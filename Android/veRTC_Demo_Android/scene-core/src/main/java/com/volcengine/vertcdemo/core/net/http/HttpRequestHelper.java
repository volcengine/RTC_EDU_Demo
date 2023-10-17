package com.volcengine.vertcdemo.core.net.http;

import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.AnyThread;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.WorkerThread;

import com.google.gson.JsonSyntaxException;
import com.ss.video.rtc.demo.basic_module.utils.AppExecutors;
import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.core.BuildConfig;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.ServerResponse;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class HttpRequestHelper {
    private static final String TAG = "HttpRequestHelper";
    private static final OkHttpClient DEFAULT_OKHTTP_CLIENT = new OkHttpClient();

    @WorkerThread
    public static <T> void sendPost(@NonNull String url,
                                    JSONObject params,
                                    @Nullable Class<T> resultClass,
                                    @NonNull IRequestCallback<ServerResponse<T>> callBack) {
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), params.toString());
        Request.Builder requestBuilder = new Request.Builder()
                .url(url)
                .post(body);
        String XTTToken = SolutionDataManager.ins().getXTTToken();
        if (!TextUtils.isEmpty(XTTToken)) {
            requestBuilder.addHeader("x-tt-token", XTTToken);
        }
        String tokenSdkVer = SolutionDataManager.ins().getSdkVersion();
        if (!TextUtils.isEmpty(tokenSdkVer)) {
            requestBuilder.addHeader("sdk-version", tokenSdkVer);
        }
        Call call = DEFAULT_OKHTTP_CLIENT.newCall(requestBuilder.build());

        try {
            final Response response = call.execute();
            Log.d(TAG, "Request: " + params);
            if (!response.isSuccessful()) {
                throw new IOException("http code = " + response.code());
            }

            final ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new IOException("ResponseBody is null");
            }

            JSONObject json = new JSONObject(responseBody.string());
            Log.d(TAG, "Response: " + json);

            final int code = json.optInt("code");
            final String message = json.optString("message");

            if (code != 200) {
                throw new NetworkException(code, message);
            }

            final long timestamp = json.optLong("timestamp");
            Object responseObject = json.opt("response");

            T data;
            if (responseObject == null
                    || resultClass == null
                    || resultClass == Void.class) {
                data = null;
            } else {
                data = GsonUtils.gson().fromJson(responseObject.toString(), resultClass);
            }

            final ServerResponse<T> sr = ServerResponse.create(code, message, data, timestamp);
            AppExecutors.mainThread().execute(() -> callBack.onSuccess(sr));
        } catch (NetworkException e) {
            Log.d(TAG, "post fail url:" + url, e);
            AppExecutors.mainThread().execute(() -> callBack.onError(e.code, e.getMessage()));
        } catch (IOException | JsonSyntaxException | JSONException e) {
            Log.d(TAG, "post fail url:" + url, e);
            AppExecutors.mainThread().execute(() -> callBack.onError(NetworkException.CODE_ERROR, e.getMessage()));
        }
    }
}
