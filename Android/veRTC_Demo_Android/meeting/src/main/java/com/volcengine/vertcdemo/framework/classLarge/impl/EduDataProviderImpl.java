package com.volcengine.vertcdemo.framework.classLarge.impl;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.volcengine.vertcdemo.core.AbsHandlerPool;
import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class EduDataProviderImpl implements IUIEduDef.IEduDataProvider, IUIEduDef.IUserDataObserver {

    private final MutableLiveData<IUIEduDef.RoomInfo> mRoomInfo = new MutableLiveData<>();
    private final MutableLiveData<Long> mTick = new MutableLiveData<>();
    private final MutableLiveData<IUIEduDef.RoomState> mRoomState = new MutableLiveData<>(IUIEduDef.RoomState.UNSET);

    private final MutableLiveData<Boolean> mPullWhiteBoardStream = new MutableLiveData<>();
    private volatile IUIEduDef.WhiteBoardStreamInfo mWhiteBoardStreamInfo;

    private final MutableLiveData<Boolean> mPullScreenStream = new MutableLiveData<>();
    private volatile IUIEduDef.ScreenShareStreamInfo mScreenShareStreamInfo;

    private final MutableLiveData<Boolean> mLickMicState = new MutableLiveData<>(Boolean.FALSE);
    private final MutableLiveData<Boolean> mSharePermit = new MutableLiveData<>(Boolean.FALSE);

    private final List<EduUserInfo> mVisibleUsers = new ArrayList<>();
    private final AbsHandlerPool<IUIEduDef.IUserDataObserver> mUserHandlerPool = new AbsHandlerPool<>();


    @Override
    public LiveData<IUIEduDef.RoomInfo> getRoomInfo() {
        return mRoomInfo;
    }

    @Override
    public LiveData<Long> getTick() {
        return mTick;
    }

    @Override
    public LiveData<IUIEduDef.RoomState> getRoomState() {
        return mRoomState;
    }

    @Override
    public LiveData<Boolean> getPullWhiteBoardStream() {
        return mPullWhiteBoardStream;
    }

    @Override
    public IUIEduDef.WhiteBoardStreamInfo getWhiteBoardStreamInfo() {
        return mWhiteBoardStreamInfo;
    }

    @Override
    public LiveData<Boolean> getPullScreenStream() {
        return mPullScreenStream;
    }

    @Override
    public IUIEduDef.ScreenShareStreamInfo getScreenStreamInfo() {
        return mScreenShareStreamInfo;
    }

    @Override
    public LiveData<Boolean> getLickMicState() {
        return mLickMicState;
    }

    @Override
    public LiveData<Boolean> getSharePermit() {
        return mSharePermit;
    }

    public List<EduUserInfo> getVisibleUsers() {
        return mVisibleUsers;
    }

    @Override
    public void addHandler(IUIEduDef.IUserDataObserver userHandler) {
        mUserHandlerPool.addHandler(userHandler);
    }

    @Override
    public void removeHandler(IUIEduDef.IUserDataObserver userHandler) {
        mUserHandlerPool.removeHandler(userHandler);
    }

    public void setTick(long tick) {
        mTick.setValue(tick);
    }

    public void setRoomInfo(IUIEduDef.RoomInfo roomInfo) {
        mRoomInfo.postValue(roomInfo);
    }

    // IUIEduDef.IUserDataObserver
    @Override
    public void onUserDataRenew(List<EduUserInfo> userList) {
        mVisibleUsers.clear();
        mVisibleUsers.addAll(userList);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserDataRenew(mVisibleUsers));
    }

    @Override
    public void onUserInserted(EduUserInfo user, int position) {
        mVisibleUsers.add(position, user);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserInserted(user, position));
    }

    @Override
    public void onUserUpdated(EduUserInfo user, int position) {
        mVisibleUsers.set(position, user);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserUpdated(user, position));
    }

    @Override
    public void onUserUpdated(EduUserInfo user, int position, Object payload) {
        mVisibleUsers.set(position, user);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserUpdated(user, position, payload));
    }

    @Override
    public void onUserRemoved(EduUserInfo user, int position) {
        mVisibleUsers.remove(position);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserRemoved(user, position));
    }

    @Override
    public void onUserMoved(EduUserInfo user, int fromPosition, int toPosition) {
        Collections.swap(mVisibleUsers, fromPosition, toPosition);
        mUserHandlerPool.notifyHandler(userHandler -> userHandler.onUserMoved(user, fromPosition, toPosition));
    }

    public void setSharePermit(boolean permit) {
        mSharePermit.postValue(permit);
    }

    public void setLickMicState(boolean permit) {
        mLickMicState.postValue(permit);
        if (!permit) {
            setSharePermit(false);
        }
    }

    public void setRoomState(IUIEduDef.RoomState roomState) {
        mRoomState.postValue(roomState);
    }

    public void setWhiteBoardStream(boolean pullWhiteboardStream, String roomId, String userId) {
        mWhiteBoardStreamInfo = new IUIEduDef.WhiteBoardStreamInfo(roomId, userId);
        mPullWhiteBoardStream.postValue(pullWhiteboardStream);
    }

    public void setScreenStream(boolean pullScreenStream, String roomId, String userId) {
        mScreenShareStreamInfo = new IUIEduDef.ScreenShareStreamInfo(roomId, userId);
        mPullScreenStream.postValue(pullScreenStream);
    }
}
