package com.volcengine.vertcdemo.framework.classLarge;

import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.WhiteBoardService;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduRoomTokenInfo;

import java.util.Set;

public interface UIEduRoom {

    UIRtcCore getUIRtcCore();

    IUIEduDef.IEduDataProvider getDataProvider();

    WhiteBoardService getWhiteBoardService();

    void dispose();

    void joinRoom(String userName, boolean isHost, IRequestCallback<EduRoomTokenInfo> callback);

    void openMic(boolean open);

    void openCam(boolean open);

    void subscribeVideoStream(@NonNull Set<String> userIds);

    void subscribeWhiteBoardStream();

    void unsubscribeWhiteBoardStream();

    void linkMicApply();
    void linkMicApplyCancel();

    void linkMicLeave();

    void leaveRoom();
}
