package com.volcengine.vertcdemo.framework.classLarge.internal;

import androidx.annotation.MainThread;
import androidx.annotation.NonNull;

import com.ss.bytertc.engine.RTCRoom;
import com.ss.bytertc.engine.type.MediaStreamType;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.IUIRtcDef.IRtcListener;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduDataProviderImpl;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduRoomImpl;

import java.util.HashSet;
import java.util.Set;

public class EduWhiteBoardStreamManager extends AbsEduManager implements IRtcListener {

    private static final String TAG = "WhiteBoardStreamManager";

    @NonNull
    private final RTCRoom mRtcRoom;
    @NonNull
    private final Set<String> mVideoAvailableUserSet = new HashSet<>();
    @NonNull
    private final Set<String> mVideoSubUserSet = new HashSet<>();
    @NonNull
    private final Set<String> mVideoSubPendingUserSet = new HashSet<>();

    public EduWhiteBoardStreamManager(@NonNull UIRtcCore uiRtcCore, @NonNull EduRoomImpl uiRoom, @NonNull EduDataProviderImpl dataProvider, @NonNull RTCRoom rtcRoom) {
        super(uiRtcCore, uiRoom, dataProvider);
        mRtcRoom = rtcRoom;
        getUIRtcCore().addHandler(this);
    }

    @Override
    public void dispose() {
        getUIRtcCore().removeHandler(this);
        mVideoAvailableUserSet.clear();
        mVideoSubUserSet.clear();
        mVideoSubPendingUserSet.clear();
    }

    private void subscribeStream(String uid, MediaStreamType type) {
        MLog.d(TAG, "subscribeStream, uid: " + uid + ", type: " + type.toString());
        mRtcRoom.subscribeStream(uid, type);
    }

    private void unsubscribeStream(String uid, MediaStreamType type) {
        MLog.d(TAG, "unSubscribeStream, uid: " + uid + ", type:" + type);
        mRtcRoom.unsubscribeStream(uid, type);
    }

    // IRtcListener
    @Override
    public void onUserVideoStreamAvailable(String userId, boolean available) {
        // MLog.e(TAG, "onUserVideoStreamAvailable " + userId + " available : " +  available);
        if (available) {
            mVideoAvailableUserSet.add(userId);
            if (mVideoSubPendingUserSet.contains(userId)) {
                MLog.d(TAG, "sub video in pending list, useId " + userId);
                subscribeStream(userId, MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
                mVideoSubPendingUserSet.remove(userId);
                mVideoSubUserSet.add(userId);
            }
        } else {
            mVideoAvailableUserSet.remove(userId);
            mVideoSubUserSet.remove(userId);
            mVideoSubPendingUserSet.remove(userId);
        }
    }

    public void subscribeVideoStream(@NonNull Set<String> userIds) {
        MLog.d(TAG, "subscribeVideoStream, " + userIds);
        for (String userId : mVideoSubUserSet) {
            if (userIds.contains(userId)) {
                continue;
            }
            unsubscribeStream(userId, MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
        }

        mVideoSubPendingUserSet.clear();
        Set<String> currentVideoSubUserList = new HashSet<>();
        for (String userId : userIds) {
            if (mVideoSubUserSet.contains(userId)) {
                currentVideoSubUserList.add(userId);
                continue;
            }
            if (mVideoAvailableUserSet.contains(userId)) {
                currentVideoSubUserList.add(userId);
                subscribeStream(userId, MediaStreamType.RTC_MEDIA_STREAM_TYPE_VIDEO);
            } else {
                mVideoSubPendingUserSet.add(userId);
            }
        }
        mVideoSubUserSet.clear();
        mVideoSubUserSet.addAll(currentVideoSubUserList);
    }
}
