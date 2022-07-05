package com.volcengine.vertcdemo.edudemo.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;

import java.util.List;

public class JoinClassResult implements RTMBizInform, RTMBizResponse {
    @SerializedName("token")
    public String token;
    @SerializedName("is_mic_on")
    public boolean isMicOn;
    @SerializedName("room_info")
    public EduRoomInfo roomInfo;
    @SerializedName("teacher_info")
    public EduUserInfo teacherInfo;
    @SerializedName("current_mic_user")
    public List<EduUserInfo> currentMicUser;
    @SerializedName("room_idx")
    public int roomIdx;
    @SerializedName("group_token")
    public String groupToken;
    @SerializedName("group_room_id")
    public String groupRoomId;
    @SerializedName("group_user_list")
    public List<EduUserInfo> groupUserList;
    public int errorCode = 200;

    @Override
    public String toString() {
        return "JoinClassResult{" +
                "token='" + token + '\'' +
                ", isMicOn=" + isMicOn +
                ", roomInfo=" + roomInfo +
                ", teacherInfo=" + teacherInfo +
                ", currentMicUser=" + currentMicUser +
                ", roomIdx=" + roomIdx +
                ", groupToken='" + groupToken + '\'' +
                ", groupRoomId='" + groupRoomId + '\'' +
                ", groupUserList=" + groupUserList +
                ", errorCode=" + errorCode +
                '}';
    }
}
