package com.volcengine.vertcdemo.framework.classLarge.internal;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ss.bytertc.engine.data.AudioPropertiesInfo;
import com.ss.bytertc.engine.data.LocalAudioPropertiesInfo;
import com.ss.bytertc.engine.data.RemoteAudioPropertiesInfo;
import com.ss.bytertc.engine.data.StreamIndex;
import com.ss.video.rtc.demo.basic_module.ui.CommonDialog;
import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.AudioVideoConfig;
import com.volcengine.vertcdemo.core.IUIRtcDef;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduRoomTokenInfo;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduDataProviderImpl;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduRoomImpl;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class EduUserManager extends AbsEduManager implements IEduRtmEventHandler, IUIRtcDef.IRtcListener {

    private static final String TAG = "EduUserManager";

    private String mUserId;
    private volatile EduUserInfo mLocalUser;
    private volatile EduUserInfo mTeacher;
    private final List<EduUserInfo> mVisibleUserList = new ArrayList<>();
    private final Map<String, EduUserInfo> mVisibleUserMap = new HashMap<>();

    public EduUserManager(@NonNull UIRtcCore uiRtcCore, @NonNull EduRoomImpl eduRoom, @NonNull EduDataProviderImpl dataProvider) {
        super(uiRtcCore, eduRoom, dataProvider);
        eduRoom.addHandler(this);
        uiRtcCore.addHandler(this);
    }

    @Override
    public void dispose() {
        getEduRoom().removeHandler(this);
    }

    private EduUserInfo createFakeTeacher() {
        EduUserInfo fakeTeacherUser = new EduUserInfo();
        fakeTeacherUser.userId = "0";
        fakeTeacherUser.isHost = true;
        fakeTeacherUser.isFakeUser = true;
        return fakeTeacherUser;
    }

    private void addVisibleUser(EduUserInfo user) {
        if (Objects.equals(user.userId, mLocalUser.userId)) {
            mVisibleUserList.add(mLocalUser);
            mVisibleUserMap.put(mLocalUser.userId, mLocalUser);
        } else {
            mVisibleUserList.add(user);
            mVisibleUserMap.put(user.userId, user);
        }
    }

    private void visibleUserLeave(@NonNull EduUserInfo user, int index) {
        mVisibleUserList.remove(user);
        mVisibleUserMap.remove(user.userId);
        runOnUIThread(() -> getDataProvider().onUserRemoved(user, index));
    }

    private void enableMicByHost(boolean enable) {
        MLog.d(TAG, "enableMicByHost " + enable);
        if (!enable) {
            Context context = Utilities.getApplicationContext();
            if (getUIRtcCore().getRtcDataProvider().isMicOpen()) {
                getUIRtcCore().openMic(false);
                getEduRoom().enableLocalMic(false);
                SafeToast.show(context.getString(R.string.mic_mute, context.getString(R.string.role_host_desc_class)));
            }
        } else {
            Activity activity = getCurrentActivityContext();
            if (activity == null) {
                return;
            }
            CommonDialog dialog = new CommonDialog(activity);
            dialog.setMessage(activity.getString(R.string.on_ask_open_mic, activity.getString(R.string.role_host_desc_class)));
            dialog.setPositiveListener(v -> {
                if (getUIRtcCore().openMic(true)) {
                    getEduRoom().enableLocalMic(true);
                }
                dialog.dismiss();
            });
            dialog.setNegativeListener(v -> dialog.dismiss());
            dialog.show();
        }
    }

    private void enableCameraByHost(boolean enable) {
        MLog.d(TAG, "enableCameraByHost " + enable);
        if (!enable) {
            Context context = Utilities.getApplicationContext();
            if (getUIRtcCore().getRtcDataProvider().isCamOpen()) {
                getUIRtcCore().openCam(false);
                getEduRoom().enableLocalCam(false);
                SafeToast.show(context.getString(R.string.cam_mute, context.getString(R.string.role_host_desc_class)));
            }
        } else {
            Activity activity = getCurrentActivityContext();
            if (activity == null) {
                return;
            }
            CommonDialog dialog = new CommonDialog(activity);
            dialog.setMessage(activity.getString(R.string.on_ask_open_cam, activity.getString(R.string.role_host_desc_class)));
            dialog.setPositiveListener(v -> {
                if (getUIRtcCore().openCam(true)) {
                    getEduRoom().enableLocalCam(true);
                }
                dialog.dismiss();
            });
            dialog.setNegativeListener(v -> dialog.dismiss());
            dialog.show();
        }
    }

    @Override
    public void onJoinRoom(EduRoomTokenInfo info) {
        mUserId = info.user.userId;
        mLocalUser = (EduUserInfo) info.user.clone();
        mLocalUser.isMe = true;

        mVisibleUserList.clear();
        if (info.teacher != null) {
            mTeacher = (EduUserInfo) info.teacher.clone();
        } else {
            mTeacher = createFakeTeacher();
        }
        addVisibleUser(mTeacher);
        for (EduUserInfo user : info.linkMicUsersList) {
            addVisibleUser(user);
        }
        List<EduUserInfo> newVisibleUserList = new ArrayList<>(mVisibleUserList);
        runOnUIThread(() -> {
            getDataProvider().onUserDataRenew(newVisibleUserList);
        });
    }

    @Override
    public void onRemoteUserJoin(@NonNull EduUserInfo user, int userCount) {
        if (user.isHost) {
            mTeacher = (EduUserInfo) user.clone();
            mVisibleUserList.set(0, mTeacher);
            mVisibleUserMap.put(mTeacher.userId, mTeacher);
            runOnUIThread(() -> getDataProvider().onUserUpdated(mTeacher, 0));
        }
    }

    @Override
    public void onRemoteUserLeave(@NonNull EduUserInfo user, int userCount) {
        if (user.isHost) {
            mTeacher = createFakeTeacher();
            mVisibleUserList.set(0, mTeacher);
            mVisibleUserMap.put(mTeacher.userId, mTeacher);
            runOnUIThread(() -> getDataProvider().onUserUpdated(mTeacher, 0));
        } else {
            int index = mVisibleUserList.indexOf(user);
            if (index == -1) {
                return;
            }
            visibleUserLeave(user, index);
        }
    }

    @Override
    public void onEnableLocalMic(boolean enable) {
        EduUserInfo userInfo = mVisibleUserMap.get(mUserId);
        if (userInfo == null) {
            MLog.w(TAG, "onEnableLocalMic, can't find user");
            return;
        }
        MLog.d(TAG, "onEnableLocalMic enable: " + enable);
        userInfo.isMicOn = enable;
        notifyUserUpdated(userInfo, IUIEduDef.UserUpdateReason.ON_MIC_CHANGED);
    }

    @Override
    public void onEnableLocalCam(boolean enable) {
        EduUserInfo userInfo = mVisibleUserMap.get(mUserId);
        if (userInfo == null) {
            MLog.w(TAG, "onEnableLocalCam, can't find user");
            return;
        }
        MLog.d(TAG, "onEnableLocalCam enable: " + enable);
        userInfo.isCameraOn = enable;
        notifyUserUpdated(userInfo, IUIEduDef.UserUpdateReason.ON_CAM_CHANGED);
    }

    private void notifyUserUpdated(EduUserInfo user, Object payload) {
        int changedIndex = mVisibleUserList.indexOf(user);
        runOnUIThread(() -> getDataProvider().onUserUpdated(user, changedIndex, payload));
    }

    @Override
    public void onLinkMicPermit(boolean permit) {
        if (permit) {
            getEduRoom().setUserVisibility(true);
            onLinkMicJoin(mLocalUser);
        }
        getDataProvider().setLickMicState(permit);
    }

    @Override
    public void onLinkMicJoin(EduUserInfo user) {
        MLog.d(TAG, "onLinkMicJoin userId: " + user.userId);
        int foundIndex = mVisibleUserList.indexOf(user);
        if (foundIndex != -1) {
            visibleUserLeave(user, foundIndex);
        }
        addVisibleUser(user);
        int changedIndex = mVisibleUserList.indexOf(user);
        runOnUIThread(() -> getDataProvider().onUserInserted(user, changedIndex));
    }

    @Override
    public void onLinkMicLeave(EduUserInfo user) {
        int foundIndex = mVisibleUserList.indexOf(user);
        if (foundIndex == -1) {
            MLog.w(TAG, "onLinkMicLeave, can't find user " + user.userId);
            return;
        }
        visibleUserLeave(user, foundIndex);
        if (Objects.equals(user, mLocalUser)) {
            getEduRoom().setUserVisibility(false);
            getDataProvider().setLickMicState(false);
        }
    }

    @Override
    public void onLinkMicKick() {
        onLinkMicLeave(mLocalUser);
    }

    @Override
    public void onRemoteUserEnableMic(String userId, boolean enable) {
        EduUserInfo userInfo = mVisibleUserMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "onRemoteUserEnableMic, can't find user " + userId);
            return;
        }
        if (userInfo.isMe) {
            return;
        }
        MLog.d(TAG, "onRemoteUserEnableMic: " + userId + " enable: " + enable);
        userInfo.isMicOn = enable;
        notifyUserUpdated(userInfo, IUIEduDef.UserUpdateReason.ON_MIC_CHANGED);
    }

    @Override
    public void onRemoteUserEnableCam(String userId, boolean enable) {
        EduUserInfo userInfo = mVisibleUserMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "onRemoteUserEnableCam, can't find user " + userId);
            return;
        }
        if (userInfo.isMe) {
            return;
        }
        MLog.d(TAG, "onRemoteUserEnableCam: " + userId + " enable: " + enable);
        userInfo.isCameraOn = enable;
        notifyUserUpdated(userInfo, IUIEduDef.UserUpdateReason.ON_CAM_CHANGED);
    }

    private Activity getCurrentActivityContext() {
        return getUIRtcCore().getRtcDataProvider().currentActivity();
    }

    @Override
    public void onEnableMicByHost(boolean enable) {
        runOnUIThread(() -> enableMicByHost(enable));
    }

    @Override
    public void onEnableCamByHost(boolean enable) {
        runOnUIThread(() -> enableCameraByHost(enable));
    }

    @Override
    public void onReceiveShareReply(boolean permit) {
        onChangeSharePermitByHost(permit);
    }

    @Override
    public void onChangeSharePermitByHost(boolean permit) {
        getDataProvider().setSharePermit(permit);
    }

    @Override
    public void onLocalAudioPropertiesReport(List<LocalAudioPropertiesInfo> audioProperties) {
        if (TextUtils.isEmpty(mUserId)) {
            return;
        }
        for (LocalAudioPropertiesInfo item : audioProperties) {
            if (!StreamIndex.STREAM_INDEX_MAIN.equals(item.streamIndex)) {
                continue;
            }
            if (mLocalUser == null) {
                continue;
            }
            notifyUserVolumeChanged(mLocalUser, item.audioPropertiesInfo);
        }
    }

    @Override
    public void onRemoteAudioPropertiesReport(List<RemoteAudioPropertiesInfo> audioProperties, int totalRemoteVolume) {
        for (RemoteAudioPropertiesInfo item : audioProperties) {
            if (!StreamIndex.STREAM_INDEX_MAIN.equals(item.streamKey.getStreamIndex())) {
                continue;
            }
            EduUserInfo userInfo = mVisibleUserMap.get(item.streamKey.getUserId());
            if (userInfo == null) {
                continue;
            }
            notifyUserVolumeChanged(userInfo, item.audioPropertiesInfo);
        }
    }

    private void notifyUserVolumeChanged(EduUserInfo user, AudioPropertiesInfo info) {
        boolean isSpeaking = info.linearVolume > AudioVideoConfig.VOLUME_MIN_THRESHOLD;
        if (user.isSpeaking != isSpeaking) {
            // only notify change
            user.isSpeaking = isSpeaking;
            int changeIndex = mVisibleUserList.indexOf(user);
            if (changeIndex >= 0) {
                runOnUIThread(() -> getDataProvider().onUserUpdated(user, changeIndex, IUIEduDef.UserUpdateReason.ON_MIC_CHANGED));
            }
        }
    }
}
