package com.volcengine.vertcdemo.framework.meeting.impl;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.volcengine.vertcdemo.core.AbsHandlerPool;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MeetingDataProviderImpl implements IUIMeetingDef.IMeetingDataProvider {

    private final AbsHandlerPool<IUIMeetingDef.IUserDataObserver> mUserHandlerPool = new AbsHandlerPool<>();

    private MeetingUserInfo mLocalUser;
    private final List<MeetingUserInfo> mUsers = new ArrayList<>();
    private final MutableLiveData<Integer> mUserCount = new MutableLiveData<>(0);

    private final MutableLiveData<MeetingUserInfo> mLatestSpeaker = new MutableLiveData<>();

    private final MutableLiveData<IUIMeetingDef.RoomInfo> mRoomBasicInfo = new MutableLiveData<>();
    private final MutableLiveData<Long> mTick = new MutableLiveData<>();
    private final MutableLiveData<Boolean> mRecordState = new MutableLiveData<>(Boolean.FALSE);
    private final MutableLiveData<IUIMeetingDef.RoomState> mRoomState = new MutableLiveData<>(IUIMeetingDef.RoomState.UNSET);
    private final MutableLiveData<IUIMeetingDef.RoomShareState> mRoomShareState = new MutableLiveData<>();

    private final MutableLiveData<Boolean> hasMicPermit = new MutableLiveData<>(Boolean.FALSE);
    private final MutableLiveData<Boolean> hasSharePermit = new MutableLiveData<>(Boolean.FALSE);

    @Override
    public void addHandler(IUIMeetingDef.IUserDataObserver userHandler) {
        mUserHandlerPool.addHandler(userHandler);
    }

    @Override
    public void removeHandler(IUIMeetingDef.IUserDataObserver userHandler) {
        mUserHandlerPool.removeHandler(userHandler);
    }

    @Override
    public boolean isHost() {
        return mLocalUser != null && mLocalUser.isHost;
    }

    @Override
    public LiveData<Integer> getUserCount() {
        return mUserCount;
    }

    @NonNull
    @Override
    public List<MeetingUserInfo> getUsers() {
        return mUsers;
    }

    public LiveData<MeetingUserInfo> getLatestSpeaker() {
        return mLatestSpeaker;
    }

    public LiveData<IUIMeetingDef.RoomInfo> getRoomInfo() {
        return mRoomBasicInfo;
    }

    @Override
    public LiveData<Long> getTick() {
        return mTick;
    }

    public LiveData<IUIMeetingDef.RoomState> getRoomState() {
        return mRoomState;
    }

    public LiveData<IUIMeetingDef.RoomShareState> getRoomShareState() {
        return mRoomShareState;
    }

    public LiveData<Boolean> getRecordState() {
        return mRecordState;
    }

    public LiveData<Boolean> getMicPermit() {
        return hasMicPermit;
    }

    public LiveData<Boolean> getSharePermit() {
        return hasSharePermit;
    }

    public void onUserDataRenew(List<MeetingUserInfo> userList) {
        mUsers.clear();
        mUsers.addAll(userList);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserDataRenew(userList));
        mUserCount.setValue(mUsers.size());
    }

    public void onUserInserted(MeetingUserInfo user, int position) {
        mUsers.add(position, user);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserInserted(user, position));
        mUserCount.setValue(mUsers.size());
    }

    public void onUserUpdated(MeetingUserInfo user, int position) {
        mUsers.set(position, user);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserUpdated(user, position));
    }

    public void onUserUpdated(MeetingUserInfo user, int position, Object payload) {
        mUsers.set(position, user);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserUpdated(user, position, payload));
    }

    public void onUserRemoved(MeetingUserInfo user, int position) {
        mUsers.remove(position);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserRemoved(user, position));
        mUserCount.setValue(mUsers.size());
    }

    public void onUserMoved(MeetingUserInfo user, int fromPosition, int toPosition) {
        Collections.swap(mUsers, fromPosition, toPosition);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserMoved(user, fromPosition, toPosition));
    }

    public void setLatestSpeaker(MeetingUserInfo userInfo) {
        mLatestSpeaker.postValue(userInfo);
    }

    public void setLocalUser(MeetingUserInfo userInfo) {
        mLocalUser = userInfo;
    }

    public void setRoomBasicInfo(IUIMeetingDef.RoomInfo roomInfo) {
        mRoomBasicInfo.postValue(roomInfo);
    }

    public void setTick(long tick) {
        mTick.setValue(tick);
    }

    public void setRecordState(boolean record) {
        mRecordState.postValue(record);
    }

    public void setRoomShareState(IUIMeetingDef.RoomShareState shareState) {
        mRoomShareState.postValue(shareState);
    }

    public void setRoomState(IUIMeetingDef.RoomState roomState) {
        mRoomState.postValue(roomState);
    }

    public void setHasMicPermit(boolean permit) {
        hasMicPermit.postValue(permit);
    }

    public void setHasSharePermit(boolean permit) {
        if (isHost()) {
            hasSharePermit.postValue(true);
        } else {
            hasSharePermit.postValue(permit);
        }
    }
}
