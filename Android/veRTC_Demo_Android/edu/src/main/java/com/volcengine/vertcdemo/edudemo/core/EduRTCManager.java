package com.volcengine.vertcdemo.edudemo.core;

import static com.ss.bytertc.engine.RTCEngine.ChannelProfile.CHANNEL_PROFILE_LIVE_BROADCASTING;
import static com.ss.bytertc.engine.VideoCanvas.RENDER_MODE_HIDDEN;

import android.text.TextUtils;
import android.util.Log;
import android.view.TextureView;

import com.ss.bytertc.engine.IRTCRoom;
import com.ss.bytertc.engine.MultiRoomConfig;
import com.ss.bytertc.engine.RTCEngine;
import com.ss.bytertc.engine.UserInfo;
import com.ss.bytertc.engine.VideoCanvas;
import com.ss.bytertc.engine.VideoStreamDescription;
import com.ss.bytertc.engine.data.MirrorMode;
import com.ss.bytertc.engine.data.MuteState;
import com.ss.bytertc.engine.data.RemoteStreamKey;
import com.ss.bytertc.engine.data.StreamIndex;
import com.ss.bytertc.engine.data.VideoFrameInfo;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.eventbus.SDKJoinChannelSuccessEvent;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.core.net.rtm.RTCEventHandlerWithRTM;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EduRTCManager {

    private static final String TAG = "EduRTCManager";

    private static RTCEngine sInstance = null;

    private static IRTCRoom sClassRoom = null;
    private static IRTCRoom sGroupRoom = null;

    private static final Map<String, TextureView> sUserIdView = new HashMap<>();

    private static final Map<String, Boolean> sUidInClass = new HashMap<>();

    private static final RTCEventHandlerWithRTM sRtcEventHandler = new RTCEventHandlerWithRTM() {

        @Override
        public void onRoomStateChanged(String roomId, String uid, int state, String extraInfo) {
            super.onRoomStateChanged(roomId, uid, state, extraInfo);
            Log.d(TAG, String.format("onRoomStateChanged: %s, %s, %d, %s", roomId, uid, state, extraInfo));
            if (joinRoomSuccessWhenFirst(state,extraInfo)) {
                SolutionDemoEventManager.post(new SDKJoinChannelSuccessEvent(roomId, uid));

            }
        }

        @Override
        public void onFirstLocalVideoFrameCaptured(StreamIndex streamIndex, VideoFrameInfo frameInfo) {
            super.onFirstLocalVideoFrameCaptured(streamIndex, frameInfo);
            Log.d(TAG, "onFirstLocalVideoFrameCaptured");
            setupLocalVideo(getUserRenderView(SolutionDataManager.ins().getUserId()));
        }

        @Override
        public void onError(int err) {
            Log.e(TAG, "onError:" + err);
        }
    };

    private static final IRtcRoomEventHandlerAdapter sRtcRoomEventHandler = new IRtcRoomEventHandlerAdapter() {

        @Override
        public void onRoomStateChanged(String roomId, String uid, int state, String extraInfo) {
            super.onRoomStateChanged(roomId, uid, state, extraInfo);
            Log.d(TAG, String.format("onRoomStateChanged: %s, %s, %d, %s", roomId, uid, state, extraInfo));
            if (checkExtraInfoIfJoinRoomSuccess(extraInfo)) {
                SolutionDemoEventManager.post(new SDKJoinChannelSuccessEvent(roomId, uid));
            }
        }

        @Override
        public void onFirstRemoteVideoFrameRendered(RemoteStreamKey remoteStreamKey, VideoFrameInfo videoFrameInfo) {
            super.onFirstRemoteVideoFrameRendered(remoteStreamKey, videoFrameInfo);
            Log.d(TAG, String.format("RTCRoom onFirstRemoteVideoFrameRendered: %s, %s",
                    remoteStreamKey.toString(), videoFrameInfo.toString()));
        }

        @Override
        public void onFirstRemoteVideoFrameDecoded(RemoteStreamKey remoteStreamKey, VideoFrameInfo frameInfo) {
            super.onFirstRemoteVideoFrameDecoded(remoteStreamKey, frameInfo);
            Log.d(TAG, String.format("RTCRoom onFirstRemoteVideoFrameDecoded: %s, %s",
                    remoteStreamKey.toString(), frameInfo.toString()));
            String uid = remoteStreamKey.getUserId();
            if (TextUtils.isEmpty(uid)) {
                return;
            }
            TextureView view = getUserRenderView(remoteStreamKey.getUserId());
            if (view != null) {
                if (sUidInClass.get(uid) == Boolean.TRUE) {
                    setupClassRemoteVideo(uid, view);
                } else {
                    setupGroupRemoteVideo(uid, view);
                }
            }
        }
    };

    private EduRtmClient mRTMClient;

    public EduRtmClient getRTMClient() {
        return mRTMClient;
    }

    private static EduRTCManager sEduInstance;
    public static EduRTCManager ins() {
        if (sEduInstance == null) {
            sEduInstance = new EduRTCManager();
        }
        return sEduInstance;
    }

    public void initEngine(RtmInfo info) {
        destroyEngine();
        sInstance = RTCEngine.createEngine(Utilities.getApplicationContext(), info.appId, sRtcEventHandler, null, null);
        sInstance.stopVideoCapture();
        sInstance.setAudioVolumeIndicationInterval(2000);
        mRTMClient = new EduRtmClient(sInstance, info);
        sRtcEventHandler.setBaseClient(mRTMClient);
        sRtcRoomEventHandler.setBaseClient(mRTMClient);
    }

    public static void destroyRooms() {
        MLog.d(TAG, "destroyRooms");
        if (sClassRoom != null) {
            sClassRoom.destroy();
            sClassRoom = null;
        }
        if (sGroupRoom != null) {
            sGroupRoom.destroy();
            sGroupRoom = null;
        }
    }

    public static void destroyEngine() {
        MLog.d(TAG, "destroyEngine");
        if (sInstance == null) {
            return;
        }
        sInstance = null;
        RTCEngine.destroyEngine(sInstance);
        RTCEngine.destroy();
    }

    public static void enableAutoSubscribe(boolean audioSubscribe, boolean videoSubscribe) {
        MLog.d(TAG, "enableAutoSubscribe audioSubscribe :" + audioSubscribe +  ", videoSubscribe: " + videoSubscribe);
        if (sInstance == null) {
            return;
        }
        RTCEngine.SubscribeMode audioMode = audioSubscribe ? RTCEngine.SubscribeMode.AUTO_SUBSCRIBE_MODE : RTCEngine.SubscribeMode.MANUAL_SUBSCRIBE_MODE;
        RTCEngine.SubscribeMode videoMode = videoSubscribe ? RTCEngine.SubscribeMode.AUTO_SUBSCRIBE_MODE : RTCEngine.SubscribeMode.MANUAL_SUBSCRIBE_MODE;
        sInstance.enableAutoSubscribe(audioMode, videoMode);
    }

    public static void muteLocalAudioStream(boolean mute) {
        MLog.d(TAG, "muteLocalAudioStream: " + mute);
        if (sInstance == null) {
            return;
        }
        sInstance.muteLocalAudio(mute ? MuteState.MUTE_STATE_ON : MuteState.MUTE_STATE_OFF);
    }

    public static void enableLocalAudio(boolean enable) {
        MLog.d(TAG, "enableLocalAudio: " + enable);
        if (sInstance == null) {
            return;
        }
        if (enable) {
            sInstance.startAudioCapture();
        } else {
            sInstance.stopAudioCapture();
        }
    }

    public static void enableLocalVideo(boolean enable) {
        MLog.d(TAG, "enableLocalVideo: " + enable);
        if (sInstance == null) {
            return;
        }
        if (enable) {
            sInstance.startVideoCapture();
        } else {
            sInstance.stopVideoCapture();
        }
    }

    public static void muteLocalVideoStream(boolean mute) {
        MLog.d(TAG, "muteLocalVideoStream: " + mute);
        if (sInstance == null) {
            return;
        }
        sInstance.muteLocalVideo(mute ? MuteState.MUTE_STATE_ON : MuteState.MUTE_STATE_OFF);
    }

    public static void startPreview() {
        MLog.d(TAG, "startPreview");
        if (sInstance == null) {
            return;
        }
        sInstance.startVideoCapture();
    }

    public static void stopPreview() {
        MLog.d(TAG, "stopPreview");
        if (sInstance == null) {
            return;
        }
        sInstance.stopVideoCapture();
    }

    public static void setLocalVideoMirrorMode(MirrorMode mode) {
        MLog.d(TAG, "setLocalVideoMirrorMode: " + mode);
        if (sInstance == null) {
            return;
        }
        sInstance.setLocalVideoMirrorMode(mode);
    }

    public static void setVideoProfiles(List<VideoStreamDescription> descriptions) {
        MLog.d("setVideoProfiles", "");
        if (sInstance == null) {
            return;
        }
        sInstance.setVideoEncoderConfig(descriptions);
    }

    public static void setupLocalVideo(TextureView textureView) {
        MLog.d(TAG, "setupLocalVideo");
        if (sInstance == null) {
            return;
        }
        VideoCanvas videoCanvas = new VideoCanvas(textureView, RENDER_MODE_HIDDEN, "", false);
        sInstance.setLocalVideoCanvas(StreamIndex.STREAM_INDEX_MAIN, videoCanvas);
    }

    public static void setupClassRemoteVideo(String userId, TextureView textureView) {
        Log.d(TAG, "setClassRemoteVideoView : " + userId);
        if (sClassRoom != null) {
            VideoCanvas canvas = new VideoCanvas(textureView, RENDER_MODE_HIDDEN, userId, false);
            sClassRoom.setRemoteVideoCanvas(userId, StreamIndex.STREAM_INDEX_MAIN, canvas);
        }
    }

    public static void setupGroupRemoteVideo(String userId, TextureView textureView) {
        Log.d(TAG, "setGroupRemoteVideoView : " + userId);
        if (sGroupRoom != null) {
            VideoCanvas canvas = new VideoCanvas(textureView, RENDER_MODE_HIDDEN, userId, false);
            sGroupRoom.setRemoteVideoCanvas(userId, StreamIndex.STREAM_INDEX_MAIN, canvas);
        }
    }

    public static void joinClassChannel(String token, String roomId, String uid) {
        MLog.d(TAG, "joinClassChannel token:" + token + " roomId:" + roomId + " uid:" + uid);
        if (sInstance == null) {
            return;
        }
        if (sClassRoom == null) {
            sClassRoom = sInstance.createRoom(roomId);
            sClassRoom.setRTCRoomEventHandler(sRtcRoomEventHandler);
        }
        UserInfo userInfo = new UserInfo(uid, null);
        MultiRoomConfig config = new MultiRoomConfig(CHANNEL_PROFILE_LIVE_BROADCASTING,
                true, true);
        sClassRoom.joinRoom(token, userInfo, config);
    }

    public static void joinGroupChannel(String token, String roomId, String uid) {
        MLog.d(TAG, "joinGroupChannel token:" + token + " roomId:" + roomId + " uid:" + uid);
        if (sInstance == null) {
            return;
        }
        if (sGroupRoom == null) {
            sGroupRoom = sInstance.createRoom(roomId);
            sGroupRoom.setRTCRoomEventHandler(sRtcRoomEventHandler);
        }
        UserInfo userInfo = new UserInfo(uid, null);
        MultiRoomConfig config = new MultiRoomConfig(CHANNEL_PROFILE_LIVE_BROADCASTING,
                true, true);
        sGroupRoom.joinRoom(token, userInfo, config);
    }

    public static void leaveChannel() {
        MLog.d(TAG, "leaveChannel");
        if (sClassRoom != null) {
            sClassRoom.leaveRoom();
        }
        if (sGroupRoom != null) {
            sGroupRoom.leaveRoom();
        }
    }

    public static void setClassClientRole(boolean isVisible) {
        MLog.d(TAG, "setClassClientRole clientRole: " + isVisible);
        if (sClassRoom != null) {
            sClassRoom.setUserVisibility(isVisible);
        }
    }

    public static void setGroupClientRole(boolean isVisible) {
        MLog.d(TAG, "setGroupClientRole clientRole: " + isVisible);
        if (sGroupRoom != null) {
            sGroupRoom.setUserVisibility(isVisible);
        }
    }

    public static void classPublish(boolean isPub) {
        MLog.d(TAG, "classPublish isPub: " + isPub);
        if (sClassRoom != null) {
            if (isPub) {
                sClassRoom.publish();
            } else {
                sClassRoom.unpublish();
            }
        }
    }

    public static void groupPublish(boolean isPub) {
        MLog.d(TAG, "groupPublish isPub: " + isPub);
        if (sGroupRoom != null) {
            if (isPub) {
                sGroupRoom.publish();
            } else {
                sGroupRoom.unpublish();
            }
        }
    }

    public static void unSubscribe(String userId) {
        MLog.d(TAG, "unSubscribe: " + userId);
        if (sGroupRoom != null) {
            sGroupRoom.unsubscribe(userId, false);
        }
        if (sClassRoom != null) {
            sClassRoom.unsubscribe(userId, false);
        }
    }

    public static TextureView getUserRenderView(String userId) {
        if (TextUtils.isEmpty(userId)) {
            return null;
        }
        TextureView view = sUserIdView.get(userId);
        if (view == null) {
            view = new TextureView(Utilities.getApplicationContext());
            sUserIdView.put(userId, view);
        }
        return view;
    }

    public static void clearUserRenderView() {
        sUserIdView.clear();
    }

    /**
     * 是否在大教室或者上台中
     */
    public static void setUidInClass(String uid, boolean isInClass) {
        Log.d(TAG, "setUidInClass: " + uid + " " + isInClass);
        if (!TextUtils.isEmpty(uid)) {
            sUidInClass.put(uid, isInClass);
        }
    }
}
