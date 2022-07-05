package com.volcengine.vertcdemo.edudemo.core;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.google.gson.JsonObject;
import com.ss.bytertc.engine.RTCEngine;
import com.ss.video.rtc.demo.basic_module.utils.AppExecutors;
import com.volcengine.vertcdemo.common.AbsBroadcast;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.rtm.RTMBaseClient;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;
import com.volcengine.vertcdemo.edudemo.bean.EduResponse;
import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;
import com.volcengine.vertcdemo.edudemo.bean.JoinClassResult;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduClassEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduGroupSpeechEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduLoginElseWhereEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduStuMicEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduTeacherCameraStatusEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduTeacherMicStatusEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduVideoInteractEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.GroupStudentJoinEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.GroupStudentLeaveEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.UpdateActiveClassListEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.UpdateHistoryClassListEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.UpdateHistoryListOfClassEvent;

import java.util.UUID;

public class EduRtmClient extends RTMBaseClient {

    private static final String CMD_EDU_GET_ACTIVE_CLASS = "eduGetActiveClass";
    private static final String CMD_EDU_JOIN_CLASS = "eduJoinClass";
    private static final String CMD_EDU_LEAVE_CLASS = "eduLeaveClass";
    private static final String CMD_EDU_HANDS_UP = "eduHandsUp";
    private static final String CMD_EDU_CANCEL_HANDS_UP = "eduCancelHandsUp";
    private static final String CMD_EDU_GET_HISTORY_ROOM_LIST = "eduGetHistoryRoomList";
    private static final String CMD_EDU_GET_HISTORY_RECORD_LIST = "eduGetHistoryRecordList";

    public static final String ON_BEGIN_CLASS = "onBeginClass";
    public static final String ON_END_CLASS = "onEndClass";
    public static final String ON_OPEN_GROUP_SPEECH = "onOpenGroupSpeech";
    public static final String ON_CLOSE_GROUP_SPEECH = "onCloseGroupSpeech";
    public static final String ON_OPEN_VIDEO_INTERACT = "onOpenVideoInteract";
    public static final String ON_CLOSE_VIDEO_INTERACT = "onCloseVideoInteract";
    public static final String ON_TEACHER_MIC_ON = "onTeacherMicOn";
    public static final String ON_TEACHER_MIC_OFF = "onTeacherMicOff";
    public static final String ON_TEACHER_CAMERA_ON = "onTeacherCameraOn";
    public static final String ON_TEACHER_CAMERA_OFF = "onTeacherCameraOff";
    public static final String ON_TEACHER_JOIN_ROOM = "onTeacherJoinRoom";
    public static final String ON_TEACHER_LEAVE_ROOM = "onTeacherLeaveRoom";
    public static final String ON_STUDENT_JOIN_GROUP_ROOM = "onStudentJoinGroupRoom";
    public static final String ON_STUDENT_LEAVE_GROUP_ROOM = "onStudentLeaveGroupRoom";
    public static final String ON_STUDENT_MIC_ON = "onStuMicOn";
    public static final String ON_STUDENT_MIC_OFF = "onStuMicOff";
    public static final String ON_APPROVE_MIC = "onApproveMic";
    public static final String ON_CLOSE_MIC = "onCloseMic";
    public static final String ON_LOG_IN_ELSE_WHERE = "onLogInElsewhere";

    public EduRtmClient(@NonNull RTCEngine engine, @NonNull RtmInfo rtmInfo) {
        super(engine, rtmInfo);
    }

    @Override
    protected JsonObject getCommonParams(String cmd) {
        JsonObject params = new JsonObject();
        params.addProperty("app_id", mRtmInfo.appId);
        params.addProperty("room_id", "");
        params.addProperty("user_id", SolutionDataManager.ins().getUserId());
        params.addProperty("event_name", cmd);
        params.addProperty("request_id", UUID.randomUUID().toString());
        params.addProperty("device_id", SolutionDataManager.ins().getDeviceId());
        return params;
    }

    @Override
    protected void initEventListener() {
        putEventListener(new AbsBroadcast<>(ON_BEGIN_CLASS, EduClassEvent.class, (data) -> {
            data.isStart = true;
            SolutionDemoEventManager.post(data);
        }));

        putEventListener(new AbsBroadcast<>(ON_END_CLASS, EduClassEvent.class, (data) -> {
            data.isStart = false;
            SolutionDemoEventManager.post(data);
        }));

        putEventListener(new AbsBroadcast<>(ON_OPEN_GROUP_SPEECH, EduResponse.class,
                (data) -> SolutionDemoEventManager.post(new EduGroupSpeechEvent(true))));

        putEventListener(new AbsBroadcast<>(ON_CLOSE_GROUP_SPEECH, EduResponse.class,
                (data) -> SolutionDemoEventManager.post(new EduGroupSpeechEvent(false))));

        putEventListener(new AbsBroadcast<>(ON_OPEN_VIDEO_INTERACT, EduResponse.class,
                (data) -> SolutionDemoEventManager.post(new EduVideoInteractEvent(true))));

        putEventListener(new AbsBroadcast<>(ON_CLOSE_VIDEO_INTERACT, EduResponse.class,
                (data) -> SolutionDemoEventManager.post(new EduVideoInteractEvent(false))));

        putEventListener(new AbsBroadcast<>(ON_TEACHER_MIC_ON, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new EduTeacherMicStatusEvent(data.userId, true))));

        putEventListener(new AbsBroadcast<>(ON_TEACHER_MIC_OFF, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new EduTeacherMicStatusEvent(data.userId, false))));

        putEventListener(new AbsBroadcast<>(ON_TEACHER_CAMERA_ON, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new EduTeacherCameraStatusEvent(data.userId, true))));

        putEventListener(new AbsBroadcast<>(ON_TEACHER_CAMERA_OFF, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new EduTeacherCameraStatusEvent(data.userId, false))));

        putEventListener(new AbsBroadcast<>(ON_TEACHER_JOIN_ROOM, EduUserInfo.class, (data) -> {
        }));

        putEventListener(new AbsBroadcast<>(ON_TEACHER_LEAVE_ROOM, EduUserInfo.class, (data) -> {
        }));

        putEventListener(new AbsBroadcast<>(ON_STUDENT_JOIN_GROUP_ROOM, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new GroupStudentJoinEvent(data))));

        putEventListener(new AbsBroadcast<>(ON_STUDENT_LEAVE_GROUP_ROOM, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new GroupStudentLeaveEvent(data))));

        putEventListener(new AbsBroadcast<>(ON_STUDENT_MIC_ON, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new EduStuMicEvent(true, data))));

        putEventListener(new AbsBroadcast<>(ON_STUDENT_MIC_OFF, EduUserInfo.class,
                (data) -> SolutionDemoEventManager.post(new EduStuMicEvent(false, data))));

        putEventListener(new AbsBroadcast<>(ON_APPROVE_MIC, EduResponse.class, (data) -> {
        }));

        putEventListener(new AbsBroadcast<>(ON_CLOSE_MIC, EduResponse.class, (data) -> {
        }));

        putEventListener(new AbsBroadcast<>(ON_LOG_IN_ELSE_WHERE, EduResponse.class,
                (data) -> SolutionDemoEventManager.post(new EduLoginElseWhereEvent())));
    }

    private void putEventListener(AbsBroadcast<? extends RTMBizInform> absBroadcast) {
        mEventListeners.put(absBroadcast.getEvent(), absBroadcast);
    }

    public void removeAllEventListener() {
        mEventListeners.remove(ON_BEGIN_CLASS);
        mEventListeners.remove(ON_END_CLASS);
        mEventListeners.remove(ON_OPEN_GROUP_SPEECH);
        mEventListeners.remove(ON_CLOSE_GROUP_SPEECH);
        mEventListeners.remove(ON_OPEN_VIDEO_INTERACT);
        mEventListeners.remove(ON_CLOSE_VIDEO_INTERACT);
        mEventListeners.remove(ON_TEACHER_MIC_ON);
        mEventListeners.remove(ON_TEACHER_MIC_OFF);
        mEventListeners.remove(ON_TEACHER_CAMERA_ON);
        mEventListeners.remove(ON_TEACHER_CAMERA_OFF);
        mEventListeners.remove(ON_TEACHER_JOIN_ROOM);
        mEventListeners.remove(ON_TEACHER_LEAVE_ROOM);
        mEventListeners.remove(ON_STUDENT_JOIN_GROUP_ROOM);
        mEventListeners.remove(ON_STUDENT_LEAVE_GROUP_ROOM);
        mEventListeners.remove(ON_STUDENT_MIC_ON);
        mEventListeners.remove(ON_STUDENT_MIC_OFF);
        mEventListeners.remove(ON_APPROVE_MIC);
        mEventListeners.remove(ON_CLOSE_MIC);
        mEventListeners.remove(ON_LOG_IN_ELSE_WHERE);
    }

    private <T extends RTMBizResponse> void sendServerMessageOnNetwork(String roomId, JsonObject content, Class<T> resultClass, IRequestCallback<T> callback) {
        String cmd = content.get("event_name").getAsString();
        if (TextUtils.isEmpty(cmd)) {
            return;
        }
        AppExecutors.networkIO().execute(() -> sendServerMessage(cmd, roomId, content, resultClass, callback));
    }

    public void requestActiveClassList(IRequestCallback<UpdateActiveClassListEvent> callback) {
        JsonObject params = getCommonParams(CMD_EDU_GET_ACTIVE_CLASS);
        sendServerMessageOnNetwork("", params, UpdateActiveClassListEvent.class, callback);
    }

    public void requestHistoryClassList(IRequestCallback<UpdateHistoryClassListEvent> callback) {
        JsonObject params = getCommonParams(CMD_EDU_GET_HISTORY_ROOM_LIST);
        sendServerMessageOnNetwork("", params, UpdateHistoryClassListEvent.class, callback);
    }

    public void requestHistoryListOfClass(String roomId, IRequestCallback<UpdateHistoryListOfClassEvent> callback) {
        JsonObject params = getCommonParams(CMD_EDU_GET_HISTORY_RECORD_LIST);
        params.addProperty("room_id", roomId);
        sendServerMessageOnNetwork(roomId, params, UpdateHistoryListOfClassEvent.class, callback);
    }

    /*
                if (response.getCode() == 200 && response.getData() != null) {
                result.roomInfo.now = response.getTimestamp();
                String roomName = result.roomInfo.roomName;
                if (!TextUtils.isEmpty(roomName)) {
                    try {
                        result.roomInfo.roomName = URLDecoder.decode(roomName, "UTF-8");
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
            } else {
                result = new JoinClassResult();
                result.errorCode = response.getCode();
            }
     */
    public void joinClass(String roomId, IRequestCallback<JoinClassResult> callback) {
        JsonObject params = getCommonParams(CMD_EDU_JOIN_CLASS);
        params.addProperty("room_id", roomId);
        params.addProperty("user_name", SolutionDataManager.ins().getUserName());
        sendServerMessageOnNetwork(roomId, params, JoinClassResult.class, callback);
    }

    public void leaveClass(String roomId, IRequestCallback<EduResponse> callback) {
        JsonObject params = getCommonParams(CMD_EDU_LEAVE_CLASS);
        params.addProperty("room_id", roomId);
        sendServerMessageOnNetwork(roomId, params, EduResponse.class, callback);
    }

    public void handsUp(String roomId, IRequestCallback<EduResponse> callback) {
        JsonObject params = getCommonParams(CMD_EDU_HANDS_UP);
        params.addProperty("room_id", roomId);
        sendServerMessageOnNetwork(roomId, params, EduResponse.class, callback);
    }

    public void cancelHandsUp(String roomId, IRequestCallback<EduResponse> callback) {
        JsonObject params = getCommonParams(CMD_EDU_CANCEL_HANDS_UP);
        params.addProperty("room_id", roomId);
        sendServerMessageOnNetwork(roomId, params, EduResponse.class, callback);
    }
}
