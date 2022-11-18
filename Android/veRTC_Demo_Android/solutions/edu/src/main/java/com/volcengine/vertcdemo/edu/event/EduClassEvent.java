package com.volcengine.vertcdemo.edu.event;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rts.RTSBizInform;

public class EduClassEvent implements RTSBizInform {
    public boolean isStart;
    @SerializedName("room_id")
    public String classId;

    public EduClassEvent(boolean isStart, String classId) {
        this.isStart = isStart;
        this.classId = classId;
    }
}
