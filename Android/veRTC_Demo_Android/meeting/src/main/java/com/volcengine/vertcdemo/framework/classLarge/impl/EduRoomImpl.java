package com.volcengine.vertcdemo.framework.classLarge.impl;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.ss.bytertc.engine.RTCRoom;
import com.ss.bytertc.engine.RTCRoomConfig;
import com.ss.bytertc.engine.UserInfo;
import com.ss.bytertc.engine.type.ChannelProfile;
import com.ss.video.rtc.demo.basic_module.utils.AppExecutors;
import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.common.AbsBroadcast;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.AbsHandlerPool;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.WhiteBoardService;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;
import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;
import com.volcengine.vertcdemo.framework.classLarge.UIEduRoom;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduRoomTokenInfo;
import com.volcengine.vertcdemo.framework.classLarge.internal.EduRoomManager;
import com.volcengine.vertcdemo.framework.classLarge.internal.EduStreamManager;
import com.volcengine.vertcdemo.framework.classLarge.internal.EduUserManager;
import com.volcengine.vertcdemo.framework.classLarge.internal.EduWhiteBoardStreamManager;
import com.volcengine.vertcdemo.framework.classLarge.internal.IEduRtmDef;
import com.volcengine.vertcdemo.framework.classLarge.internal.IEduRtmEventHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class EduRoomImpl implements UIEduRoom {

    private static final String TAG = "UIEduRoom";

    private final RtmInfo mRtmInfo;
    private final String mRoomId;
    private final UIRtcCore mUIRtcCore;
    private final RTCRoom mRtcRoom;
    private final AbsHandlerPool<IEduRtmEventHandler> mEventListenerPool = new AbsHandlerPool<>();

    private final EduDataProviderImpl mDataProvider = new EduDataProviderImpl();
    private final WhiteBoardService mWhiteBoardService;

    private final EduRoomManager mEduRoomManager;
    private final EduUserManager mEduUserManager;
    private final EduStreamManager mEduStreamManager;
    private final EduWhiteBoardStreamManager mEduWhiteBoardStreamManager;

    public EduRoomImpl(Context context, RtmInfo rtmInfo, String roomId, UIRtcCore uiRtcCore) {
        mRtmInfo = rtmInfo;
        mRoomId = roomId;
        mUIRtcCore = uiRtcCore;
        mRtcRoom = mUIRtcCore.createRtcRoom(roomId);
        mWhiteBoardService = new WhiteBoardService(context);
        initEventListener();

        mEduRoomManager = new EduRoomManager(mUIRtcCore, this, mDataProvider);
        mEduUserManager = new EduUserManager(mUIRtcCore, this, mDataProvider);
        mEduStreamManager = new EduStreamManager(mUIRtcCore, this, mDataProvider, mRtcRoom);
        mEduWhiteBoardStreamManager = new EduWhiteBoardStreamManager(mUIRtcCore, this, mDataProvider, mRtcRoom);
    }

    public UIRtcCore getUIRtcCore() {
        return mUIRtcCore;
    }

    @Override
    public IUIEduDef.IEduDataProvider getDataProvider() {
        return mDataProvider;
    }

    @Override
    public WhiteBoardService getWhiteBoardService() {
        return mWhiteBoardService;
    }

    @Override
    public void dispose() {
        mEduRoomManager.dispose();
        mEduUserManager.dispose();
        removeAllEventListeners();
        mWhiteBoardService.dispose();
        mEventListenerPool.dispose();
        mUIRtcCore.destroyRtcRoom(mRoomId);
    }

    public void addHandler(IEduRtmEventHandler listener) {
        mEventListenerPool.addHandler(listener);
    }

    public void removeHandler(IEduRtmEventHandler listener) {
        mEventListenerPool.removeHandler(listener);
    }

    private void notifyHandler(AbsHandlerPool.Consumer<IEduRtmEventHandler> action) {
        getUIRtcCore().getExecutor().execute(() -> mEventListenerPool.notifyHandler(action));
    }

    private void initEventListener() {
        putEventListener(IEduRtmDef.ON_REMOTE_USER_JOIN_ROOM, IEduRtmDef.UserNotify.class, t -> {
            notifyHandler(handler -> handler.onRemoteUserJoin(t.user, t.userCount));
        });
        putEventListener(IEduRtmDef.ON_REMOTE_USER_LEAVE_ROOM, IEduRtmDef.UserNotify.class, t -> {
            notifyHandler(handler -> handler.onRemoteUserLeave(t.user, t.userCount));
        });
        putEventListener(IEduRtmDef.ON_LINK_MIC_PERMIT, IEduRtmDef.LinkMicNotify.class, t -> {
            notifyHandler(handler -> handler.onLinkMicPermit(t.permit));
        });
        putEventListener(IEduRtmDef.ON_LINK_MIC_JOIN, IEduRtmDef.UserNotify.class, t -> {
            notifyHandler(handler -> handler.onLinkMicJoin(t.user));
        });
        putEventListener(IEduRtmDef.ON_LINK_MIC_LEAVE, IEduRtmDef.UserNotify.class, t -> {
            notifyHandler(handler -> handler.onLinkMicLeave(t.user));
        });
        putEventListener(IEduRtmDef.ON_LINK_MIC_KICK, IEduRtmDef.Notify.class, t -> {
            notifyHandler(handler -> handler.onLinkMicKick());
        });
        putEventListener(IEduRtmDef.ON_REMOTE_USER_ENABLE_MIC, IEduRtmDef.SyncDeviceStatusNotify.class, t -> {
            notifyHandler(handler -> handler.onRemoteUserEnableMic(t.userId, t.open));
        });
        putEventListener(IEduRtmDef.ON_REMOTE_USER_ENABLE_CAM, IEduRtmDef.SyncDeviceStatusNotify.class, t -> {
            notifyHandler(handler -> handler.onRemoteUserEnableCam(t.userId, t.open));
        });
        putEventListener(IEduRtmDef.ON_ROOM_RELEASED, IEduRtmDef.RoomReleasedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onRoomReleased(data.reason));
        });
        putEventListener(IEduRtmDef.ON_ENABLE_MIC_BY_HOST, IEduRtmDef.DeviceMutedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onEnableMicByHost(data.open));
        });
        putEventListener(IEduRtmDef.ON_ENABLE_CAM_BY_HOST, IEduRtmDef.DeviceMutedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onEnableCamByHost(data.open));
        });
        putEventListener(IEduRtmDef.ON_CHANGE_SHARE_PERMIT_BY_HOST, IEduRtmDef.SharePermitChangedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onChangeSharePermitByHost(data.permit));
        });
        putEventListener(IEduRtmDef.ON_PERMIT_SHARE, IEduRtmDef.SharePermitNotify.class, (data) -> {
            notifyHandler(callback -> callback.onReceiveShareReply(data.permit));
        });
        putEventListener(IEduRtmDef.ON_START_SHARE, IEduRtmDef.ShareNotify.class, (data) -> {
            notifyHandler(callback -> callback.onShareStarted(data.roomId, data.userId, data.userName));
        });
        putEventListener(IEduRtmDef.ON_STOP_SHARE, IEduRtmDef.ShareNotify.class, (data) -> {
            notifyHandler(callback -> callback.onShareStopped(data.roomId, data.userId));
        });
    }

    private <T extends IEduRtmDef.Notify> void putEventListener(String event, Class<T> clz, AbsBroadcast.On<T> on) {
        mUIRtcCore.addRtmEventListener(event, clz, on);
    }

    private void removeAllEventListeners() {
        MLog.w(TAG, "removeAllEventListeners");
        mUIRtcCore.removeRtmEventListener();
    }

    private void sendMessage(String eventName, Object content) {
        sendMessage(eventName, content, null, null);
    }

    private <T extends RTMBizResponse> void sendMessage(String eventName, Object content, Class<T> resultClass, IRequestCallback<T> callback) {
        AppExecutors.networkIO().execute(() -> {
            String contentStr = GsonUtils.gson().toJson(content);
            Log.d(TAG, "sendServerMessage eventName:" + eventName + ",content:" + contentStr);
            IEduRtmDef.Request request = new IEduRtmDef.Request();
            request.loginToken = SolutionDataManager.ins().getToken();
            request.userId = SolutionDataManager.ins().getUserId();
            request.deviceId = SolutionDataManager.ins().getDeviceId();
            request.appId = mRtmInfo.appId;
            request.roomId = mRoomId;
            request.eventName = eventName;
            request.content = contentStr;
            request.requestId = String.valueOf(UUID.randomUUID());
            mUIRtcCore.sendRtmMessage(eventName, request.requestId, request, resultClass, callback);
        });
    }

    protected void joinRtcRoom(String token, String userId) {
        RTCRoomConfig roomConfig = new RTCRoomConfig(ChannelProfile.CHANNEL_PROFILE_COMMUNICATION, true, true, false);
        setUserVisibility(false);
        mRtcRoom.joinRoom(token, new UserInfo(userId, null), roomConfig);
    }

    public void setUserVisibility(boolean visible) {
        mRtcRoom.setUserVisibility(visible);
    }

    private void configWhiteBoardRoom(String appId, String roomId, String userId, String token) {
        mWhiteBoardService.setAuthInfo(appId, roomId, userId, token);
    }

    @Override
    public void joinRoom(String userName, boolean isHost, IRequestCallback<EduRoomTokenInfo> callback) {
        if (isHost) {
            throw new IllegalAccessError("do not support teacher now");
        }

        IEduRtmDef.JoinRoomReq req = new IEduRtmDef.JoinRoomReq();
        req.userName = userName;
        req.isHost = false;
        req.openMic = getUIRtcCore().getRtcDataProvider().isMicOpen();
        req.openCam = getUIRtcCore().getRtcDataProvider().isCamOpen();
        sendMessage(IEduRtmDef.CMD_JOIN_ROOM, req, EduRoomTokenInfo.class, new IRequestCallback<EduRoomTokenInfo>() {
            @Override
            public void onSuccess(EduRoomTokenInfo data) {
                joinRtcRoom(data.rtcToken, data.user.userId);
                configWhiteBoardRoom(data.roomInfo.appId, data.wbRoomId, data.wbUserId, data.wbToken);
                notifyHandler(callback -> callback.onJoinRoom(data));
                callback.onSuccess(data);
            }

            @Override
            public void onError(int errorCode, String message) {
                callback.onError(errorCode, message);
            }
        });
    }

    @Override
    public void openMic(boolean open) {
        if (!getUIRtcCore().openMic(open)) {
            return;
        }
        enableLocalMic(open);
    }

    public void enableLocalMic(boolean open) {
        IEduRtmDef.SyncDeviceStatusReq req = new IEduRtmDef.SyncDeviceStatusReq();
        req.open = open;
        sendMessage(IEduRtmDef.CMD_ENABLE_LOCAL_MIC, req, RTMBizResponse.class, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                notifyHandler(callback -> callback.onEnableLocalMic(open));
            }

            @Override
            public void onError(int errorCode, String message) {

            }
        });
    }

    @Override
    public void openCam(boolean open) {
        if (!getUIRtcCore().openCam(open)) {
            return;
        }
        enableLocalCam(open);
    }

    public void enableLocalCam(boolean open) {
        IEduRtmDef.SyncDeviceStatusReq req = new IEduRtmDef.SyncDeviceStatusReq();
        req.open = open;
        sendMessage(IEduRtmDef.CMD_ENABLE_LOCAL_CAME, req, RTMBizResponse.class, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                notifyHandler(callback -> callback.onEnableLocalCam(open));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    @Override
    public void subscribeVideoStream(@NonNull Set<String> userIds) {
        getUIRtcCore().getExecutor().execute(() -> mEduStreamManager.subscribeVideoStream(userIds));
    }

    @Override
    public void subscribeWhiteBoardStream() {
        IUIEduDef.WhiteBoardStreamInfo info = getDataProvider().getWhiteBoardStreamInfo();
        if (info == null) {
            MLog.w(TAG, "ignore, empty whiteboard stream info");
            return;
        }
        Set<String> userIds = new HashSet<>(Collections.singletonList(info.mUserId));
        getUIRtcCore().getExecutor().execute(() -> mEduWhiteBoardStreamManager.subscribeVideoStream(userIds));
    }

    @Override
    public void unsubscribeWhiteBoardStream() {
        getUIRtcCore().getExecutor().execute(() -> mEduWhiteBoardStreamManager.subscribeVideoStream(new HashSet<>()));
    }

    @Override
    public void linkMicApply() {
        sendMessage(IEduRtmDef.CMD_LINK_MIC_APPLY, null);
    }

    @Override
    public void linkMicApplyCancel() {
        sendMessage(IEduRtmDef.CMD_LINK_MIC_APPLY_CANCEL, null);
    }


    @Override
    public void linkMicLeave() {
        sendMessage(IEduRtmDef.CMD_LINK_MIC_LEAVE, null);
    }

    @Override
    public void leaveRoom() {
        getWhiteBoardService().leaveRoom();
        sendMessage(IEduRtmDef.CMD_LEAVE_ROOM, null);
        mRtcRoom.leaveRoom();
    }
}
