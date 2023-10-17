package com.volcengine.vertcdemo.core;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ss.video.rtc.demo.basic_module.utils.SPUtils;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.core.eventbus.TokenExpiredEvent;

import java.util.UUID;

public class SolutionDataManager {

    private static final class SInstanceHolder {
        static final SolutionDataManager sInstance = new SolutionDataManager();
    }

    public static SolutionDataManager ins() {
        return SInstanceHolder.sInstance;
    }

    @NonNull
    private String token;
    @NonNull
    private String userId;
    @NonNull
    private String userName;
    @NonNull
    private String deviceId;
    private String mXTTToken;
    private String mSdkVersion;

    public SolutionDataManager() {
        token = SPUtils.getString(SolutionConstants.SP_KEY_TOKEN, "");
        userId = SPUtils.getString(SolutionConstants.SP_KEY_USER_ID, "");
        userName = SPUtils.getString(SolutionConstants.SP_KEY_USER_NAME, "");
        deviceId = SPUtils.getString(SolutionConstants.SP_KEY_DEVICE_ID, "");
        if (TextUtils.isEmpty(deviceId)) {
            String uuid = UUID.randomUUID().toString();
            deviceId = HashUtil.encrypt(uuid);
            if (deviceId.length() > 16) {
                deviceId = deviceId.substring(0, 16);
            }
            SPUtils.putString(SolutionConstants.SP_KEY_DEVICE_ID, deviceId);
        }
    }

    public void store(@NonNull String token, @NonNull String userId, @NonNull String userName) {
        setToken(token);
        setUserId(userId);
        setUserName(userName);
    }

    public void setToken(@NonNull String token) {
        this.token = token;
        SPUtils.putString(SolutionConstants.SP_KEY_TOKEN, token);
    }

    public void setUserId(@NonNull String userId) {
        this.userId = userId;
        SPUtils.putString(SolutionConstants.SP_KEY_USER_ID, userId);
    }

    public void setUserName(@NonNull String userName) {
        this.userName = userName;
        SPUtils.putString(SolutionConstants.SP_KEY_USER_NAME, userName);
    }

    @NonNull
    public String getToken() {
        return token;
    }

    @NonNull
    public String getUserId() {
        return userId;
    }

    @NonNull
    public String getUserName() {
        return userName;
    }

    @NonNull
    public String getDeviceId() {
        return deviceId;
    }

    public void clear() {
        store("", "", "");
    }

    public void setXTTToken(@NonNull String XTTToken) {
        this.mXTTToken = XTTToken;
    }

    public String getXTTToken() {
        return mXTTToken;
    }

    public String getSdkVersion() {
        return mSdkVersion;
    }

    public void setSdkVersion(String SdkVersion) {
        this.mSdkVersion = SdkVersion;
    }

    public void logout() {
        setUserId("");
        setUserName("");
        setToken("");
        SolutionDemoEventManager.post(new TokenExpiredEvent());
    }

}
