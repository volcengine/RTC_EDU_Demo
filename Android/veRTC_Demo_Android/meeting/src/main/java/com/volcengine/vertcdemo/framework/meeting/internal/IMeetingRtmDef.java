package com.volcengine.vertcdemo.framework.meeting.internal;

import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.bean.BooleanTypeAdapter;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;

public interface IMeetingRtmDef {

    String CMD_JOIN_ROOM = "vcJoinRoom";
    String CMD_LEAVE_ROOM = "vcLeaveRoom";
    String CMD_RELEASE_ROOM = "vcFinishRoom";
    String CMD_RE_SYNC = "vcResync";
    String CMD_GET_USER_LIST = "vcGetUserList";
    String CMD_ENABLE_LOCAL_MIC = "vcOperateSelfMic";
    String CMD_ENABLE_LOCAL_CAME = "vcOperateSelfCamera";
    String CMD_START_SHARE = "vcStartShare";
    String CMD_END_SHARE = "vcFinishShare";
    String CMD_ENABLE_REMOTE_USER_MIC = "vcOperateOtherMic";
    String CMD_ENABLE_REMOTE_USER_CAM = "vcOperateOtherCamera";
    String CMD_ENABLE_ALL_MIC = "vcOperateAllMic";
    String CMD_CHANGE_REMOTE_USER_SHARE_PERMIT = "vcOperateOtherSharePermission";
    String CMD_APPLY_CHANGE_MIC = "vcOperateSelfMicApply";
    String CMD_PERMIT_CHANGE_MIC = "vcOperateSelfMicPermit";
    String CMD_APPLY_SHARE = "vcSharePermissionApply";
    String CMD_PERMIT_SHARE = "vcSharePermissionPermit";
    String CMD_START_RECORD = "vcStartRecord";
    String CMD_STOP_RECORD = "vcStopRecord";
    String CMD_APPLY_RECORD = "vcStartRecordApply";
    String CMD_START_RECORD_PERMIT = "vcStartRecordPermit";

    String ON_REMOTE_USER_JOIN_ROOM = "vcOnJoinRoom";
    String ON_REMOTE_USER_LEAVE_ROOM = "vcOnLeaveRoom";
    String ON_ROOM_RELEASED = "vcOnFinishRoom";
    String ON_REMOTE_USER_ENABLE_MIC = "vcOnOperateSelfMic";
    String ON_REMOTE_USER_ENABLE_CAM = "vcOnOperateSelfCamera";
    String ON_START_SHARE = "vcOnStartShare";
    String ON_STOP_SHARE = "vcOnFinishShare";
    String ON_ENABLE_MIC_BY_HOST = "vcOnOperateOtherMic";
    String ON_ENABLE_CAM_BY_HOST = "vcOnOperateOtherCamera";
    String ON_ENABLE_ALL_MIC_BY_HOST = "vcOnOperateAllMic";
    String ON_CHANGE_SHARE_PERMIT_BY_HOST = "vcOnOperateOtherSharePermission";
    String ON_APPLY_CHANGE_MIC = "vcOnOperateSelfMicApply";
    String ON_PERMIT_CHANGE_MIC = "vcOnOperateSelfMicPermit";
    String ON_APPLY_SHARE = "vcOnSharePermissionApply";
    String ON_PERMIT_SHARE = "vcOnSharePermissionPermit";
    String ON_START_RECORD = "vcOnStartRecord";
    String ON_STOP_RECORD = "vcOnStopRecord";
    String ON_APPLY_RECORD = "vcOnStartRecordApply";
    String ON_START_RECORD_PERMIT = "vcOnStartRecordPermit";
    String ON_HOST_CHANGE = "vcOnHostChange";

    class Request {
        @SerializedName("app_id")
        public String appId;

        @SerializedName("room_id")
        public String roomId;

        @SerializedName("login_token")
        public String loginToken;

        @SerializedName("user_id")
        public String userId;

        @SerializedName("event_name")
        public String eventName;

        @SerializedName("content")
        public String content;

        @SerializedName("request_id")
        public String requestId;

        @SerializedName("device_id")
        public String deviceId;
    }

    class JoinClassRoomReq {
        @SerializedName("user_name")
        public String userName;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("user_role")
        public boolean isHost;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("mic")
        public boolean openMic;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("camera")
        public boolean openCam;
    }

    class JoinMeetingRoomReq {
        @SerializedName("user_name")
        public String userName;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("mic")
        public boolean openMic;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("camera")
        public boolean openCam;
    }

    class SyncDeviceStatusReq {
        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;
    }

    class ApplyOperateDeviceReq {
        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;
    }

    class PermitReq {
        @SerializedName("apply_user_id")
        public String applyUserId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("permit")
        public boolean permit;
    }

    class ShareReq {
        @SerializedName("share_type")
        public int shareType;
    }

    class ChangeAllMicReq {
        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate_self_mic_permission")
        public boolean micPermit;
    }

    class ChangeDeviceStatusReq {
        @SerializedName("operate_user_id")
        public String remoteUserId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;
    }

    class ChangePermitReq {
        @SerializedName("operate_user_id")
        public String remoteUserId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean permit;
    }

    class Notify implements RTMBizInform {
    }

    class SyncDeviceStatusNotify extends Notify {
        @SerializedName("user_id")
        public String userId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;
    }

    class UserNotify extends Notify {
        @SerializedName("user")
        public MeetingUserInfo user;
        @SerializedName("user_count")
        public int userCount;
    }

    class ShareNotify extends Notify {
        @SerializedName("room_id")
        public String roomId;

        @SerializedName("user_id")
        public String userId;

        @SerializedName("user_name")
        public String userName;

        @SerializedName("share_type")
        public int shareType;
    }

    class RecordStoppedNotify extends Notify {
        @SerializedName("reason")
        public int reason;
    }

    class RoomReleasedNotify extends Notify {
        @SerializedName("reason")
        public int reason;
    }

    class AllMicMutedNotify extends Notify {
        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate_self_mic_permission")
        public boolean micPermit;
    }

    class DeviceMutedNotify extends Notify {
        @SerializedName("operate_user_id")
        public String hostUserId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;
    }

    class SharePermitChangedNotify extends Notify {
        @SerializedName("operate_user_id")
        public String hostUserId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean permit;
    }

    class SpeakApplyNotify extends Notify {
        @SerializedName("user_name")
        public String userName;

        @SerializedName("user_id")
        public String userId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("operate")
        public boolean open;
    }

    class SharePermitApplyNotify extends Notify {
        @SerializedName("user_name")
        public String userName;

        @SerializedName("user_id")
        public String userId;
    }

    class MicPermitChangedNotify extends Notify {
        @SerializedName("user_id")
        public String userId;

        @JsonAdapter(BooleanTypeAdapter.class)
        public boolean permit;
    }

    class SharePermitNotify extends Notify {
        @SerializedName("user_id")
        public String userId;

        @JsonAdapter(BooleanTypeAdapter.class)
        public boolean permit;
    }

    class RecordApplyNotify extends Notify {
        @SerializedName("user_name")
        public String userName;

        @SerializedName("user_id")
        public String userId;
    }

    class RecordPermitNotify extends Notify {
        @SerializedName("user_id")
        public String userId;

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("permit")
        public boolean permit;
    }

    class HostChangeNotify extends Notify {
        @SerializedName("user_id")
        public String userId;
        @SerializedName("room_id")
        public String roomId;
    }
}
