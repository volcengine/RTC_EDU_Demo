package com.volcengine.vertcdemo.framework.meeting.impl;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.util.Log;
import android.util.Pair;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;

import com.bytedance.realx.video.RXScreenCaptureService;
import com.ss.bytertc.engine.RTCRoom;
import com.ss.bytertc.engine.RTCRoomConfig;
import com.ss.bytertc.engine.UserInfo;
import com.ss.bytertc.engine.VideoEncoderConfig;
import com.ss.bytertc.engine.data.AudioRoute;
import com.ss.bytertc.engine.type.ChannelProfile;
import com.ss.bytertc.engine.type.MediaStreamType;
import com.ss.video.rtc.demo.basic_module.utils.AppExecutors;
import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.bean.SettingsConfigEntity;
import com.volcengine.vertcdemo.common.AbsBroadcast;
import com.volcengine.vertcdemo.common.CommonDialog;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.AbsHandlerPool;
import com.volcengine.vertcdemo.core.IUIRtcDef;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.WhiteBoardService;
import com.volcengine.vertcdemo.core.impl.RtcDataProviderImpl;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUsersInfo;
import com.volcengine.vertcdemo.framework.meeting.internal.IMeetingRtmDef;
import com.volcengine.vertcdemo.framework.meeting.internal.IMeetingRtmEventHandler;
import com.volcengine.vertcdemo.framework.meeting.internal.MeetingPermitManager;
import com.volcengine.vertcdemo.framework.meeting.internal.MeetingRoomManager;
import com.volcengine.vertcdemo.framework.meeting.internal.MeetingStreamManager;
import com.volcengine.vertcdemo.framework.meeting.internal.MeetingUserManager;
import com.volcengine.vertcdemo.meeting.R;
import com.volcengine.vertcdemo.ui.ShareDialog;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class MeetingRoomImpl implements UIMeetingRoom, IUIRtcDef.IRtcListener {

    private static final String TAG = "UIMeetingRoom";

    private final SettingsConfigEntity sSettingsConfigEntity = new SettingsConfigEntity();

    private final RtmInfo mRtmInfo;
    private final String mRoomId;
    private final UIRtcCore mUIRtcCore;
    private final RTCRoom mRtcRoom;
    private final AbsHandlerPool<IMeetingRtmEventHandler> mMeetingListenerPool = new AbsHandlerPool<>();

    private final MeetingDataProviderImpl mDataProvider = new MeetingDataProviderImpl();
    private final MeetingUserManager mMeetingUserManager;
    private final MeetingPermitManager mMeetingPermitManager;
    private final MeetingRoomManager mMeetingRoomManager;
    private final MeetingStreamManager mMeetingStreamManager;

    private final WhiteBoardService mWhiteBoardService;
    private final IUIMeetingDef.IRoleDesc mRoleDesc;

    public MeetingRoomImpl(@NonNull Context context, @NonNull RtmInfo rtmInfo, @NonNull String roomId, @NonNull UIRtcCore uiRtcCore, IUIMeetingDef.IRoleDesc roleDesc) {
        mRtmInfo = rtmInfo;
        mRoomId = roomId;
        mUIRtcCore = uiRtcCore;
        mRtcRoom = mUIRtcCore.createRtcRoom(roomId);
        mWhiteBoardService = new WhiteBoardService(context);
        mRoleDesc = roleDesc;

        mMeetingUserManager = new MeetingUserManager(mUIRtcCore, this, mDataProvider);
        mMeetingPermitManager = new MeetingPermitManager(mUIRtcCore, this, mDataProvider);
        mMeetingRoomManager = new MeetingRoomManager(mUIRtcCore, this, mDataProvider);
        mMeetingStreamManager = new MeetingStreamManager(mUIRtcCore, this, mDataProvider, mRtcRoom);

        initEventListener();
        setVideoEncoderConfig();
        setScreenEncoderConfig();
        mUIRtcCore.addHandler(this);
    }

    private void setVideoEncoderConfig() {
        VideoEncoderConfig description = new VideoEncoderConfig();
        Pair<Integer, Integer> resolution = sSettingsConfigEntity.getResolution();
        description.width = resolution.first;
        description.height = resolution.second;
        description.frameRate = sSettingsConfigEntity.getFrameRate();
        description.maxBitrate = sSettingsConfigEntity.getBitRate();
        mUIRtcCore.setVideoEncoderConfig(Collections.singletonList(description));
    }

    private void setScreenEncoderConfig() {
        Pair<Integer, Integer> resolution = sSettingsConfigEntity.getScreenResolution();
        VideoEncoderConfig config = new VideoEncoderConfig();
        config.height = resolution.first;
        config.width = resolution.second;
        config.frameRate = sSettingsConfigEntity.getScreenFrameRate();
        config.maxBitrate = sSettingsConfigEntity.getScreenBitRate();
        mUIRtcCore.setScreenVideoEncoderConfig(config);
    }

    public UIRtcCore getUIRtcCore() {
        return mUIRtcCore;
    }

    @Override
    public IUIMeetingDef.IMeetingDataProvider getDataProvider() {
        return mDataProvider;
    }

    @Override
    public IUIMeetingDef.IRoleDesc getRoleDesc() {
        return mRoleDesc;
    }

    @Override
    public WhiteBoardService getWhiteBoardService() {
        return mWhiteBoardService;
    }

    public void addHandler(IMeetingRtmEventHandler listener) {
        mMeetingListenerPool.addHandler(listener);
    }

    public void removeHandler(IMeetingRtmEventHandler listener) {
        mMeetingListenerPool.removeHandler(listener);
    }

    @Override
    public void dispose() {
        mUIRtcCore.removeHandler(this);
        removeAllEventListeners();
        mWhiteBoardService.dispose();
        mMeetingListenerPool.dispose();
        mMeetingUserManager.dispose();
        mMeetingPermitManager.dispose();
        mMeetingRoomManager.dispose();
        mUIRtcCore.destroyRtcRoom(mRoomId);
    }

    @Override
    public void openMic(@NonNull Activity activity, boolean open) {
        if (!mDataProvider.hasMicPermit()) {
            CommonDialog dialog = new CommonDialog(activity);
            dialog.setMessage(activity.getString(R.string.need_permit_to_mic, getRoleDesc().hostDesc()));
            dialog.setPositiveListener(v -> {
                applyOpenMic();
                dialog.dismiss();
            });
            dialog.setNegativeListener(v -> dialog.dismiss());
            dialog.show();
            return;
        }
        if (mUIRtcCore.openMic(open)) {
            enableLocalMic(open);
        }
    }

    @Override
    public void openCam(@NonNull Activity activity, boolean open) {
        if (mUIRtcCore.openCam(open)) {
            enableLocalCam(open);
        }
    }

    @Override
    public void clickShare(@NonNull Activity activity) {
        if (getDataProvider().isLocalSharingScreen()) {
            stopScreenSharing();
            return;
        }
        if (getDataProvider().isLocalSharingWhiteBoard()) {
            stopWhiteBoardSharing();
            return;
        }
        if (!getDataProvider().hasSharePermit()) {
            applySharePermission(activity);
            return;
        }
        List<String> options = new ArrayList<>();
        options.add(activity.getString(R.string.share_screen));
        options.add(activity.getString(R.string.share_whiteboard));
        ShareDialog dialog = new ShareDialog(activity, options);
        dialog.setOnItemClickListener((i, s) -> {
            if (i == 0) {
                startScreenSharing(activity);
            } else if (i == 1) {
                if (!getDataProvider().isSharingWhiteBoard()) {
                    startWhiteBoardSharing();
                }
            }
            dialog.dismiss();
        });
        dialog.setCanceledOnTouchOutside(true);
        dialog.show();
    }

    private void applySharePermission(@NonNull Activity activity) {
        CommonDialog dialog = new CommonDialog(activity);
        dialog.setMessage(activity.getString(R.string.need_permit_to_share, getRoleDesc().hostDesc()));
        dialog.setPositiveListener(v -> {
            applyShare();
            dialog.dismiss();
        });
        dialog.setNegativeListener(v -> dialog.dismiss());
        dialog.show();
    }


    @Override
    public void clickRecord(@NonNull Activity activity) {
        if (getDataProvider().isHost()) {
            if (!getDataProvider().isRecording()) {
                CommonDialog dialog = new CommonDialog(activity);
                dialog.setTitle(activity.getString(R.string.record_confirm_title));
                dialog.setMessage(activity.getString(R.string.record_confirm_content));
                dialog.setPositiveListener(v -> {
                    startRecord();
                    dialog.dismiss();
                });
                dialog.setNegativeListener(v -> dialog.dismiss());
                dialog.show();
            } else {
                stopRecord();
            }
        } else {
            if (!getDataProvider().isRecording()) {
                SafeToast.show(activity.getString(R.string.already_request_record, getRoleDesc().hostDesc()));
                applyRecord();
            } else {
                SafeToast.show(R.string.student_stop_recording_hint);
            }
        }
    }

    @Override
    public void subscribeVideoStream(@NonNull Set<String> userIds) {
        getUIRtcCore().getExecutor().execute(() -> mMeetingStreamManager.subscribeVideoStream(userIds));
    }

    @Override
    public void showOpenMicApplyDialog(Context context, String userId, String userName) {
        mMeetingPermitManager.showOpenMicApplyDialog(context, userId, userName);
    }

    @Override
    public void showShareApplyDialog(Context context, String userId, String userName) {
        mMeetingPermitManager.showShareApplyDialog(context, userId, userName);
    }

    @Override
    public void startScreenSharing(@NonNull Activity activity) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            SafeToast.show(activity.getString(R.string.screen_capture_not_supported));
            return;
        }
        MediaProjectionManager manager = (MediaProjectionManager) Utilities.getApplicationContext().getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        if (manager == null) {
            SafeToast.show(activity.getString(R.string.screen_capture_no_media_projection));
            return;
        }
        activity.startActivityForResult(manager.createScreenCaptureIntent(), UIRtcCore.REQUEST_CODE_OF_SCREEN_SHARING);
    }

    @Override
    public void onScreenSharingIntent(@NonNull Activity activity, @DrawableRes int largeIcon, @DrawableRes int smallIcon, Intent data) {
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.P) {
            Intent intent = new Intent();
            intent.putExtra(RXScreenCaptureService.KEY_LARGE_ICON, largeIcon);
            intent.putExtra(RXScreenCaptureService.KEY_SMALL_ICON, smallIcon);
            intent.putExtra(RXScreenCaptureService.KEY_CONTENT_TEXT, activity.getString(R.string.screen_capture_hint));
            intent.putExtra(RXScreenCaptureService.KEY_LAUNCH_ACTIVITY, activity.getClass().getName());
            intent.putExtra(RXScreenCaptureService.KEY_RESULT_DATA, data);
            activity.startForegroundService(RXScreenCaptureService.getServiceIntent(activity, RXScreenCaptureService.COMMAND_LAUNCH, intent));
        }
        startScreenSharing(data);
    }

    protected void notifyHandler(AbsHandlerPool.Consumer<IMeetingRtmEventHandler> action) {
        mMeetingListenerPool.notifyHandler(action);
    }

    private void initEventListener() {
        putEventListener(IMeetingRtmDef.ON_REMOTE_USER_ENABLE_MIC, IMeetingRtmDef.SyncDeviceStatusNotify.class, (data) -> {
            notifyHandler(callback -> callback.onRemoteUserEnableMic(data.userId, data.open));
        });
        putEventListener(IMeetingRtmDef.ON_REMOTE_USER_ENABLE_CAM, IMeetingRtmDef.SyncDeviceStatusNotify.class, (data) -> {
            notifyHandler(callback -> callback.onRemoteUserEnableCam(data.userId, data.open));
        });
        putEventListener(IMeetingRtmDef.ON_REMOTE_USER_JOIN_ROOM, IMeetingRtmDef.UserNotify.class, (data) -> {
            notifyHandler(callback -> callback.onRemoteUserJoin(data.user, data.userCount));
        });
        putEventListener(IMeetingRtmDef.ON_REMOTE_USER_LEAVE_ROOM, IMeetingRtmDef.UserNotify.class, (data) -> {
            notifyHandler(callback -> callback.onRemoteUserLeave(data.user, data.userCount));
        });
        putEventListener(IMeetingRtmDef.ON_START_SHARE, IMeetingRtmDef.ShareNotify.class, (data) -> {
            notifyHandler(callback -> callback.onShareStarted(data.shareType, data.userId, data.userName));
        });
        putEventListener(IMeetingRtmDef.ON_STOP_SHARE, IMeetingRtmDef.ShareNotify.class, (data) -> {
            notifyHandler(callback -> callback.onShareStopped(data.userId));
        });
        putEventListener(IMeetingRtmDef.ON_START_RECORD, IMeetingRtmDef.Notify.class, (data) -> {
            notifyHandler(callback -> callback.onRecordStarted());
        });
        putEventListener(IMeetingRtmDef.ON_STOP_RECORD, IMeetingRtmDef.RecordStoppedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onRecordStopped(data.reason));
        });
        putEventListener(IMeetingRtmDef.ON_ROOM_RELEASED, IMeetingRtmDef.RoomReleasedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onRoomReleased(data.reason));
        });
        putEventListener(IMeetingRtmDef.ON_ENABLE_MIC_BY_HOST, IMeetingRtmDef.DeviceMutedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onEnableMicByHost(data.open));
        });
        putEventListener(IMeetingRtmDef.ON_ENABLE_CAM_BY_HOST, IMeetingRtmDef.DeviceMutedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onEnableCamByHost(data.open));
        });
        putEventListener(IMeetingRtmDef.ON_CHANGE_SHARE_PERMIT_BY_HOST, IMeetingRtmDef.SharePermitChangedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onChangeSharePermitByHost(data.permit));
        });
        putEventListener(IMeetingRtmDef.ON_ENABLE_ALL_MIC_BY_HOST, IMeetingRtmDef.AllMicMutedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onEnableAllMicByHost(data.open, data.micPermit));
        });
        putEventListener(IMeetingRtmDef.ON_APPLY_CHANGE_MIC, IMeetingRtmDef.SpeakApplyNotify.class, (data) -> {
            notifyHandler(callback -> callback.onReceiveOpenMicApply(data.userId, data.userName));
        });
        putEventListener(IMeetingRtmDef.ON_PERMIT_CHANGE_MIC, IMeetingRtmDef.MicPermitChangedNotify.class, (data) -> {
            notifyHandler(callback -> callback.onReceiveOpenMicReply(data.permit));
        });
        putEventListener(IMeetingRtmDef.ON_APPLY_SHARE, IMeetingRtmDef.SharePermitApplyNotify.class, (data) -> {
            notifyHandler(callback -> callback.onReceiveShareApply(data.userId, data.userName));
        });
        putEventListener(IMeetingRtmDef.ON_PERMIT_SHARE, IMeetingRtmDef.SharePermitNotify.class, (data) -> {
            notifyHandler(callback -> callback.onReceiveShareReply(data.permit));
        });
        putEventListener(IMeetingRtmDef.ON_APPLY_RECORD, IMeetingRtmDef.RecordApplyNotify.class, (data) -> {
            notifyHandler(callback -> callback.onReceiveRecordApply(data.userId, data.userName));
        });
        putEventListener(IMeetingRtmDef.ON_START_RECORD_PERMIT, IMeetingRtmDef.RecordPermitNotify.class, (data) -> {
            notifyHandler(callback -> callback.onReceiveRecordReply(data.userId, data.permit));
        });
        putEventListener(IMeetingRtmDef.ON_HOST_CHANGE, IMeetingRtmDef.HostChangeNotify.class, (data) -> {
            notifyHandler(callback -> callback.onHostChange(data.roomId, data.userId));
        });
    }

    protected <T extends IMeetingRtmDef.Notify> void putEventListener(String event, Class<T> clz, AbsBroadcast.On<T> on) {
        mUIRtcCore.addRtmEventListener(event, clz, on);
    }

    private void removeAllEventListeners() {
        MLog.w(TAG, "removeAllEventListeners");
        mUIRtcCore.removeRtmEventListener();
    }

    private void sendMessage(String eventName, Object content) {
        sendMessage(eventName, content, null, null);
    }

    protected <T extends RTMBizResponse> void sendMessage(String eventName, Object content, Class<T> resultClass, IRequestCallback<T> callback) {
        AppExecutors.networkIO().execute(() -> {
            String contentStr = GsonUtils.gson().toJson(content);
            Log.d(TAG, "sendServerMessage eventName:" + eventName + ",content:" + contentStr);
            IMeetingRtmDef.Request request = new IMeetingRtmDef.Request();
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

    public void joinRtcRoom(String token, String userId) {
        RTCRoomConfig roomConfig = new RTCRoomConfig(ChannelProfile.CHANNEL_PROFILE_COMMUNICATION, true, true, false);
        mRtcRoom.joinRoom(token, new UserInfo(userId, null), roomConfig);
    }

    public void configWhiteBoardRoom(String appId, String roomId, String userId, String token) {
        mWhiteBoardService.setAuthInfo(appId, roomId, userId, token);
    }

    @Override
    public void joinRoom(String userName, IRequestCallback<MeetingTokenInfo> callback) {
        IMeetingRtmDef.JoinMeetingRoomReq req = new IMeetingRtmDef.JoinMeetingRoomReq();
        req.userName = userName;
        req.openMic = mUIRtcCore.getRtcDataProvider().isMicOpen();
        req.openCam = mUIRtcCore.getRtcDataProvider().isCamOpen();
        sendMessage(IMeetingRtmDef.CMD_JOIN_ROOM, req, MeetingTokenInfo.class, new IRequestCallback<MeetingTokenInfo>() {
            @Override
            public void onSuccess(MeetingTokenInfo data) {
                joinRtcRoom(data.rtcToken, data.user.userId);
                RtcDataProviderImpl dataProvider = (RtcDataProviderImpl) UIRtcCore.ins().getRtcDataProvider();
                dataProvider.setCanSwitchAudioRoute(mUIRtcCore.isSpeakerphoneOrEarpiece());
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

    private void getUserList() {
        sendMessage(IMeetingRtmDef.CMD_GET_USER_LIST, null, MeetingUsersInfo.class, new IRequestCallback<MeetingUsersInfo>() {
            @Override
            public void onSuccess(MeetingUsersInfo data) {
                notifyHandler(callback -> callback.onGetUserList(data));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    private void reSync() {
        sendMessage(IMeetingRtmDef.CMD_RE_SYNC, null, MeetingTokenInfo.class, new IRequestCallback<MeetingTokenInfo>() {
            @Override
            public void onSuccess(MeetingTokenInfo data) {
                notifyHandler(callback -> callback.onReSync(data));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    public void enableLocalMic(boolean enable) {
        IMeetingRtmDef.SyncDeviceStatusReq req = new IMeetingRtmDef.SyncDeviceStatusReq();
        req.open = enable;
        sendMessage(IMeetingRtmDef.CMD_ENABLE_LOCAL_MIC, req, RTMBizResponse.class, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                notifyHandler(callback -> callback.onEnableLocalMic(enable));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    public void enableLocalCam(boolean enable) {
        IMeetingRtmDef.SyncDeviceStatusReq req = new IMeetingRtmDef.SyncDeviceStatusReq();
        req.open = enable;
        sendMessage(IMeetingRtmDef.CMD_ENABLE_LOCAL_CAME, req, RTMBizResponse.class, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                notifyHandler(callback -> callback.onEnableLocalCam(enable));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    public void applyOpenMic() {
        IMeetingRtmDef.ApplyOperateDeviceReq req = new IMeetingRtmDef.ApplyOperateDeviceReq();
        req.open = true;
        sendMessage(IMeetingRtmDef.CMD_APPLY_CHANGE_MIC, req);
    }

    public void permitOpenMic(String userId, boolean permit) {
        IMeetingRtmDef.PermitReq req = new IMeetingRtmDef.PermitReq();
        req.applyUserId = userId;
        req.permit = permit;
        sendMessage(IMeetingRtmDef.CMD_PERMIT_CHANGE_MIC, req, RTMBizResponse.class, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                notifyHandler(callback -> callback.onPermitOpenMic(userId, permit));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    public void applyShare() {
        sendMessage(IMeetingRtmDef.CMD_APPLY_SHARE, null);
    }

    public void permitShare(String userId, boolean permit) {
        IMeetingRtmDef.PermitReq req = new IMeetingRtmDef.PermitReq();
        req.applyUserId = userId;
        req.permit = permit;
        sendMessage(IMeetingRtmDef.CMD_PERMIT_SHARE, req, RTMBizResponse.class, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                notifyHandler(callback -> callback.onPermitShare(userId, permit));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    @Override
    public void applyRecord() {
        sendMessage(IMeetingRtmDef.CMD_APPLY_RECORD, null);
    }

    public void permitRecord(String applyUserId, boolean permit) {
        IMeetingRtmDef.PermitReq req = new IMeetingRtmDef.PermitReq();
        req.applyUserId = applyUserId;
        req.permit = permit;
        sendMessage(IMeetingRtmDef.CMD_START_RECORD_PERMIT, req);
    }

    public void startShare(int shareType) {
        IMeetingRtmDef.ShareReq req = new IMeetingRtmDef.ShareReq();
        req.shareType = shareType;
        sendMessage(IMeetingRtmDef.CMD_START_SHARE, req);
    }

    public void stopShare(int shareType) {
        IMeetingRtmDef.ShareReq req = new IMeetingRtmDef.ShareReq();
        req.shareType = shareType;
        sendMessage(IMeetingRtmDef.CMD_END_SHARE, req);
    }

    @Override
    public void startRecord() {
        sendMessage(IMeetingRtmDef.CMD_START_RECORD, null);
    }

    @Override
    public void stopRecord() {
        sendMessage(IMeetingRtmDef.CMD_STOP_RECORD, null);
    }

    @Override
    public void enableAllRemoteUserMic(boolean enable, boolean micPermit, @NonNull IRequestCallback<RTMBizResponse> callback) {
        IMeetingRtmDef.ChangeAllMicReq req = new IMeetingRtmDef.ChangeAllMicReq();
        req.open = enable;
        req.micPermit = micPermit;
        sendMessage(IMeetingRtmDef.CMD_ENABLE_ALL_MIC, req, RTMBizResponse.class, callback);
    }

    @Override
    public void enableRemoteUserMic(String userId, boolean enable, IRequestCallback<RTMBizResponse> callback) {
        IMeetingRtmDef.ChangeDeviceStatusReq req = new IMeetingRtmDef.ChangeDeviceStatusReq();
        req.remoteUserId = userId;
        req.open = enable;
        sendMessage(IMeetingRtmDef.CMD_ENABLE_REMOTE_USER_MIC, req, RTMBizResponse.class, callback);
    }

    @Override
    public void enableRemoteUserCam(String userId, boolean enable, IRequestCallback<RTMBizResponse> callback) {
        IMeetingRtmDef.ChangeDeviceStatusReq req = new IMeetingRtmDef.ChangeDeviceStatusReq();
        req.remoteUserId = userId;
        req.open = enable;
        sendMessage(IMeetingRtmDef.CMD_ENABLE_REMOTE_USER_CAM, req, RTMBizResponse.class, callback);
    }

    @Override
    public void changeRemoteUserSharePermit(String userId, boolean permit) {
        IMeetingRtmDef.ChangePermitReq req = new IMeetingRtmDef.ChangePermitReq();
        req.remoteUserId = userId;
        req.permit = permit;
        sendMessage(IMeetingRtmDef.CMD_CHANGE_REMOTE_USER_SHARE_PERMIT, req, RTMBizResponse.class, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                notifyHandler(callback -> callback.onChangeRemoteUserSharePermit(userId, permit));
            }

            @Override
            public void onError(int errorCode, String message) {
            }
        });
    }

    @Override
    public void leaveRoom(boolean release) {
        if (getDataProvider().isLocalSharingScreen()) {
            stopScreenSharing();
        }
        if (getDataProvider().isLocalSharingWhiteBoard()) {
            stopWhiteBoardSharing();
            getWhiteBoardService().leaveRoom();
        }
        if (getDataProvider().isRemoteSharingScreen()) {
            getWhiteBoardService().leaveRoom();
        }
        mUIRtcCore.enableSpeakerphone(true);
        if (release) {
            sendMessage(IMeetingRtmDef.CMD_RELEASE_ROOM, null);
        } else {
            sendMessage(IMeetingRtmDef.CMD_LEAVE_ROOM, null);
        }
        mRtcRoom.leaveRoom();
    }

    private void startScreenSharing(Intent intent) {
        mUIRtcCore.startScreenCapture(intent);
        if (mUIRtcCore.getRtcDataProvider().isSharingScreenAudio()) {
            mRtcRoom.publishScreen(MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
        } else {
            mRtcRoom.publishScreen(MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
        }
        startShare(IUIMeetingDef.SHARE_SCREEN);
    }

    @Override
    public void stopScreenSharing() {
        MLog.d(TAG, "stopScreenSharing");
        mRtcRoom.unpublishScreen(MediaStreamType.RTC_MEDIA_STREAM_TYPE_BOTH);
        mUIRtcCore.stopScreenCapture();
        stopShare(IUIMeetingDef.SHARE_SCREEN);
    }

    @Override
    public void publishScreenAudio() {
        MLog.d(TAG, "publishScreenAudio");
        mUIRtcCore.updateScreenCapture(true);
        mRtcRoom.publishScreen(MediaStreamType.RTC_MEDIA_STREAM_TYPE_AUDIO);
    }

    @Override
    public void unPublishScreenAudio() {
        MLog.d(TAG, "unPublishScreenAudio");
        mUIRtcCore.updateScreenCapture(false);
        mRtcRoom.unpublishScreen(MediaStreamType.RTC_MEDIA_STREAM_TYPE_AUDIO);
    }

    @Override
    public void startWhiteBoardSharing() {
        startShare(IUIMeetingDef.SHARE_WHITEBOARD);
    }

    @Override
    public void stopWhiteBoardSharing() {
        stopShare(IUIMeetingDef.SHARE_WHITEBOARD);
    }

    // IRtcListener
    @Override
    public void onRoomStateChanged(int state, String extraInfo) {
        MLog.d(TAG, "onRoomStateChanged, state: " + state + ", info: " + extraInfo);
        if (state != 0) {
            return;
        }

        // sync user list when join rtc room success.
        // in case:
        if (IUIRtcDef.IRtcListener.joinRoomSuccessWhenFirst(extraInfo)) {
            // 1. use join between this rts and rtc
            getUserList();
        } else {
            // 2. network reconnect
            reSync();
        }
    }

    @Override
    public void onAudioRouteChanged(AudioRoute route) {
        boolean canSwitchAudioRoute = (
                route == AudioRoute.AUDIO_ROUTE_SPEAKERPHONE
                        || route == AudioRoute.AUDIO_ROUTE_EARPIECE);
        RtcDataProviderImpl dataProvider = (RtcDataProviderImpl) UIRtcCore.ins().getRtcDataProvider();
        dataProvider.setCanSwitchAudioRoute(canSwitchAudioRoute);
    }
}
