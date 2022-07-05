package com.volcengine.vertcdemo.edudemo.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;

public class EduUserInfo implements RTMBizInform {

    @SerializedName("room_id")
    public String roomId;
    @SerializedName("user_id")
    public String userId;
    @SerializedName("user_name")
    public String userName;
    @SerializedName("is_camera_on")
    public boolean isCameraOn;
    @SerializedName("is_mic_on")
    public boolean isMicOn;

    @Override
    public String toString() {
        return "EduUserInfo{" +
                "roomId='" + roomId + '\'' +
                ", userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", isCameraOn=" + isCameraOn +
                ", isMicOn=" + isMicOn +
                '}';
    }
}
