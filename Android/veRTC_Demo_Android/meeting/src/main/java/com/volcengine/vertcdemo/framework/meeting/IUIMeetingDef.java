package com.volcengine.vertcdemo.framework.meeting;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;

import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.framework.meeting.internal.IMeetingRtmEventHandler;

import java.util.List;

public interface IUIMeetingDef {

    int SHARE_SCREEN = IMeetingRtmEventHandler.SHARE_SCREEN;
    int SHARE_WHITEBOARD = IMeetingRtmEventHandler.SHARE_WHITEBOARD;

    enum RoomState {
        UNSET, CONNECTED, RELEASED
    }

    class RoomInfo {
        public String mRoomId;
        public long mStartTime;

        public RoomInfo(String roomId, long startTime) {
            mRoomId = roomId;
            mStartTime = startTime;
        }
    }

    class RoomShareState {
        public boolean mIsMe;
        public boolean mShareStatus;
        public int mShareType;
        public String mRoomId;
        public String mShareUserId;
        public String mShareUserName;

        public boolean isShareScreen() {
            return mShareType == SHARE_SCREEN;
        }

        public boolean isShareWhiteboard() {
            return mShareType == SHARE_WHITEBOARD;
        }
    }

    enum UserUpdateReason {
        ON_MIC_CHANGED,
        ON_CAM_CHANGED,
        ON_PERMIT_CHANGED,
        ON_SHARE_CHANGED,
        ON_HOST_CHANGED,
    }

    interface IMeetingDataProvider {
        void addHandler(IUIMeetingDef.IUserDataObserver userHandler);

        void removeHandler(IUIMeetingDef.IUserDataObserver userHandler);

        boolean isHost();

        LiveData<Integer> getUserCount();

        default int userCount() {
            Integer count = getUserCount().getValue();
            return count != null ? count : 0;
        }

        default boolean singleUser() {
            return userCount() == 1;
        }

        @NonNull
        List<MeetingUserInfo> getUsers();

        LiveData<MeetingUserInfo> getLatestSpeaker();

        LiveData<IUIMeetingDef.RoomInfo> getRoomInfo();

        LiveData<Long> getTick();

        LiveData<IUIMeetingDef.RoomState> getRoomState();

        LiveData<IUIMeetingDef.RoomShareState> getRoomShareState();

        default boolean isSharing() {
            IUIMeetingDef.RoomShareState state = getRoomShareState().getValue();
            return state != null && state.mShareStatus;
        }

        default boolean isLocalSharingScreen() {
            IUIMeetingDef.RoomShareState state = getRoomShareState().getValue();
            return state != null && state.isShareScreen() && state.mIsMe;
        }

        default boolean isRemoteSharingScreen() {
            IUIMeetingDef.RoomShareState state = getRoomShareState().getValue();
            return state != null && state.isShareScreen() && !state.mIsMe;
        }

        default boolean isSharingWhiteBoard() {
            IUIMeetingDef.RoomShareState state = getRoomShareState().getValue();
            return state != null && state.isShareWhiteboard();
        }

        default boolean isLocalSharingWhiteBoard() {
            IUIMeetingDef.RoomShareState state = getRoomShareState().getValue();
            return state != null && state.isShareWhiteboard() && state.mIsMe;
        }

        LiveData<Boolean> getRecordState();

        default boolean isRecording() {
            return Boolean.TRUE.equals(getRecordState().getValue());
        }

        LiveData<Boolean> getMicPermit();

        default boolean hasMicPermit() {
            return Boolean.TRUE.equals(getMicPermit().getValue());
        }

        LiveData<Boolean> getSharePermit();

        default boolean hasSharePermit() {
            return Boolean.TRUE.equals(getSharePermit().getValue());
        }
    }

    interface IRoleDesc {
        String hostDesc();

        String participantDesc();
    }

    interface IUserDataObserver {
        void onUserDataRenew(List<MeetingUserInfo> userList);

        void onUserInserted(MeetingUserInfo user, int position);

        void onUserUpdated(MeetingUserInfo user, int position);

        void onUserUpdated(MeetingUserInfo user, int position, Object payload);

        void onUserRemoved(MeetingUserInfo user, int position);

        void onUserMoved(MeetingUserInfo user, int fromPosition, int toPosition);
    }
}
