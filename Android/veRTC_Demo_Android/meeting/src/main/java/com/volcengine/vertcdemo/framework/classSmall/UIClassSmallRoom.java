package com.volcengine.vertcdemo.framework.classSmall;

import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;

public interface UIClassSmallRoom extends UIMeetingRoom {

    void joinRoom(String userName, boolean isHost, IRequestCallback<MeetingTokenInfo> callback);
}
