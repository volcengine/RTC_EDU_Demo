#include "edu_rtc_engine_wrap.h"
#include "core/util.h"
#include "edu/core/data_mgr.h"

EduRTCEngineWrap& EduRTCEngineWrap::instance() {
	static EduRTCEngineWrap _;
	return _;
}

int EduRTCEngineWrap::init() {
	int a = bytertc::SetEnv(bytertc::kEnvProduct);
	RtcEngineWrap::SetDeviceId(util::GetDeviceID());

	connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnRoomStateChanged, 
		&instance(), &EduRTCEngineWrap::sigOnRoomStateChanged);

	connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnFirstRemoteVideoFrameRendered,
		&instance(),
		[=](RemoteStreamKeyWrap key, bytertc::VideoFrameInfo info) {
			if (bytertc::kStreamIndexMain == key.stream_index) {
				std::string user_id = key.user_id;
				instance().cb_helper_.emitCallback([user_id]() {
					instance().video_streams_[user_id] = 1;
					if (instance().stream_listener_) {
						instance().stream_listener_(user_id, true);
					}
					});
			}
		});

	connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnStreamRemove, &instance(),
		[](MediaStreamInfoWrap stream, bytertc::StreamRemoveReason reason) {
			if (stream.has_video) {
				std::string user_id = stream.user_id;
				instance().cb_helper_.emitCallback([user_id]() {
					instance().video_streams_[user_id] = 0;

					if (instance().stream_listener_) {
						instance().stream_listener_(user_id, false);
					}
					});
			}
		});

	connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnLocalVideoStateChanged,
		&instance(),
		[](bytertc::StreamIndex index, bytertc::LocalVideoStreamState state,
			bytertc::LocalVideoStreamError error) {
				if (bytertc::kStreamIndexMain == index) {
					bool add = false;
					if ((bytertc::kLocalVideoStreamStateRecording == state) ||
						(bytertc::kLocalVideoStreamStateEncoding == state)) {
						add = true;
					}

					instance().cb_helper_.emitCallback([add]() {
						bool exist = instance().video_streams_[""] > 0;
						if (add != exist) {
							if (add) {
								instance().video_streams_[""] = 1;
							}
							else {
								instance().video_streams_[""] = 0;
							}

							if (instance().stream_listener_) {
								instance().stream_listener_("", add);
							}
						}
						});
				}
		});

	connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnAudioVolumeIndication, &instance(),
		[](std::vector<AudioVolumeInfoWrap> volumes, int total_vol) {
			emit instance().sigAudioVolumeIndication(volumes, total_vol);
		});

	return 0;
}

int EduRTCEngineWrap::unInit() {
	QObject::disconnect(&RtcEngineWrap::instance(), nullptr, &instance(), nullptr);
	EduRTCEngineWrap::resetDevice();
	return 0;
}

int EduRTCEngineWrap::setUserRole(bytertc::UserRoleType role) {
	return RtcEngineWrap::instance().setUserRole(role);
}

int EduRTCEngineWrap::setupLocalView(void* view, bytertc::RenderMode mode,
                                     const std::string& uid) {
	return RtcEngineWrap::instance().setLocalVideoCanvas(
		uid, bytertc::StreamIndex::kStreamIndexMain, mode, view);
}


int EduRTCEngineWrap::setupRemoteView(void* view, bytertc::RenderMode mode,
                                      const std::string& uid) {
	return RtcEngineWrap::instance().setRemoteVideoCanvas(
		uid, bytertc::StreamIndex::kStreamIndexMain, mode, view);
}

int EduRTCEngineWrap::setupRemoteViewMainRoom(void* view,
                                              bytertc::RenderMode mode,
                                              const std::string& uid) {
	bytertc::VideoCanvas vc;
	vc.render_mode = mode;
	vc.view = view;
	instance().main_room_->SetRemoteVideoCanvas(
		uid.c_str(), bytertc::StreamIndex::kStreamIndexMain, vc);
	return 0;
}

int EduRTCEngineWrap::setupRemoteViewGroupRoom(void* view,
                                               bytertc::RenderMode mode,
                                               const std::string& uid) {
	bytertc::VideoCanvas vc;
	vc.render_mode = mode;
	vc.view = view;
	instance().group_room_->SetRemoteVideoCanvas(
		uid.c_str(), bytertc::StreamIndex::kStreamIndexMain, vc);
	return 0;
}

int EduRTCEngineWrap::startPreview() { 
	return RtcEngineWrap::instance().startPreview(); 
}

int EduRTCEngineWrap::stopPreview() { 
	return RtcEngineWrap::instance().stopPreview(); 
}

//int EduRTCEngineWrap::enableAutoSubscribe(bool video, bool audio) {
//  return RtcEngineWrap::instance().enableAutoSubscribe(
//      video ? bytertc::SubscribeMode::kSubscribeModeAuto
//            : bytertc::SubscribeMode::kSubscribeModeManual,
//      audio ? bytertc::SubscribeMode::kSubscribeModeAuto
//            : bytertc::SubscribeMode::kSubscribeModeManual);
//}

//int EduRTCEngineWrap::enableAutoPublish(bool enable) {
//  return RtcEngineWrap::instance().enableAutoPublish(enable);
//}

int EduRTCEngineWrap::setLocalMirrorMode(bytertc::MirrorMode mode) {
	return RtcEngineWrap::instance().setLocalPreviewMirrorMode(mode);
}

int EduRTCEngineWrap::joinRoom(const std::string token,
                               const std::string room_id,
                               const std::string user_id) {
	bytertc::UserInfo info;
	info.extra_info = nullptr;
	info.uid = user_id.c_str();
	return RtcEngineWrap::instance().joinRoom(token, room_id, info,
		bytertc::kRoomProfileTypeLiveBroadcasting);
}

int EduRTCEngineWrap::leaveRoom() { 
	return RtcEngineWrap::instance().leaveRoom(); 
}

int EduRTCEngineWrap::publish() { 
	return RtcEngineWrap::instance().publish();
}

int EduRTCEngineWrap::unPublish() { 
	return RtcEngineWrap::instance().unPublish(); 
}

int EduRTCEngineWrap::subscribeVideoStream(const std::string& user_id,
                                           const SubscribeConfig& info) {
	bytertc::SubscribeConfig config;
	config.is_screen = info.is_screen;
	config.sub_audio = true;
	config.sub_video = info.sub_video;
	return RtcEngineWrap::instance().subscribeVideoStream(user_id, config);
}

int EduRTCEngineWrap::unSubscribeVideoStream(const std::string& user_id,
                                             bool screen) {
	return RtcEngineWrap::instance().unSubscribeVideoStream(user_id, screen);
}

int EduRTCEngineWrap::enableLocalAudio(bool enable) {
	return RtcEngineWrap::instance().enableLocalAudio(enable);
}

int EduRTCEngineWrap::enableLocalVideo(bool enable) {
	return RtcEngineWrap::instance().enableLocalVideo(enable);
}

int EduRTCEngineWrap::muteLocalAudio(bool bMute) {
	return RtcEngineWrap::instance().muteLocalAudio(bMute);
}

int EduRTCEngineWrap::muteLocalVideo(bool bMute) {
	return RtcEngineWrap::instance().muteLocalVideo(bMute);
}

int EduRTCEngineWrap::getAudioInputDevices(std::vector<RtcDevice>& devices) {
	return RtcEngineWrap::instance().getAudioInputDevices(devices);
}

int EduRTCEngineWrap::setAudioInputDevice(int index) {
	return RtcEngineWrap::instance().setAudioInputDevice(index);
}

int EduRTCEngineWrap::getAudioInputDevice(std::string& guid) {
	return RtcEngineWrap::instance().getAudioInputDevice(guid);
}

int EduRTCEngineWrap::setAudioVolumeIndicate(int indicate) {
	return RtcEngineWrap::instance().setAudioVolumeIndicate(indicate);
}

int EduRTCEngineWrap::getAudioOutputDevices(std::vector<RtcDevice>& devices) {
	return RtcEngineWrap::instance().getAudioOutputDevices(devices);
}

int EduRTCEngineWrap::setAudioOutputDevice(int index) {
	return RtcEngineWrap::instance().setAudioOutputDevice(index);
}

int EduRTCEngineWrap::getAudioOutputDevice(std::string& guid) {
	return RtcEngineWrap::instance().getAudioOutputDevice(guid);
}

int EduRTCEngineWrap::getVideoCaptureDevices(std::vector<RtcDevice>& devices) {
	return RtcEngineWrap::instance().getVideoCaptureDevices(devices);
}

int EduRTCEngineWrap::setVideoCaptureDevice(int index) {
	return RtcEngineWrap::instance().setVideoCaptureDevice(index);
}

int EduRTCEngineWrap::getVideoCaptureDevice(std::string& guid) {
	return RtcEngineWrap::instance().getVideoCaptureDevice(guid);
}

int EduRTCEngineWrap::setRemoteScreenView(const std::string& uid, void* view) {
	return RtcEngineWrap::instance().setRemoteVideoCanvas(
		uid, bytertc::StreamIndex::kStreamIndexScreen,
		bytertc::RenderMode::kRenderModeHidden, view);
}

int EduRTCEngineWrap::startScreenCapture(void* source_id,
                                         const std::vector<void*>& excluded) {
	return RtcEngineWrap::instance().startScreenCapture(source_id, excluded);
}

int EduRTCEngineWrap::startScreenCaptureByWindowId(void* window_id) {
	return RtcEngineWrap::instance().startScreenCaptureByWindowId(window_id);
}

int EduRTCEngineWrap::stopScreenCapture() {
	return RtcEngineWrap::instance().stopScreenCapture();
}

bool EduRTCEngineWrap::audioRecordDevicesTest() {
	return RtcEngineWrap::instance().audioReocrdDeviceTest();
}

std::shared_ptr<bytertc::IRtcRoom> EduRTCEngineWrap::getMainRtcRoom() {
	return main_room_;
}

std::shared_ptr<bytertc::IRtcRoom> EduRTCEngineWrap::getGroupRtcRoom() {
	return group_room_;
}

int EduRTCEngineWrap::startPlaybackDeviceTest(const std::string& str) {
	return RtcEngineWrap::instance().startPlaybackDeviceTest(str);
}

int EduRTCEngineWrap::stopPlaybackDeviceTest() {
	return RtcEngineWrap::instance().stopPlaybackDeviceTest();
}

int EduRTCEngineWrap::startRecordingDeviceTest(int indicatoin) {
	return RtcEngineWrap::instance().startRecordingDeviceTest(indicatoin);
}

int EduRTCEngineWrap::stopRecordingDeviceTest() {
	return RtcEngineWrap::instance().stopRecordingDeviceTest();
}

void EduRTCEngineWrap::setMainStreamListener(
    std::function<void(const std::string& userId, bool add)>&& l) {
	instance().stream_listener_ = std::move(l);
	//instance().main_room_->SetRtcRoomEventHandler(&RtcEngineWrap::instance());
}

void EduRTCEngineWrap::setGroupStreamListener(
    std::function<void(const std::string& userId, bool add)>&& l) {
	instance().group_handler_.stream_listener_ = std::move(l);
	//instance().group_room_->SetRtcRoomEventHandler(&instance().group_handler_);
}

bool EduRTCEngineWrap::mainHasVideoStream(const std::string& userId) {
	return instance().video_streams_[userId] > 0;
}

bool EduRTCEngineWrap::groupHasVideoStream(const std::string& userId) {
	return instance().group_handler_.video_streams_[userId] > 0;
}

bool EduRTCEngineWrap::hasMainRoom() { 
	return bool(instance().main_room_); 
}

bool EduRTCEngineWrap::hasGroupRoom() { 
	return bool(instance().group_room_); 
}

void EduRTCEngineWrap::createGroupRoom(const std::string& room) {
	instance().group_room_ =  RtcEngineWrap::instance().createRtcRoom(room);
	instance().group_room_->SetRtcRoomEventHandler(&instance().group_handler_);
	instance().str_group_room_ = room;
}

void EduRTCEngineWrap::createMainRoom(const std::string& room) {
	instance().main_room_ = RtcEngineWrap::instance().createRtcRoom(room);
	instance().main_room_->SetRtcRoomEventHandler(&RtcEngineWrap::instance());
	instance().str_main_room_ = room;
}

void EduRTCEngineWrap::destoryGroupRoom() {
	if (!hasGroupRoom()) return;
	instance().group_room_ = nullptr;
	instance().str_group_room_ = "";
	RtcEngineWrap::instance().destoryRtcRoom(instance().str_group_room_);
}

void EduRTCEngineWrap::destoryMainRoom() {
	if (!hasMainRoom()) return;
	instance().main_room_ = nullptr;
	instance().str_main_room_ = "";
	RtcEngineWrap::instance().destoryRtcRoom(instance().str_main_room_);
}

void EduRTCEngineWrap::setGroupUserRole(bytertc::UserRoleType type) {
	instance().group_room_->SetUserRole(type);
}

void EduRTCEngineWrap::setMainUserRole(bytertc::UserRoleType type) {
	instance().main_room_->SetUserRole(type);
}

void EduRTCEngineWrap::publishMainRoom() {
	instance().main_room_->Publish();
}

void EduRTCEngineWrap::unPublishMainRoom() {
	instance().main_room_->Unpublish();
}

void EduRTCEngineWrap::publishGroupRoom() { 
	instance().group_room_->Publish(); 
}

void EduRTCEngineWrap::unPublishGroupRoom() {
	instance().group_room_->Unpublish();
}

void EduRTCEngineWrap::joinGroupRoom(const std::string token,
                                     const std::string room_id,
                                     const std::string user_id) {
	bytertc::UserInfo info;
	info.extra_info = nullptr;
	info.uid = user_id.c_str();
	instance().group_room_->JoinRoom(token.c_str(), info,
		bytertc::MultiRoomConfig{});
}

void EduRTCEngineWrap::joinMainRoom(const std::string token,
	const std::string room_id,
	const std::string user_id) {
	bytertc::UserInfo info;
	info.extra_info = nullptr;
	info.uid = user_id.c_str();
	instance().main_room_->JoinRoom(
		token.c_str(), info,
		bytertc::RoomProfileType::kRoomProfileTypeLiveBroadcasting);
}

void EduRTCEngineWrap::joinMainRoom(const std::string& token,
	const bytertc::UserInfo& info,
	bytertc::RoomProfileType type) {
	instance().main_room_->JoinRoom(token.c_str(), info, type);
}

void EduRTCEngineWrap::joinGroupRoom(const std::string& token,
	const bytertc::UserInfo& info,
	bytertc::RoomProfileType type) {
	instance().group_room_->JoinRoom(token.c_str(), info, type);
}

int EduRTCEngineWrap::leaveGroupRoom() {
	instance().group_room_->LeaveRoom();
	return 0;
}

int EduRTCEngineWrap::leaveMainRoom() {
	instance().main_room_->LeaveRoom();
	return 0;
}

int EduRTCEngineWrap::initDevice() {
	RtcEngineWrap::instance().initDevices();
	auto setting = Edu::DataMgr::instance().current_device_setting();
	setVideoCaptureDevice(setting.curVideoDevIndex);
	setAudioInputDevice(setting.curAudioCaptureIndex);
	setAudioOutputDevice(setting.curAudioPlaybackIndex);
	return 0;
}

int EduRTCEngineWrap::resetDevice() {
	RtcEngineWrap::instance().resetDevices();
	Edu::DataMgr::instance().setDevSetting(Edu::DevSetting());
	return 0;
}

void EduRTCEngineWrap::MiniHandler::OnFirstRemoteVideoFrameRendered(
	const bytertc::RemoteStreamKey key, const bytertc::VideoFrameInfo& info) {
	if (bytertc::kStreamIndexMain == key.stream_index) {
		std::string user_id = key.user_id;
		cb_helper_.emitCallback([user_id, this]() {
			video_streams_[user_id] = 1;

			if (stream_listener_) {
				stream_listener_(user_id, true);
			}
			});
	}
}

void EduRTCEngineWrap::MiniHandler::OnStreamRemove(
	const bytertc::MediaStreamInfo& stream,
	bytertc::StreamRemoveReason reason) {
	if (stream.has_video) {
		std::string user_id = stream.user_id;
		cb_helper_.emitCallback([user_id, this]() {
			video_streams_[user_id] = 0;

			if (stream_listener_) {
				stream_listener_(user_id, false);
			}
		});
	}
}

void EduRTCEngineWrap::MiniHandler::OnLocalVideoStateChanged(
	bytertc::StreamIndex index, bytertc::LocalVideoStreamState state,
	bytertc::LocalVideoStreamError error) {
	if (bytertc::kStreamIndexMain == index) {
		bool add = false;
		if ((bytertc::kLocalVideoStreamStateRecording == state) ||
			(bytertc::kLocalVideoStreamStateEncoding == state)) {
			add = true;
		}

		cb_helper_.emitCallback([add, this]() {
			bool exist = video_streams_[""] > 0;
			if (add != exist) {
				if (add) {
					video_streams_[""] = 1;
				}
				else {
					video_streams_[""] = 0;
				}

				if (stream_listener_) {
					stream_listener_("", add);
				}
			}
		});
	}
}
