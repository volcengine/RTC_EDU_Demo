package com.volcengine.vertcdemo.core.internal;

import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.core.impl.RtcDataProviderImpl;

public abstract class AbsRtcManager {

    protected RtcDataProviderImpl mDataProvider;

    public AbsRtcManager(@NonNull RtcDataProviderImpl dataProvider) {
        mDataProvider = dataProvider;
    }

    public abstract void dispose();
}
