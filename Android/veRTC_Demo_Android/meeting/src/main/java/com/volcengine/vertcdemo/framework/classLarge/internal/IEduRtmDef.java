package com.volcengine.vertcdemo.framework.classLarge.internal;

import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.bean.BooleanTypeAdapter;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;

public interface IEduRtmDef {

    String CMD_JOIN_ROOM = "edubJoinRoom";
    String CMD_LEAVE_ROOM = "edubLeaveRoom";
    String CMD_RELEASE_ROOM = "edubFinishRoom";
    String CMD_RE_SYNC = "edubResync";
    String CMD_GET_USER_LIST = "edubGetUserList";
    String CMD_ENABLE_LOCAL_MIC = "edubOperateSelfMic";
    String CMD_ENABLE_LOCAL_CAME = "edubOperateSelfCamera";
    String CMD_START_SHARE = "edubStartShare";
    String CMD_END_SHARE = "edubFinishShare";
    String CMD_ENABLE_REMOTE_USER_MIC = "edubOperateOtherMic";
    String CMD_ENABLE_REMOTE_USER_CAM = "edubOperateOtherCamera";
    String CMD_ENABLE_ALL_MIC = "edubOperateAllMic";
    String CMD_CHANGE_REMOTE_USER_SHARE_PERMIT = "edubOperateOtherSharePermission";
    String CMD_APPLY_CHANGE_MIC = "edubOperateSelfMicApply";
    String CMD_PERMIT_CHANGE_MIC = "edubOperateSelfMicPermit";
    String CMD_APPLY_SHARE = "edubSharePermissionApply";
    String CMD_PERMIT_SHARE = "edubSharePermissionPermit";
    String CMD_START_RECORD = "edubStartRecord";
    String CMD_STOP_RECORD = "edubStopRecord";
    String CMD_APPLY_RECORD = "edubStartRecordApply";
    String CMD_START_RECORD_PERMIT = "edubStartRecordPermit";
    String CMD_LINK_MIC_APPLY = "edubLinkmicApply";
    String CMD_LINK_MIC_APPLY_CANCEL = "edubLinkmicApplyCancel";
    String CMD_LINK_MIC_LEAVE = "edubLinkmicLeave";

    String ON_REMOTE_USER_JOIN_ROOM = "edubOnJoinRoom";
    String ON_REMOTE_USER_LEAVE_ROOM = "edubOnLeaveRoom";
    String ON_ROOM_RELEASED = "edubOnFinishRoom";
    String ON_REMOTE_USER_ENABLE_MIC = "edubOnOperateSelfMic";
    String ON_REMOTE_USER_ENABLE_CAM = "edubOnOperateSelfCamera";
    String ON_START_SHARE = "edubOnStartShare";
    String ON_STOP_SHARE = "edubOnFinishShare";
    String ON_ENABLE_MIC_BY_HOST = "edubOnOperateOtherMic";
    String ON_ENABLE_CAM_BY_HOST = "edubOnOperateOtherCamera";
    String ON_ENABLE_ALL_MIC_BY_HOST = "edubOnOperateAllMic";
    String ON_CHANGE_SHARE_PERMIT_BY_HOST = "edubOnOperateOtherSharePermission";
    String ON_APPLY_CHANGE_MIC = "edubOnOperateSelfMicApply";
    String ON_PERMIT_CHANGE_MIC = "edubOnOperateSelfMicPermit";
    String ON_APPLY_SHARE = "edubOnSharePermissionApply";
    String ON_PERMIT_SHARE = "edubOnSharePermissionPermit";
    String ON_START_RECORD = "edubOnStartRecord";
    String ON_STOP_RECORD = "edubOnStopRecord";
    String ON_APPLY_RECORD = "edubOnStartRecordApply";
    String ON_START_RECORD_PERMIT = "edubOnStartRecordPermit";
    String ON_LINK_MIC_PERMIT = "edubOnLinkmicPermit";
    String ON_LINK_MIC_JOIN = "edubOnLinkmicJoin";
    String ON_LINK_MIC_LEAVE = "edubOnLinkmicLeave";
    String ON_LINK_MIC_KICK = "edubOnLinkmicKick";

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

    class JoinRoomReq {
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
        public EduUserInfo user;
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

    class LinkMicNotify extends Notify {

        @JsonAdapter(BooleanTypeAdapter.class)
        @SerializedName("permit")
        public boolean permit;
    }

}
