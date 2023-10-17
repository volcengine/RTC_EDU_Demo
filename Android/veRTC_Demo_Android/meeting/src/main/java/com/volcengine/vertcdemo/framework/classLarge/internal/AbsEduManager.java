package com.volcengine.vertcdemo.framework.classLarge.internal;

import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduRoomImpl;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduDataProviderImpl;

public abstract class AbsEduManager {

    private final Handler mUIHandler;
    private final UIRtcCore mUIRtcCore;
    private final EduRoomImpl mEduRoom;
    private final EduDataProviderImpl mDataProvider;

    public AbsEduManager(@NonNull UIRtcCore uiRtcCore, @NonNull EduRoomImpl eduRoom, @NonNull EduDataProviderImpl dataProvider) {
        mUIHandler = new Handler(Looper.getMainLooper());
        mUIRtcCore = uiRtcCore;
        mEduRoom = eduRoom;
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
    public EduRoomImpl getEduRoom() {
        return mEduRoom;
    }

    @NonNull
    public EduDataProviderImpl getDataProvider() {
        return mDataProvider;
    }
}
