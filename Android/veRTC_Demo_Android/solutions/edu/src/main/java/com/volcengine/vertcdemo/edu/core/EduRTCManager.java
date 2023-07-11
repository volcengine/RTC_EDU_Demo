// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.core;

import static com.ss.bytertc.engine.VideoCanvas.RENDER_MODE_HIDDEN;

import android.text.TextUtils;
import android.util.Log;
import android.view.TextureView;

import com.ss.bytertc.engine.RTCRoom;
import com.ss.bytertc.engine.RTCRoomConfig;
import com.ss.bytertc.engine.RTCVideo;
import com.ss.bytertc.engine.UserInfo;
import com.ss.bytertc.engine.VideoCanvas;
import com.ss.bytertc.engine.data.AudioPropertiesConfig;
import com.ss.bytertc.engine.data.RemoteStreamKey;
import com.ss.bytertc.engine.data.StreamIndex;
import com.ss.bytertc.engine.data.VideoFrameInfo;
import com.ss.bytertc.engine.type.ChannelProfile;
import com.ss.bytertc.engine.type.MediaStreamType;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.eventbus.SDKJoinChannelSuccessEvent;
import com.volcengine.vertcdemo.core.eventbus.SDKReconnectToRoomEvent;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.core.net.rts.RTCRoomEventHandlerWithRTS;
import com.volcengine.vertcdemo.core.net.rts.RTCVideoEventHandlerWithRTS;
import com.volcengine.vertcdemo.core.net.rts.RTSInfo;
import com.volcengine.vertcdemo.utils.AppUtil;

import java.util.HashMap;
import java.util.Map;

public class EduRTCManager {

    private static final String TAG = "EduRTCManager";

    private static RTCVideo sRTCVideo = null;

    private static RTCRoom sClassRoom = null;
    private static RTCRoom sGroupRoom = null;

    private static String mClassRoomId; // 加入的大班房间的roomId
    private static String mGroupRoomId; // 加入的小组房间的roomId

    private static final Map<String, TextureView> sUserIdView = new HashMap<>();

    private static final Map<String, Boolean> sUidInClass = new HashMap<>();

    private final RTCVideoEventHandlerWithRTS mRTCVideoEventHandler = new RTCVideoEventHandlerWithRTS() {

        @Override
        public void onFirstRemoteVideoFrameRendered(RemoteStreamKey remoteStreamKey, VideoFrameInfo videoFrameInfo) {
            super.onFirstRemoteVideoFrameRendered(remoteStreamKey, videoFrameInfo);
            Log.d(TAG, String.format("RTCRoom onFirstRemoteVideoFrameRendered: %s, %s",
                    remoteStreamKey.toString(), videoFrameInfo.toString()));
        }

        @Override
        public void onFirstLocalVideoFrameCaptured(StreamIndex streamIndex, VideoFrameInfo frameInfo) {
            super.onFirstLocalVideoFrameCaptured(streamIndex, frameInfo);
            Log.d(TAG, "onFirstLocalVideoFrameCaptured");
            setupLocalVideo(getUserRenderView(SolutionDataManager.ins().getUserId()));
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

        @Override
        public void onError(int err) {
            Log.e(TAG, "onError:" + err);
        }
    };

    private static final RTCRoomEventHandlerWithRTS mRTCRoomEventHandler = new RTCRoomEventHandlerWithRTS() {

        @Override
        public void onRoomStateChanged(String roomId, String uid, int state, String extraInfo) {
            super.onRoomStateChanged(roomId, uid, state, extraInfo);
            Log.d(TAG, String.format("onRoomStateChanged: %s, %s, %d, %s", roomId, uid, state, extraInfo));
            if (isFirstJoinRoomSuccess(state,extraInfo)) {
                SolutionDemoEventManager.post(new SDKJoinChannelSuccessEvent(roomId, uid));
            } else if (isReconnectSuccess(state, extraInfo)) {
                SolutionDemoEventManager.post(new SDKReconnectToRoomEvent(roomId));
            }
        }
    };



    private EduRTSClient mRTMClient;

    public EduRTSClient getRTMClient() {
        return mRTMClient;
    }

    private static EduRTCManager sEduInstance;
    public static EduRTCManager ins() {
        if (sEduInstance == null) {
            sEduInstance = new EduRTCManager();
        }
        return sEduInstance;
    }

    public void initEngine(RTSInfo info) {
        destroyEngine();
        sRTCVideo = RTCVideo.createRTCVideo(AppUtil.getApplicationContext(), info.appId,
                mRTCVideoEventHandler, null, null);
        sRTCVideo.setBusinessId(info.bid);
        sRTCVideo.stopVideoCapture();
        sRTCVideo.enableAudioPropertiesReport(new AudioPropertiesConfig(2000));
        mRTMClient = new EduRTSClient(sRTCVideo, info);
        mRTCVideoEventHandler.setBaseClient(mRTMClient);
        mRTCRoomEventHandler.setBaseClient(mRTMClient);
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

        if (sClassRoom != null) {
            sClassRoom.destroy();
        }
        if (sGroupRoom != null) {
            sGroupRoom.destroy();
        }
        if (sRTCVideo != null) {
            RTCVideo.destroyRTCVideo();
            sRTCVideo = null;
        }
    }

    public static void muteLocalAudioStream(boolean mute) {
        MLog.d(TAG, "muteLocalAudioStream: " + mute);
        if (sClassRoom != null) {
            if (mute) {
                sClassRoom.unpublishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_AUDIO);
            } else {
                sClassRoom.publishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_AUDIO);
            }
        }
        if (sGroupRoom != null) {
            if (mute) {
                sGroupRoom.unpublishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_AUDIO);
            } else {
                sGroupRoom.publishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_AUDIO);
            }
        }
    }

    public static void enableLocalAudio(boolean enable) {
        MLog.d(TAG, "enableLocalAudio: " + enable);
        if (sRTCVideo == null) {
            return;
        }
        if (enable) {
            sRTCVideo.startAudioCapture();
        } else {
            sRTCVideo.stopAudioCapture();
        }
    }

    public static void enableLocalVideo(boolean enable) {
        MLog.d(TAG, "enableLocalVideo: " + enable);
        if (sRTCVideo == null) {
            return;
        }
        if (enable) {
            sRTCVideo.startVideoCapture();
        } else {
            sRTCVideo.stopVideoCapture();
        }
    }

    public static void muteLocalVideoStream(boolean mute) {
        MLog.d(TAG, "muteLocalVideoStream: " + mute);
        if (sRTCVideo == null) {
            return;
        }
        if (sClassRoom != null) {
            if (mute) {
                sClassRoom.unpublishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
            } else {
                sClassRoom.publishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
            }
        }
        if (sGroupRoom != null) {
            if (mute) {
                sGroupRoom.unpublishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
            } else {
                sGroupRoom.publishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
            }
        }
    }

    public static void startPreview() {
        MLog.d(TAG, "startPreview");
        if (sRTCVideo == null) {
            return;
        }
        sRTCVideo.startVideoCapture();
    }

    public static void stopPreview() {
        MLog.d(TAG, "stopPreview");
        if (sRTCVideo == null) {
            return;
        }
        sRTCVideo.stopVideoCapture();
    }

    public static void setupLocalVideo(TextureView textureView) {
        MLog.d(TAG, "setupLocalVideo");
        if (sRTCVideo == null) {
            return;
        }
        VideoCanvas videoCanvas = new VideoCanvas(textureView, RENDER_MODE_HIDDEN);
        sRTCVideo.setLocalVideoCanvas(StreamIndex.STREAM_INDEX_MAIN, videoCanvas);
    }

    public static void setupClassRemoteVideo(String userId, TextureView textureView) {
        Log.d(TAG, "setClassRemoteVideoView : " + userId);
        if (sClassRoom != null) {
            VideoCanvas canvas = new VideoCanvas(textureView, RENDER_MODE_HIDDEN);
            RemoteStreamKey streamKey = new RemoteStreamKey(mClassRoomId, userId, StreamIndex.STREAM_INDEX_MAIN);
            sRTCVideo.setRemoteVideoCanvas(streamKey, canvas);
        }
    }

    public static void setupGroupRemoteVideo(String userId, TextureView textureView) {
        Log.d(TAG, "setGroupRemoteVideoView : " + userId);
        if (sGroupRoom != null) {
            VideoCanvas canvas = new VideoCanvas(textureView, RENDER_MODE_HIDDEN);
            RemoteStreamKey streamKey = new RemoteStreamKey(mGroupRoomId, userId, StreamIndex.STREAM_INDEX_MAIN);
            sRTCVideo.setRemoteVideoCanvas(streamKey, canvas);
        }
    }

    public static void joinClassChannel(String token, String roomId, String uid) {
        mClassRoomId = roomId;
        MLog.d(TAG, "joinClassChannel token:" + token + " roomId:" + roomId + " uid:" + uid);
        if (sRTCVideo == null) {
            return;
        }
        if (sClassRoom == null) {
            sClassRoom = sRTCVideo.createRTCRoom(roomId);
            sClassRoom.setRTCRoomEventHandler(mRTCRoomEventHandler);
        }
        UserInfo userInfo = new UserInfo(uid, null);
        RTCRoomConfig roomConfig = new RTCRoomConfig(ChannelProfile.CHANNEL_PROFILE_COMMUNICATION,
                true, true, true);
        sClassRoom.joinRoom(token, userInfo, roomConfig);
    }

    public static void joinGroupChannel(String token, String roomId, String uid) {
        mGroupRoomId = roomId;
        MLog.d(TAG, "joinGroupChannel token:" + token + " roomId:" + roomId + " uid:" + uid);
        if (sRTCVideo == null) {
            return;
        }
        if (sGroupRoom == null) {
            sGroupRoom = sRTCVideo.createRTCRoom(roomId);
            sGroupRoom.setRTCRoomEventHandler(mRTCRoomEventHandler);
        }
        UserInfo userInfo = new UserInfo(uid, null);
        RTCRoomConfig roomConfig = new RTCRoomConfig(ChannelProfile.CHANNEL_PROFILE_COMMUNICATION,
                true, true, true);
        sGroupRoom.joinRoom(token, userInfo, roomConfig);
    }

    public static void leaveChannel() {
        MLog.d(TAG, "leaveChannel");
        mClassRoomId = null;
        mGroupRoomId = null;
        if (sClassRoom != null) {
            sClassRoom.leaveRoom();
            sClassRoom.destroy();
            sClassRoom = null;
        }
        if (sGroupRoom != null) {
            sGroupRoom.leaveRoom();
            sGroupRoom.destroy();
            sGroupRoom = null;
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
                sClassRoom.publishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
            } else {
                sClassRoom.unpublishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
            }
        }
    }

    public static void groupPublish(boolean isPub) {
        MLog.d(TAG, "groupPublish isPub: " + isPub);
        if (sGroupRoom != null) {
            if (isPub) {
                sGroupRoom.publishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
            } else {
                sGroupRoom.unpublishStream(MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
            }
        }
    }

    /**
     * 订阅班级内用户的音视频流
     * @param userId 用户id
     */
    public static void classSubscribe(String userId) {
        MLog.d(TAG, "classSubscribe: " + userId);
        if (sClassRoom != null) {
            sClassRoom.subscribeStream(userId, MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
        }
    }

    /**
     * 订阅小组内用户的音视频流
     * @param userId 用户id
     */
    public static void groupSubscribe(String userId) {
        MLog.d(TAG, "groupSubscribe: " + userId);
        if (sGroupRoom != null) {
            sGroupRoom.subscribeStream(userId, MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
        }
    }

    /**
     * 取消订阅用户音视频流
     * @param userId 用户id
     */
    public static void unSubscribe(String userId) {
        MLog.d(TAG, "unSubscribe: " + userId);
        if (sGroupRoom != null) {
            sGroupRoom.unsubscribeStream(userId, MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
        }
        if (sClassRoom != null) {
            sClassRoom.unsubscribeStream(userId, MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
        }
    }

    public static TextureView getUserRenderView(String userId) {
        if (TextUtils.isEmpty(userId)) {
            return null;
        }
        TextureView view = sUserIdView.get(userId);
        if (view == null) {
            view = new TextureView(AppUtil.getApplicationContext());
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
