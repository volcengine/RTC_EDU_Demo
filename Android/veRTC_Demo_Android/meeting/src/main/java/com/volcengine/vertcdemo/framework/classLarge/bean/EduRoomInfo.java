package com.volcengine.vertcdemo.framework.classLarge.bean;

import androidx.annotation.NonNull;

import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.bean.BooleanTypeAdapter;

import java.io.Serializable;

public class EduRoomInfo implements Serializable, Cloneable {
    @SerializedName("app_id")
    public String appId;
    @SerializedName("room_id")
    public String roomId; // room id
    @SerializedName("room_name")
    public String roomName; // room name
    @SerializedName("host_user_id")
    public String hostUserId; // host's id
    @SerializedName("host_user_name")
    public String hostUserName; // host's name
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
    public boolean recordStatus; // whether is recording
    @SerializedName("record_start_time")
    public long recordStartTime; // in ms

    @NonNull
    @Override
    public Object clone() {
        try {
            return super.clone();
        } catch (CloneNotSupportedException e) {
            throw new UnknownError("impossible error");
        }
    }

    @Override
    public String toString() {
        return "EduRoomInfo{" +
                "appId='" + appId + '\'' +
                ", roomId='" + roomId + '\'' +
                ", roomName='" + roomName + '\'' +
                ", hostUserId='" + hostUserId + '\'' +
                ", hostUserName='" + hostUserName + '\'' +
                ", shareStatus=" + shareStatus +
                ", shareType=" + shareType +
                ", shareUserId='" + shareUserId + '\'' +
                ", shareUserName='" + shareUserName + '\'' +
                ", startTime=" + startTime +
                ", baseTime=" + baseTime +
                ", experienceTimeLimit=" + experienceTimeLimit +
                ", recordStatus=" + recordStatus +
                ", recordStartTime=" + recordStartTime +
                '}';
    }
}