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

#include "bytertc_video.h"
#include "bytertc_room.h"
#include "bytertc_video_event_handler.h"
#include "bytertc_room_event_handler.h"

/** {zh}
 * Qt自定义事件类，用于将工作线程的数据转发给主线程处理
 */

/** {en}
* Qt custom event class, used to forward the data of the worker thread 
*  to the main thread for processing
*/
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
    bytertc::StreamIndex stream_index;
    std::string uid;
    std::string roomId;
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
    std::string room_id;
    std::string user_id;
    bytertc::StreamIndex stream_index;
};

/** {zh}
 * ByteRTC接口封装以及回调接收类,适用于全场景
 * 注意,相关接口和回调的具体含义可直接参看RTC原生接口的释义
 */

 /** {en}
  * ByteRTC interface wrapper and callback receiving class, applicable to all scenarios
  * Note that for the specific meaning of related interfaces and callbacks, please refer to the definition of RTC native interface directly
  */
class RtcEngineWrap : public QObject, public bytertc::IRTCVideoEventHandler
                                    , public bytertc::IRTCRoomEventHandler {
    Q_OBJECT

public:
    RtcEngineWrap();
	virtual ~RtcEngineWrap() = default;
	int startPlaybackDeviceTest(const std::string & str);
	int stopPlaybackDeviceTest();
	int startRecordingDeviceTest(int indicatoin);
	int stopRecordingDeviceTest();

	static RtcEngineWrap& instance();
	static int setEnv(bytertc::Env env);
	static int setMainRoomId(const std::string& roomId);
	static int SetDeviceId(const std::string & device_id);
	static std::string getSDKVersion();
	void createEngine(const std::string & app_id);
	void destroyEngine();
	int initDevices();
	void resetDevices();

	std::shared_ptr<bytertc::IRTCRoom> createRtcRoom(const std::string& room_id);
	int destoryRtcRoom(const std::string& room_id);
	int joinRoom(const std::string& token, const std::string& room_id,
		const bytertc::UserInfo& userInfo,
		bytertc::RoomProfileType profileType);

	int setUserRole(bytertc::UserRoleType role);
	int setRemoteVideoCanvas(const std::string& user_id,
		bytertc::StreamIndex index, bytertc::RenderMode mode,
		void* view, const std::string& room_id = "");
	int setLocalVideoCanvas(const std::string& uid, bytertc::StreamIndex index,
		bytertc::RenderMode mode, void* view);

	int startPreview();
	int stopPreview();
    int setLocalPreviewMirrorMode(bytertc::MirrorType type);
    int enableLocalAudio(bool);
    int enableLocalVideo(bool);
    int muteLocalVideo(bool);
    int muteLocalAudio(bool);
    int leaveRoom();
    int leaveSubRoom(const std::string& room_id);
    int destroySubRoom(const std::string& room_id);
    int publish();
    int unPublish();

    int subscribeVideoStream(const std::string& uid,
        const bytertc::SubscribeConfig& config);
    int unSubscribeVideoStream(const std::string& uid, bool is_screen);

    int enableSimulcastMode(bool enabled);
	int setVideoProfiles(const bytertc::VideoEncoderConfig& config);
    int setAudioProfiles(bytertc::AudioProfileType type);
	int setScreenProfiles(const bytertc::ScreenVideoEncoderConfig& config);

	int getShareList(std::vector<SnapshotAttr>& list);
	QPixmap getThumbnail(SnapshotAttr::SnapshotType type, void* source_id,
		int max_width, int max_height);

    int getAudioInputDevices(std::vector<RtcDevice>&);
    int setAudioInputDevice(int index);
    int getAudioInputDevice(std::string& guid);
    int getCurrentAudioInputDeviceIndex();

    int getAudioOutputDevices(std::vector<RtcDevice>&);
    int setAudioOutputDevice(int index);
    int getAudioOutputDevice(std::string& guid);
    int getCurrentAudioOutputDeviceIndex();

	int getVideoCaptureDevices(std::vector<RtcDevice>&);
	int setVideoCaptureDevice(int index);
	int getVideoCaptureDevice(std::string& guid);
    int getCurrentVideoCaptureDeviceIndex();

    void followSystemCaptureDevice(bool enabled);

    int enableEffectBeauty(bool enabled);
    int setBeautyIntensity(bytertc::EffectBeautyMode beauty_mode, float intensity);

	int startScreenCapture(void* source_id, const std::vector<void*>& excluded);
	int startScreenCaptureByWindowId(void* window_id);
	int stopScreenCapture();
	int startScreenAudioCapture();
	int stopScreenAudioCapture();
	bool audioReocrdDeviceTest();
	int feedBack(bytertc::ProblemFeedbackOption* type, int count, const std::string& problem_desc);
	int setAudioVolumeIndicate(int indicate);

	void emitOnRTSMessageArrived(const char* uid, const char* message);

    std::unique_ptr<bytertc::IRTCVideo, std::function<void(bytertc::IRTCVideo*)>>&
        getRtcEngine();

protected:
    void customEvent(QEvent* e) override;
    std::shared_ptr<bytertc::IRTCRoom> getRtcRoom(const std::string& room_id);

signals:
    void sigOnRoomStateChanged(std::string room_id, std::string uid, int state, std::string extra_info);
    void sigOnRoomStats(bytertc::RtcRoomStats stats);
    void sigOnLocalStreamStats(bytertc::LocalStreamStats stats);
    void sigOnRemoteStreamStats(RemoteStreamStatsWrap stats);
    void sigOnWarning(int warn);
    void sigOnError(int err);
    void sigOnRemoteAudioVolumeIndication(std::vector<AudioVolumeInfoWrap> speakers,
        int totalVolume);
    void sigOnLocalAudioVolumeIndication(std::vector<AudioVolumeInfoWrap> speakers);
    void sigOnLeaveRoom(bytertc::RtcRoomStats stats);
    void sigOnUserJoined(UserInfoWrap user_info,int elapsed);
    void sigOnUserLeave(std::string uid, bytertc::UserOfflineReason reason);
    void sigOnUserStartAudioCapture(std::string roomId, std::string uid);
    void sigOnUserStopAudioCapture(std::string roomId, std::string uid);
    

    void sigOnFirstLocalAudioFrame(bytertc::StreamIndex index);
    void sigOnLogReport(std::string log_type, std::string log_content);

    void sigOnUserPublishStream(const std::string& uid, bytertc::MediaStreamType type);
    void sigOnUserUnPublishStream(const std::string& uid, 
        bytertc::MediaStreamType type, bytertc::StreamRemoveReason reason);
    void sigOnUserPublishScreen(std::string uid, bytertc::MediaStreamType type);
    void sigOnUserUnPublishScreen(std::string uid,
        bytertc::MediaStreamType type, bytertc::StreamRemoveReason reason);
    void sigOnStreamSubscribed(bytertc::SubscribeState state_code,
                                std::string user_id,
                                bytertc::SubscribeConfig info);
    void sigOnStreamPublishSuccess(std::string user_id, bool is_screen);
    void sigOnFirstLocalVideoFrameCaptured(bytertc::StreamIndex index,
                                            bytertc::VideoFrameInfo info);
    void sigOnFirstRemoteVideoFrameDecoded(RemoteStreamKeyWrap key,
                                            bytertc::VideoFrameInfo info);

    void sigOnUserStartVideoCapture(const std::string& roomId, const std::string& userId);
    void sigOnUserStopVideoCapture(const std::string& roomId, const std::string& userId);
    void sigOnAudioDeviceStateChanged(
        const std::string& device_id, bytertc::RTCAudioDeviceType device_type, 
        bytertc::MediaDeviceState device_state, bytertc::MediaDeviceError device_error);
    void sigOnVideoDeviceStateChanged(
        const std::string& device_id, bytertc::RTCVideoDeviceType device_type,
        bytertc::MediaDeviceState device_state, bytertc::MediaDeviceError device_error);

    void sigOnLocalVideoStateChanged(bytertc::StreamIndex index,
                                    bytertc::LocalVideoStreamState state,
                                    bytertc::LocalVideoStreamError error);
    void sigOnLocalAudioStateChanged(bytertc::LocalAudioStreamState state,
                                    bytertc::LocalAudioStreamError error);

    void sigOnAudioPlaybackDeviceTestVolume(int volume);

    void sigOnSysStats(bytertc::SysStats stats);
    void sigOnNetworkTypeChanged(bytertc::NetworkType type);

    //RTS
    void sigOnLoginResult(std::string uid, int error_code, int elapsed);
    void sigOnServerParamsSetResult(int error);
    void sigOnMessageReceived(std::string uid, std::string message);
    void sigOnServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg);

public:
    void onRoomStateChanged(
	    const char* room_id, const char* uid, int state, const char* extra_info) override;
    void onRoomStats(const bytertc::RtcRoomStats& stats) override;
    void onLocalStreamStats(const bytertc::LocalStreamStats& stats) override;
    void onRemoteStreamStats(const bytertc::RemoteStreamStats& stats) override;
    void onWarning(int warn) override;
    void onError(int err) override;

    void onRemoteAudioPropertiesReport(const bytertc::RemoteAudioPropertiesInfo* audio_properties_infos, int audio_properties_info_number, int total_remote_volume) override;
    void onLocalAudioPropertiesReport(const bytertc::LocalAudioPropertiesInfo* audio_properties_infos, int audio_properties_info_number) override;
    void onLeaveRoom(const bytertc::RtcRoomStats& stats) override;
    void onUserJoined(const bytertc::UserInfo& userInfo, int elapsed) override;
    void onUserLeave(const char* uid, bytertc::UserOfflineReason reason) override;
    void onUserStartAudioCapture(const char* room_id, const char* user_id) override;
    void onUserStopAudioCapture(const char* room_id, const char* user_id) override;
    void onFirstLocalAudioFrame(bytertc::StreamIndex index) override;
    void onLogReport(const char* log_type, const char* log_content) override;

    void onUserPublishStream(const char* uid, bytertc::MediaStreamType type) override;
    void onUserUnpublishStream(const char* uid, bytertc::MediaStreamType type, bytertc::StreamRemoveReason reason) override;
    void onUserPublishScreen(const char* uid, bytertc::MediaStreamType type) override;
    void onUserUnpublishScreen(const char* uid, bytertc::MediaStreamType type,
        bytertc::StreamRemoveReason reason) override;
    void onStreamSubscribed(bytertc::SubscribeState state_code,
                            const char* user_id,
                            const bytertc::SubscribeConfig& info) override;
    void onStreamPublishSuccess(const char* user_id, bool is_screen) override;
    void onFirstLocalVideoFrameCaptured(bytertc::StreamIndex index,
                                        bytertc::VideoFrameInfo info) override;
    void onFirstRemoteVideoFrameDecoded(
        const bytertc::RemoteStreamKey key,
        const bytertc::VideoFrameInfo& info) override;

    void onUserStartVideoCapture(const char* room_id, const char* user_id) override;
    void onUserStopVideoCapture(const char* room_id, const char* user_id) override;

    void onAudioDeviceStateChanged(const char* device_id, bytertc::RTCAudioDeviceType device_type,
        bytertc::MediaDeviceState device_state, bytertc::MediaDeviceError device_error) override;
    void onVideoDeviceStateChanged(const char* device_id, bytertc::RTCVideoDeviceType device_type,
        bytertc::MediaDeviceState device_state, bytertc::MediaDeviceError device_error) override;

    void onAudioPlaybackDeviceTestVolume(int volume) override;

    void onLocalVideoStateChanged(bytertc::StreamIndex index,
                                bytertc::LocalVideoStreamState state,
                                bytertc::LocalVideoStreamError error) override;
    void onLocalAudioStateChanged(bytertc::LocalAudioStreamState state,
                                bytertc::LocalAudioStreamError error) override;
    void onSysStats(const bytertc::SysStats& stats) override;
    void onNetworkTypeChanged(bytertc::NetworkType type) override;

    //RTS
    void onLoginResult(const char* uid, int error_code, int elapsed) override;
    void onServerParamsSetResult(int error) override;
    void onRoomMessageReceived(const char* uid, const char* message) override;
    void onUserMessageReceived(const char* uid, const char* message) override;
    void onUserMessageReceivedOutsideRoom(const char* uid, const char* message) override;
    void onServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg) override;

protected:
    std::string room_id_ = "";
    std::unique_ptr<bytertc::IRTCVideo,
        std::function<void(bytertc::IRTCVideo*)>> video_engine_;
    std::unordered_map<std::string, std::shared_ptr<bytertc::IRTCRoom>> rooms_;

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
