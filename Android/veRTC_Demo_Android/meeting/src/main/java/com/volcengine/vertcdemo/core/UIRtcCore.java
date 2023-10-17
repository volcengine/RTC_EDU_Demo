package com.volcengine.vertcdemo.core;

import android.app.Activity;
import android.content.Intent;
import android.view.ViewGroup;

import androidx.annotation.NonNull;

import com.ss.bytertc.engine.RTCRoom;
import com.ss.bytertc.engine.VideoEncoderConfig;
import com.ss.bytertc.engine.data.AudioRoute;
import com.volcengine.vertcdemo.common.AbsBroadcast;
import com.volcengine.vertcdemo.core.impl.RtcCoreImpl;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.rtm.RTMBaseClient;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;

import java.util.List;
import java.util.concurrent.Executor;

public abstract class UIRtcCore {

    public static final int VOLUME_INTERVAL_MS = 1000;
    public static final int REQUEST_CODE_OF_SCREEN_SHARING = 101;
    public static final int REQUEST_CODE_OF_DEVICE_PERMISSION = 102;

    private static volatile UIRtcCore sInstance = null;

    public static synchronized void init(@NonNull Activity activity, @NonNull RtmInfo rtmInfo) {
        sInstance = new RtcCoreImpl(activity, rtmInfo);
    }

    public static synchronized UIRtcCore ins() {
        return sInstance;
    }

    public static synchronized void release() {
        if (sInstance != null) {
            sInstance.dispose();
            sInstance = null;
        }
    }

    public abstract void dispose();

    public abstract IUIRtcDef.IRtcDataProvider getRtcDataProvider();

    public abstract void requestPermissions();

    public abstract void reCheckPermissions();

    public abstract void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults);

    public abstract void setupLocalVideoRenderer(@NonNull ViewGroup viewGroup);

    public abstract void setupRemoteVideoRenderer(@NonNull ViewGroup viewGroup, @NonNull String roomId, @NonNull String userId);

    public abstract void setupRemoteScreenRenderer(@NonNull ViewGroup viewGroup, @NonNull String roomId, @NonNull String userId);

    public abstract void removeVideoRenderer(@NonNull ViewGroup viewGroup);

    public abstract void setDevicePrefer(boolean openMic, boolean openCam);

    public abstract boolean openMic(boolean open);

    public abstract boolean openCam(boolean open);

    public abstract void switchCamera(boolean facingFront);

    public abstract void enableSpeakerphone(boolean speakerPhone);

    public abstract boolean isSpeakerphoneOrEarpiece();

    public abstract void loginRtm(@NonNull RTMBaseClient.LoginCallBack callback);

    public abstract void logoutRtm();

    public abstract <T extends RTMBizResponse> void sendRtmMessage(String eventName, String requestId, Object message, Class<T> resultClass, IRequestCallback<T> callback);

    public abstract <T extends RTMBizInform> void addRtmEventListener(String event, Class<T> clz, AbsBroadcast.On<T> on);

    public abstract void removeRtmEventListener();

    public abstract void setVideoEncoderConfig(List<VideoEncoderConfig> configs);

    public abstract void setScreenVideoEncoderConfig(VideoEncoderConfig description);

    public abstract RTCRoom createRtcRoom(String roomId);

    public abstract void destroyRtcRoom(String roomId);

    public abstract void startScreenCapture(Intent intent);

    public abstract void updateScreenCapture(boolean includeAudio);

    public abstract void stopScreenCapture();

    public abstract void addHandler(IUIRtcDef.IRtcListener listener);

    public abstract void removeHandler(IUIRtcDef.IRtcListener listener);

    public abstract Executor getExecutor();
}
