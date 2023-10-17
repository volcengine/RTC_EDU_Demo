package com.volcengine.vertcdemo.core.impl;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;

import com.ss.bytertc.engine.type.ConnectionState;
import com.volcengine.vertcdemo.core.IUIRtcDef;

import java.lang.ref.WeakReference;
import java.util.Objects;

public class RtcDataProviderImpl implements IUIRtcDef.IRtcDataProvider {

    private final MutableLiveData<ConnectionState> mNetworkConnectionState = new MutableLiveData<>();
    private final MutableLiveData<Boolean> mRtmLoggedState = new MutableLiveData<>(Boolean.FALSE);
    private final MediatorLiveData<IUIRtcDef.KickOutReason> mRtmKickOutReason = new MediatorLiveData<>();

    private final MutableLiveData<Boolean> mMicPermission = new MutableLiveData<>(Boolean.FALSE);
    private final MutableLiveData<Boolean> mCamPermission = new MutableLiveData<>(Boolean.FALSE);

    private final MutableLiveData<Boolean> mPreferOpenMic = new MutableLiveData<>(Boolean.TRUE);
    private final MutableLiveData<Boolean> mPreferOpenCam = new MutableLiveData<>(Boolean.TRUE);
    private final MutableLiveData<Boolean> mFacingFront = new MutableLiveData<>(Boolean.TRUE);
    private final MutableLiveData<Boolean> mSpeakerPhone = new MutableLiveData<>(Boolean.TRUE);
    private final MutableLiveData<Boolean> mScreenAudio = new MutableLiveData<>(Boolean.FALSE);

    private final MediatorLiveData<Boolean> mMicState = new MediatorLiveData<>();
    private final MediatorLiveData<Boolean> mCamState = new MediatorLiveData<>();

    private final MutableLiveData<Boolean> mAppBackground = new MutableLiveData<>(Boolean.FALSE);
    private final MutableLiveData<WeakReference<Activity>> mActivityRef = new MutableLiveData<>();
    private final MutableLiveData<Boolean> mCanSwitchAudioRoute = new MutableLiveData<>(Boolean.TRUE);

    public RtcDataProviderImpl() {
        combineWith(mMicState, mMicPermission, mPreferOpenMic);
        combineWith(mCamState, mCamPermission, mPreferOpenCam);
    }

    @Override
    public LiveData<ConnectionState> getNetworkConnectionState() {
        return mNetworkConnectionState;
    }

    @Override
    public LiveData<Boolean> rtmLoggedState() {
        return mRtmLoggedState;
    }

    public LiveData<Boolean> getMicPermission() {
        return mMicPermission;
    }

    public LiveData<Boolean> getCamPermission() {
        return mCamPermission;
    }

    @Override
    public LiveData<Boolean> micState() {
        return mMicState;
    }

    @Override
    public LiveData<Boolean> camState() {
        return mCamState;
    }

    @Override
    public LiveData<Boolean> facingFront() {
        return mFacingFront;
    }

    @Override
    public LiveData<Boolean> speakerPhone() {
        return mSpeakerPhone;
    }

    @Override
    public LiveData<Boolean> screenAudio() {
        return mScreenAudio;
    }

    @Override
    public LiveData<IUIRtcDef.KickOutReason> getRtmKickOutReason() {
        return mRtmKickOutReason;
    }

    @Override
    public LiveData<Boolean> appBackground() {
        return mAppBackground;
    }

    @Override
    public Activity currentActivity() {
        WeakReference<Activity> activityRef = mActivityRef.getValue();
        if (activityRef == null) {
            return null;
        }
        return activityRef.get();
    }

    public void setNetworkConnectionState(ConnectionState connectionState) {
        mNetworkConnectionState.postValue(connectionState);
    }

    public void setRtmLoggedState(boolean logged) {
        mRtmLoggedState.postValue(logged);
    }

    // workaround cause no on error code for duplicated login
    public void enableRtmLoggedStateMonitor(boolean enable) {
        if (enable) {
            mRtmLoggedState.setValue(true);
            mRtmKickOutReason.addSource(mRtmLoggedState, login -> {
                if (!login) {
                    mRtmKickOutReason.setValue(IUIRtcDef.KickOutReason.LOGIN_IN_OTHER_DEVICE);
                }
            });
        } else {
            mRtmKickOutReason.removeSource(mRtmLoggedState);
            mRtmLoggedState.setValue(false);
        }
    }

    public void setPreferOpenMic(boolean open) {
        mPreferOpenMic.postValue(open);
    }

    public void setPreferOpenCam(boolean open) {
        mPreferOpenCam.postValue(open);
    }

    public void setFacingFront(boolean facingFront) {
        mFacingFront.postValue(facingFront);
    }

    public void setSpeakerPhone(boolean speakerPhone) {
        mSpeakerPhone.postValue(speakerPhone);
    }

    public void setScreenAudio(boolean screenAudio) {
        mScreenAudio.postValue(screenAudio);
    }

    public void setMicPermission(boolean granted) {
        mMicPermission.setValue(granted);
    }

    public void setCamPermission(boolean granted) {
        mCamPermission.setValue(granted);
    }

    public void setAppBackground(boolean background) {
        mAppBackground.setValue(background);
    }

    public void setActivity(Activity activity) {
        mActivityRef.setValue(new WeakReference<>(activity));
    }

    static void combineWith(@NonNull MediatorLiveData<Boolean> d, @NonNull LiveData<Boolean> s1, @NonNull LiveData<Boolean> s2) {
        d.addSource(s1, value -> {
            boolean newValue = value && Boolean.TRUE.equals(s2.getValue());
            if (!Objects.equals(newValue, d.getValue())) {
                d.setValue(newValue);
            }
        });

        d.addSource(s2, value -> {
            boolean newValue = value && Boolean.TRUE.equals(s1.getValue());
            if (!Objects.equals(newValue, d.getValue())) {
                d.setValue(newValue);
            }
        });
    }

    @Override
    public LiveData<Boolean> canSwitchAudioRoute() {
        return mCanSwitchAudioRoute;
    }

    public void setCanSwitchAudioRoute(boolean canSwitchAudioRoute) {
        boolean oldValue = Boolean.TRUE.equals(mCanSwitchAudioRoute.getValue());
        if (oldValue == canSwitchAudioRoute) {
            return;
        }
        mCanSwitchAudioRoute.postValue(canSwitchAudioRoute);
    }

}
