package com.volcengine.vertcdemo.framework.meeting.internal;

import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingRoomImpl;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingDataProviderImpl;

public abstract class AbsMeetingManager {

    private final Handler mUIHandler;
    private final UIRtcCore mUIRtcCore;
    private final MeetingRoomImpl mMeetingRoom;
    private final MeetingDataProviderImpl mDataProvider;

    public AbsMeetingManager(@NonNull UIRtcCore uiRtcCore, @NonNull MeetingRoomImpl meetingRoom, @NonNull MeetingDataProviderImpl dataProvider) {
        mUIHandler = new Handler(Looper.getMainLooper());
        mUIRtcCore = uiRtcCore;
        mMeetingRoom = meetingRoom;
        mDataProvider = dataProvider;
    }

    public abstract void dispose();

    protected void runOnUIThread(@NonNull Runnable runnable) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            runnable.run();
        } else {
            mUIHandler.post(runnable);
        }
    }

    public Handler getUIHandler() {
        return mUIHandler;
    }

    @NonNull
    public UIRtcCore getUIRtcCore() {
        return mUIRtcCore;
    }

    @NonNull
    public MeetingRoomImpl getMeetingRoom() {
        return mMeetingRoom;
    }

    @NonNull
    public MeetingDataProviderImpl getDataProvider() {
        return mDataProvider;
    }

    public String hostDesc() {
        return mMeetingRoom.getRoleDesc().hostDesc();
    }

    @SuppressWarnings("unused")
    public String participantDesc() {
        return mMeetingRoom.getRoleDesc().participantDesc();
    }
}
