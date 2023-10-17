package com.volcengine.vertcdemo.framework.meeting.bean;

import androidx.annotation.NonNull;

import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.bean.BooleanTypeAdapter;

import java.io.Serializable;

public class MeetingRoomInfo implements Serializable {
    @SerializedName("app_id")
    public String appId;
    @SerializedName("room_id")
    public String roomId; // meeting's id
    @SerializedName("room_name")
    public String roomName; // meeting's name
    @SerializedName("host_user_id")
    public String hostUserId; // host's id
    @SerializedName("host_user_name")
    public String hostUserName; // host's name
    @SerializedName("room_mic_status")
    @JsonAdapter(BooleanTypeAdapter.class)
    public boolean roomMicStatus;  // false, all audio muted
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("operate_self_mic_permission")
    public boolean operateSelfMicPermission; // false, permission reverted
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("share_status")
    public boolean shareStatus; // 1, sharing, 0 otherwise
    @SerializedName("share_type")
    public int shareType; // 0, screen, 1 whiteboard
    @SerializedName("share_user_id")
    public String shareUserId; // user's id who is sharing
    @SerializedName("share_user_name")
    public String shareUserName; // user's name who is sharing
    @SerializedName("start_time")
    public long startTime; // in ms
    @SerializedName("base_time")
    public long baseTime; // in ms
    @SerializedName("experience_time_limit")
    public long experienceTimeLimit; // in s
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("record_status")
    public boolean recordStatus; // whether meeting is recording

    public void copy(@NonNull MeetingRoomInfo info) {
        appId = info.appId;
        roomId = info.roomId;
        roomName = info.roomName;
        hostUserId = info.hostUserId;
        hostUserName = info.hostUserName;
        roomMicStatus = info.roomMicStatus;
        operateSelfMicPermission = info.operateSelfMicPermission;
        shareStatus = info.shareStatus;
        shareType = info.shareType;
        shareUserId = info.shareUserId;
        shareUserName = info.shareUserName;
        startTime = info.startTime;
        recordStatus = info.recordStatus;
    }

    @Override
    public String toString() {
        return "MeetingRoomInfo{" +
                "appId='" + appId + '\'' +
                ", roomId='" + roomId + '\'' +
                ", roomName='" + roomName + '\'' +
                ", hostUserId='" + hostUserId + '\'' +
                ", hostUserName='" + hostUserName + '\'' +
                ", roomMicStatus='" + roomMicStatus + '\'' +
                ", operateSelfMicPermission=" + operateSelfMicPermission +
                ", shareStatus=" + shareStatus +
                ", shareType=" + shareType +
                ", shareUserId=" + shareUserId +
                ", shareUserName=" + shareUserName +
                ", startTime=" + startTime +
                ", recordStatus=" + recordStatus +
                "}";
    }
}