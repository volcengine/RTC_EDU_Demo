package com.volcengine.vertcdemo.framework.meeting;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.core.IUIRtcDef;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.WhiteBoardService;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;

import java.util.Set;

public interface UIMeetingRoom {

    UIRtcCore getUIRtcCore();

    default IUIRtcDef.IRtcDataProvider getRtcDataProvider() {
        return getUIRtcCore().getRtcDataProvider();
    }

    IUIMeetingDef.IMeetingDataProvider getDataProvider();

    IUIMeetingDef.IRoleDesc getRoleDesc();

    WhiteBoardService getWhiteBoardService();

    void dispose();

    void openMic(@NonNull Activity activity, boolean open);

    void openCam(@NonNull Activity activity, boolean open);

    void clickShare(@NonNull Activity activity);

    void clickRecord(@NonNull Activity activity);

    void subscribeVideoStream(@NonNull Set<String> userIds);

    void showOpenMicApplyDialog(Context context, String userId, String userName);

    void showShareApplyDialog(Context context, String userId, String userName);

    void startScreenSharing(@NonNull Activity activity);

    void onScreenSharingIntent(@NonNull Activity activity, @DrawableRes int largeIcon, @DrawableRes int smallIcon, Intent data);

    void joinRoom(String userName, IRequestCallback<MeetingTokenInfo> callback);

    void applyRecord();

    void startRecord();

    void stopRecord();

    void enableAllRemoteUserMic(boolean enable, boolean micPermit, @NonNull IRequestCallback<RTMBizResponse> callback);

    void enableRemoteUserMic(String userId, boolean enable, IRequestCallback<RTMBizResponse> callback);

    void enableRemoteUserCam(String userId, boolean enable, IRequestCallback<RTMBizResponse> callback);

    void changeRemoteUserSharePermit(String userId, boolean permit);

    void leaveRoom(boolean release);

    void stopScreenSharing();

    void publishScreenAudio();

    void unPublishScreenAudio();

    void startWhiteBoardSharing();

    void stopWhiteBoardSharing();
}
