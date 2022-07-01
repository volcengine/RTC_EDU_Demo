#pragma once
#include "core/callback_helper.h"
#include "core/rtc_engine_wrap.h"

class EduRTCEngineWrap : public QObject {
  Q_OBJECT

 public:
  static EduRTCEngineWrap& instance();
  static int init();
  static int unInit();

  static int setUserRole(bytertc::UserRoleType role);

  static int setupLocalView(void* view, bytertc::RenderMode mode,
                            const std::string& uid);

  static int setupRemoteView(void* view, bytertc::RenderMode mode,
                             const std::string& uid);

  static int setupRemoteViewMainRoom(void* view, bytertc::RenderMode mode,
                                     const std::string& uid);

  static int setupRemoteViewGroupRoom(void* view, bytertc::RenderMode mode,
                                      const std::string& uid);

  static int startPreview();
  static int stopPreview();

  //static int enableAutoSubscribe(bool video, bool audio);
  //static int enableAutoPublish(bool enable);
  static int setLocalMirrorMode(bytertc::MirrorMode mode);
  static int joinRoom(const std::string token, const std::string room_id,
                      const std::string user_id);
  static int leaveRoom();
  static int publish();
  static int unPublish();

  static int subscribeVideoStream(const std::string& user_id,
                                  const SubscribeConfig& info);
  static int unSubscribeVideoStream(const std::string& user_id, bool screen);

  static int enableLocalAudio(bool enable);
  static int enableLocalVideo(bool enable);

  static int muteLocalAudio(bool bMute);
  static int muteLocalVideo(bool bMute);

  static int getAudioInputDevices(std::vector<RtcDevice>&);
  static int setAudioInputDevice(int index);
  static int getAudioInputDevice(std::string& guid);

  static int setAudioVolumeIndicate(int indicate);

  static int getAudioOutputDevices(std::vector<RtcDevice>&);
  static int setAudioOutputDevice(int index);
  static int getAudioOutputDevice(std::string& guid);

  static int getVideoCaptureDevices(std::vector<RtcDevice>&);
  static int setVideoCaptureDevice(int index);
  static int getVideoCaptureDevice(std::string& guid);

  static int setRemoteScreenView(const std::string& uid, void* view);
  static int startScreenCapture(void* source_id,
                                const std::vector<void*>& excluded);
  static int startScreenCaptureByWindowId(void* window_id);
  static int stopScreenCapture();

  static bool audioRecordDevicesTest();

  std::shared_ptr<bytertc::IRtcRoom> getMainRtcRoom();
  std::shared_ptr<bytertc::IRtcRoom> getGroupRtcRoom();

  // test
  static int startPlaybackDeviceTest(const std::string& str);
  static int stopPlaybackDeviceTest();
  static int startRecordingDeviceTest(int indicatoin);
  static int stopRecordingDeviceTest();

  static void setMainStreamListener(
      std::function<void(const std::string& userId, bool add)>&& l);
  static void setGroupStreamListener(
      std::function<void(const std::string& userId, bool add)>&& l);

  static bool mainHasVideoStream(const std::string& userId);
  static bool groupHasVideoStream(const std::string& userId);

  static bool hasMainRoom();
  static bool hasGroupRoom();

  static void createGroupRoom(const std::string& room);
  static void createMainRoom(const std::string& room);
  static void destoryGroupRoom();
  static void destoryMainRoom();

  static void setGroupUserRole(bytertc::UserRoleType type);
  static void setMainUserRole(bytertc::UserRoleType type);
  static void publishMainRoom();
  static void unPublishMainRoom();
  static void publishGroupRoom();
  static void unPublishGroupRoom();
  static void joinGroupRoom(const std::string token, const std::string room_id,
                            const std::string user_id);
  static void joinMainRoom(const std::string token, const std::string room_id,
                      const std::string user_id);
  static void joinMainRoom(const std::string& token, const bytertc::UserInfo& info,bytertc::RoomProfileType type);
  static void joinGroupRoom(const std::string& token,
                            const bytertc::UserInfo& info,
                            bytertc::RoomProfileType type);
  static int leaveGroupRoom();
  static int leaveMainRoom();
  static int initDevice();
  static int resetDevice();

 signals:
  void sigAudioVolumeIndication(std::vector<AudioVolumeInfoWrap> volumes,
                                int total_vol);
  void sigOnRoomStateChanged(std::string room_id, std::string uid, int state, std::string extra_info);

 protected:
  EduRTCEngineWrap() = default;
  ~EduRTCEngineWrap() = default;

 private:
  std::string str_group_room_;
  std::string str_main_room_;
  std::shared_ptr<bytertc::IRtcRoom> group_room_;
  std::shared_ptr<bytertc::IRtcRoom> main_room_;

  std::function<void(const std::string& user_id, bool add)> stream_listener_;
  std::map<std::string, int> video_streams_;
  vrd::CallbackHelper cb_helper_;

  class MiniHandler : public bytertc::IRTCRoomEventHandler {
   public:
    void OnFirstRemoteVideoFrameRendered(
        const bytertc::RemoteStreamKey key,
        const bytertc::VideoFrameInfo& info) override;
    void OnStreamRemove(const bytertc::MediaStreamInfo& stream,
                        bytertc::StreamRemoveReason reason) override;
    void OnLocalVideoStateChanged(
        bytertc::StreamIndex index, bytertc::LocalVideoStreamState state,
        bytertc::LocalVideoStreamError error) override;

    std::function<void(const std::string& user_id, bool add)> stream_listener_;
    std::map<std::string, int> video_streams_;
    vrd::CallbackHelper cb_helper_;
  };

  MiniHandler group_handler_;
};