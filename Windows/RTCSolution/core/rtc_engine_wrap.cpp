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
    : video_engine_(nullptr,
            [](bytertc::IRTCVideo* self) {
                bytertc::destroyRTCVideo();
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
  return audio_device_manager_->startAudioPlaybackDeviceTest(str.c_str(), 200);
}

int RtcEngineWrap::stopPlaybackDeviceTest() {
  CHECK_POINTER(audio_device_manager_, -API_CALL_ERROR);
  return audio_device_manager_->stopAudioPlaybackDeviceTest();
}

int RtcEngineWrap::startRecordingDeviceTest(int indicatoin) {
  CHECK_POINTER(audio_device_manager_, -API_CALL_ERROR);
  return audio_device_manager_->startAudioDeviceRecordTest(indicatoin);
}

int RtcEngineWrap::stopRecordingDeviceTest() {
  CHECK_POINTER(audio_device_manager_, -API_CALL_ERROR);
  return audio_device_manager_->stopAudioDeviceRecordAndPlayTest();
}

int RtcEngineWrap::setEnv(bytertc::Env env) { 
    return bytertc::setEnv(env); 
}

int RtcEngineWrap::setMainRoomId(const std::string& roomId) {
    instance().room_id_ = roomId;
    return 0;
}

int RtcEngineWrap::SetDeviceId(const std::string& device_id) {
    bytertc::setDeviceId(device_id.c_str());
    return 0;
}

void RtcEngineWrap::createEngine(const std::string& app_id) {
    video_engine_.reset(bytertc::createRTCVideo(app_id.c_str(), this, nullptr));
}

std::string RtcEngineWrap::getSDKVersion() { 
    return bytertc::getSDKVersion(); 
}

void RtcEngineWrap::destroyEngine() {
    video_engine_.reset();
}

int RtcEngineWrap::initDevices() {
    rooms_.clear();
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    audio_device_manager_.reset(video_engine_->getAudioDeviceManager());
    video_device_manager_.reset(video_engine_->getVideoDeviceManager());

    video_engine_->startVideoCapture();
    video_engine_->startAudioCapture();
    if (auto rtcRoom = getRtcRoom(room_id_)) {
        rtcRoom->unpublishStream(bytertc::MediaStreamType::kMediaStreamTypeBoth);
    }

    bytertc::VideoSolution vs;
    vs.width = 640;
    vs.height = 480;
    vs.fps = 15;
    vs.max_send_kbps = 600;

    return video_engine_->setVideoEncoderConfig(bytertc::kStreamIndexMain, &vs, 1);
}

void RtcEngineWrap::resetDevices() {
	video_device_manager_.reset();
	audio_device_manager_.reset();
}

std::shared_ptr<bytertc::IRTCRoom> RtcEngineWrap::createRtcRoom(
        const std::string& room_id) {
    auto find_it = rooms_.find(room_id);
    if (find_it != rooms_.cend()) return find_it->second;

    CHECK_POINTER(video_engine_, nullptr);
    rooms_[room_id] = std::shared_ptr<bytertc::IRTCRoom>(
        video_engine_->createRTCRoom(room_id.c_str()),
        [=](bytertc::IRTCRoom* room) { room->destroy(); });
    return rooms_[room_id];
}

int RtcEngineWrap::destoryRtcRoom(const std::string& room_id) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    auto find_it = rooms_.find(room_id);
    if (find_it != rooms_.cend()) {
        find_it->second.reset();
        rooms_.erase(find_it);
    }
    return 0;
}

int RtcEngineWrap::joinRoom(const std::string& token,
                            const std::string& room_id,
                            const bytertc::UserInfo& userInfo,
                            bytertc::RoomProfileType profileType) {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);
  room_id_ = room_id;

  bytertc::RTCRoomConfig config;
  config.room_profile_type = profileType;
  config.is_auto_publish = true;
  config.is_auto_subscribe_audio = true;
  config.is_auto_subscribe_video = true;
  if (auto rtcRoom = getRtcRoom(room_id_)) {
     return rtcRoom->joinRoom(token.c_str(), userInfo, config);
  }
  return -API_CALL_ERROR;
}

int RtcEngineWrap::setUserRole(bytertc::UserRoleType role) {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);
  if (auto rtcRoom = getRtcRoom(room_id_)) {
       rtcRoom->setUserVisibility(role == bytertc::kUserRoleTypeBroadcaster 
           ? true : false);
  }
  return 0;
}

int RtcEngineWrap::setRemoteVideoCanvas(const std::string& user_id,
                                        bytertc::StreamIndex index,
                                        bytertc::RenderMode mode, void* view, const std::string& room_id) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    bytertc::VideoCanvas vc;
    vc.view = view;
    vc.render_mode = mode;

    bytertc::RemoteStreamKey key;
    key.room_id = room_id.empty() ? room_id_.c_str() : room_id.c_str();
    key.user_id = user_id.c_str();
    key.stream_index = index;

    video_engine_->setRemoteVideoCanvas(key, vc);
    return 0;
}

int RtcEngineWrap::setLocalVideoCanvas(const std::string& uid,
                                       bytertc::StreamIndex index,
                                       bytertc::RenderMode mode, void* view) {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);
  bytertc::VideoCanvas vc;
  vc.view = view;
  vc.render_mode = mode;
  return video_engine_->setLocalVideoCanvas(index, vc);
}

int RtcEngineWrap::startPreview() {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);
  video_engine_->startVideoCapture();
  return 0;
}

int RtcEngineWrap::stopPreview() {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);
  video_engine_->stopVideoCapture();
  return 0;
}

int RtcEngineWrap::setLocalPreviewMirrorMode(bytertc::MirrorType type) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    video_engine_->setLocalVideoMirrorType(type);
    return 0;
}

int RtcEngineWrap::enableLocalAudio(bool enabled) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    if (enabled) {
        video_engine_->startAudioCapture();
    }
    else {
        video_engine_->stopAudioCapture();
    }
    return 0;
}

int RtcEngineWrap::enableLocalVideo(bool enabled) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    if (enabled) {
        video_engine_->startVideoCapture();
    }
    else {
        video_engine_->stopVideoCapture();
    }
    return 0;
}

int RtcEngineWrap::muteLocalVideo(bool enabled) {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);
  if (auto rtcRoom = getRtcRoom(room_id_)) {
      enabled ? rtcRoom->unpublishStream(bytertc::MediaStreamType::kMediaStreamTypeVideo)
          : rtcRoom->publishStream(bytertc::MediaStreamType::kMediaStreamTypeVideo);
  }
  return 0;
}

int RtcEngineWrap::muteLocalAudio(bool enabled) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    if (auto rtcRoom = getRtcRoom(room_id_)) {
        enabled ? rtcRoom->unpublishStream(bytertc::MediaStreamType::kMediaStreamTypeAudio)
            : rtcRoom->publishStream(bytertc::MediaStreamType::kMediaStreamTypeAudio);
    }
    return  0;
}

int RtcEngineWrap::leaveRoom() {
    if (auto rtcRoom = getRtcRoom(room_id_)) {
        rtcRoom->leaveRoom();
    }
    destoryRtcRoom(room_id_);
    return 0;
}

int RtcEngineWrap::leaveSubRoom(const std::string& room_id) {
    auto find_it = rooms_.find(room_id);
    if (find_it != rooms_.cend()) {
        find_it->second->leaveRoom();
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
    if (auto rtcRoom = getRtcRoom(room_id_)) {
        rtcRoom->publishStream(bytertc::MediaStreamType::kMediaStreamTypeBoth);
    }
    return 0;
}

int RtcEngineWrap::unPublish() {
    if (auto rtcRoom = getRtcRoom(room_id_)) {
        rtcRoom->unpublishStream(bytertc::MediaStreamType::kMediaStreamTypeBoth);
    }
    return 0;
}

int RtcEngineWrap::subscribeVideoStream(
        const std::string& uid, const bytertc::SubscribeConfig& config) {
    bool sub_audio = config.sub_audio;
    bool sub_video = config.sub_video;
    bytertc::MediaStreamType media_type;
    if (sub_audio && sub_video) {
        media_type = bytertc::MediaStreamType::kMediaStreamTypeBoth;
    }
    else if (!sub_audio && sub_video) {
        media_type = bytertc::MediaStreamType::kMediaStreamTypeVideo;
    }
    else if (!sub_video && sub_audio) {
        media_type = bytertc::MediaStreamType::kMediaStreamTypeAudio;
    }

    bytertc::SubscribeVideoConfig videoConfig;
    videoConfig.priority = config.priority;
    videoConfig.video_index = config.video_index;
    if (auto rtcRoom = getRtcRoom(room_id_)) {
        config.is_screen ? rtcRoom->subscribeScreen(uid.c_str(), media_type)
                        : rtcRoom->subscribeStream(uid.c_str(), media_type);
    }
    return 0;
}

int RtcEngineWrap::unSubscribeVideoStream(const std::string& uid,
                                          bool is_screen) {
    if (auto rtcRoom = getRtcRoom(room_id_)) {
        is_screen ? rtcRoom->unsubscribeScreen(uid.c_str(), bytertc::MediaStreamType::kMediaStreamTypeBoth)
            : rtcRoom->unsubscribeStream(uid.c_str(), bytertc::MediaStreamType::kMediaStreamTypeBoth);
    }
    return 0;
}

int RtcEngineWrap::enableSimulcastMode(bool enabled) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    video_engine_->enableSimulcastMode(enabled);
    return 0;
}

int RtcEngineWrap::setVideoProfiles(const bytertc::VideoEncoderConfig& config) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    return video_engine_->setVideoEncoderConfig(config);
}

int RtcEngineWrap::setAudioProfiles(bytertc::AudioProfileType type) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    video_engine_->setAudioProfile(type);
    return 0;
}

int RtcEngineWrap::setScreenProfiles(const bytertc::ScreenVideoEncoderConfig& config) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    return video_engine_->setScreenVideoEncoderConfig(config);
}

int RtcEngineWrap::getShareList(std::vector<SnapshotAttr>& list) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);

    int display_index = 0;
    SnapshotAttr snapshot;
    static std::string desktop_names[] = {
        QObject::tr("desktop_1").toStdString(), QObject::tr("desktop_2").toStdString(), 
        QObject::tr("desktop_3").toStdString(), QObject::tr("desktop_4").toStdString(), 
        QObject::tr("desktop_5").toStdString(), QObject::tr("desktop_6").toStdString(), 
        QObject::tr("desktop_7").toStdString(), QObject::tr("desktop_8").toStdString(), 
        QObject::tr("desktop_9").toStdString(), QObject::tr("desktop_10").toStdString(),
    };

    auto sourcelist = video_engine_->getScreenCaptureSourceList();
    int count = sourcelist->getCount();
    for (int i = 0; i < count; ++i) {
        auto source = sourcelist->getSourceInfo(i);
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
            }
            else {
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

    sourcelist->release();
    return 0;
}

QPixmap RtcEngineWrap::getThumbnail(SnapshotAttr::SnapshotType type,
                                    void* source_id, int max_width,
                                    int max_height) {
    QPixmap pix_map;
    CHECK_POINTER(video_engine_, pix_map);

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
    auto p = video_engine_->getThumbnail(s_type, source_id, max_width, max_height);
    CHECK_POINTER(p, pix_map);

    QImage img(reinterpret_cast<uchar*>(p->getPlaneData(0)), p->width(),
        p->height(), QImage::Format::Format_RGB32);
    return QPixmap::fromImage(img);
}

int RtcEngineWrap::getAudioInputDevices(std::vector<RtcDevice>& devices) {
    CHECK_POINTER(this->audio_device_manager_, -API_CALL_ERROR);
    char szName[512], szId[512];
    std::string strSelectedDeviceId;

    int devIdx = 0;
    audio_input_devices_.clear();
    bytertc::IDeviceCollection* pAudioRecordCollection =
        audio_device_manager_->enumerateAudioCaptureDevices();
    if (pAudioRecordCollection) {
        memset(szName, 0, sizeof(szName));
        memset(szId, 0, sizeof(szId));
        devIdx = 0;

        audio_device_manager_->getAudioCaptureDevice(szId);
        strSelectedDeviceId = szId;

        int nAudioRecNum = pAudioRecordCollection->getCount();
        if (nAudioRecNum > 0) {
            for (int i = 0; i < nAudioRecNum; ++i) {
                memset(szName, 0, sizeof(szName));
                memset(szId, 0, sizeof(szId));
                if (pAudioRecordCollection->getDevice(i, szName, szId) == 0) {
                    if (strSelectedDeviceId == szId) {
                        current_audio_input_idx_ = i;
                    }
                    RtcDevice device;
                    device.type = RtcDeviceTypeAudioRecord;
                    device.name = szName;
                    device.device_id = szId;
                    audio_input_devices_.push_back(device);
                }
            }
        }
        devices = audio_input_devices_;
        pAudioRecordCollection->release();
        pAudioRecordCollection = nullptr;
    }
    return 0;
}

int RtcEngineWrap::setAudioInputDevice(int index) {
    if (audio_input_devices_.size() <= static_cast<unsigned int>(index) ||
        index < 0)
        return -API_CALL_ERROR;
    current_audio_input_idx_ = index;
    audio_device_manager_->followSystemCaptureDevice(false);
    return audio_device_manager_->setAudioCaptureDevice(
        audio_input_devices_[index].device_id.c_str());
}

int RtcEngineWrap::getAudioInputDevice(std::string& guid) {
    guid.reserve(512);
    return audio_device_manager_->getAudioCaptureDevice(
        const_cast<char*>(guid.data()));
}

int RtcEngineWrap::getCurrentAudioInputDeviceIndex() {
    return current_audio_input_idx_;
}

int RtcEngineWrap::getAudioOutputDevices(std::vector<RtcDevice>& devices) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    std::string strSelectedDeviceId;
    char szName[512], szId[512];
    int devIdx = 0;

    audio_output_devices_.clear();

    bytertc::IAudioDeviceManager* pAudioDeviceManager =
        video_engine_->getAudioDeviceManager();
    if (pAudioDeviceManager) {
    bytertc::IDeviceCollection* pAudioPlayoutCollection =
        pAudioDeviceManager->enumerateAudioPlaybackDevices();
    if (pAudioPlayoutCollection) {
        memset(szName, 0, sizeof(szName));
        memset(szId, 0, sizeof(szId));
        devIdx = 0;

        pAudioDeviceManager->getAudioPlaybackDevice(szId);
        strSelectedDeviceId = szId;

        int nAudioRecNum = pAudioPlayoutCollection->getCount();
        if (nAudioRecNum > 0) {
        for (int i = 0; i < nAudioRecNum; ++i) {
            memset(szName, 0, sizeof(szName));
            memset(szId, 0, sizeof(szId));

            if (pAudioPlayoutCollection->getDevice(i, szName, szId) == 0) {
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
        pAudioPlayoutCollection->release();
        pAudioPlayoutCollection = nullptr;
    }
    }
    return 0;
}

int RtcEngineWrap::setAudioOutputDevice(int index) {
    if (audio_output_devices_.size() >= static_cast<unsigned int>(index) 
        || index < 0)
        return -API_CALL_ERROR;
    current_audio_output_idx_ = index;
    audio_device_manager_->followSystemPlaybackDevice(false);
    return audio_device_manager_->setAudioPlaybackDevice(
        audio_output_devices_[index].device_id.c_str());
}

int RtcEngineWrap::getAudioOutputDevice(std::string& guid) {
    guid.resize(512);
    return audio_device_manager_->getAudioPlaybackDevice(
        const_cast<char*>(guid.c_str()));
}

int RtcEngineWrap::getCurrentAudioOutputDeviceIndex() {
    return current_audio_output_idx_;
}

int RtcEngineWrap::getVideoCaptureDevices(std::vector<RtcDevice>& devices) {
    std::string strSelectedDeviceId;
    char szName[512], szId[512];
    int devIdx = 0;

    camera_devices_.clear();

    bytertc::IDeviceCollection* pVideoRecordCollection =
        video_device_manager_->enumerateVideoCaptureDevices();
    if (pVideoRecordCollection) {
    memset(szName, 0, sizeof(szName));
    memset(szId, 0, sizeof(szId));
    devIdx = 0;

    video_device_manager_->getVideoCaptureDevice(szId);
    strSelectedDeviceId = szId;

    int nVideoCaptureNum = pVideoRecordCollection->getCount();
    if (nVideoCaptureNum > 0) {
        current_camera_idx_ = 0;
        for (int i = 0; i < nVideoCaptureNum; ++i) {
        memset(szName, 0, sizeof(szName));
        memset(szId, 0, sizeof(szId));

        if (pVideoRecordCollection->getDevice(i, szName, szId) == 0) {
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

    pVideoRecordCollection->release();
    pVideoRecordCollection = nullptr;
    }
    return 0;
}

int RtcEngineWrap::setVideoCaptureDevice(int index) {
    if (camera_devices_.size() <= static_cast<unsigned int>(index) || index < 0)
        return -API_CALL_ERROR;
    return video_device_manager_->setVideoCaptureDevice(
        camera_devices_[index].device_id.c_str());
}

bool RtcEngineWrap::audioReocrdDeviceTest() {
    bool res = false;
    char szName[512];
    char szId[512];
    if (audio_device_manager_) {
        bytertc::IDeviceCollection* pAudioRecordCollection =
            audio_device_manager_->enumerateAudioCaptureDevices();
        if (pAudioRecordCollection) {
            memset(szName, 0, sizeof(szName));
            memset(szId, 0, sizeof(szId));

            int nAudioRecNum = pAudioRecordCollection->getCount();
            if (nAudioRecNum > 0) {
                current_audio_input_idx_ = 0;
                for (int i = 0; i < nAudioRecNum; ++i) {
                    memset(szName, 0, sizeof(szName));

                    if (pAudioRecordCollection->getDevice(i, szName, szId) == 0) {
                        auto code =
                            audio_device_manager_->initAudioCaptureDeviceForTest(szId);
                        if (code == 0) {
                            res = true;
                        }
                    }
                }
            }
            pAudioRecordCollection->release();
            pAudioRecordCollection = nullptr;
        }
    }
    return res;
}

int RtcEngineWrap::feedBack(bytertc::ProblemFeedbackOption* type, 
        int count, const std::string& problem_desc) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    bytertc::ProblemFeedbackInfo info;
    info.problem_desc = problem_desc.c_str();
    info.room_info_count = count;
    video_engine_->feedback(*type, &info);
    return 0;
}

int RtcEngineWrap::setAudioVolumeIndicate(int indicate) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    bytertc::AudioPropertiesConfig config;
    config.interval = indicate;
    video_engine_->enableAudioPropertiesReport(config);
    return 0;
}

void RtcEngineWrap::emitOnRTSMessageArrived(const char* uid, const char* message) {
	ForwardEvent::PostEvent(this, [=, uid = std::string(uid), message = std::string(message)]{
	    emit sigOnMessageReceived(uid, message);
	});
}

std::unique_ptr<bytertc::IRTCVideo, std::function<void(bytertc::IRTCVideo*)>>&
RtcEngineWrap::getRtcEngine() {
	return video_engine_;
}

void RtcEngineWrap::customEvent(QEvent* e) {
  if (e->type() == QEvent::User) {
    auto user_event = static_cast<ForwardEvent*>(e);
    user_event->execTask();
  }
}

std::shared_ptr<bytertc::IRTCRoom> RtcEngineWrap::getRtcRoom(const std::string& room_id) {
    if (room_id.empty()) {
        return nullptr;
    }

    auto find_it = rooms_.find(room_id);
    if (find_it != rooms_.cend()) {
        return find_it->second;
    }
    CHECK_POINTER(video_engine_, nullptr);
    rooms_[room_id] = std::shared_ptr<bytertc::IRTCRoom>(
        video_engine_->createRTCRoom(room_id.c_str()),
        [=](bytertc::IRTCRoom* room) { room->destroy(); });
    rooms_[room_id]->setRTCRoomEventHandler(this);
    return rooms_[room_id];
}

int RtcEngineWrap::getVideoCaptureDevice(std::string& guid) {
    guid.resize(512);
    return video_device_manager_->getVideoCaptureDevice(
        const_cast<char*>(guid.c_str()));
}

int RtcEngineWrap::getCurrentVideoCaptureDeviceIndex() {
    return current_camera_idx_;
}

void RtcEngineWrap::followSystemCaptureDevice(bool enabled) {
    CHECK_POINTER(this->audio_device_manager_);
    audio_device_manager_->followSystemCaptureDevice(enabled);
}

int RtcEngineWrap::enableEffectBeauty(bool enabled) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    return video_engine_->enableEffectBeauty(enabled);
}

int RtcEngineWrap::setBeautyIntensity(bytertc::EffectBeautyMode beauty_mode, float intensity) {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    return video_engine_->setBeautyIntensity(beauty_mode, intensity);
}

int RtcEngineWrap::startScreenCapture(void* source_id,
                                      const std::vector<void*>& excluded) {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);
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
      video_engine_->startScreenVideoCapture(screenSourceInfo, screenCaptureParams);

  if (nRet == 0 && getRtcRoom(room_id_)) {
      getRtcRoom(room_id_)->publishScreen(bytertc::kMediaStreamTypeBoth);
  }
  return nRet;
}

int RtcEngineWrap::startScreenCaptureByWindowId(void* window_id) {
  CHECK_POINTER(video_engine_, -API_CALL_ERROR);

  bytertc::ScreenCaptureSourceInfo screenSourceInfo;
  screenSourceInfo.type = bytertc::kScreenCaptureSourceTypeWindow;
  screenSourceInfo.source_id = window_id;

  bytertc::ScreenCaptureParameters screenCaptureParams;
  screenCaptureParams.capture_mouse_cursor =
      bytertc::kMouseCursorCaptureStateOff;
  auto nRet =
      video_engine_->startScreenVideoCapture(screenSourceInfo, screenCaptureParams);
  if (nRet == 0 && getRtcRoom(room_id_)) {
      getRtcRoom(room_id_)->publishScreen(bytertc::kMediaStreamTypeBoth);
  }
  return nRet;
}

int RtcEngineWrap::stopScreenCapture() {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    video_engine_->stopScreenVideoCapture();
    if (getRtcRoom(room_id_)) {
        getRtcRoom(room_id_)->unpublishScreen(bytertc::kMediaStreamTypeBoth);
    }
    return 0;
}

int RtcEngineWrap::startScreenAudioCapture() {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    video_engine_->startScreenAudioCapture();
    return 0;
}

int RtcEngineWrap::stopScreenAudioCapture() {
    CHECK_POINTER(video_engine_, -API_CALL_ERROR);
    video_engine_->stopScreenAudioCapture();
    return 0;
}

void RtcEngineWrap::onRoomStateChanged(const char* room_id, const char* uid,
                                       int state, const char* extra_info) {
    ForwardEvent::PostEvent(
        this, [=, rid = std::string(room_id), uid = std::string(uid),
        extra_info = std::string(extra_info)]{
            emit sigOnRoomStateChanged(rid, uid, state, extra_info);
        });
}

void RtcEngineWrap::onRoomStats(const bytertc::RtcRoomStats& stats) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnRoomStats(stats); });
}

void RtcEngineWrap::onLocalStreamStats(const bytertc::LocalStreamStats& stats) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnLocalStreamStats(stats); });
}

void RtcEngineWrap::onRemoteStreamStats(
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

void RtcEngineWrap::onWarning(int warn) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnWarning(warn); });
}

void RtcEngineWrap::onError(int err) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnError(err); });
}

void RtcEngineWrap::onRemoteAudioPropertiesReport(
        const bytertc::RemoteAudioPropertiesInfo* audio_properties_infos,
        int audio_properties_info_number, int total_remote_volume) {
    std::vector<AudioVolumeInfoWrap> vec_;
    for (size_t i = 0; i < audio_properties_info_number; i++) {
        AudioVolumeInfoWrap wrap{
            audio_properties_infos[i].audio_properties_info.linear_volume,
            audio_properties_infos[i].stream_key.stream_index,
            audio_properties_infos[i].stream_key.user_id,
            audio_properties_infos[i].stream_key.room_id
        };
        vec_.push_back(std::move(wrap));
    }
    ForwardEvent::PostEvent(
        this, [=] { emit sigOnRemoteAudioVolumeIndication(vec_, total_remote_volume); });
}

void RtcEngineWrap::onLocalAudioPropertiesReport(const bytertc::LocalAudioPropertiesInfo* audio_properties_infos, int audio_properties_info_number) {
    std::vector<AudioVolumeInfoWrap> vec_;
    for (size_t i = 0; i < audio_properties_info_number; i++) {
        AudioVolumeInfoWrap wrap{
            audio_properties_infos[i].audio_properties_info.linear_volume,
            audio_properties_infos[i].stream_index,
        };
        vec_.push_back(std::move(wrap));
    }
    ForwardEvent::PostEvent(
        this, [=] { emit sigOnLocalAudioVolumeIndication(vec_); });
}

void RtcEngineWrap::onLeaveRoom(const bytertc::RtcRoomStats& stats) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnLeaveRoom(stats); });
}

void RtcEngineWrap::onUserJoined(const bytertc::UserInfo& userInfo,
                                 int elapsed) {
    UserInfoWrap wrap;
    wrap.uid = std::string(userInfo.uid);
    wrap.extra_info = std::string(userInfo.extra_info);
    ForwardEvent::PostEvent(this, [=] { emit sigOnUserJoined(wrap, elapsed); });
}

void RtcEngineWrap::onUserLeave(const char* uid,
                                bytertc::UserOfflineReason reason) {
    ForwardEvent::PostEvent(
        this, [=, uid = std::string(uid)]{ emit sigOnUserLeave(uid, reason); });
}

void RtcEngineWrap::onUserStartAudioCapture(const char* room_id, const char* user_id) {
    ForwardEvent::PostEvent(this, [=, roomId = std::string(room_id), uid = std::string(user_id)]{
        emit sigOnUserStartAudioCapture(roomId, uid);
    });
}

void RtcEngineWrap::onUserStopAudioCapture(const char* room_id, const char* user_id) {
    ForwardEvent::PostEvent(this, [=, roomId = std::string(room_id), uid = std::string(user_id)]{
        emit sigOnUserStopAudioCapture(roomId, uid);
    });
}

void RtcEngineWrap::onFirstLocalAudioFrame(bytertc::StreamIndex index) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnFirstLocalAudioFrame(index); });
}

void RtcEngineWrap::onLogReport(const char* log_type, const char* log_content) {
    ForwardEvent::PostEvent(this, [=, log_type_ = std::string(log_type),
        log_content_ = std::string(log_content)]{
            emit sigOnLogReport(log_type_, log_content_);
    });
}

void RtcEngineWrap::onUserPublishStream(const char* uid, bytertc::MediaStreamType type) {
    ForwardEvent::PostEvent(this, [=, uid = std::string(uid)]{
        emit sigOnUserPublishStream(uid, type);
    });
}

void RtcEngineWrap::onUserUnpublishStream(const char* uid, bytertc::MediaStreamType type,
        bytertc::StreamRemoveReason reason) {
    ForwardEvent::PostEvent(this, [=, uid = std::string(uid)]{
        emit sigOnUserUnPublishStream(uid, type, reason);
    });
}

void RtcEngineWrap::onUserPublishScreen(const char* uid, bytertc::MediaStreamType type) {
    ForwardEvent::PostEvent(this, [=, uid = std::string(uid)]{
        emit sigOnUserPublishScreen(uid, type);
    });
}

void RtcEngineWrap::onUserUnpublishScreen(const char* uid,
    bytertc::MediaStreamType type, bytertc::StreamRemoveReason reason) {
    ForwardEvent::PostEvent(this, [=, uid = std::string(uid)]{
        emit sigOnUserUnPublishScreen(uid, type, reason);
    });
}

void RtcEngineWrap::onStreamSubscribed(bytertc::SubscribeState state_code,
                                       const char* user_id,
                                       const bytertc::SubscribeConfig& info) {
  ForwardEvent::PostEvent(
      this, [=] { emit sigOnStreamSubscribed(state_code, user_id, info); });
}

void RtcEngineWrap::onStreamPublishSuccess(const char* user_id,
                                           bool is_screen) {
    ForwardEvent::PostEvent(this, [=, uid = std::string(user_id)]{
        emit sigOnStreamPublishSuccess(user_id, is_screen);
    });
}

void RtcEngineWrap::onFirstLocalVideoFrameCaptured(
    bytertc::StreamIndex index, bytertc::VideoFrameInfo info) {
  ForwardEvent::PostEvent(
      this, [=] { emit sigOnFirstLocalVideoFrameCaptured(index, info); });
}

void RtcEngineWrap::onFirstRemoteVideoFrameDecoded(
    const bytertc::RemoteStreamKey key, const bytertc::VideoFrameInfo& info) {
    RemoteStreamKeyWrap wrap;
    wrap.room_id = std::string(key.room_id);
    wrap.user_id = std::string(key.user_id);
    wrap.stream_index = key.stream_index;
    ForwardEvent::PostEvent(
        this, [=] { emit sigOnFirstRemoteVideoFrameDecoded(wrap, info); });
}

void RtcEngineWrap::onUserStartVideoCapture(const char* room_id, const char* user_id) {
    ForwardEvent::PostEvent(this, [=, roomId = std::string(room_id), uid = std::string(user_id)]{
        emit sigOnUserStartVideoCapture(roomId, uid);
    });
}

void RtcEngineWrap::onUserStopVideoCapture(const char* room_id, const char* user_id) {
    ForwardEvent::PostEvent(this, [=, roomId = std::string(room_id), uid = std::string(user_id)]{
        emit sigOnUserStopVideoCapture(roomId, uid);
    });
}

void RtcEngineWrap::onAudioDeviceStateChanged(const char* device_id, 
    bytertc::RTCAudioDeviceType device_type, bytertc::MediaDeviceState device_state, 
    bytertc::MediaDeviceError device_error) {
    ForwardEvent::PostEvent(this, [=, device_id = std::string(device_id)]{
        emit sigOnAudioDeviceStateChanged(device_id, device_type, device_state,
                                    device_error);
    });
}

void RtcEngineWrap::onVideoDeviceStateChanged(const char* device_id,
    bytertc::RTCVideoDeviceType device_type, bytertc::MediaDeviceState device_state,
    bytertc::MediaDeviceError device_error) {
    ForwardEvent::PostEvent(this, [=, device_id = std::string(device_id)]{
        emit sigOnVideoDeviceStateChanged(device_id, device_type, device_state,
                                    device_error);
    });
}

void RtcEngineWrap::onAudioPlaybackDeviceTestVolume(int volume)
{
    ForwardEvent::PostEvent(
        this, [=] { emit sigOnAudioPlaybackDeviceTestVolume(volume); });
}

void RtcEngineWrap::onLocalVideoStateChanged(
    bytertc::StreamIndex index, bytertc::LocalVideoStreamState state,
    bytertc::LocalVideoStreamError error) {
    ForwardEvent::PostEvent(
        this, [=] { emit sigOnLocalVideoStateChanged(index, state, error); });
}

void RtcEngineWrap::onLocalAudioStateChanged(
        bytertc::LocalAudioStreamState state,
        bytertc::LocalAudioStreamError error) {
    ForwardEvent::PostEvent(
        this, [=] { emit sigOnLocalAudioStateChanged(state, error); });
}

void RtcEngineWrap::onSysStats(const bytertc::SysStats& stats) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnSysStats(stats); });
}

void RtcEngineWrap::onNetworkTypeChanged(bytertc::NetworkType type) {
    ForwardEvent::PostEvent(this, [=]{
        emit sigOnNetworkTypeChanged(type);
    });
}

void RtcEngineWrap::onLoginResult(const char* uid, int error_code, int elapsed) {
	ForwardEvent::PostEvent(this, [=, uid = std::string(uid)]{
	emit sigOnLoginResult(uid, error_code, elapsed);
		});
}

void RtcEngineWrap::onServerParamsSetResult(int error) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnServerParamsSetResult(error); });
}

void RtcEngineWrap::onRoomMessageReceived(const char* uid, const char* message) {
    emitOnRTSMessageArrived(uid, message);
}

void RtcEngineWrap::onUserMessageReceived(const char* uid, const char* message) {
    emitOnRTSMessageArrived(uid, message);
}

void RtcEngineWrap::onUserMessageReceivedOutsideRoom(const char* uid, const char* message) {
    emitOnRTSMessageArrived(uid, message);
}

void RtcEngineWrap::onServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg) {
    ForwardEvent::PostEvent(this, [=] { emit sigOnServerMessageSendResult(msgid, error, msg); });
}
