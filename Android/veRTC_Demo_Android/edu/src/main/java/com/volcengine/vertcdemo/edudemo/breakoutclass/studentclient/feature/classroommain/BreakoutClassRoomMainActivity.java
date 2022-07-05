package com.volcengine.vertcdemo.edudemo.breakoutclass.studentclient.feature.classroommain;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import androidx.core.content.PermissionChecker;

import com.google.gson.reflect.TypeToken;
import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.ss.video.rtc.demo.basic_module.ui.CommonDialog;
import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.core.eventbus.SDKJoinChannelSuccessEvent;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;
import com.volcengine.vertcdemo.edudemo.common.ClassStudentsLayout;
import com.volcengine.vertcdemo.edudemo.common.ClassTitleLayout;
import com.volcengine.vertcdemo.edudemo.common.EduDialogHelper;
import com.volcengine.vertcdemo.edudemo.common.GroupSpeechTipView;
import com.volcengine.vertcdemo.edudemo.common.GroupStudentLayout;
import com.volcengine.vertcdemo.edudemo.common.StudentVideoView;
import com.volcengine.vertcdemo.edudemo.common.TeacherVideoView;
import com.volcengine.vertcdemo.edudemo.core.EduConstants;
import com.volcengine.vertcdemo.edudemo.core.EduRTCManager;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduClassEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduGroupSpeechEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduLoginElseWhereEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduMuteAllEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduRecordEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduStuMicEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduTeacherCameraStatusEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduTeacherMicStatusEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.EduVideoInteractEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.GroupStudentJoinEvent;
import com.volcengine.vertcdemo.edudemo.core.eventbus.GroupStudentLeaveEvent;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.Iterator;
import java.util.List;

public class BreakoutClassRoomMainActivity extends BaseActivity {

    private static final int HIDE_TITLE_DELAY = 5000;

    private View mRootView;
    private ClassTitleLayout mTitleLayout;
    private TeacherVideoView mTeacherVideoView;
    private StudentVideoView mSelfVideoView;
    private ClassStudentsLayout mStudentsLayout;
    private GroupSpeechTipView mGroupSpeechTipView;
    private GroupStudentLayout mGroupStudentLayout;
    private boolean mHasLayoutCompleted = false;

    private final ClassRoomMainData mMainData = new ClassRoomMainData();

    private final Runnable mHideTitleRunnable = () -> {
        if (isFinishing()) {
            return;
        }
        if (mTitleLayout != null) {
            mTitleLayout.setVisibility(View.GONE);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_breakout_class_room_main);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        initArgs();
    }

    @Override
    protected void onGlobalLayoutCompleted() {
        if (mHasLayoutCompleted) {
            return;
        }
        mHasLayoutCompleted = true;

        mRootView = findViewById(R.id.root_view);
        mTitleLayout = findViewById(R.id.break_out_title);
        mTitleLayout.setOnBackPressListener((v) -> onBackPressed());

        mTeacherVideoView = findViewById(R.id.break_out_teacher_container);
        mSelfVideoView = findViewById(R.id.break_out_self_container);

        mStudentsLayout = findViewById(R.id.break_out_mic_on_container);
        mStudentsLayout.setHandUpBtnListener((v) -> {
            if (isUserMicOn(mMainData.mSelfInfo)) {
                mMainData.mIsRaiseHand = false;
                mStudentsLayout.setHandsUpStatus(false);
                mStudentsLayout.setHandsUpVisible(false);
                return;
            }
            if (mMainData.mIsRaiseHand) {
                mMainData.mIsRaiseHand = false;
                mStudentsLayout.setHandsUpStatus(false);
                mStudentsLayout.setHandsUpVisible(true);
                EduRTCManager.ins().getRTMClient().cancelHandsUp(mMainData.mRoomId, null);
            } else {
                mMainData.mIsRaiseHand = true;
                mStudentsLayout.setHandsUpStatus(true);
                mStudentsLayout.setHandsUpVisible(true);
                EduRTCManager.ins().getRTMClient().handsUp(mMainData.mRoomId, null);
            }
        });

        mGroupStudentLayout = findViewById(R.id.break_out_group_container);

        mGroupSpeechTipView = findViewById(R.id.break_out_group_speech_tip);
        mGroupSpeechTipView.setVisibility(View.GONE);

        if (!checkedArgs()) {
            return;
        }

        setTitleAutoHide();
        updateUI();

        joinChannel(mMainData.mRoomToken, mMainData.mRoomId, mMainData.mSelfUserId);
        joinGroupChannel(mMainData.mGroupToken, mMainData.mGroupRoomId, mMainData.mSelfUserId);
        EduRTCManager.setClassClientRole(false);
        EduRTCManager.setGroupClientRole(true);
        EduRTCManager.groupPublish(true);
        SolutionDemoEventManager.register(this);

        requestPermissions(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO);
    }

    private void initArgs() {
        Intent intent = getIntent();
        String appId = intent.getStringExtra(EduConstants.APP_ID);
        String roomToken = intent.getStringExtra(EduConstants.ROOM_TOKEN);
        String roomID = intent.getStringExtra(EduConstants.ROOM_ID);
        String roomName = intent.getStringExtra(EduConstants.ROOM_NAME);

        String groupId = intent.getStringExtra(EduConstants.GROUP_ROOM_ID);
        String groupToken = intent.getStringExtra(EduConstants.GROUP_TOKEN);
        String groupUserListJson = intent.getStringExtra(EduConstants.GROUP_USER_LIST);

        String teacherUid = intent.getStringExtra(EduConstants.TEACHER_UID);
        String teacherName = intent.getStringExtra(EduConstants.TEACHER_NAME);
        boolean teacherMicOn = intent.getBooleanExtra(EduConstants.TEACHER_MIC_ON, false);
        boolean teacherCameraOn = intent.getBooleanExtra(EduConstants.TEACHER_CAMERA_ON, false);

        String selfUid = intent.getStringExtra(EduConstants.SELF_UID);
        String selfName = intent.getStringExtra(EduConstants.SELF_NAME);
        boolean selfMicOn = intent.getBooleanExtra(EduConstants.SELF_MIC_ON, false);

        boolean isRecord = intent.getBooleanExtra(EduConstants.IS_RECORD, false);

        boolean isClassStart = intent.getBooleanExtra(EduConstants.IS_CLASS_START, false);
        long classStartAt = intent.getLongExtra(EduConstants.CLASS_START_AT, 0);
        long classDuration = intent.getLongExtra(EduConstants.CLASS_DURATION, 0);

        boolean isVideoInteract = intent.getBooleanExtra(EduConstants.IS_VIDEO_INTERACT, false);
        boolean isGroupSpeech = intent.getBooleanExtra(EduConstants.IS_GROUP_SPEECH, false);
        String micOnStudentJson = intent.getStringExtra(EduConstants.MIC_ON_STUDENTS);

        int errorCode = intent.getIntExtra(EduConstants.ERROR_CODE, 200);

        mMainData.mAppId = appId;
        mMainData.mRoomToken = roomToken;
        mMainData.mRoomId = roomID;
        mMainData.mRoomName = roomName;

        mMainData.mGroupRoomId = groupId;
        mMainData.mGroupToken = groupToken;
        try {
            List<EduUserInfo> infoList = GsonUtils.gson().fromJson(groupUserListJson,
                    new TypeToken<List<EduUserInfo>>() {
                    }.getType());
            if (infoList != null) {
                mMainData.mGroupUserList.addAll(infoList);
            }
        } catch (Exception e) {
            Log.e("ClassRoomMainActivity", "initArgs: getGroupUserList", e);
        }

        EduUserInfo info = new EduUserInfo();
        info.userId = teacherUid;
        info.userName = teacherName;
        info.isMicOn = teacherMicOn;
        info.isCameraOn = teacherCameraOn;
        mMainData.mTeacherInfo = info;

        EduUserInfo selfInfo = new EduUserInfo();
        selfInfo.userId = selfUid;
        selfInfo.userName = selfName;
        selfInfo.isMicOn = selfMicOn;
        selfInfo.isCameraOn = selfMicOn;
        mMainData.mSelfInfo = selfInfo;

        mMainData.mSelfUserId = selfUid;
        mMainData.mSelfUserName = selfName;
        mMainData.mIsSelfMicOn = selfMicOn;

        mMainData.mIsRecord = isRecord;

        mMainData.mIsClassStart = isClassStart;
        mMainData.mClassStartAt = classStartAt;
        mMainData.mClassDuration = classDuration;

        mMainData.mIsVideoInteract = isVideoInteract;
        mMainData.mIsGroupSpeech = isGroupSpeech;

        try {
            List<EduUserInfo> infoList = GsonUtils.gson().fromJson(micOnStudentJson,
                    new TypeToken<List<EduUserInfo>>() {
                    }.getType());
            if (infoList != null) {
                mMainData.addMicOnStudent(infoList);
            }
        } catch (Exception e) {
            Log.e("ClassRoomMainActivity", "initArgs: getMicOnStudentList", e);
        }

        selfInfo.isMicOn = false;
        for (EduUserInfo classInfo : mMainData.getMicOnStudentList()) {
            classInfo.isMicOn = true;
            if (TextUtils.equals(classInfo.userId, selfInfo.userId)) {
                selfInfo.isMicOn = true;
            }
        }
        for (EduUserInfo groupInfo : mMainData.mGroupUserList) {
            groupInfo.isMicOn = false;
            for (EduUserInfo classInfo : mMainData.getMicOnStudentList()) {
                if (TextUtils.equals(groupInfo.userId, classInfo.userId)) {
                    groupInfo.isMicOn = true;
                    classInfo.isMicOn = true;
                }
            }
        }

        mMainData.errorCode = errorCode;
    }

    private boolean checkedArgs() {
        if (!TextUtils.isEmpty(mMainData.mRoomId) && mMainData.errorCode == 200) {
            return true;
        }
        showJoinFailedDialog(mMainData.errorCode);
        return false;
    }

    private void showJoinFailedDialog(int errorCode) {
        CommonDialog dialog = new CommonDialog(this);
        dialog.setCancelable(false);
        if (errorCode == 405 || errorCode == 407) {
            dialog.setMessage("该用户正在使用老师身份上课，当前无法使用学生身份");
        } else if (errorCode == 422) {
            dialog.setMessage("房间已经解散");
        } else {
            dialog.setMessage("加入房间失败，回到房间列表页");
        }
        dialog.setPositiveListener((v) -> finish());
        dialog.show();
    }

    @SuppressLint("ClickableViewAccessibility")
    private void setTitleAutoHide() {
        mRootView.setOnTouchListener((v, event) -> {
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                mTitleLayout.setVisibility(View.VISIBLE);
                mTitleLayout.removeCallbacks(mHideTitleRunnable);
                mTitleLayout.postDelayed(mHideTitleRunnable, HIDE_TITLE_DELAY);
            }
            return false;
        });
        mTitleLayout.postDelayed(mHideTitleRunnable, HIDE_TITLE_DELAY);
    }

    public void updateUI() {
        mTitleLayout.setTitleMessage(mMainData.mRoomName, mMainData.mRoomId);
        onClassStartRecord(mMainData.mIsRecord);
        onClassStart(mMainData.mIsClassStart, System.currentTimeMillis(), mMainData.mClassDuration);

        mTeacherVideoView.bindInfo(mMainData.mTeacherInfo);
        mSelfVideoView.bindInfo(mMainData.mSelfInfo, false);

        onGroupSpeech(mMainData.mIsGroupSpeech, true);
        onVideoInteract(mMainData.mIsVideoInteract);

        setGroupStudent();
    }

    private void attemptLeaveClass() {
        EduDialogHelper.openLeaveDialog(this, (v) -> super.onBackPressed());
    }

    @Override
    public void onBackPressed() {
        attemptLeaveClass();
    }

    @Override
    public void finish() {
        super.finish();
        SolutionDemoEventManager.unregister(this);
        leaveChannel();
        EduRTCManager.clearUserRenderView();
    }

    private void setGroupStudent() {
        Iterator<EduUserInfo> iterator = mMainData.mGroupUserList.iterator();
        while (iterator.hasNext()) {
            EduUserInfo info = iterator.next();
            if (info != null && mMainData.isSelf(info.userId)) {
                iterator.remove();
            }
        }
        for (EduUserInfo groupMicOnInfo : mMainData.mGroupUserList) {
            groupMicOnInfo.isMicOn = false;
            for (EduUserInfo info : mMainData.getMicOnStudentList()) {
                if (TextUtils.equals(groupMicOnInfo.userId, info.userId)) {
                    groupMicOnInfo.isMicOn = true;
                }
            }
        }
        mGroupStudentLayout.setStudentList(mMainData.mGroupUserList);
    }

    private boolean isUserMicOn(EduUserInfo info) {
        for (EduUserInfo userInfo : mMainData.getMicOnStudentList()) {
            if (TextUtils.equals(userInfo.userId, info.userId)) {
                return true;
            }
        }
        return false;
    }

    private void onClassStart(boolean isStart, long startAt, long duration) {
        if (isStart) {
            mTitleLayout.startClass(startAt, duration);
        } else {
            mTitleLayout.endClass();
        }
    }

    private void onGroupSpeech(boolean isStart, boolean isViewChanged) {
        if (isStart) {
            mGroupSpeechTipView.setVisibility(isViewChanged ? View.VISIBLE : View.GONE);
            if (PermissionChecker.checkSelfPermission(BreakoutClassRoomMainActivity.this,
                    Manifest.permission.RECORD_AUDIO) == PermissionChecker.PERMISSION_GRANTED) {

                EduRTCManager.groupPublish(false);
                EduRTCManager.enableLocalAudio(true);
                EduRTCManager.muteLocalAudioStream(false);
                EduRTCManager.setClassClientRole(true);
                EduRTCManager.setGroupClientRole(false);
                EduRTCManager.classPublish(true);

            } else {
                requestPermissions(Manifest.permission.RECORD_AUDIO);
            }
        } else {
            mGroupSpeechTipView.setVisibility(View.GONE);

            EduRTCManager.classPublish(false);
            EduRTCManager.enableLocalAudio(false);
            EduRTCManager.muteLocalAudioStream(true);
            EduRTCManager.setClassClientRole(false);
            EduRTCManager.setGroupClientRole(true);
            EduRTCManager.groupPublish(true);
        }
    }

    private void onVideoInteract(boolean isStart) {
        mMainData.mIsVideoInteract = isStart;
        mStudentsLayout.setVisibility(isStart ? View.VISIBLE : View.GONE);
        mStudentsLayout.clearStudentList();
        if (isStart) {
            mStudentsLayout.setHandsUpStatus(false);
            mStudentsLayout.setHandsUpVisible(true);
            mStudentsLayout.setStudentList(mMainData.getMicOnStudentList());
        } else {
            onGroupSpeech(false, false);
        }
        boolean selfMicOn = isUserMicOn(mMainData.mSelfInfo) && isStart;
        mMainData.mSelfInfo.isMicOn = selfMicOn;
        onMicOn(selfMicOn, mMainData.mSelfInfo);

        if (!isStart) {
            mMainData.getMicOnStudentList().clear();
            for (EduUserInfo userInfo : mMainData.mGroupUserList) {
                if (!mMainData.isSelf(userInfo.userId)) {
                    isUserMicOn(userInfo);
                    userInfo.isMicOn = false;
                    mGroupStudentLayout.updateUserInfo(userInfo);
                }
            }
        }
    }

    private void onClassStartRecord(boolean isStart) {
        mTitleLayout.setIsRecord(isStart);
    }

    private void onMicOn(boolean isMicOn, EduUserInfo micOnStudent) {
        if (micOnStudent == null || TextUtils.isEmpty(micOnStudent.userId)) {
            return;
        }
        micOnStudent.isMicOn = isMicOn;
        if (isMicOn) {
            if (mMainData.isSelf(micOnStudent.userId)) {
                onGroupSpeech(true, false);
                if (PermissionChecker.checkSelfPermission(BreakoutClassRoomMainActivity.this,
                        Manifest.permission.CAMERA) == PermissionChecker.PERMISSION_GRANTED) {
                    mMainData.mSelfInfo.isMicOn = true;
                    EduRTCManager.groupPublish(false);
                    EduRTCManager.enableLocalVideo(true);
                    EduRTCManager.muteLocalVideoStream(false);
                    EduRTCManager.startPreview();
                    EduRTCManager.setClassClientRole(true);
                    EduRTCManager.setGroupClientRole(false);
                    EduRTCManager.classPublish(true);

                    mMainData.mIsSelfMicOn = true;
                    mMainData.mIsRaiseHand = false;
                    mStudentsLayout.expand();
                    mStudentsLayout.setHandsUpStatus(true);
                    mStudentsLayout.setHandsUpVisible(false);
                    mSelfVideoView.bindInfo(mMainData.mSelfInfo, false);
                } else {
                    requestPermissions(Manifest.permission.CAMERA);
                }
            } else {
                mGroupStudentLayout.updateUserInfo(micOnStudent);
            }
            mStudentsLayout.addUser(micOnStudent);
            mMainData.getMicOnStudentList().add(micOnStudent);
        } else {
            if (mMainData.isSelf(micOnStudent.userId)) {
                onGroupSpeech(false, false);
                mMainData.mSelfInfo.isMicOn = false;
                EduRTCManager.classPublish(false);
                EduRTCManager.enableLocalVideo(true);
                EduRTCManager.muteLocalVideoStream(false);
                EduRTCManager.startPreview();
                EduRTCManager.setClassClientRole(false);
                EduRTCManager.setGroupClientRole(true);
                EduRTCManager.groupPublish(true);
                mStudentsLayout.setHandsUpStatus(false);
                mStudentsLayout.setHandsUpVisible(true);
                mSelfVideoView.bindInfo(mMainData.mSelfInfo, false);

                mMainData.mIsSelfMicOn = false;
                mMainData.mIsRaiseHand = false;
            } else {
                mGroupStudentLayout.updateUserInfo(micOnStudent);
            }
            mStudentsLayout.removeUser(micOnStudent.userId);
            mMainData.removeMicOnStudent(micOnStudent);
        }
    }

    private void joinChannel(String token, String roomId, String userId) {
        EduRTCManager.joinClassChannel(token, roomId, userId);
    }

    private void joinGroupChannel(String groupToken, String groupId, String userId) {
        EduRTCManager.joinGroupChannel(groupToken, groupId, userId);
    }

    private void leaveChannel() {
        EduRTCManager.stopPreview();
        EduRTCManager.leaveChannel();
        EduRTCManager.destroyRooms();
        EduRTCManager.ins().getRTMClient().leaveClass(mMainData.mRoomId, null);
    }

    private void setTeacherCameraStatus(boolean status) {
        mMainData.mTeacherInfo.isCameraOn = status;
        mTeacherVideoView.setCameraStatus(status, mMainData.mTeacherInfo.userId);
    }

    private void setTeacherMicStatus(boolean status) {
        mMainData.mTeacherInfo.isMicOn = status;
        mTeacherVideoView.setMicStatus(status, mMainData.mTeacherInfo.userId);
    }

    private void showLoginElseWhereDialog() {
        CommonDialog dialog = new CommonDialog(this);
        dialog.setCancelable(false);
        dialog.setMessage("用户在另一台设备加入");
        dialog.setPositiveListener((v) -> finish());
        dialog.show();
    }

    /**
     * 开始、结束课程通知
     * 开始后需要开始倒计时
     * 结束时退出房间
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onClassEvent(EduClassEvent event) {
        onClassStart(event.isStart, System.currentTimeMillis(), 0);
        if (!event.isStart) {
            Intent intent = new Intent();
            intent.putExtra("dialog_tip", "课程已结束");
            setResult(RESULT_OK, intent);
            finish();
        }
    }

    /**
     * 录制开始通知
     * 开始后展示录制的按钮
     * 如果进入一个已经开始录制的房间，录制UI也需要改变
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onRecordEvent(EduRecordEvent recordEvent) {
        onClassStartRecord(recordEvent.isStart);
    }

    /**
     * 集体发言通知
     * 开启集体发言的时候打开麦克风，权限处理待定
     * 关闭集体发言的时候关闭麦克风
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onGroupSpeechEvent(EduGroupSpeechEvent event) {
        onGroupSpeech(event.isStart, true);
    }

    /**
     * 视频互动通知
     * 开启视频互动的时候，可以举手
     * 关闭视频互动的时候
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onVideoInteractEvent(EduVideoInteractEvent event) {
        onVideoInteract(event.isStart);
        setGroupStudent();
    }

    /**
     * 上下麦通知
     * 如果是自己上麦，先检查用户的摄像头权限，然后在开启视频开关；收到下麦通知，需要关闭摄像头开关
     * 如果是别人上麦，需要设置用户的远端视图；收到下麦通知，需要移出远端用户视图
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEduStuMicEvent(EduStuMicEvent event) {
        onMicOn(event.isMicOn, event.info);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMuteAllEvent(EduMuteAllEvent event) {
        mMainData.mIsSelfMicOn = false;
        EduRTCManager.muteLocalAudioStream(true);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEduTeacherCameraStatusEvent(EduTeacherCameraStatusEvent event) {
        setTeacherCameraStatus(event.status);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEduTeacherMicStatusEvent(EduTeacherMicStatusEvent event) {
        setTeacherMicStatus(event.status);
        setGroupStudent();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onSDKJoinChannelSuccessEvent(SDKJoinChannelSuccessEvent event) {
        setTeacherCameraStatus(mMainData.mTeacherInfo.isCameraOn);
        setGroupStudent();
        onGroupSpeech(mMainData.mIsGroupSpeech, true);
    }

    private boolean addGroupUser(EduUserInfo info) {
        if (info == null || TextUtils.isEmpty(info.userId)) {
            return false;
        }
        for (EduUserInfo userInfo : mMainData.mGroupUserList) {
            if (TextUtils.equals(userInfo.userId, info.userId)) {
                return false;
            }
        }
        mMainData.mGroupUserList.add(info);
        return true;
    }

    private boolean removeGroupUser(EduUserInfo info) {
        if (info == null || TextUtils.isEmpty(info.userId)) {
            return false;
        }
        for (EduUserInfo meetingUserInfo : mMainData.mGroupUserList) {
            if (TextUtils.equals(meetingUserInfo.userId, info.userId)) {
                mMainData.mGroupUserList.remove(info);
                return true;
            }
        }
        return false;
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onGroupStudentJoinEvent(GroupStudentJoinEvent event) {
        if (addGroupUser(event.info)) {
            event.info.isMicOn = isUserMicOn(event.info);
            mGroupStudentLayout.addUser(event.info);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onGroupStudentLeaveEvent(GroupStudentLeaveEvent event) {
        if (removeGroupUser(event.info)) {
            mGroupStudentLayout.removeUser(event.info.userId);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEduLoginElseWhereEvent(EduLoginElseWhereEvent event) {
        showLoginElseWhereDialog();
    }

    public static void openClassRoomMainActivity(
            Activity activity, String appId,
            String roomToken, String roomId, String roomName,
            String groupId, String groupToken, List<EduUserInfo> groupUserList,
            String teacherUid, String teacherName, boolean teacherMicOn, boolean teacherCameraOn,
            String selfUid, String selfName, boolean selfMicOn,
            boolean isClassRecording, boolean isClassStart, long classStartAt, long classDuration,
            boolean isVideoInteract, boolean isGroupSpeech, List<EduUserInfo> micOnStudentList,
            int errorCode) {
        Intent intent = new Intent(activity, BreakoutClassRoomMainActivity.class);
        intent.putExtra(EduConstants.APP_ID, appId);
        intent.putExtra(EduConstants.ROOM_TOKEN, roomToken);
        intent.putExtra(EduConstants.ROOM_ID, roomId);
        intent.putExtra(EduConstants.ROOM_NAME, roomName);
        intent.putExtra(EduConstants.GROUP_ROOM_ID, groupId);
        intent.putExtra(EduConstants.GROUP_TOKEN, groupToken);
        intent.putExtra(EduConstants.GROUP_USER_LIST, GsonUtils.gson().toJson(groupUserList));
        intent.putExtra(EduConstants.TEACHER_UID, teacherUid);
        intent.putExtra(EduConstants.TEACHER_NAME, teacherName);
        intent.putExtra(EduConstants.TEACHER_MIC_ON, teacherMicOn);
        intent.putExtra(EduConstants.TEACHER_CAMERA_ON, teacherCameraOn);
        intent.putExtra(EduConstants.SELF_UID, selfUid);
        intent.putExtra(EduConstants.SELF_NAME, selfName);
        intent.putExtra(EduConstants.SELF_MIC_ON, selfMicOn);
        intent.putExtra(EduConstants.IS_RECORD, isClassRecording);
        intent.putExtra(EduConstants.IS_CLASS_START, isClassStart);
        intent.putExtra(EduConstants.CLASS_START_AT, classStartAt);
        intent.putExtra(EduConstants.CLASS_DURATION, classDuration);
        intent.putExtra(EduConstants.IS_VIDEO_INTERACT, isVideoInteract);
        intent.putExtra(EduConstants.IS_GROUP_SPEECH, isGroupSpeech);
        intent.putExtra(EduConstants.MIC_ON_STUDENTS, GsonUtils.gson().toJson(micOnStudentList));
        intent.putExtra(EduConstants.ERROR_CODE, errorCode);
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        activity.startActivityForResult(intent, 1000);
    }
}
