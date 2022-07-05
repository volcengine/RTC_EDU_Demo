package com.volcengine.vertcdemo.edudemo.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;

import java.net.URLDecoder;

public class EduRoomInfo implements RTMBizInform {
    @SerializedName("room_id")
    public String roomId;
    @SerializedName("room_name")
    public String roomName;
    @SerializedName("app_id")
    public String appId;
    @SerializedName("status")
    public int status;
    @SerializedName("room_type")
    public int roomType;
    @SerializedName("is_recording")
    public boolean isRecording;
    @SerializedName("now")
    public long now;
    @SerializedName("begin_class_time_real")
    public long beginClassTimeReal;
    @SerializedName("enable_interactive")
    public boolean enableInteractive;
    @SerializedName("enable_group_speech")
    public boolean enableGroupSpeech;
    @SerializedName("teacher_name")
    public String teacherName;
    @SerializedName("token")
    public String token;

    public String getDecodedRoomName() {
        try {
            return URLDecoder.decode(roomName, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
            return roomName;
        }
    }

    @Override
    public String toString() {
        return "EduRoomInfo{" +
                "roomId='" + roomId + '\'' +
                ", roomName='" + roomName + '\'' +
                ", appId='" + appId + '\'' +
                ", status=" + status +
                ", roomType=" + roomType +
                ", isRecording=" + isRecording +
                ", now=" + now +
                ", beginClassTimeReal=" + beginClassTimeReal +
                ", enableInteractive=" + enableInteractive +
                ", enableGroupSpeech=" + enableGroupSpeech +
                ", teacherName='" + teacherName + '\'' +
                '}';
    }
}
