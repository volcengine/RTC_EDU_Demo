package com.volcengine.vertcdemo.framework.meeting.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;

import java.util.List;

public class MeetingTokenInfo implements RTMBizResponse {

    @SerializedName("token")
    public String rtcToken;
    @SerializedName("room")
    public MeetingRoomInfo roomInfo;
    @SerializedName("user")
    public MeetingUserInfo user;
    @SerializedName("user_list")
    public List<MeetingUserInfo> usersList;
    @SerializedName("wb_token")
    public String wbToken;
    @SerializedName("wb_room_id")
    public String wbRoomId;
    @SerializedName("wb_user_id")
    public String wbUserId;
    @SerializedName("nts")
    public long nts;

    @Override
    public String toString() {
        return "MeetingTokenInfo{" +
                "token='" + rtcToken + '\'' +
                ", wbToken='" + wbToken + '\'' +
                ", roomInfo=" + roomInfo +
                ", user=" + user +
                ", usersList=" + usersList +
                '}';
    }
}
