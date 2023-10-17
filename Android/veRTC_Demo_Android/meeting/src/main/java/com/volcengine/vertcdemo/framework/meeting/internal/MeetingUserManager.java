package com.volcengine.vertcdemo.framework.meeting.internal;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ss.bytertc.engine.data.AudioPropertiesInfo;
import com.ss.bytertc.engine.data.LocalAudioPropertiesInfo;
import com.ss.bytertc.engine.data.RemoteAudioPropertiesInfo;
import com.ss.bytertc.engine.data.StreamIndex;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.AudioVideoConfig;
import com.volcengine.vertcdemo.core.IUIRtcDef.IRtcListener;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUsersInfo;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingRoomImpl;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingDataProviderImpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MeetingUserManager extends AbsMeetingManager implements IMeetingRtmEventHandler, IRtcListener {

    private static final String TAG = "MeetingUserManager";

    private static final boolean DEBUG = false;

    // current user's id
    private final String mUserId;
    // current user's info
    private final MeetingUserInfo mUser = new MeetingUserInfo();
    // all users in meeting, store in map
    private final Map<String, MeetingUserInfo> mUsersMap = new ConcurrentHashMap<>();
    // all users in meeting, store in list
    private final List<MeetingUserInfo> mUsersList = new ArrayList<>();
    // comparator used for sort item in mUserList
    private final UserComparator mUserComparator = new UserComparator();
    // current active speaker userId
    private String mActiveSpeakerUserId = "";
    // current screen or whiteboard sharing userId
    private String mShareUserId = "";

    public MeetingUserManager(@NonNull UIRtcCore uiRtcCore, @NonNull MeetingRoomImpl uiMeetingCore, @NonNull MeetingDataProviderImpl dataProvider) {
        super(uiRtcCore, uiMeetingCore, dataProvider);
        getUIRtcCore().addHandler(this);
        getMeetingRoom().addHandler(this);
        mUserId = SolutionDataManager.ins().getUserId();
    }

    @Override
    public void dispose() {
        getUIRtcCore().removeHandler(this);
        getMeetingRoom().removeHandler(this);
    }

    private void updateUserList(@NonNull List<MeetingUserInfo> userList) {
        mUsersMap.clear();
        for (MeetingUserInfo item : userList) {
            if (mUserId.equals(item.userId)) {
                mUser.copy(item);
                mUser.isMe = true;
                mUsersMap.put(mUserId, mUser);
            } else {
                mUsersMap.put(item.userId, item);
            }
        }

        mUsersList.clear();
        mUsersList.addAll(mUsersMap.values());
        Collections.sort(mUsersList, mUserComparator);

        List<MeetingUserInfo> newUserList = new ArrayList<>(mUsersList);
        runOnUIThread(() -> {
            getDataProvider().setLocalUser(mUser);
            getDataProvider().onUserDataRenew(newUserList);
        });
    }

    @Override
    public void onJoinRoom(MeetingTokenInfo data) {
        MLog.d(TAG, "onJoinRoom");
        getUIRtcCore().setDevicePrefer(data.user.isMicOn, data.user.isCameraOn);
        updateUserList(data.usersList);
    }

    @Override
    public void onGetUserList(MeetingUsersInfo data) {
        MLog.d(TAG, "onGetUserList");
        if (data == null) {
            return;
        }
        updateUserList(data.usersList);
    }

    @Override
    public void onReSync(MeetingTokenInfo data) {
        MLog.d(TAG, "onReSync");
        updateUserList(data.usersList);
    }

    private static class UserComparator implements Comparator<MeetingUserInfo> {

        private int booleanToInt(boolean value) {
            return value ? 0 : 1;
        }

        private int longToInt(long value) {
            if (value == 0) {
                return 0;
            } else {
                return value > 0 ? 1 : -1;
            }
        }

        @Override
        public int compare(MeetingUserInfo user1, MeetingUserInfo user2) {
            int compare = booleanToInt(user1.isMe) - booleanToInt(user2.isMe);
            if (compare != 0) {
                return compare;
            }
            compare = booleanToInt(user1.isShareOn) - booleanToInt(user2.isShareOn);
            if (compare != 0) {
                return compare;
            }
            compare = booleanToInt(user1.isHost) - booleanToInt(user2.isHost);
            if (compare != 0) {
                return compare;
            }
            compare = -longToInt(user1.latestActiveSpeakerMs - user2.latestActiveSpeakerMs);
            if (compare != 0) {
                return compare;
            }
            compare = longToInt(user1.joinTime - user2.joinTime);
            return compare;
        }
    }

    private void notifyUserUpdated(MeetingUserInfo user, Object payload) {
        int changedIndex = mUsersList.indexOf(user);
        runOnUIThread(() -> getDataProvider().onUserUpdated(user, changedIndex, payload));
    }

    private void changePropertyAffectOrder(@NonNull MeetingUserInfo user, Runnable runnable, Object payload) {
        int fromPosition = mUsersList.indexOf(user);
        if (runnable != null) {
            runnable.run();
        }
        Collections.sort(mUsersList, mUserComparator);
        int toPosition = mUsersList.indexOf(user);
        runOnUIThread(() -> getDataProvider().onUserUpdated(user, fromPosition, payload));
        if (fromPosition == toPosition) {
            return;
        }
        runOnUIThread(() -> getDataProvider().onUserMoved(user, fromPosition, toPosition));
    }

    @SuppressWarnings("all")
    private void changePropertyOnlyAffectOrder(@NonNull MeetingUserInfo user, Runnable runnable, String skipMsg) {
        int fromPosition = mUsersList.indexOf(user);
        if (runnable != null) {
            runnable.run();
        }
        Collections.sort(mUsersList, mUserComparator);
        int toPosition = mUsersList.indexOf(user);
        if (fromPosition == toPosition) {
            if (DEBUG) {
                MLog.d(TAG, "position did not change for " + skipMsg + ", position: " + fromPosition + "" + ", user: " + user.userName);
            }
            return;
        }
        runOnUIThread(() -> getDataProvider().onUserMoved(user, fromPosition, toPosition));
    }


    // IMeetingRtmEventHandler
    @Override
    public void onEnableLocalMic(boolean enable) {
        MeetingUserInfo userInfo = mUsersMap.get(mUserId);
        if (userInfo == null) {
            MLog.w(TAG, "onEnableLocalMic, can't find user");
            return;
        }
        MLog.d(TAG, "onEnableLocalMic enable: " + enable);
        userInfo.isMicOn = enable;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_MIC_CHANGED);
    }

    @Override
    public void onEnableLocalCam(boolean enable) {
        MeetingUserInfo userInfo = mUsersMap.get(mUserId);
        if (userInfo == null) {
            MLog.w(TAG, "onEnableLocalCam, can't find user");
            return;
        }
        MLog.d(TAG, "onEnableLocalCam enable: " + enable);
        userInfo.isCameraOn = enable;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_CAM_CHANGED);
    }


    @Override
    public void onChangeRemoteUserSharePermit(String userId, boolean permit) {
        MeetingUserInfo userInfo = mUsersMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "onChangeRemoteUserSharePermit, can't find user " + userId);
            return;
        }
        MLog.d(TAG, "onChangeRemoteMicPermit userId: " + userId + ", permit: " + permit);
        userInfo.hasSharePermission = permit;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_PERMIT_CHANGED);
    }

    @Override
    public void onRemoteUserJoin(@NonNull MeetingUserInfo user, int userCount) {
        MLog.d(TAG, "onUserJoin userId: " + user.userId);
        int foundIndex = mUsersList.indexOf(user);
        if (foundIndex != -1) {
            userLeave(user, foundIndex);
        }
        mUsersList.add(user);
        mUsersMap.put(user.userId, user);
        Collections.sort(mUsersList, mUserComparator);

        int changedIndex = mUsersList.indexOf(user);
        runOnUIThread(() -> getDataProvider().onUserInserted(user, changedIndex));
    }

    private void userLeave(@NonNull MeetingUserInfo user, int index) {
        mUsersList.remove(user);
        mUsersMap.remove(user.userId);
        runOnUIThread(() -> getDataProvider().onUserRemoved(user, index));
    }

    @Override
    public void onRemoteUserLeave(@NonNull MeetingUserInfo user, int userCount) {
        int foundIndex = mUsersList.indexOf(user);
        if (foundIndex == -1) {
            MLog.w(TAG, "onUserLeave, can't find user " + user.userId);
            return;
        }
        userLeave(user, foundIndex);
    }

    @Override
    public void onRemoteUserEnableMic(String userId, boolean enable) {
        MeetingUserInfo userInfo = mUsersMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "onRemoteUserEnableMic, can't find user " + userId);
            return;
        }
        if (userInfo.isMe) {
            return;
        }
        MLog.d(TAG, "onRemoteUserEnableMic: " + userId + " enable: " + enable);
        userInfo.isMicOn = enable;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_MIC_CHANGED);
    }

    @Override
    public void onRemoteUserEnableCam(String userId, boolean enable) {
        MeetingUserInfo userInfo = mUsersMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "onRemoteUserEnableCam, can't find user " + userId);
            return;
        }
        if (userInfo.isMe) {
            return;
        }
        MLog.d(TAG, "onRemoteUserEnableCam: " + userId + " enable: " + enable);
        userInfo.isCameraOn = enable;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_CAM_CHANGED);
    }

    @Override
    public void onEnableAllMicByHost(boolean enable, boolean micPermit) {
        MLog.d(TAG, "onEnableAllMicByHost enable: " + enable + ", micPermit: " + micPermit);
        for (int i = 0; i < mUsersList.size(); i++) {
            MeetingUserInfo user = mUsersList.get(i);
            if (user.isHost) {
                continue;
            }
            if (user.isMicOn == enable && user.hasMicPermission == micPermit) {
                continue;
            }
            user.isMicOn = enable;
            user.hasMicPermission = micPermit;
            final int position = i;
            runOnUIThread(() -> getDataProvider().onUserUpdated(user, position));
        }
    }

    @Override
    public void onChangeSharePermitByHost(boolean permit) {
        MeetingUserInfo userInfo = mUsersMap.get(mUserId);
        if (userInfo == null) {
            MLog.w(TAG, "onChangeSharePermitByHost, can't find user");
            return;
        }
        MLog.d(TAG, "onChangeSharePermitByHost: permit: " + permit);
        userInfo.hasSharePermission = permit;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_PERMIT_CHANGED);
    }

    @Override
    public void onReceiveShareReply(boolean permit) {
        MLog.d(TAG, "onReceiveShareReply: permit: " + permit);
        onChangeSharePermitByHost(permit);
    }

    @Override
    public void onShareStarted(int shareType, @NonNull String userId, String userName) {
        if (!TextUtils.isEmpty(mShareUserId)) {
            onShareStopped(mShareUserId);
        }
        MeetingUserInfo user = mUsersMap.get(userId);
        if (user == null) {
            MLog.w(TAG, "onShareStarted, can't find user " + userId);
            return;
        }
        MLog.d(TAG, "onShareStarted, type: " + shareType + ", userId: " + userId);
        mShareUserId = userId;
        changePropertyAffectOrder(user, () -> {
            user.isShareOn = true;
            user.shareType = MeetingUserInfo.SHARE_TYPE_SCREEN;
        }, IUIMeetingDef.UserUpdateReason.ON_SHARE_CHANGED);
    }

    @Override
    public void onShareStopped(@NonNull String userId) {
        if (TextUtils.isEmpty(mShareUserId)) {
            return;
        }
        MLog.d(TAG, "onScreenShareStopped: " + userId);
        mShareUserId = null;
        MeetingUserInfo user = mUsersMap.get(userId);
        if (user == null) {
            MLog.w(TAG, "onScreenShareStopped, can't find user " + userId);
            return;
        }
        changePropertyAffectOrder(user, () -> user.isShareOn = false, IUIMeetingDef.UserUpdateReason.ON_SHARE_CHANGED);
    }

    @Override
    public void onReceiveOpenMicApply(String userId, String userName) {
        MeetingUserInfo userInfo = mUsersMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "can't find remote user info in map, userId: " + userId);
            return;
        }
        MLog.d(TAG, "onReceiveSpeakApply userId: " + userId);
        userInfo.applyMicPermission = true;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_PERMIT_CHANGED);
    }

    @Override
    public void onPermitOpenMic(String userId, boolean permit) {
        MeetingUserInfo userInfo = mUsersMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "can't find remote user info in map, userId: " + userId);
            return;
        }
        MLog.d(TAG, "onPermitOpenMic userId: " + userId + ", permit: " + permit);
        userInfo.hasMicPermission = permit;
        userInfo.applyMicPermission = false;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_PERMIT_CHANGED);
    }

    @Override
    public void onReceiveShareApply(String userId, String userName) {
        MeetingUserInfo userInfo = mUsersMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "can't find remote user info in map, userId: " + userId);
            return;
        }
        MLog.d(TAG, "onReceiveShareApply userId: " + userId);
        userInfo.applySharePermission = true;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_PERMIT_CHANGED);
    }

    @Override
    public void onPermitShare(String userId, boolean permit) {
        MeetingUserInfo userInfo = mUsersMap.get(userId);
        if (userInfo == null) {
            MLog.w(TAG, "can't find remote user info in map, userId: " + userId);
            return;
        }
        MLog.d(TAG, "onPermitShare userId: " + userId);
        userInfo.hasSharePermission = permit;
        userInfo.applySharePermission = false;
        notifyUserUpdated(userInfo, IUIMeetingDef.UserUpdateReason.ON_PERMIT_CHANGED);
    }


    // IRtcListener
    @Override
    public void onActiveSpeaker(String userId) {
        if (DEBUG) {
            MLog.d(TAG, "onActiveSpeaker: " + userId);
        }
        if (userId.equals(mActiveSpeakerUserId)) {
            if (DEBUG) {
                MLog.w(TAG, "active speaker do not change, current user " + userId);
            }
            return;
        }
        MeetingUserInfo user = mUsersMap.get(userId);
        if (user == null) {
            if (DEBUG) {
                MLog.w(TAG, "onActiveSpeaker, can't find user " + userId);
            }
            return;
        }
        // case 1 (no active user)
        // - a, b, c, d, f
        // a, b(*), c, d, f - 1->1
        // a, c(*), b, d, f - 2->1
        // a, d(*), b, c, f - 3->1
        // a, f(*), b, c, d - 4->1

        // case 2 (new active user)
        // - a, b(*), c, d, f
        // a, b(*), c, d, f - 1->1
        // a, c(*), b, d, f - 2->1
        // a, d(*), b, c, f - 3->1
        // a, f(*), b, c, d - 4->1

        // user become active speaker
        mActiveSpeakerUserId = userId;
        getDataProvider().setLatestSpeaker(user);
        changePropertyOnlyAffectOrder(user, () -> user.latestActiveSpeakerMs = System.currentTimeMillis(), "active speaker");
    }

    private void notifyUserVolumeChanged(MeetingUserInfo user, AudioPropertiesInfo info) {
        user.volume = info.linearVolume;
        boolean isSpeaking = info.linearVolume > AudioVideoConfig.VOLUME_MIN_THRESHOLD;
        if (user.isSpeaking != isSpeaking) {
            // only notify change
            user.isSpeaking = isSpeaking;
            int changeIndex = mUsersList.indexOf(user);
            if (DEBUG) {
                MLog.d(TAG, "user speaking state change " + user.userId + " speaking: " + isSpeaking + " position: " + changeIndex);
            }
            runOnUIThread(() -> getDataProvider().onUserUpdated(user, changeIndex, IUIMeetingDef.UserUpdateReason.ON_MIC_CHANGED));
        }
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
            MeetingUserInfo userInfo = mUsersMap.get(mUserId);
            if (userInfo == null) {
                continue;
            }
            notifyUserVolumeChanged(userInfo, item.audioPropertiesInfo);
        }
    }

    @Override
    public void onRemoteAudioPropertiesReport(List<RemoteAudioPropertiesInfo> audioProperties, int totalRemoteVolume) {
        for (RemoteAudioPropertiesInfo item : audioProperties) {
            if (!StreamIndex.STREAM_INDEX_MAIN.equals(item.streamKey.getStreamIndex())) {
                continue;
            }
            MeetingUserInfo userInfo = mUsersMap.get(item.streamKey.getUserId());
            if (userInfo == null) {
                continue;
            }
            notifyUserVolumeChanged(userInfo, item.audioPropertiesInfo);
        }
    }

    @Override
    public void onHostChange(String roomId, String userId) {
        for (MeetingUserInfo info : mUsersList) {
            if (TextUtils.equals(userId, info.userId) && !info.isHost) {
                info.isHost = true;
                notifyUserUpdated(info, IUIMeetingDef.UserUpdateReason.ON_HOST_CHANGED);
            }
            if (info.isHost && !TextUtils.equals(userId, info.userId)) {
                info.isHost = false;
                notifyUserUpdated(info, IUIMeetingDef.UserUpdateReason.ON_HOST_CHANGED);
            }
        }
    }

}
