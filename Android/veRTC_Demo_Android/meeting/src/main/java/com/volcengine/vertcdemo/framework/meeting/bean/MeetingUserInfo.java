package com.volcengine.vertcdemo.framework.meeting.bean;

import androidx.annotation.NonNull;

import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.bean.BooleanTypeAdapter;

import java.io.Serializable;
import java.util.Objects;

public class MeetingUserInfo implements Serializable {

    public static final int SHARE_TYPE_SCREEN = 0;
    public static final int SHARE_TYPE_WHITEBOARD = 1;

    @SerializedName("room_id")
    public String roomId; // meeting's id
    @SerializedName("user_id")
    public String userId; // user's id
    @SerializedName("user_name")
    public String userName; // user's name
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("user_role")
    public boolean isHost; // whether user is host
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("operate_mic_permission")
    public boolean hasMicPermission; // whether have mic operation permission
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("mic")
    public boolean isMicOn; // whether local microphone is on.
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("operate_camera_permission")
    public boolean hasCamPermission; // whether have camera operation permission.
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("camera")
    public boolean isCameraOn; // whether local camera is on.
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("share_permission")
    public boolean hasSharePermission;// whether have share permission.
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("share_status")
    public boolean isShareOn; // whether sharing. either screen or whiteboard.
    @SerializedName("share_type")
    public int shareType; // shared content type
    @SerializedName("join_time")
    public long joinTime; // join time in MS
    @SerializedName("volume")
    public int volume; // volume value

    public boolean isMe;
    public boolean applyMicPermission;
    public boolean applySharePermission;
    public long latestActiveSpeakerMs;
    public boolean isSpeaking;

    @Override
    public String toString() {
        return "MeetingUserInfo{" +
                "roomId='" + roomId + '\'' +
                ", userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", userRole=" + isHost +
                ", cameraOn=" + isCameraOn +
                ", hasCamPermission=" + hasCamPermission +
                ", micOn=" + isMicOn +
                ", hasMicPermission=" + hasMicPermission +
                ", shareOn=" + isShareOn +
                ", shareType=" + shareType +
                ", hasSharePermission=" + hasSharePermission +
                ", joinTime=" + joinTime +
                ", volume=" + volume +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MeetingUserInfo info = (MeetingUserInfo) o;
        return Objects.equals(userId, info.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    public void copy(@NonNull MeetingUserInfo user) {
        this.roomId = user.roomId;
        this.userId = user.userId;
        this.userName = user.userName;
        this.isHost = user.isHost;
        this.hasMicPermission = user.hasMicPermission;
        this.isMicOn = user.isMicOn;
        this.hasCamPermission = user.hasCamPermission;
        this.isCameraOn = user.isCameraOn;
        this.hasSharePermission = user.hasSharePermission;
        this.isShareOn = user.isShareOn;
        this.shareType = user.shareType;
        this.joinTime = user.joinTime;
        this.volume = user.volume;
    }

    public MeetingUserInfo deepCopy() {
        MeetingUserInfo info = new MeetingUserInfo();
        info.roomId = roomId;
        info.userId = userId;
        info.userName = userName;
        info.isHost = isHost;
        info.hasMicPermission = hasMicPermission;
        info.isMicOn = isMicOn;
        info.hasCamPermission = hasCamPermission;
        info.isCameraOn = isCameraOn;
        info.hasSharePermission = hasSharePermission;
        info.isShareOn = isShareOn;
        info.shareType = shareType;
        info.joinTime = joinTime;
        info.volume = volume;
        return info;
    }
}
