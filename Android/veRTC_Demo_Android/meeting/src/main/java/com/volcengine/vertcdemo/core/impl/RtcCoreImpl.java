package com.volcengine.vertcdemo.core.impl;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.opengl.EGLContext;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.ss.bytertc.engine.RTCRoom;
import com.ss.bytertc.engine.RTCStream;
import com.ss.bytertc.engine.RTCVideo;
import com.ss.bytertc.engine.ScreenVideoEncoderConfig;
import com.ss.bytertc.engine.SubscribeConfig;
import com.ss.bytertc.engine.UserInfo;
import com.ss.bytertc.engine.VideoCanvas;
import com.ss.bytertc.engine.VideoEncoderConfig;
import com.ss.bytertc.engine.data.AVSyncState;
import com.ss.bytertc.engine.data.AudioPropertiesConfig;
import com.ss.bytertc.engine.data.AudioRoute;
import com.ss.bytertc.engine.data.CameraId;
import com.ss.bytertc.engine.data.LocalAudioPropertiesInfo;
import com.ss.bytertc.engine.data.LocalAudioStreamError;
import com.ss.bytertc.engine.data.LocalAudioStreamState;
import com.ss.bytertc.engine.data.MirrorType;
import com.ss.bytertc.engine.data.RemoteAudioPropertiesInfo;
import com.ss.bytertc.engine.data.RemoteAudioState;
import com.ss.bytertc.engine.data.RemoteAudioStateChangeReason;
import com.ss.bytertc.engine.data.RemoteStreamKey;
import com.ss.bytertc.engine.data.ScreenMediaType;
import com.ss.bytertc.engine.data.StreamIndex;
import com.ss.bytertc.engine.data.VideoRotationMode;
import com.ss.bytertc.engine.handler.IRTCRoomEventHandler;
import com.ss.bytertc.engine.handler.IRTCVideoEventHandler;
import com.ss.bytertc.engine.type.AudioScenarioType;
import com.ss.bytertc.engine.type.ConnectionState;
import com.ss.bytertc.engine.type.LocalStreamStats;
import com.ss.bytertc.engine.type.LocalVideoStreamError;
import com.ss.bytertc.engine.type.LocalVideoStreamState;
import com.ss.bytertc.engine.type.MediaStreamType;
import com.ss.bytertc.engine.type.RTCRoomStats;
import com.ss.bytertc.engine.type.RemoteStreamStats;
import com.ss.bytertc.engine.type.RemoteVideoState;
import com.ss.bytertc.engine.type.RemoteVideoStateChangeReason;
import com.ss.bytertc.engine.type.StreamRemoveReason;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.common.AbsBroadcast;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.AbsHandlerPool;
import com.volcengine.vertcdemo.core.IUIRtcDef;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.internal.LifecycleManager;
import com.volcengine.vertcdemo.core.internal.PermissionManager;
import com.volcengine.vertcdemo.core.internal.RendererManager;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.rtm.RTMBaseClient;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;

import org.json.JSONObject;

import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class RtcCoreImpl extends UIRtcCore {

    private static final String TAG = "UIRtcCore";

    private final Executor mExecutor = Executors.newSingleThreadExecutor();
    private final RtcDataProviderImpl mRoomDataProvider = new RtcDataProviderImpl();
    private final AbsHandlerPool<IUIRtcDef.IRtcListener> mRtcListenerPool = new AbsHandlerPool<>();

    private final RtmInfo mRtmInfo;
    private final RTCVideo mRtcVideo;
    private final RtmClient mRtmClient;
    private final Map<String, RTCRoom> mRtcRoomMap = new ConcurrentHashMap<>();

    private final LifecycleManager mLifecycleManager;
    private final PermissionManager mPermissionManager;
    private final RendererManager mRendererManager;

    public RtcCoreImpl(@NonNull Activity activity, @NonNull RtmInfo rtmInfo) {
        mRtmInfo = rtmInfo;
        mRtcVideo = RTCVideo.createRTCVideo(activity.getApplicationContext(), mRtmInfo.appId, mIRTCVideoEventHandler, null, null);
        mRtcVideo.setVideoRotationMode(VideoRotationMode.FollowGSensor);
        mRtcVideo.setAudioScenario(AudioScenarioType.AUDIO_SCENARIO_COMMUNICATION);
        mRtcVideo.enableAudioPropertiesReport(new AudioPropertiesConfig(VOLUME_INTERVAL_MS));
        mRtmClient = new RtmClient(mRtcVideo, rtmInfo);
        mLifecycleManager = new LifecycleManager(mRoomDataProvider, activity);
        mPermissionManager = new PermissionManager(mRoomDataProvider);
        mRendererManager = new RendererManager(mRoomDataProvider);
        observeState();
    }

    @Override
    public void dispose() {
        mRendererManager.dispose();
        mPermissionManager.dispose();
        mLifecycleManager.dispose();
        for (RTCRoom item : mRtcRoomMap.values()) {
            item.leaveRoom();
            item.destroy();
        }
        mRtcRoomMap.clear();
        mRtcListenerPool.dispose();
        if (mRtcVideo != null) {
            RTCVideo.destroyRTCVideo();
        }
    }

    @Override
    public RtcDataProviderImpl getRtcDataProvider() {
        return mRoomDataProvider;
    }

    @Override
    public void requestPermissions() {
        mPermissionManager.requestPermissions(mRoomDataProvider.currentActivity(), REQUEST_CODE_OF_DEVICE_PERMISSION);
    }

    @Override
    public void reCheckPermissions() {
        mPermissionManager.reCheckPermissions(mRoomDataProvider.currentActivity());
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        mPermissionManager.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void setupLocalVideoRenderer(@NonNull ViewGroup viewGroup) {
        VideoCanvas videoCanvas = mRendererManager.getLocalVideoRenderer(viewGroup.getContext());
        setupLocalVideo(videoCanvas);
        View renderView = videoCanvas.renderView;
        addRenderView(viewGroup, renderView);
    }

    @Override
    public void setupRemoteVideoRenderer(@NonNull ViewGroup viewGroup, @NonNull String roomId, @NonNull String userId) {
        VideoCanvas videoCanvas = mRendererManager.getRemoteVideoRenderer(viewGroup.getContext(), roomId, userId);
        setupRemoteVideo(roomId, userId, videoCanvas);
        addRenderView(viewGroup, videoCanvas.renderView);
    }

    @Override
    public void setupRemoteScreenRenderer(@NonNull ViewGroup viewGroup, @NonNull String roomId, @NonNull String userId) {
        MLog.d(TAG, "setupRemoteScreenRenderer, roomId: " + roomId + ", userId: " + userId);
        VideoCanvas screenCanvas = mRendererManager.getRemoteScreenRenderer(viewGroup.getContext(), roomId, userId);
        setupRemoteScreen(roomId, userId, screenCanvas);
        addRenderView(viewGroup, screenCanvas.renderView);
    }

    private void addRenderView(@NonNull ViewGroup viewGroup, @NonNull View renderView) {
        if (renderView.getParent() != viewGroup) {
            Utilities.removeFromParent(renderView);
            viewGroup.addView(renderView, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        }
    }

    @Override
    public void removeVideoRenderer(@NonNull ViewGroup viewGroup) {
        viewGroup.removeAllViews();
    }

    @Override
    public void setDevicePrefer(boolean openMic, boolean openCam) {
        mRoomDataProvider.setPreferOpenMic(openMic);
        mRoomDataProvider.setPreferOpenCam(openCam);
    }

    @Override
    public boolean openMic(boolean open) {
        if (Boolean.TRUE.equals(mRoomDataProvider.getMicPermission().getValue())) {
            mRoomDataProvider.setPreferOpenMic(open);
            return true;
        } else {
            mPermissionManager.requestMicPermission(mRoomDataProvider.currentActivity(), REQUEST_CODE_OF_DEVICE_PERMISSION);
            return false;
        }
    }

    @Override
    public boolean openCam(boolean open) {
        if (Boolean.TRUE.equals(mRoomDataProvider.getCamPermission().getValue())) {
            mRoomDataProvider.setPreferOpenCam(open);
            return true;
        } else {
            mPermissionManager.requestCamPermission(mRoomDataProvider.currentActivity(), REQUEST_CODE_OF_DEVICE_PERMISSION);
            return false;
        }
    }

    @Override
    public void switchCamera(boolean facingFront) {
        mRoomDataProvider.setFacingFront(facingFront);
    }

    @Override
    public void enableSpeakerphone(boolean speakerPhone) {
        mRoomDataProvider.setSpeakerPhone(speakerPhone);
    }

    @Override
    public boolean isSpeakerphoneOrEarpiece() {
        AudioRoute currentAudioRoute = mRtcVideo.getAudioRoute();
        return currentAudioRoute == AudioRoute.AUDIO_ROUTE_SPEAKERPHONE
                || currentAudioRoute == AudioRoute.AUDIO_ROUTE_EARPIECE;
    }

    @Override
    public void loginRtm(@NonNull RTMBaseClient.LoginCallBack callback) {
        MLog.d(TAG, "loginRtm");
        logoutRtm();
        mRtmClient.login(mRtmInfo.rtmToken, (resultCode, message) -> {
            if (resultCode == RTMBaseClient.LoginCallBack.SUCCESS) {
                mRoomDataProvider.enableRtmLoggedStateMonitor(true);
            }
            callback.notifyLoginResult(resultCode, message);
        });
    }

    @Override
    public void logoutRtm() {
        if (mRoomDataProvider.isRtmLogged()) {
            MLog.d(TAG, "logoutRtm");
            mRoomDataProvider.enableRtmLoggedStateMonitor(false);
            mRtmClient.logout();
        }
    }

    @Override
    public <T extends RTMBizResponse> void sendRtmMessage(String eventName, String requestId, Object message, Class<T> resultClass, IRequestCallback<T> callback) {
        mRtmClient.sendServerMessage(eventName, requestId, message, resultClass, callback);
    }

    @Override
    public <T extends RTMBizInform> void addRtmEventListener(String event, Class<T> clz, AbsBroadcast.On<T> on) {
        mRtmClient.putEventListener(new AbsBroadcast<>(event, clz, on));
    }

    @Override
    public void removeRtmEventListener() {
        mRtmClient.removeEventListener();
    }

    @Override
    public void setVideoEncoderConfig(List<VideoEncoderConfig> configs) {
        if (configs == null || configs.isEmpty()) {
            return;
        }
        MLog.d(TAG, "setVideoEncoderConfig, configs: " + configs);
        VideoEncoderConfig[] array = new VideoEncoderConfig[configs.size()];
        configs.toArray(array);
        mRtcVideo.setVideoEncoderConfig(array);
    }

    @Override
    public void setScreenVideoEncoderConfig(VideoEncoderConfig description) {
        MLog.d(TAG, "setScreenShareProfiles, description: " + description);
        ScreenVideoEncoderConfig config = new ScreenVideoEncoderConfig();
        if (description.encodePreference == VideoEncoderConfig.EncoderPreference.MaintainQuality) {
            config.encodePreference = ScreenVideoEncoderConfig.EncoderPreference.MaintainQuality;
        } else if (description.encodePreference == VideoEncoderConfig.EncoderPreference.MaintainFramerate) {
            config.encodePreference = ScreenVideoEncoderConfig.EncoderPreference.MaintainFramerate;
        }
        config.frameRate = description.frameRate;
        config.height = description.height;
        config.width = description.width;
        config.maxBitrate = description.maxBitrate;
        config.minBitrate = description.minBitrate;
        mRtcVideo.setScreenVideoEncoderConfig(config);
    }

    @Override
    public RTCRoom createRtcRoom(String roomId) {
        MLog.d(TAG, "createRoom " + roomId);
        RTCRoom rtcRoom = mRtcVideo.createRTCRoom(roomId);
        rtcRoom.setRTCRoomEventHandler(mIRTCRoomEventHandler);
        mRtcRoomMap.put(roomId, rtcRoom);
        return rtcRoom;
    }

    @Override
    public void destroyRtcRoom(String roomId) {
        MLog.d(TAG, "destroyRoom " + roomId);
        RTCRoom rtcRoom = mRtcRoomMap.remove(roomId);
        if (rtcRoom != null) {
            rtcRoom.destroy();
        }
        mRendererManager.clearRemoteRenderer(roomId);
    }

    @Override
    public void startScreenCapture(Intent intent) {
        MLog.d(TAG, "startScreenCapture");
        mRtcVideo.startScreenCapture(ScreenMediaType.SCREEN_MEDIA_TYPE_VIDEO_AND_AUDIO, intent);
    }

    @Override
    public void updateScreenCapture(boolean includeAudio) {
        MLog.d(TAG, "updateScreenCapture,  includeAudio: " + includeAudio);
        mRoomDataProvider.setScreenAudio(includeAudio);
    }

    @Override
    public void stopScreenCapture() {
        MLog.d(TAG, "stopScreenCapture");
        mRtcVideo.stopScreenCapture();
        updateScreenCapture(false);
    }

    @Override
    public void addHandler(IUIRtcDef.IRtcListener listener) {
        mRtcListenerPool.addHandler(listener);
    }

    @Override
    public void removeHandler(IUIRtcDef.IRtcListener listener) {
        mRtcListenerPool.removeHandler(listener);
    }

    public Executor getExecutor() {
        return mExecutor;
    }

    private void observeState() {
        mRoomDataProvider.facingFront().observeForever(this::setCameraId);
        mRoomDataProvider.speakerPhone().observeForever(this::setDefaultAudioRoute);
        mRoomDataProvider.appBackground().observeForever(isInBackground -> {
            if (isInBackground) {
                if (mRoomDataProvider.isCamOpen()) {
                    enableLocalVideo(false);
                }
            } else {
                if (mRoomDataProvider.isCamOpen()) {
                    enableLocalVideo(true);
                }
            }
        });
        mRoomDataProvider.micState().observeForever(this::enableLocalAudio);
        mRoomDataProvider.camState().observeForever(this::enableLocalVideo);
    }

    private void enableLocalAudio(boolean enable) {
        MLog.d(TAG, "enableLocalAudio, enable:" + enable);
        if (enable) {
            mRtcVideo.startAudioCapture();
        } else {
            mRtcVideo.stopAudioCapture();
        }
    }

    private void enableLocalVideo(boolean enable) {
        MLog.d(TAG, "enableLocalVideo, enable:" + enable);
        if (enable) {
            mRtcVideo.startVideoCapture();
        } else {
            mRtcVideo.stopVideoCapture();
        }
    }

    private void setCameraId(boolean facingFront) {
        MLog.d(TAG, "switchCamera, change to facing: " + (facingFront ? "front" : "rear"));
        CameraId cameraId = facingFront ? CameraId.CAMERA_ID_FRONT : CameraId.CAMERA_ID_BACK;
        mRtcVideo.switchCamera(cameraId);
        if (CameraId.CAMERA_ID_FRONT.equals(cameraId)) {
            mRtcVideo.setLocalVideoMirrorType(MirrorType.MIRROR_TYPE_RENDER);
        } else {
            mRtcVideo.setLocalVideoMirrorType(MirrorType.MIRROR_TYPE_NONE);
        }
    }

    private void setDefaultAudioRoute(boolean speakerPhone) {
        MLog.d(TAG, "enableSpeakerphone, speaker: " + speakerPhone);
        mRtcVideo.setDefaultAudioRoute(speakerPhone ? AudioRoute.AUDIO_ROUTE_SPEAKERPHONE : AudioRoute.AUDIO_ROUTE_EARPIECE);
    }

    private void setupLocalVideo(VideoCanvas canvas) {
        MLog.d(TAG, "setupLocalVideo");
        mRtcVideo.setLocalVideoCanvas(StreamIndex.STREAM_INDEX_MAIN, canvas);
    }

    private void setupRemoteVideo(String roomId, String uid, VideoCanvas canvas) {
        RemoteStreamKey streamKey = new RemoteStreamKey(roomId, uid, StreamIndex.STREAM_INDEX_MAIN);
        MLog.d(TAG, "setupRemoteVideo streamKey:" + streamKey);
        mRtcVideo.setRemoteVideoCanvas(streamKey, canvas);
    }

    private void setupRemoteScreen(String roomId, String uid, VideoCanvas canvas) {
        RemoteStreamKey streamKey = new RemoteStreamKey(roomId, uid, StreamIndex.STREAM_INDEX_SCREEN);
        MLog.d(TAG, "setupRemoteScreen, streamKey: " + streamKey);
        mRtcVideo.setRemoteVideoCanvas(streamKey, canvas);
    }

    private void runInExecutor(Runnable runnable) {
        mExecutor.execute(runnable);
    }

    private void notifyRtcHandler(AbsHandlerPool.Consumer<IUIRtcDef.IRtcListener> action) {
        mExecutor.execute(() -> mRtcListenerPool.notifyHandler(action));
    }

    // implementation of IRTCVideoEventHandler
    @SuppressWarnings("FieldCanBeLocal")
    private final IRTCVideoEventHandler mIRTCVideoEventHandler = new IRTCVideoEventHandler() {

        private static final String UID_BIZ_SERVER = "server";

        @Override
        public void onLoginResult(String userId, int error, int elapsed) {
            runInExecutor(() -> mRtmClient.onLoginResult(userId, error, elapsed));
        }

        @Override
        public void onServerMessageSendResult(long msgId, int error, ByteBuffer message) {
            runInExecutor(() -> mRtmClient.onServerMessageSendResult(msgId, error));
        }

        @Override
        public void onServerParamsSetResult(int error) {
            runInExecutor(() -> mRtmClient.onServerParamsSetResult(error));
        }

        @Override
        public void onUserMessageReceivedOutsideRoom(String uid, String message) {
            if (TextUtils.equals(uid, UID_BIZ_SERVER)) {
                runInExecutor(() -> mRtmClient.onMessageReceived(uid, message));
            }
        }

        @Override
        public void onConnectionStateChanged(int state, int reason) {
            runInExecutor(() -> {
                ConnectionState connectionState = ConnectionState.fromId(state);
                MLog.d(TAG, "onConnectionStateChanged " + connectionState);
                mRoomDataProvider.setNetworkConnectionState(connectionState);
            });
        }

        @Override
        public void onLogout() {
            runInExecutor(() -> {
                MLog.d(TAG, "onLogout");
                mRoomDataProvider.setRtmLoggedState(false);
            });
        }

        @Override
        public void onRemoteVideoStateChanged(RemoteStreamKey streamKey, RemoteVideoState state, RemoteVideoStateChangeReason reason) {
            MLog.d(TAG, "onRemoteVideoStateChanged " + streamKey + ", state: " + state + ", reason: " + reason);
        }

        @Override
        public void onActiveSpeaker(String roomId, String uid) {
            notifyRtcHandler(callback -> callback.onActiveSpeaker(uid));
        }

        @Override
        public void onLocalAudioStateChanged(LocalAudioStreamState state, LocalAudioStreamError error) {
            MLog.d(TAG, "onLocalAudioStateChanged " + state + ", state: " + state);
        }

        @Override
        public void onRemoteAudioStateChanged(RemoteStreamKey key, RemoteAudioState state, RemoteAudioStateChangeReason reason) {
            MLog.d(TAG, "onRemoteAudioStateChanged " + key + ", state: " + state + ", reason: " + reason);
        }

        @Override
        public void onLocalVideoStateChanged(StreamIndex streamIndex, LocalVideoStreamState state, LocalVideoStreamError error) {
            MLog.d(TAG, "onLocalVideoStateChanged " + streamIndex + ", state: " + state + ", error: " + error);
        }

        @Override
        public void onLocalAudioPropertiesReport(LocalAudioPropertiesInfo[] audioProperties) {
            if (audioProperties == null || audioProperties.length == 0) {
                return;
            }
            notifyRtcHandler(callback -> callback.onLocalAudioPropertiesReport(Arrays.asList(audioProperties)));
        }

        @Override
        public void onRemoteAudioPropertiesReport(RemoteAudioPropertiesInfo[] audioProperties, int totalRemoteVolume) {
            if (audioProperties == null || audioProperties.length == 0) {
                return;
            }
            notifyRtcHandler(callback -> callback.onRemoteAudioPropertiesReport(Arrays.asList(audioProperties), totalRemoteVolume));
        }

        @Override
        public void onAudioRouteChanged(AudioRoute route) {
            notifyRtcHandler(callback -> callback.onAudioRouteChanged(route));
        }

    };

    // implementation of IRTCRoomEventHandler
    private final IRTCRoomEventHandler mIRTCRoomEventHandler = new IRTCRoomEventHandler() {
        @Override
        public void onRoomMessageReceived(String uid, String message) {
            runInExecutor(() -> mRtmClient.onMessageReceived(uid, message));
        }

        @Override
        public void onUserMessageReceived(String uid, String message) {
            runInExecutor(() -> mRtmClient.onMessageReceived(uid, message));
        }

        @Override
        public void onRoomStateChanged(String roomId, String uid, int state, String extraInfo) {
            MLog.d(TAG, "onRoomStateChanged roomId: " + roomId + ", uid: " + uid + ", state: " + state + "extraInfo: " + extraInfo);
            notifyRtcHandler(callback -> callback.onRoomStateChanged(state, extraInfo));
        }

        @Override
        public void onUserPublishStream(String uid, MediaStreamType type) {
            MLog.i(TAG, "onUserPublishStream " + uid + ", type: " + type);
            if (containVideo(type)) {
                notifyRtcHandler(callback -> callback.onUserVideoStreamAvailable(uid, true));
            }
        }

        @Override
        public void onUserUnpublishStream(String uid, MediaStreamType type, StreamRemoveReason reason) {
            MLog.i(TAG, "onUserUnpublishStream " + uid + ", type: " + type + " reason: " + reason);
            if (containVideo(type)) {
                notifyRtcHandler(callback -> callback.onUserVideoStreamAvailable(uid, false));
            }
        }

        @Override
        public void onUserPublishScreen(String uid, MediaStreamType type) {
            MLog.i(TAG, "onUserPublishScreen " + uid + ", type: " + type);
            if (containVideo(type)) {
                notifyRtcHandler(callback -> callback.onUserScreenStreamAvailable(uid, true));
            }
        }

        @Override
        public void onUserUnpublishScreen(String uid, MediaStreamType type, StreamRemoveReason reason) {
            MLog.i(TAG, "onUserUnpublishScreen " + uid + ", type: " + type + " reason: " + reason);
            if (containVideo(type)) {
                notifyRtcHandler(callback -> callback.onUserScreenStreamAvailable(uid, false));
            }
        }

        @Override
        public void onLeaveRoom(RTCRoomStats stats) {
        }

        @Override
        public void onStreamStateChanged(String roomId, String uid, int state, String extraInfo) {
            MLog.d(TAG, "onStreamStateChanged uid: " + uid + ", state: " + state);
        }

        @Override
        public void onRoomWarning(int warn) {
            MLog.w(TAG, "onRoomWarning " + warn);
        }

        @Override
        public void onRoomError(int err) {
            MLog.w(TAG, "onRoomError " + err);
        }

        @Override
        public void onAVSyncStateChange(AVSyncState state) {
        }

        @Override
        public void onRoomStats(RTCRoomStats stats) {
        }

        @Override
        public void onUserJoined(UserInfo userInfo, int elapsed) {
        }

        @Override
        public void onUserLeave(String uid, int reason) {
        }

        @Override
        public void onTokenWillExpire() {
        }

        @Override
        public void onLocalStreamStats(LocalStreamStats stats) {
        }

        @Override
        public void onRemoteStreamStats(RemoteStreamStats stats) {
        }

        @Override
        public void onStreamRemove(RTCStream stream, StreamRemoveReason reason) {
        }

        @Override
        public void onStreamAdd(RTCStream stream) {
        }

        @Override
        public void onStreamSubscribed(int stateCode, String userId, SubscribeConfig info) {
        }

        @Override
        public void onStreamPublishSuccess(String uid, boolean isScreen) {
        }

        @Override
        public void onRoomBinaryMessageReceived(String uid, ByteBuffer message) {
        }

        @Override
        public void onUserBinaryMessageReceived(String uid, ByteBuffer message) {
        }

        @Override
        public void onUserMessageSendResult(long msgId, int error) {
        }

        @Override
        public void onRoomMessageSendResult(long msgId, int error) {
        }

        @Override
        public void onVideoStreamBanned(String uid, boolean banned) {
        }

        @Override
        public void onAudioStreamBanned(String uid, boolean banned) {
        }
    };

    private boolean containVideo(MediaStreamType type) {
        return MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH.equals(type) || MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO.equals(type);
    }
}
