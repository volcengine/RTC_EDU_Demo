package com.volcengine.vertcdemo.edudemo.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;

public class EduRecordInfo implements RTMBizInform {

    @SerializedName("room_name")
    public String roomName;
    @SerializedName("video_url")
    public String videoUrl;
    // 时间单位是ns
    @SerializedName("record_begin_time")
    public long recordBeginTime;
    @SerializedName("record_end_time")
    public long recordEndTime;

    @Override
    public String toString() {
        return "EduRecordInfo{" +
                "roomName='" + roomName + '\'' +
                ", videoUrl='" + videoUrl + '\'' +
                ", recordBeginTime=" + recordBeginTime +
                ", recordEndTime=" + recordEndTime +
                '}';
    }
}
