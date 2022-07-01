#pragma once
#include <QCoreApplication>
#include <QEvent>
#include <QObject>
#include <QPixmap>
#include <functional>
#include <memory>
#include <string>
#include <unordered_map>

#include "core/common_define.h"
#include "rtc/bytertc_advance.h"
#include "rtc/bytertc_engine_interface.h"
#include "rtc/bytertc_video_frame.h"

class ForwardEvent : public QEvent {
 public:
  ForwardEvent(std::function<void(void)>&& task)
      : QEvent(User), task_(std::move(task)) {}
  void execTask() {
    if (task_) task_();
  }
  static void PostEvent(QObject* obj, std::function<void()>&& task) {
    ForwardEvent* event = new ForwardEvent(std::move(task));
    QCoreApplication::postEvent(obj, event);
  }
  std::function<void(void)> task_;
};

enum {
  RtcDeviceTypeVideoCapture = 0,
  RtcDeviceTypeAudioRecord,
  RtcDeviceTypeAudioPlayout,
};

enum UserOfflineType {
  USER_OFFLINE_NORMAL,
  USER_OFFLINE_REPEAT_LOGIN,
  USER_OFFLINE_JOIN_FAILD,
};

enum SubscribeMode {
  AutoSubscribeMode = 0,
  ManualSubscribeMode = 1,
};

struct SubscribeConfig {
  bool is_screen = false;
  bool sub_video = false;
};

struct RemoteStream {
  std::string user_id;
  bool is_screen;
};

struct RtcDevice {
  std::string name;
  std::string device_id;
  int type;
};

struct AudioVolumeInfoWrap {
  unsigned int volume;
  std::string uid;
  bool operator<(const AudioVolumeInfoWrap& rhs) {
    return this->volume < rhs.volume;
  }
};

struct RemoteStreamStatsWrap {
  std::string uid;
  bytertc::RemoteAudioStats audio_stats;
  bytertc::RemoteVideoStats video_stats;
  bytertc::NetworkQuality remote_tx_quality;
  bytertc::NetworkQuality remote_rx_quality;
  bool is_screen;
};

struct UserInfoWrap {
  std::string uid;
  std::string extra_info;
};

struct MediaStreamInfoWrap {
  std::string user_id;
  bool is_screen;
  bool has_video;
  bool has_audio;
  std::vector<bytertc::VideoSolutionDescription> profiles;
};

struct RemoteStreamKeyWrap {
  const char* room_id;
  const char* user_id;
  bytertc::StreamIndex stream_index;
};

class RtcEngineWrap : public QObject, public bytertc::IRtcEngineEventHandler {
  Q_OBJECT

 public:
  RtcEngineWrap();
  virtual ~RtcEngineWrap() = default;
  int startPlaybackDeviceTest(const std::string& str);
  int stopPlaybackDeviceTest();
  int startRecordingDeviceTest(int indicatoin);
  int stopRecordingDeviceTest();

  static RtcEngineWrap& instance();
  static int setEnv(bytertc::Env env);
  static int SetDeviceId(const std::string& device_id);
  static std::string getSDKVersion();
  void createEngine(const std::string& app_id);
  void destroyEngine();
  int initDevices();
  void resetDevices();

  std::shared_ptr<bytertc::IRtcRoom> createRtcRoom(const std::string& room_id);
  int destoryRtcRoom(const std::string& room_id);
  int joinRoom(const std::string& token, const std::string& room_id,
	  const bytertc::UserInfo& userInfo,
	  bytertc::RoomProfileType profileType);

  int joinSubRoom(const std::string& token, const std::string& room_id,
                  const bytertc::UserInfo& userInfo,
                  bytertc::RoomProfileType profileType);
  int setUserRole(bytertc::UserRoleType role);
  int setRemoteVideoCanvas(const std::string& user_id,
                           bytertc::StreamIndex index, bytertc::RenderMode mode,
                           void* view);
  int setLocalVideoCanvas(const std::string& uid, bytertc::StreamIndex index,
                          bytertc::RenderMode mode, void* view);

  int startPreview();
  int stopPreview();
  //int enableAutoSubscribe(bytertc::SubscribeMode video_mode,
  //                        bytertc::SubscribeMode audio_mode);
  //int enableAutoPublish(bool);
  int setLocalPreviewMirrorMode(bytertc::MirrorMode mm);
  int enableLocalAudio(bool);
  int enableLocalVideo(bool);
  int muteLocalVideo(bool);
  int muteLocalAudio(bool);
  int leaveRoom();
  int leaveSubRoom(const std::string& room_id);
  int destroySubRoom(const std::string& room_id);
  int publish();
  int unPublish();
  int subPublish(const std::string& room_id);
  int unSubPublish(const std::string& room_id);

  int subscribeVideoStream(const std::string& uid,
                           const bytertc::SubscribeConfig& config);
  int unSubscribeVideoStream(const std::string& uid, bool is_screen);

  int setVideoProfiles(const bytertc::VideoSolution* solutions,
                       int solution_num);
  int setScreenProfiles(const bytertc::VideoSolution* solutions,
                        int solution_num);

  int getShareList(std::vector<SnapshotAttr>& list);
  QPixmap getThumbnail(SnapshotAttr::SnapshotType type, void* source_id,
                       int max_width, int max_height);

  int getAudioInputDevices(std::vector<RtcDevice>&);
  int setAudioInputDevice(int index);
  int getAudioInputDevice(std::string& guid);

  int getAudioOutputDevices(std::vector<RtcDevice>&);
  int setAudioOutputDevice(int index);
  int getAudioOutputDevice(std::string& guid);

  int getVideoCaptureDevices(std::vector<RtcDevice>&);
  int setVideoCaptureDevice(int index);
  int getVideoCaptureDevice(std::string& guid);

  int startScreenCapture(void* source_id, const std::vector<void*>& excluded);
  int startScreenCaptureByWindowId(void* window_id);
  int stopScreenCapture();
  bool audioReocrdDeviceTest();
  int feedBack(const std::string& str);
  int setAudioVolumeIndicate(int indicate);

  std::unique_ptr<bytertc::IRtcEngine,
                  std::function<void(bytertc::IRtcEngine*)>>&
  getRtcEngine();

 protected:
  void customEvent(QEvent* e) override;

 signals:
  void sigOnRoomStateChanged(std::string room_id, std::string uid, int state, std::string extra_info);
  void sigOnRoomStats(bytertc::RtcRoomStats stats);
  void sigOnLocalStreamStats(bytertc::LocalStreamStats stats);
  void sigOnRemoteStreamStats(RemoteStreamStatsWrap stats);
  void sigOnWarning(int warn);
  void sigOnError(int err);
  void sigOnAudioVolumeIndication(std::vector<AudioVolumeInfoWrap> speakers,
                                  int totalVolume);
  void sigOnLeaveRoom(bytertc::RtcRoomStats stats);
  void sigOnUserJoined(UserInfoWrap user_info,int elapsed);
  void sigOnUserLeave(std::string uid, bytertc::UserOfflineReason reason);
  void sigOnUserMuteAudio(std::string user_id, bytertc::MuteState mute_state);
  void sigOnUserEnableLocalAudio(std::string uid, bool enabled);

  void sigOnFirstLocalAudioFrame(bytertc::StreamIndex index);
  void sigOnStreamRemove(MediaStreamInfoWrap stream,
                         bytertc::StreamRemoveReason reason);
  void sigOnLogReport(std::string log_type, std::string log_content);
  void sigOnStreamAdd(MediaStreamInfoWrap stream);
  void sigOnStreamSubscribed(bytertc::SubscribeState state_code,
                             std::string user_id,
                             bytertc::SubscribeConfig info);
  void sigOnStreamPublishSuccess(std::string user_id, bool is_screen);
  //void sigOnAudioRouteChanged(int routing);
  void sigOnFirstLocalVideoFrameCaptured(bytertc::StreamIndex index,
                                         bytertc::VideoFrameInfo info);
  void sigOnFirstRemoteVideoFrameRendered(RemoteStreamKeyWrap key,
                                          bytertc::VideoFrameInfo info);
  void sigOnUserMuteVideo(std::string uid, bytertc::MuteState mute);

  void sigOnUserEnableLocalVideo(std::string uid, bool enabled);
  void sigOnMediaDeviceStateChanged(
	  std::string device_id, bytertc::MediaDeviceType device_type,
	  bytertc::MediaDeviceState device_state, bytertc::MediaDeviceError error);
  void sigOnLocalVideoStateChanged(bytertc::StreamIndex index,
                                   bytertc::LocalVideoStreamState state,
                                   bytertc::LocalVideoStreamError error);
  void sigOnLocalAudioStateChanged(bytertc::LocalAudioStreamState state,
                                   bytertc::LocalAudioStreamError error);
  void sigOnSysStats(bytertc::SysStats stats);

  //RTS
  void sigOnLoginResult(std::string uid, int error_code, int elapsed);
  void sigOnServerParamsSetResult(int error);
  void sigOnMessageReceived(std::string uid, std::string message);
  void sigOnServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg);

 public:
  void OnRoomStateChanged(
	  const char* room_id, const char* uid, int state, const char* extra_info) override;
  void OnRoomStats(const bytertc::RtcRoomStats& stats) override;
  void OnLocalStreamStats(const bytertc::LocalStreamStats& stats) override;
  void OnRemoteStreamStats(const bytertc::RemoteStreamStats& stats) override;
  void OnWarning(int warn) override;
  void OnError(int err) override;
  void OnAudioVolumeIndication(const bytertc::AudioVolumeInfo* speakers,
                               unsigned int speakerNumber,
                               int totalVolume) override;
  void OnLeaveRoom(const bytertc::RtcRoomStats& stats) override;
  // void OnUserJoined(const bytertc::ByteUser* users_list, int user_number)
  // override; void OnUserOffline(const bytertc::ByteUserOfflineInfo*
  // users_list, int user_number) override;
  void OnUserJoined(const bytertc::UserInfo& userInfo, int elapsed) override;
  void OnUserLeave(const char* uid, bytertc::UserOfflineReason reason) override;
  void OnUserMuteAudio(const char* user_id,
                       bytertc::MuteState mute_state) override;
  void OnUserEnableLocalAudio(const char* uid, bool enabled) override;

  void OnFirstLocalAudioFrame(bytertc::StreamIndex index) override;
  // void OnStreamRemove(const bytertc::ByteStreamRemovedInfo* streams_list, int
  // stream_number) override;
  void OnStreamRemove(const bytertc::MediaStreamInfo& stream,
                      bytertc::StreamRemoveReason reason) override;
  void OnLogReport(const char* log_type, const char* log_content) override;
  void OnStreamAdd(const bytertc::MediaStreamInfo& stream) override;
  // void OnStreamAdd(const bytertc::ByteStream* streams_list, int
  // stream_number) override;
  void OnStreamSubscribed(bytertc::SubscribeState state_code,
                          const char* user_id,
                          const bytertc::SubscribeConfig& info) override;
  void OnStreamPublishSuccess(const char* user_id, bool is_screen) override;
  //void OnAudioRouteChanged(int routing) override;
  void OnFirstLocalVideoFrameCaptured(bytertc::StreamIndex index,
                                      bytertc::VideoFrameInfo info) override;
  void OnFirstRemoteVideoFrameRendered(
      const bytertc::RemoteStreamKey key,
      const bytertc::VideoFrameInfo& info) override;


  void OnUserMuteVideo(const char* uid, bytertc::MuteState mute) override;

  void OnUserEnableLocalVideo(const char* uid, bool enabled) override;
  void OnMediaDeviceStateChanged(
	  const char* device_id, bytertc::MediaDeviceType device_type,
	  bytertc::MediaDeviceState device_state, bytertc::MediaDeviceError error) override;
  void OnLocalVideoStateChanged(bytertc::StreamIndex index,
                                bytertc::LocalVideoStreamState state,
                                bytertc::LocalVideoStreamError error) override;
  void OnLocalAudioStateChanged(bytertc::LocalAudioStreamState state,
                                bytertc::LocalAudioStreamError error) override;
  void OnSysStats(const bytertc::SysStats& stats) override;

  //RTS
  void OnLoginResult(const char* uid, int error_code, int elapsed) override;
  void OnServerParamsSetResult(int error) override;
  void OnRoomMessageReceived(const char* uid, const char* message) override;
  void OnUserMessageReceived(const char* uid, const char* message) override;
  void OnUserMessageReceivedOutsideRoom(const char* uid, const char* message) override;
  void OnServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg) override;

 protected:
  std::unique_ptr<bytertc::IRtcEngine,
                  std::function<void(bytertc::IRtcEngine*)>> engine_;
  std::unordered_map<std::string, std::shared_ptr<bytertc::IRtcRoom>> rooms_;
  std::unique_ptr<bytertc::IVideoDeviceManager,
                  std::function<void(bytertc::IVideoDeviceManager*)>>
      video_device_manager_;
  std::unique_ptr<bytertc::IAudioDeviceManager,
                  std::function<void(bytertc::IAudioDeviceManager*)>>
      audio_device_manager_;
  std::vector<RtcDevice> audio_input_devices_;
  int current_audio_input_idx_ = -1;
  std::vector<RtcDevice> audio_output_devices_;
  int current_audio_output_idx_ = -1;
  std::vector<RtcDevice> camera_devices_;
  int current_camera_idx_ = -1;
};
