package com.volcengine.vertcdemo.framework.classLarge;

import androidx.lifecycle.LiveData;

import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;

import java.util.List;

public interface IUIEduDef {

    class RoomInfo {
        public String mRoomId;
    }

    enum RoomState {
        UNSET, CONNECTED, RELEASED
    }

    enum UserUpdateReason {
        ON_MIC_CHANGED, ON_CAM_CHANGED,
    }

    class WhiteBoardStreamInfo {
        public String mRoomId;
        public String mUserId;

        public WhiteBoardStreamInfo(String roomId, String userId) {
            mRoomId = roomId;
            mUserId = userId;
        }
    }

    class ScreenShareStreamInfo {
        public String mRoomId;
        public String mUserId;

        public ScreenShareStreamInfo(String roomId, String userId) {
            mRoomId = roomId;
            mUserId = userId;
        }
    }

    interface IEduDataProvider {
        void addHandler(IUserDataObserver userHandler);

        void removeHandler(IUserDataObserver userHandler);

        LiveData<RoomInfo> getRoomInfo();

        LiveData<Long> getTick();

        LiveData<RoomState> getRoomState();

        LiveData<Boolean> getPullWhiteBoardStream();

        default boolean isPullWhiteBoardStream() {
            return Boolean.TRUE.equals(getPullWhiteBoardStream().getValue());
        }

        WhiteBoardStreamInfo getWhiteBoardStreamInfo();

        LiveData<Boolean> getPullScreenStream();

        default boolean isPullScreenStream() {
            return Boolean.TRUE.equals(getPullScreenStream().getValue());
        }

        IUIEduDef.ScreenShareStreamInfo getScreenStreamInfo();

        LiveData<Boolean> getLickMicState();

        default boolean isLickingMic() {
            return Boolean.TRUE.equals(getLickMicState().getValue());
        }

        LiveData<Boolean> getSharePermit();

        List<EduUserInfo> getVisibleUsers();
    }

    interface IUserDataObserver {
        void onUserDataRenew(List<EduUserInfo> userList);

        void onUserInserted(EduUserInfo user, int position);

        void onUserUpdated(EduUserInfo user, int position);

        void onUserUpdated(EduUserInfo user, int position, Object payload);

        void onUserRemoved(EduUserInfo user, int position);

        void onUserMoved(EduUserInfo user, int fromPosition, int toPosition);
    }
}
