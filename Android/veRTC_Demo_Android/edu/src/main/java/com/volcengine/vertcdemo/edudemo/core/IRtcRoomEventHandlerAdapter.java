package com.volcengine.vertcdemo.edudemo.core;

import android.text.TextUtils;

import com.ss.bytertc.engine.RTCEngine;
import com.ss.bytertc.engine.RTCStream;
import com.ss.bytertc.engine.SubscribeConfig;
import com.ss.bytertc.engine.UserInfo;
import com.ss.bytertc.engine.data.AVSyncState;
import com.ss.bytertc.engine.data.MuteState;
import com.ss.bytertc.engine.data.RemoteStreamKey;
import com.ss.bytertc.engine.data.StreamIndex;
import com.ss.bytertc.engine.data.VideoFrameInfo;
import com.ss.bytertc.engine.handler.IRTCEngineEventHandler;
import com.ss.bytertc.engine.handler.IRTCRoomEventHandler;
import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.core.net.rtm.RTMBaseClient;

import java.nio.ByteBuffer;
import java.util.Map;

public class IRtcRoomEventHandlerAdapter extends IRTCRoomEventHandler {

    private static final String UID_BIZ_SERVER = "server";
    public RTMBaseClient baseClient;

    public void setBaseClient(RTMBaseClient baseClient) {
        this.baseClient = baseClient;
    }

    /**
     * 判断 onRoomStateChanged 中的extraInfo，是不是加入房间成功了
     * @param extraInfo 额外信息
     * @return true:加入房间成功
     */
    protected boolean checkExtraInfoIfJoinRoomSuccess(String extraInfo) {
        int joinType = -1;
        try {
            Map extra = GsonUtils.gson().fromJson(extraInfo, Map.class);
            // 341后 SDK传的固定键
            joinType = (int) Double.parseDouble(extra.get("join_type").toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return joinType == 0;
    }

    @Override
    public void onLeaveRoom(IRTCEngineEventHandler.RTCRoomStats rtcRoomStats) {

    }

    @Override
    public void onRoomStateChanged(String roomId, String uid, int state, String extraInfo) {

    }

    @Override
    public void onStreamStateChanged(String roomId, String uid, int state, String extraInfo) {

    }

    @Override
    public void onRoomWarning(int i) {

    }

    @Override
    public void onRoomError(int i) {

    }

    @Override
    public void onAVSyncStateChange(AVSyncState state) {

    }

    @Override
    public void onAudioVolumeIndication(IRTCEngineEventHandler.AudioVolumeInfo[] audioVolumeInfos, int i, int i1) {

    }

    @Override
    public void onRtcStats(IRTCEngineEventHandler.RTCRoomStats rtcRoomStats) {

    }

    @Override
    public void onUserJoined(UserInfo userInfo, int i) {

    }

    @Override
    public void onUserLeave(String s, int i) {

    }

    @Override
    public void onTokenWillExpire() {

    }

    @Override
    public void onUserMuteAudio(String s, MuteState muteState) {

    }

    @Override
    public void onUserPublishStream(String uid, RTCEngine.MediaStreamType type) {

    }

    @Override
    public void onUserUnPublishStream(String uid, RTCEngine.MediaStreamType type, IRTCEngineEventHandler.StreamRemoveReason reason) {

    }

    @Override
    public void onUserPublishScreen(String uid, RTCEngine.MediaStreamType type) {

    }

    @Override
    public void onUserUnPublishScreen(String uid, RTCEngine.MediaStreamType type, IRTCEngineEventHandler.StreamRemoveReason reason) {

    }

    @Override
    public void onUserEnableLocalAudio(String s, boolean b) {

    }

    @Override
    public void onLocalStreamStats(IRTCEngineEventHandler.LocalStreamStats localStreamStats) {

    }

    @Override
    public void onRemoteStreamStats(IRTCEngineEventHandler.RemoteStreamStats remoteStreamStats) {

    }

    @Override
    public void onFirstLocalAudioFrame(StreamIndex streamIndex) {

    }

    @Override
    public void onFirstRemoteAudioFrame(RemoteStreamKey remoteStreamKey) {

    }

    @Override
    public void onStreamRemove(RTCStream rtcStream, IRTCEngineEventHandler.StreamRemoveReason streamRemoveReason) {

    }

    @Override
    public void onStreamAdd(RTCStream rtcStream) {

    }

    @Override
    public void onStreamSubscribed(int i, String s, SubscribeConfig subscribeConfig) {

    }

    @Override
    public void onStreamPublishSuccess(String s, boolean b) {

    }

    @Override
    public void onRoomMessageReceived(String uid, String message) {
        onMessageReceived(uid, message);
    }

    @Override
    public void onRoomBinaryMessageReceived(String s, ByteBuffer byteBuffer) {

    }

    @Override
    public void onUserMessageReceived(String uid, String message) {
        onMessageReceived(uid, message);
    }

    @Override
    public void onUserBinaryMessageReceived(String s, ByteBuffer byteBuffer) {

    }

    @Override
    public void onUserMessageSendResult(long l, int i) {

    }

    @Override
    public void onRoomMessageSendResult(long l, int i) {

    }

    @Override
    public void onFirstLocalVideoFrameCaptured(StreamIndex streamIndex, VideoFrameInfo videoFrameInfo) {

    }

    @Override
    public void onLocalVideoSizeChanged(StreamIndex streamIndex, VideoFrameInfo videoFrameInfo) {

    }

    @Override
    public void onRemoteVideoSizeChanged(RemoteStreamKey remoteStreamKey, VideoFrameInfo videoFrameInfo) {

    }

    @Override
    public void onFirstRemoteVideoFrameRendered(RemoteStreamKey remoteStreamKey, VideoFrameInfo videoFrameInfo) {

    }

    @Override
    public void onFirstRemoteVideoFrameDecoded(RemoteStreamKey remoteStreamKey, VideoFrameInfo frameInfo) {

    }

    @Override
    public void onUserMuteVideo(String s, MuteState muteState) {

    }

    @Override
    public void onUserStartVideoCapture(String s) {

    }

    @Override
    public void onUserStopVideoCapture(String s) {

    }

    @Override
    public void onUserStartAudioCapture(String s) {

    }

    @Override
    public void onUserStopAudioCapture(String s) {

    }

    @Override
    public void onVideoStreamBanned(String s, boolean b) {

    }

    @Override
    public void onAudioStreamBanned(String s, boolean b) {

    }

    private void onMessageReceived(String fromUid, String message) {
        //来自业务服务器的响应或者通知
        if (TextUtils.equals(UID_BIZ_SERVER, fromUid)) {
            if (baseClient != null) {
                baseClient.onMessageReceived(fromUid, message);
            }
            return;
        }
        //客户端直接的通讯
        onRTCMessageReceived(fromUid, message);
    }

    /**
     * 非来自业务服务器的消息
     * @param fromUid 发送消息uid
     * @param message 发送内容
     */
    protected void onRTCMessageReceived(String fromUid, String message) {
    }
}
