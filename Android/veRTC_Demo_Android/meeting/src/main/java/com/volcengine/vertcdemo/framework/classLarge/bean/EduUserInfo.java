package com.volcengine.vertcdemo.framework.classLarge.bean;

import androidx.annotation.NonNull;

import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.bean.BooleanTypeAdapter;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;

import java.io.Serializable;
import java.util.Objects;

public class EduUserInfo implements RTMBizInform, Serializable, Cloneable {

    public static final int SHARE_TYPE_SCREEN = 0;
    public static final int SHARE_TYPE_WHITEBOARD = 1;

    @SerializedName("room_id")
    public String roomId; // room id
    @SerializedName("user_id")
    public String userId; // user's id
    @SerializedName("user_name")
    public String userName; // user's name
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("user_role")
    public boolean isHost; // whether user is host
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("mic")
    public boolean isMicOn; // whether local microphone is on.
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
    @SerializedName("linkmic_time")
    public int linkMicTime;
    @JsonAdapter(BooleanTypeAdapter.class)
    @SerializedName("pull_wb_stream_type")
    public boolean isPullWhiteBoardStream;

    public boolean isMe;
    public boolean isSpeaking;
    public boolean isFakeUser;

    @Override
    public String toString() {
        return "EduUserInfo{" +
                "roomId='" + roomId + '\'' +
                ", userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", isHost=" + isHost +
                ", isMicOn=" + isMicOn +
                ", isCameraOn=" + isCameraOn +
                ", hasSharePermission=" + hasSharePermission +
                ", isShareOn=" + isShareOn +
                ", shareType=" + shareType +
                ", joinTime=" + joinTime +
                ", linkmicTime=" + linkMicTime +
                ", isPullWbStream=" + isPullWhiteBoardStream +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EduUserInfo info = (EduUserInfo) o;
        return Objects.equals(userId, info.userId);
    }

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
    public int hashCode() {
        return Objects.hash(roomId, userId);
    }
}
