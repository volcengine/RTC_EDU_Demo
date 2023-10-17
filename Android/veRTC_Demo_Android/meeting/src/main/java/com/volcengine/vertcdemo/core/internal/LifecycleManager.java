package com.volcengine.vertcdemo.core.internal;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.os.Handler;

import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.core.impl.RtcDataProviderImpl;

public class LifecycleManager extends AbsRtcManager implements Application.ActivityLifecycleCallbacks {

    private static final long BACKGROUND_DELAY = 500;
    private final Handler mBackgroundDelayHandler = new Handler();
    private final Application mApplication;
    private Runnable mBackgroundTransition;

    public LifecycleManager(@NonNull RtcDataProviderImpl dataProvider, @NonNull Activity activity) {
        super(dataProvider);
        mApplication = activity.getApplication();
        mApplication.registerActivityLifecycleCallbacks(this);
        mDataProvider.setActivity(activity);
    }

    @Override
    public void dispose() {
        mApplication.unregisterActivityLifecycleCallbacks(this);
    }

    private boolean isInBackground() {
        return Boolean.TRUE.equals(mDataProvider.appBackground().getValue());
    }

    // Application.ActivityLifecycleCallbacks
    @Override
    public void onActivityResumed(@NonNull Activity activity) {
        if (mBackgroundTransition != null) {
            mBackgroundDelayHandler.removeCallbacks(mBackgroundTransition);
            mBackgroundTransition = null;
        }

        if (isInBackground()) {
            mDataProvider.setAppBackground(false);
        }
    }

    @Override
    public void onActivityPaused(@NonNull Activity activity) {
        if (!isInBackground() && mBackgroundTransition == null) {
            mBackgroundTransition = () -> {
                mDataProvider.setAppBackground(true);
                mBackgroundTransition = null;
            };
            mBackgroundDelayHandler.postDelayed(mBackgroundTransition, BACKGROUND_DELAY);
        }
    }

    @Override
    public void onActivityStopped(@NonNull Activity activity) {
    }

    @Override
    public void onActivityCreated(@NonNull Activity activity, Bundle savedInstanceState) {
    }

    @Override
    public void onActivityStarted(@NonNull Activity activity) {
        mDataProvider.setActivity(activity);
    }

    @Override
    public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(@NonNull Activity activity) {
    }
}