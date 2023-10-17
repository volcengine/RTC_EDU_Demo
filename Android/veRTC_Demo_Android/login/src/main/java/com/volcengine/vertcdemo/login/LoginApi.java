// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.login;

import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.ss.video.rtc.demo.basic_module.utils.AppExecutors;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.ServerResponse;
import com.volcengine.vertcdemo.core.net.http.HttpRequestHelper;
import com.volcengine.vertcdemo.entity.LoginInfo;
import com.volcengine.vertcdemo.utils.Constants;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;

import org.json.JSONObject;

public class LoginApi {
    private static final String TAG = "LoginApi";

    private static final String LOGIN_URL = BuildConfig.LOGIN_URL;

    public static void passwordFreeLogin(String userName, IRequestCallback<ServerResponse<LoginInfo>> callBack) {
        try {
            JSONObject content = new JSONObject();
            content.put("user_name", userName);

            JSONObject params = new JSONObject();
            params.put("event_name", "passwordFreeLogin");
            params.put("content", content.toString());
            params.put("device_id", SolutionDataManager.ins().getDeviceId());

            sendPost(params, LoginInfo.class, callBack);
        } catch (Exception e) {
            Log.d(TAG, "verifyLoginSms failed:", e);
            callBack.onError(-1, "Content Error");
        }
    }

    public static void changeUserName(String userName, IRequestCallback<ServerResponse<Void>> callBack) {
        try {
            JSONObject content = new JSONObject();
            content.put("user_name", userName);
            content.put("login_token", SolutionDataManager.ins().getToken());

            JSONObject params = new JSONObject();
            params.put("event_name", "changeUserName");
            params.put("content", content.toString());
            params.put("device_id", SolutionDataManager.ins().getDeviceId());

            sendPost(params, Void.class, callBack);
        } catch (Exception e) {
            Log.d(TAG, "changeUserName failed:", e);
            callBack.onError(-1, "Content Error");
        }
    }

    public static void getRTMAuthentication(String loginToken, String roomType,
                                            IRequestCallback<ServerResponse<RtmInfo>> callBack) {
        JSONObject content = new JSONObject();
        try {
            content.put("login_token", loginToken);
            content.put("scenes_name", roomType);
            String message = null;
            if (TextUtils.isEmpty(Constants.APP_ID)) {
                message = "APPID";
            } else {
                content.put("app_id", Constants.APP_ID);
            }
            if (TextUtils.isEmpty(Constants.APP_KEY)) {
                message = "APPKey";
            } else {
                content.put("app_key", Constants.APP_KEY);
            }
            if (TextUtils.isEmpty(Constants.VOLC_AK)) {
                message = "AccessKeyID";
            } else {
                content.put("volc_ak", Constants.VOLC_AK);
            }
            if (TextUtils.isEmpty(Constants.VOLC_SK)) {
                message = "SecretAccessKey";
            } else {
                content.put("volc_sk", Constants.VOLC_SK);
            }
            if (!TextUtils.isEmpty(message)) {
                if (callBack != null) {
                    callBack.onError(-1, String.format("%s is empty", message));
                }
                return;
            }
        } catch (Exception e) {
            //ignore
        }
        try {
            JSONObject params = new JSONObject();
            params.put("event_name", "setAppInfo");
            params.put("content", content.toString());
            params.put("device_id", SolutionDataManager.ins().getDeviceId());

            Log.d(TAG, "setAppInfo params: " + params);
            sendPost(params, RtmInfo.class, callBack);
        } catch (Exception e) {
            Log.d(TAG, "setAppInfo failed", e);
            callBack.onError(-1, e.getMessage());
        }
    }

    private static <T> void sendPost(JSONObject params, Class<T> resultClass,
                                     @NonNull IRequestCallback<ServerResponse<T>> callBack) {
        AppExecutors.networkIO().execute(() -> HttpRequestHelper.sendPost(LOGIN_URL, params, resultClass, callBack));
    }
}
