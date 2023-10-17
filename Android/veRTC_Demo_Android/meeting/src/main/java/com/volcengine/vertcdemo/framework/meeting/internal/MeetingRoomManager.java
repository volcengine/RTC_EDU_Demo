package com.volcengine.vertcdemo.framework.meeting.internal;

import androidx.annotation.NonNull;

import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingRoomInfo;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingRoomImpl;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingDataProviderImpl;
import com.volcengine.vertcdemo.meeting.R;

import java.util.Objects;

public class MeetingRoomManager extends AbsMeetingManager implements IMeetingRtmEventHandler {

    private static final String TAG = "MeetingRoomManager";

    private final MeetingRoomInfo mMeetingRoomInfo = new MeetingRoomInfo();
    private String mLocalUserId;
    private volatile boolean mTiming;
    private volatile long mTimeLimit, mTimeEnter, mDurationServer;

    private final Runnable mDurationCounting = new Runnable() {
        @Override
        public void run() {
            if (!mTiming) {
                return;
            }
            long durationLocal = System.currentTimeMillis() - mTimeEnter;
            long tick = Math.max(0, mTimeLimit - (mDurationServer + durationLocal));
            getDataProvider().setTick(tick);
            getUIHandler().postDelayed(mDurationCounting, 1000);
        }
    };

    public MeetingRoomManager(@NonNull UIRtcCore uiRtcCore, @NonNull MeetingRoomImpl uiMeetingCore, @NonNull MeetingDataProviderImpl dataProvider) {
        super(uiRtcCore, uiMeetingCore, dataProvider);
        getMeetingRoom().addHandler(this);
    }

    @Override
    public void dispose() {
        stopTiming();
        getMeetingRoom().removeHandler(this);
    }

    private boolean isSharingScreen() {
        return mMeetingRoomInfo.shareStatus && mMeetingRoomInfo.shareType == IMeetingRtmEventHandler.SHARE_SCREEN;
    }

    private boolean isSharingWhiteBoard() {
        return mMeetingRoomInfo.shareStatus && mMeetingRoomInfo.shareType == IMeetingRtmEventHandler.SHARE_WHITEBOARD;
    }

    private boolean isLocalSharingScreen() {
        return isSharingScreen() && mMeetingRoomInfo.shareUserId.equals(mLocalUserId);
    }

    private void startTiming() {
        MLog.d(TAG, "startTiming");
        mTiming = true;
        mTimeEnter = System.currentTimeMillis();
        getUIHandler().removeCallbacks(mDurationCounting);
        getUIHandler().post(mDurationCounting);
    }

    private void stopTiming() {
        MLog.d(TAG, "stopTiming");
        mTiming = false;
        getUIHandler().removeCallbacks(mDurationCounting);
    }

    // IMeetingRtmEventHandler
    @Override
    public void onJoinRoom(MeetingTokenInfo info) {
        mTimeLimit = info.roomInfo.experienceTimeLimit * 1000;
        mDurationServer = Math.max(0, info.roomInfo.baseTime - info.roomInfo.startTime);

        mLocalUserId = info.user.userId;
        mMeetingRoomInfo.copy(info.roomInfo);

        getDataProvider().setRoomBasicInfo(new IUIMeetingDef.RoomInfo(mMeetingRoomInfo.roomId, mMeetingRoomInfo.startTime));
        getDataProvider().setRoomShareState(createRoomShare());
        getDataProvider().setRoomState(IUIMeetingDef.RoomState.CONNECTED);
        startTiming();
    }

    @Override
    public void onReSync(MeetingTokenInfo info) {
        onJoinRoom(info);
    }

    @Override
    public void onRemoteUserLeave(@NonNull MeetingUserInfo user, int userCount) {
        if (mMeetingRoomInfo.shareStatus && user.userId.equals(mMeetingRoomInfo.shareUserId)) {
            onShareStopped(user.userId);
        }
    }

    private void onShareReplaced(int shareType, String userName) {
        runOnUIThread(() -> {
            if (shareType == IMeetingRtmEventHandler.SHARE_SCREEN) {
                SafeToast.show(Utilities.getApplicationContext().getString(R.string.replaced_by_sharing_screen, userName));
            } else if (shareType == IMeetingRtmEventHandler.SHARE_WHITEBOARD) {
                SafeToast.show(Utilities.getApplicationContext().getString(R.string.replaced_by_sharing_white_board, userName));
            }
        });
    }

    // TODO(haiyangwu): move out
    private void stopSharingExist(int shareTyp, @NonNull String userId, String userName) {
        if (isSharingWhiteBoard()) {
            // notify if other use start screen/whiteboard share
            if (!userId.equals(mLocalUserId)) {
                onShareReplaced(shareTyp, userName);
            }
            onShareStopped(mMeetingRoomInfo.shareUserId);
        }

        if (isSharingScreen()) {
            if (!userId.equals(mLocalUserId)) {
                onShareReplaced(shareTyp, userName);
            }
            if (isLocalSharingScreen()) {
                // stop local screen sharing
                getMeetingRoom().stopScreenSharing();
                // no rtm message, so invoking locally
            }
            onShareStopped(mMeetingRoomInfo.shareUserId);
        }
    }

    @Override
    public void onShareStarted(int shareType, @NonNull String userId, String userName) {
        stopSharingExist(shareType, userId, userName);
        mMeetingRoomInfo.shareStatus = true;
        mMeetingRoomInfo.shareUserId = userId;
        mMeetingRoomInfo.shareUserName = userName;
        mMeetingRoomInfo.shareType = shareType;
        getDataProvider().setRoomShareState(createRoomShare());

    }

    @Override
    public void onShareStopped(@NonNull String userId) {
        // TODO(haiyangwu): move out
        if (isSharingWhiteBoard()) {
            getMeetingRoom().getWhiteBoardService().leaveRoom();
        }
        mMeetingRoomInfo.shareStatus = false;
        mMeetingRoomInfo.shareType = -1;
        mMeetingRoomInfo.shareUserId = "";
        mMeetingRoomInfo.shareUserName = "";
        getDataProvider().setRoomShareState(createRoomShare());
    }

    @Override
    public void onRecordStarted() {
        mMeetingRoomInfo.recordStatus = true;
        getDataProvider().setRecordState(true);
        runOnUIThread(() -> SafeToast.show(R.string.record_already_started));
    }

    @Override
    public void onRecordStopped(int reason) {
        mMeetingRoomInfo.recordStatus = false;
        getDataProvider().setRecordState(false);
        runOnUIThread(() -> {
            if (reason == IMeetingRtmEventHandler.RECORD_STOPPED_TIME_LIMIT) {
                SafeToast.show(R.string.record_already_stopped_time_limit);
            } else {
                SafeToast.show(R.string.record_already_stopped);
            }
        });
    }

    @Override
    public void onRoomReleased(int reason) {
        getDataProvider().setRoomState(IUIMeetingDef.RoomState.RELEASED);
        if (reason == IMeetingRtmEventHandler.ROOM_RELEASED_TIME_LIMIT) {
            runOnUIThread(() -> SafeToast.show(R.string.tips_time_limit));
        }
    }

    @Override
    public void onEnableAllMicByHost(boolean enable, boolean micPermit) {
        mMeetingRoomInfo.operateSelfMicPermission = micPermit;
    }

    private IUIMeetingDef.RoomShareState createRoomShare() {
        return createRoomShare(mMeetingRoomInfo, mLocalUserId);
    }

    public static IUIMeetingDef.RoomShareState createRoomShare(MeetingRoomInfo roomInfo, String localUserId) {
        IUIMeetingDef.RoomShareState state = new IUIMeetingDef.RoomShareState();
        state.mShareStatus = roomInfo.shareStatus;
        state.mShareType = roomInfo.shareType;
        state.mShareUserId = roomInfo.shareUserId;
        state.mShareUserName = roomInfo.shareUserName;
        state.mRoomId = roomInfo.roomId;
        state.mIsMe = Objects.equals(roomInfo.shareUserId, localUserId);
        return state;
    }
}
