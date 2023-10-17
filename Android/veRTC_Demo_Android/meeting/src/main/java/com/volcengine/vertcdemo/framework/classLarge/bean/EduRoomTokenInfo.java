package com.volcengine.vertcdemo.framework.classLarge.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;

import java.util.List;

public class EduRoomTokenInfo implements RTMBizResponse {

    @SerializedName("room")
    public EduRoomInfo roomInfo;
    @SerializedName("user")
    public EduUserInfo user;
    @SerializedName("teacher")
    public EduUserInfo teacher;
    @SerializedName("user_list")
    public List<EduUserInfo> usersList;
    @SerializedName("linkmic_user_list")
    public List<EduUserInfo> linkMicUsersList;
    @SerializedName("token")
    public String rtcToken;
    @SerializedName("wb_token")
    public String wbToken;
    @SerializedName("wb_room_id")
    public String wbRoomId;
    @SerializedName("wb_user_id")
    public String wbUserId;
    @SerializedName("wb_stream_user_id")
    public String wbStreamUserId;
    @SerializedName("nts")
    public long nts;

    @Override
    public String toString() {
        return "EduRoomTokenInfo{" +
                "roomInfo=" + roomInfo +
                ", user=" + user +
                ", usersList=" + usersList +
                ", linkMicUsersList=" + linkMicUsersList +
                ", rtcToken='" + rtcToken + '\'' +
                ", wbToken='" + wbToken + '\'' +
                ", wbRoomId='" + wbRoomId + '\'' +
                ", wbUserId='" + wbUserId + '\'' +
                ", nts=" + nts +
                '}';
    }
}
