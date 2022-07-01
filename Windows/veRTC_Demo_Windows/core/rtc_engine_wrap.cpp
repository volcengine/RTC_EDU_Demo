#include "rtc_engine_wrap.h"
#define API_CALL_ERROR 999

#define CHECK_POINTER(X, Y) \
  if (!X) return Y

Q_DECLARE_METATYPE(std::vector<AudioVolumeInfoWrap>)

RtcEngineWrap& RtcEngineWrap::instance() {
	static RtcEngineWrap engine_wrap_;
	return engine_wrap_;
}

RtcEngineWrap::RtcEngineWrap()
    : engine_(nullptr,
              [=](bytertc::IRtcEngine* self) {
                if (self) {
                  bytertc::DestroyRtcEngine(self);
                }
              }),
      video_device_manager_(nullptr,
                            [=](bytertc::IVideoDeviceManager* self) {
                              if (self) {
                              }
                            }),
      audio_device_manager_(nullptr, [=](bytertc::IAudioDeviceManager*) {
        if (audio_device_manager_) {
        }
      }) {}

int RtcEngineWrap::startPlaybackDeviceTest(const std::string& str) {
  CHECK_POINTER(audio_device_manager_, -API_CALL_ERROR);
  return audio_device_manager_->StartAudioPlaybackDeviceTest(str.c_str());
}

int RtcEngineWrap::stopPlaybackDeviceTest() {
  CHECK_POINTER(audio_device_manager_, -API_CALL_ERROR);
  return audio_device_manager_->StopAudioPlaybackDeviceTest();
}

int RtcEngineWrap::startRecordingDeviceTest(int indicatoin) {
  CHECK_POINTER(audio_device_manager_, -API_CALL_ERROR);
  return audio_device_manager_->StartAudioCaptureDeviceTest(indicatoin);
}

int RtcEngineWrap::stopRecordingDeviceTest() {
  CHECK_POINTER(audio_device_manager_, -API_CALL_ERROR);
  return audio_device_manager_->StopAudioCaptureDeviceTest();
}

int RtcEngineWrap::setEnv(bytertc::Env env) { return bytertc::SetEnv(env); }

int RtcEngineWrap::SetDeviceId(const std::string& device_id) {
    bytertc::SetDeviceId(device_id.c_str());
    return 0;
}

void RtcEngineWrap::createEngine(const std::string& app_id) {
    engine_.reset(bytertc::CreateRtcEngine(app_id.c_str(), this, ""));
}

std::string RtcEngineWrap::getSDKVersion() { return bytertc::GetSDKVersion(); }

void RtcEngineWrap::destroyEngine() {
    engine_.reset();
}

int RtcEngineWrap::initDevices() {
	rooms_.clear();
	CHECK_POINTER(engine_, -API_CALL_ERROR);
	audio_device_manager_.reset(engine_->GetAudioDeviceManager());
	video_device_manager_.reset(engine_->GetVideoDeviceManager());

	engine_->StartVideoCapture();
	engine_->StartAudioCapture();
	engine_->MuteLocalVideo(bytertc::kMuteStateOff);

	bytertc::VideoSolution vs;
	vs.width = 640;
	vs.height = 480;
	vs.fps = 15;
	vs.max_send_kbps = 600;

	return engine_->SetVideoEncoderConfig(bytertc::kStreamIndexMain, &vs, 1);
}

void RtcEngineWrap::resetDevices() {
	video_device_manager_.reset();
	audio_device_manager_.reset();
}

std::shared_ptr<bytertc::IRtcRoom> RtcEngineWrap::createRtcRoom(
    const std::string& room_id) {
  CHECK_POINTER(engine_, nullptr);
  auto find_it = rooms_.find(room_id);
  if (find_it != rooms_.cend()) return find_it->second;
  rooms_[room_id] = std::shared_ptr<bytertc::IRtcRoom>(
      engine_->CreateRtcRoom(room_id.c_str()),
      [=](bytertc::IRtcRoom* room) { room->Destroy(); });
  return rooms_[room_id];
}

int RtcEngineWrap::destoryRtcRoom(const std::string& room_id) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  auto find_it = rooms_.find(room_id);
  if (find_it != rooms_.cend()) rooms_.erase(find_it);
  return 0;
}

int RtcEngineWrap::joinRoom(const std::string& token,
                            const std::string& room_id,
                            const bytertc::UserInfo& userInfo,
                            bytertc::RoomProfileType profileType) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);

  bytertc::RTCRoomConfig config;
  config.room_profile_type = profileType;
  return engine_->JoinRoom(token.c_str(), room_id.c_str(), userInfo, config);
}

int RtcEngineWrap::joinSubRoom(const std::string& token,
                               const std::string& room_id,
                               const bytertc::UserInfo& userInfo,
                               bytertc::RoomProfileType profileType) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  bytertc::MultiRoomConfig config;
  config.room_profile_type = profileType;
  auto find_it = rooms_.find(room_id);
  if (find_it != rooms_.cend()) {
    find_it->second->JoinRoom(token.c_str(), userInfo, config);
    return 0;
  }
  return -API_CALL_ERROR;
}

int RtcEngineWrap::setUserRole(bytertc::UserRoleType role) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->SetUserVisibility(role == bytertc::kUserRoleTypeBroadcaster ? true
                                                                       : false);
  return 0;
}

int RtcEngineWrap::setRemoteVideoCanvas(const std::string& user_id,
                                        bytertc::StreamIndex index,
                                        bytertc::RenderMode mode, void* view) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  bytertc::VideoCanvas vc;
  vc.view = view;
  vc.render_mode = mode;
  engine_->SetRemoteVideoCanvas(user_id.c_str(), index, vc);
  return 0;
}

int RtcEngineWrap::setLocalVideoCanvas(const std::string& uid,
                                       bytertc::StreamIndex index,
                                       bytertc::RenderMode mode, void* view) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  bytertc::VideoCanvas vc;
  vc.view = view;
  vc.render_mode = mode;
  return engine_->SetLocalVideoCanvas(index, vc);
}

int RtcEngineWrap::startPreview() {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->StartVideoCapture();
  return 0;
}

int RtcEngineWrap::stopPreview() {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->StopVideoCapture();
  return 0;
}

// int RtcEngineWrap::enableAutoSubscribe(bytertc::SubscribeMode video_mode,
//                                       bytertc::SubscribeMode audio_mode) {
//  CHECK_POINTER(engine_, -API_CALL_ERROR);
//  engine_->EnableAutoSubscribe(video_mode, audio_mode);
//  return 0;
//}

// int RtcEngineWrap::enableAutoPublish(bool enabled) {
//  CHECK_POINTER(engine_, -API_CALL_ERROR);
//  engine_->EnableAutoPublish(enabled);
//  return 0;
//}

int RtcEngineWrap::setLocalPreviewMirrorMode(bytertc::MirrorMode mm) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->SetLocalVideoMirrorMode(mm);
  return 0;
}

int RtcEngineWrap::enableLocalAudio(bool enabled) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  if (enabled)
    engine_->StartAudioCapture();
  else
    engine_->StopAudioCapture();
  return 0;
}

int RtcEngineWrap::enableLocalVideo(bool enabled) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  if (enabled)
    engine_->StartVideoCapture();
  else
    engine_->StopVideoCapture();
  return 0;
}

int RtcEngineWrap::muteLocalVideo(bool enabled) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->MuteLocalVideo(enabled ? bytertc::kMuteStateOn
                                  : bytertc::kMuteStateOff);
  return 0;
}

int RtcEngineWrap::muteLocalAudio(bool enabled) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  return engine_->MuteLocalAudio(enabled ? bytertc::kMuteStateOn
                                         : bytertc::kMuteStateOff),
         0;
}

int RtcEngineWrap::leaveRoom() {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->LeaveRoom();
  return 0;
}

int RtcEngineWrap::leaveSubRoom(const std::string& room_id) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  auto find_it = rooms_.find(room_id);
  if (find_it != rooms_.cend()) {
    find_it->second->LeaveRoom();
    return 0;
  }
  return -API_CALL_ERROR;
}

int RtcEngineWrap::destroySubRoom(const std::string& room_id) {
  auto find_it = rooms_.find(room_id);
  if (find_it != rooms_.cend()) {
    rooms_.erase(find_it);
    return 0;
  }
  return -API_CALL_ERROR;
}

int RtcEngineWrap::publish() {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->Publish();
  return 0;
}

int RtcEngineWrap::unPublish() {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->Unpublish();
  return 0;
}

int RtcEngineWrap::subPublish(const std::string& room_id) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  auto find_it = rooms_.find(room_id);
  if (find_it != rooms_.cend()) {
    find_it->second->Publish();
    return 0;
  }
  return -API_CALL_ERROR;
}

int RtcEngineWrap::unSubPublish(const std::string& room_id) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  auto find_it = rooms_.find(room_id);
  if (find_it != rooms_.cend()) {
    find_it->second->Unpublish();
    return 0;
  }
  return -API_CALL_ERROR;
}

int RtcEngineWrap::subscribeVideoStream(
    const std::string& uid, const bytertc::SubscribeConfig& config) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  bytertc::StreamIndex index = config.is_screen ? bytertc::kStreamIndexScreen
                                                : bytertc::kStreamIndexMain;

  bool sub_audio = config.sub_audio;
  bool sub_video = config.sub_video;
  bytertc::SubscribeMediaType media_type;
  if (sub_audio && sub_video) {
    media_type = bytertc::kRTCSubscribeMediaTypeVideoAndAudio;
  } else if (!sub_audio && sub_video) {
    media_type = bytertc::kRTCSubscribeMediaTypeVideoOnly;
  } else if (!sub_video && sub_audio) {
    media_type = bytertc::kRTCSubscribeMediaTypeAudioOnly;
  } else {
    media_type = bytertc::kRTCSubscribeMediaTypeNone;
  }
  bytertc::SubscribeVideoConfig videoConfig;
  videoConfig.priority = config.priority;
  videoConfig.video_index = config.video_index;

  engine_->SubscribeUserStream(uid.c_str(), index, media_type, videoConfig);
  return 0;
}

int RtcEngineWrap::unSubscribeVideoStream(const std::string& uid,
                                          bool is_screen) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->Unsubscribe(uid.c_str(), is_screen);
  return 0;
}

int RtcEngineWrap::setVideoProfiles(const bytertc::VideoSolution* solutions,
                                    int solution_num) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  return engine_->SetVideoEncoderConfig(bytertc::kStreamIndexMain, solutions,
                                        solution_num);
}

int RtcEngineWrap::setScreenProfiles(const bytertc::VideoSolution* solutions,
                                     int solution_num) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  return engine_->SetVideoEncoderConfig(bytertc::kStreamIndexScreen, solutions,
                                        solution_num);
}

int RtcEngineWrap::getShareList(std::vector<SnapshotAttr>& list) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);

  int display_index = 0;
  SnapshotAttr snapshot;
  static std::string desktop_names[] = {
      "桌面一", "桌面二", "桌面三", "桌面四", "桌面五",
      "桌面六", "桌面七", "桌面八", "桌面九", "桌面十",
  };

  auto sourcelist = engine_->GetScreenCaptureSourceList();
  int count = sourcelist->GetCount();
  for (int i = 0; i < count; ++i) {
    auto source = sourcelist->GetSourceInfo(i);
    snapshot.name = source.source_name;
    snapshot.source_id = source.source_id;
    switch (source.type) {
      case bytertc::kScreenCaptureSourceTypeScreen: {
        snapshot.type = SnapshotAttr::kScreen;
        auto pos =
            std::find_if(list.begin(), list.end(), [](const SnapshotAttr& s) {
              return s.type == SnapshotAttr::kWindow;
            });

        snapshot.name = desktop_names[display_index];
        ++display_index;

        if (pos != list.end()) {
          list.insert(pos, snapshot);
        } else {
          list.push_back(snapshot);
        }
        break;
      }
      case bytertc::kScreenCaptureSourceTypeWindow:
        snapshot.type = SnapshotAttr::kWindow;
        list.push_back(snapshot);
        break;
      default:
        break;
    }
  }

  sourcelist->Release();
  return 0;
}

QPixmap RtcEngineWrap::getThumbnail(SnapshotAttr::SnapshotType type,
                                    void* source_id, int max_width,
                                    int max_height) {
  QPixmap pix_map;
  CHECK_POINTER(engine_, pix_map);

  auto s_type = bytertc::kScreenCaptureSourceTypeUnknown;
  switch (type) {
    case SnapshotAttr::kScreen:
      s_type = bytertc::kScreenCaptureSourceTypeScreen;
      break;
    case SnapshotAttr::kWindow:
      s_type = bytertc::kScreenCaptureSourceTypeWindow;
      break;
    default:
      break;
  }
  auto p = engine_->GetThumbnail(s_type, source_id, max_width, max_height);

  QImage img(reinterpret_cast<uchar*>(p->get_plane_data(0)), p->width(),
             p->height(), QImage::Format::Format_RGB32);
  return QPixmap::fromImage(img);
}

int RtcEngineWrap::getAudioInputDevices(std::vector<RtcDevice>& devices) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  CHECK_POINTER(this->audio_device_manager_, -API_CALL_ERROR);
  char szName[512], szId[512];
  std::string strSelectedDeviceId;

  int devIdx = 0;
  audio_input_devices_.clear();
  bytertc::IDeviceCollection* pAudioRecordCollection =
      audio_device_manager_->EnumerateAudioCaptureDevices();
  if (pAudioRecordCollection) {
    memset(szName, 0, sizeof(szName));
    memset(szId, 0, sizeof(szId));
    devIdx = 0;

    audio_device_manager_->GetAudioCaptureDevice(szId);
    strSelectedDeviceId = szId;

    int nAudioRecNum = pAudioRecordCollection->GetCount();
    if (nAudioRecNum > 0) {
      for (int i = 0; i < nAudioRecNum; ++i) {
        memset(szName, 0, sizeof(szName));
        memset(szId, 0, sizeof(szId));
        if (strSelectedDeviceId == szId) {
          current_audio_input_idx_ = i;
        }
        if (pAudioRecordCollection->GetDevice(i, szName, szId) == 0) {
          RtcDevice device;
          device.type = RtcDeviceTypeAudioRecord;
          device.name = szName;
          device.device_id = szId;
          audio_input_devices_.push_back(device);
        }
      }
    }
    devices = audio_input_devices_;
    pAudioRecordCollection->Release();
    pAudioRecordCollection = nullptr;
  }
  return 0;
}

int RtcEngineWrap::setAudioInputDevice(int index) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  if (audio_input_devices_.size() <= static_cast<unsigned int>(index) ||
      index < 0)
    return -API_CALL_ERROR;
  current_audio_input_idx_ = index;
  return audio_device_manager_->SetAudioCaptureDevice(
      audio_input_devices_[index].device_id.c_str());
}

int RtcEngineWrap::getAudioInputDevice(std::string& guid) {
  guid.resize(512);
  return audio_device_manager_->GetAudioCaptureDevice(
      const_cast<char*>(guid.data()));
}

int RtcEngineWrap::getAudioOutputDevices(std::vector<RtcDevice>& devices) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  std::string strSelectedDeviceId;
  char szName[512], szId[512];
  int devIdx = 0;

  // enum playout devices
  audio_output_devices_.clear();

  bytertc::IAudioDeviceManager* pAudioDeviceManager =
      engine_->GetAudioDeviceManager();
  if (pAudioDeviceManager) {
    bytertc::IDeviceCollection* pAudioPlayoutCollection =
        pAudioDeviceManager->EnumerateAudioPlaybackDevices();
    if (pAudioPlayoutCollection) {
      memset(szName, 0, sizeof(szName));
      memset(szId, 0, sizeof(szId));
      devIdx = 0;

      // get selected device id
      pAudioDeviceManager->GetAudioPlaybackDevice(szId);
      strSelectedDeviceId = szId;

      int nAudioRecNum = pAudioPlayoutCollection->GetCount();
      if (nAudioRecNum > 0) {
        for (int i = 0; i < nAudioRecNum; ++i) {
          memset(szName, 0, sizeof(szName));
          memset(szId, 0, sizeof(szId));

          if (pAudioPlayoutCollection->GetDevice(i, szName, szId) == 0) {
            if (strSelectedDeviceId == szId) {
              current_audio_output_idx_ = i;
            }

            RtcDevice device;
            device.type = RtcDeviceTypeAudioPlayout;
            device.name = szName;
            device.device_id = szId;

            audio_output_devices_.push_back(device);
          }
        }
      }
      devices = audio_output_devices_;
      pAudioPlayoutCollection->Release();
      pAudioPlayoutCollection = nullptr;
    }
  }
  return 0;
}

int RtcEngineWrap::setAudioOutputDevice(int index) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  if (audio_output_devices_.size() >= static_cast<unsigned int>(index) ||
      index < 0)
    return -API_CALL_ERROR;
  current_audio_output_idx_ = index;
  return audio_device_manager_->SetAudioPlaybackDevice(
      audio_output_devices_[index].device_id.c_str());
}

int RtcEngineWrap::getAudioOutputDevice(std::string& guid) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  guid.resize(512);
  return audio_device_manager_->GetAudioPlaybackDevice(
      const_cast<char*>(guid.c_str()));
}

int RtcEngineWrap::getVideoCaptureDevices(std::vector<RtcDevice>& devices) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  std::string strSelectedDeviceId;
  char szName[512], szId[512];
  int devIdx = 0;

  // enum video capture devices
  camera_devices_.clear();

  bytertc::IDeviceCollection* pVideoRecordCollection =
      video_device_manager_->EnumerateVideoCaptureDevices();
  if (pVideoRecordCollection) {
    memset(szName, 0, sizeof(szName));
    memset(szId, 0, sizeof(szId));
    devIdx = 0;

    // get selected device id
    video_device_manager_->GetVideoCaptureDevice(szId);
    strSelectedDeviceId = szId;

    int nVideoCaptureNum = pVideoRecordCollection->GetCount();
    if (nVideoCaptureNum > 0) {
      current_camera_idx_ = 0;
      for (int i = 0; i < nVideoCaptureNum; ++i) {
        memset(szName, 0, sizeof(szName));
        memset(szId, 0, sizeof(szId));

        if (pVideoRecordCollection->GetDevice(i, szName, szId) == 0) {
          if (strSelectedDeviceId == szId) {
            current_camera_idx_ = i;
          }

          RtcDevice device;
          device.type = RtcDeviceTypeVideoCapture;
          device.name = szName;
          device.device_id = szId;

          camera_devices_.push_back(device);
        }
      }
    }
    devices = camera_devices_;

    pVideoRecordCollection->Release();
    pVideoRecordCollection = nullptr;
  }
  return 0;
}

int RtcEngineWrap::setVideoCaptureDevice(int index) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  if (camera_devices_.size() <= static_cast<unsigned int>(index) || index < 0)
    return -API_CALL_ERROR;
  return video_device_manager_->SetVideoCaptureDevice(
      camera_devices_[index].device_id.c_str());
}

bool RtcEngineWrap::audioReocrdDeviceTest() {
  CHECK_POINTER(engine_, false);

  bool res = false;
  char szName[512];
  char szId[512];
  if (audio_device_manager_) {
    bytertc::IDeviceCollection* pAudioRecordCollection =
        audio_device_manager_->EnumerateAudioCaptureDevices();
    if (pAudioRecordCollection) {
      memset(szName, 0, sizeof(szName));
      memset(szId, 0, sizeof(szId));

      int nAudioRecNum = pAudioRecordCollection->GetCount();
      if (nAudioRecNum > 0) {
        current_audio_input_idx_ = 0;
        for (int i = 0; i < nAudioRecNum; ++i) {
          memset(szName, 0, sizeof(szName));

          if (pAudioRecordCollection->GetDevice(i, szName, szId) == 0) {
            auto code =
                audio_device_manager_->InitAudioCaptureDeviceForTest(szId);
            if (code == 0) {
              res = true;
            }
          }
        }
      }
      pAudioRecordCollection->Release();
      pAudioRecordCollection = nullptr;
    }
  }
  return res;
}

int RtcEngineWrap::feedBack(const std::string& str) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->Feedback(str.c_str());
  return 0;
}

int RtcEngineWrap::setAudioVolumeIndicate(int indicate) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->SetAudioVolumeIndicationInterval(indicate);
  return 0;
}

std::unique_ptr<bytertc::IRtcEngine, std::function<void(bytertc::IRtcEngine*)>>&
RtcEngineWrap::getRtcEngine() {
	return engine_;
}

void RtcEngineWrap::customEvent(QEvent* e) {
  if (e->type() == QEvent::User) {
    auto user_event = static_cast<ForwardEvent*>(e);
    user_event->execTask();
  }
}

int RtcEngineWrap::getVideoCaptureDevice(std::string& guid) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  guid.resize(512);
  return video_device_manager_->GetVideoCaptureDevice(
      const_cast<char*>(guid.c_str()));
}

int RtcEngineWrap::startScreenCapture(void* source_id,
                                      const std::vector<void*>& excluded) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  bytertc::ScreenCaptureSourceInfo screenSourceInfo;
  screenSourceInfo.type = bytertc::kScreenCaptureSourceTypeScreen;
  screenSourceInfo.source_id = source_id;

  bytertc::ScreenCaptureParameters screenCaptureParams;
  if (!excluded.empty()) {
    screenCaptureParams.filter_config.excluded_window_list =
        const_cast<bytertc::view_t*>(&excluded[0]);
    screenCaptureParams.filter_config.excluded_window_num = excluded.size();
  }

  screenCaptureParams.capture_mouse_cursor =
      bytertc::kMouseCursorCaptureStateOn;
  auto nRet =
      engine_->StartScreenVideoCapture(screenSourceInfo, screenCaptureParams);

  if (nRet == 0) {
    engine_->PublishScreen();
  }
  return nRet;
}

int RtcEngineWrap::startScreenCaptureByWindowId(void* window_id) {
  CHECK_POINTER(engine_, -API_CALL_ERROR);

  bytertc::ScreenCaptureSourceInfo screenSourceInfo;
  screenSourceInfo.type = bytertc::kScreenCaptureSourceTypeWindow;
  screenSourceInfo.source_id = window_id;

  bytertc::ScreenCaptureParameters screenCaptureParams;
  screenCaptureParams.capture_mouse_cursor =
      bytertc::kMouseCursorCaptureStateOff;
  auto nRet =
      engine_->StartScreenVideoCapture(screenSourceInfo, screenCaptureParams);
  if (nRet == 0) {
    engine_->PublishScreen();
  }
  return nRet;
}

int RtcEngineWrap::stopScreenCapture() {
  CHECK_POINTER(engine_, -API_CALL_ERROR);
  engine_->StopScreenCapture();
  return 0;
}

// event handler
void RtcEngineWrap::OnRoomStateChanged(const char* room_id, const char* uid,
                                       int state, const char* extra_info) {
	ForwardEvent::PostEvent(
		this, [=, rid = std::string(room_id), uid = std::string(uid), 
        extra_info = std::string(extra_info)]{
		  emit sigOnRoomStateChanged(rid, uid, state, extra_info);
		});
}

void RtcEngineWrap::OnRoomStats(const bytertc::RtcRoomStats& stats) {
  ForwardEvent::PostEvent(this, [=] { emit sigOnRoomStats(stats); });
}

void RtcEngineWrap::OnLocalStreamStats(const bytertc::LocalStreamStats& stats) {
  ForwardEvent::PostEvent(this, [=] { emit sigOnLocalStreamStats(stats); });
}

void RtcEngineWrap::OnRemoteStreamStats(
    const bytertc::RemoteStreamStats& stats) {
  RemoteStreamStatsWrap wrap;
  wrap.audio_stats = stats.audio_stats;
  wrap.is_screen = stats.is_screen;
  wrap.remote_rx_quality = stats.remote_rx_quality;
  wrap.remote_tx_quality = stats.remote_tx_quality;
  wrap.uid = stats.uid;
  wrap.video_stats = stats.video_stats;
  ForwardEvent::PostEvent(this, [=] { emit sigOnRemoteStreamStats(wrap); });
}

void RtcEngineWrap::OnWarning(int warn) {
  ForwardEvent::PostEvent(this, [=] { emit sigOnWarning(warn); });
}

void RtcEngineWrap::OnError(int err) {
  ForwardEvent::PostEvent(this, [=] { emit sigOnError(err); });
}

void RtcEngineWrap::OnAudioVolumeIndication(
    const bytertc::AudioVolumeInfo* speakers, unsigned int speakerNumber,
    int totalVolume) {
	std::vector<AudioVolumeInfoWrap> vec_;
	for (size_t i = 0; i < speakerNumber; i++) {
		AudioVolumeInfoWrap wrap{
			speakers[i].linear_volume,
			speakers[i].uid,
		};
		vec_.push_back(std::move(wrap));
	}
	ForwardEvent::PostEvent(
		this, [=] { emit sigOnAudioVolumeIndication(vec_, totalVolume); });
}

void RtcEngineWrap::OnLeaveRoom(const bytertc::RtcRoomStats& stats) {
  ForwardEvent::PostEvent(this, [=] { emit sigOnLeaveRoom(stats); });
}

void RtcEngineWrap::OnUserJoined(const bytertc::UserInfo& userInfo,
                                 int elapsed) {
  UserInfoWrap wrap;
  wrap.uid = userInfo.uid;
  wrap.extra_info = userInfo.extra_info;
  ForwardEvent::PostEvent(this, [=] { emit sigOnUserJoined(wrap, elapsed); });
}

void RtcEngineWrap::OnUserLeave(const char* uid,
                                bytertc::UserOfflineReason reason) {
  ForwardEvent::PostEvent(
      this, [=, uid = std::string(uid)] { emit sigOnUserLeave(uid, reason); });
}

void RtcEngineWrap::OnUserMuteAudio(const char* user_id,
                                    bytertc::MuteState mute_state) {
  ForwardEvent::PostEvent(this, [=, uid = std::string(user_id)] {
    emit sigOnUserMuteAudio(user_id, mute_state);
  });
}

void RtcEngineWrap::OnUserEnableLocalAudio(const char* uid, bool enabled) {
  ForwardEvent::PostEvent(this, [=, uid = std::string(uid)] {
    emit sigOnUserEnableLocalAudio(uid, enabled);
  });
}

void RtcEngineWrap::OnFirstLocalAudioFrame(bytertc::StreamIndex index) {
  ForwardEvent::PostEvent(this, [=] { emit sigOnFirstLocalAudioFrame(index); });
}

void RtcEngineWrap::OnStreamRemove(const bytertc::MediaStreamInfo& stream,
                                   bytertc::StreamRemoveReason reason) {
  MediaStreamInfoWrap wrap;
  wrap.has_audio = stream.has_audio;
  wrap.has_video = stream.has_video;
  wrap.is_screen = stream.is_screen;
  wrap.user_id = stream.user_id;

  for (int i = 0; i < stream.profile_count; i++) {
    wrap.profiles.push_back(stream.profiles[i]);
  }
  ForwardEvent::PostEvent(this, [=] { emit sigOnStreamRemove(wrap, reason); });
}

void RtcEngineWrap::OnLogReport(const char* log_type, const char* log_content) {
  ForwardEvent::PostEvent(this, [=, log_type_ = std::string(log_type),
                                 log_content_ = std::string(log_content)] {
    emit sigOnLogReport(log_type_, log_content_);
  });
}

void RtcEngineWrap::OnStreamAdd(const bytertc::MediaStreamInfo& stream) {
  MediaStreamInfoWrap wrap;
  wrap.has_audio = stream.has_audio;
  wrap.has_video = stream.has_video;
  wrap.is_screen = stream.is_screen;
  wrap.user_id = stream.user_id;

  for (int i = 0; i < stream.profile_count; i++) {
    wrap.profiles.push_back(stream.profiles[i]);
  }

  ForwardEvent::PostEvent(this, [=] { emit sigOnStreamAdd(wrap); });
}

void RtcEngineWrap::OnStreamSubscribed(bytertc::SubscribeState state_code,
                                       const char* user_id,
                                       const bytertc::SubscribeConfig& info) {
  ForwardEvent::PostEvent(
      this, [=] { emit sigOnStreamSubscribed(state_code, user_id, info); });
}

void RtcEngineWrap::OnStreamPublishSuccess(const char* user_id,
                                           bool is_screen) {
  ForwardEvent::PostEvent(this, [=, uid = std::string(user_id)] {
    emit sigOnStreamPublishSuccess(user_id, is_screen);
  });
}

// void RtcEngineWrap::OnAudioRouteChanged(int routing) {
//  ForwardEvent::PostEvent(this, [=] { emit sigOnAudioRouteChanged(routing);
//  });
//}

void RtcEngineWrap::OnFirstLocalVideoFrameCaptured(
    bytertc::StreamIndex index, bytertc::VideoFrameInfo info) {
  ForwardEvent::PostEvent(
      this, [=] { emit sigOnFirstLocalVideoFrameCaptured(index, info); });
}

void RtcEngineWrap::OnFirstRemoteVideoFrameRendered(
    const bytertc::RemoteStreamKey key, const bytertc::VideoFrameInfo& info) {
  RemoteStreamKeyWrap wrap;
  wrap.room_id = key.room_id;
  wrap.user_id = key.user_id;
  wrap.stream_index = key.stream_index;
  ForwardEvent::PostEvent(
      this, [=] { emit sigOnFirstRemoteVideoFrameRendered(wrap, info); });
}

void RtcEngineWrap::OnUserMuteVideo(const char* uid, bytertc::MuteState mute) {
  ForwardEvent::PostEvent(this, [=, uid = std::string(uid)] {
    emit sigOnUserMuteVideo(uid, mute);
  });
}

void RtcEngineWrap::OnUserEnableLocalVideo(const char* uid, bool enabled) {
  ForwardEvent::PostEvent(this, [=, uid = std::string(uid)] {
    emit sigOnUserEnableLocalVideo(uid, enabled);
  });
}

void RtcEngineWrap::OnMediaDeviceStateChanged(
    const char* device_id, bytertc::MediaDeviceType device_type,
    bytertc::MediaDeviceState device_state, bytertc::MediaDeviceError error) {
  ForwardEvent::PostEvent(this, [=, device_id = std::string(device_id)] {
    emit sigOnMediaDeviceStateChanged(device_id, device_type, device_state,
                                      error);
  });
}

void RtcEngineWrap::OnLocalVideoStateChanged(
    bytertc::StreamIndex index, bytertc::LocalVideoStreamState state,
    bytertc::LocalVideoStreamError error) {
  ForwardEvent::PostEvent(
      this, [=] { emit sigOnLocalVideoStateChanged(index, state, error); });
}

void RtcEngineWrap::OnLocalAudioStateChanged(
    bytertc::LocalAudioStreamState state,
    bytertc::LocalAudioStreamError error) {
  ForwardEvent::PostEvent(
      this, [=] { emit sigOnLocalAudioStateChanged(state, error); });
}

void RtcEngineWrap::OnSysStats(const bytertc::SysStats& stats) {
  ForwardEvent::PostEvent(this, [=] { emit sigOnSysStats(stats); });
}

void RtcEngineWrap::OnLoginResult(const char* uid, int error_code, int elapsed) {
	ForwardEvent::PostEvent(this, [=, uid = std::string(uid)]{
	emit sigOnLoginResult(uid, error_code, elapsed);
		});
}

void RtcEngineWrap::OnServerParamsSetResult(int error) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnServerParamsSetResult(error); });
}

void RtcEngineWrap::OnRoomMessageReceived(const char* uid, const char* message) {
	ForwardEvent::PostEvent(this, [=, uid = std::string(uid), message = std::string(message)]{
        emit sigOnMessageReceived(uid, message);
		});
}

void RtcEngineWrap::OnUserMessageReceived(const char* uid, const char* message) {
	ForwardEvent::PostEvent(this, [=, uid = std::string(uid), message = std::string(message)]{
	    emit sigOnMessageReceived(uid, message);
		});
}

void RtcEngineWrap::OnUserMessageReceivedOutsideRoom(const char* uid, const char* message) {
	ForwardEvent::PostEvent(this, [=, uid = std::string(uid), message = std::string(message)]{
	    emit sigOnMessageReceived(uid, message);
		});
}

void RtcEngineWrap::OnServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnServerMessageSendResult(msgid, error, msg); });
}
