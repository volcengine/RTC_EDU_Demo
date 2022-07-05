package com.volcengine.vertcdemo.edudemo.core.eventbus;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;

public class EduClassEvent implements RTMBizInform {
    public boolean isStart;
    @SerializedName("room_id")
    public String classId;

    public EduClassEvent(boolean isStart, String classId) {
        this.isStart = isStart;
        this.classId = classId;
    }
}
