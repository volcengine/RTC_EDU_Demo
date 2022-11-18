package com.volcengine.vertcdemo.edu.feature.classroomlist;

import static com.volcengine.vertcdemo.core.net.rts.RTSInfo.KEY_RTM;
import static com.volcengine.vertcdemo.edu.feature.classhistory.ClassHistoryListActivity.EXTRA_CLASS_ID;
import static com.volcengine.vertcdemo.edu.feature.classhistory.ClassHistoryListActivity.EXTRA_ROOM_TITLE;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.ss.video.rtc.demo.basic_module.ui.CommonDialog;
import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.ss.video.rtc.demo.basic_module.utils.WindowUtils;
import com.vertcdemo.joinrtsparams.bean.JoinRTSRequest;
import com.vertcdemo.joinrtsparams.common.JoinRTSManager;
import com.volcengine.vertcdemo.common.IAction;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.ServerResponse;
import com.volcengine.vertcdemo.core.net.rts.RTSBaseClient;
import com.volcengine.vertcdemo.core.net.rts.RTSInfo;
import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edu.bean.JoinClassResult;
import com.volcengine.vertcdemo.edu.core.EduConstants;
import com.volcengine.vertcdemo.edu.feature.breakoutclass.BreakoutClassRoomMainActivity;
import com.volcengine.vertcdemo.edu.core.EduRTCManager;
import com.volcengine.vertcdemo.edu.core.EducationDataManager;
import com.volcengine.vertcdemo.edu.event.UpdateActiveClassListEvent;
import com.volcengine.vertcdemo.edu.event.UpdateHistoryClassListEvent;
import com.volcengine.vertcdemo.edu.feature.classhistory.ClassHistoryListActivity;
import com.volcengine.vertcdemo.edu.feature.lecturehall.LectureClassRoomMainActivity;

public class ClassRoomListActivity extends BaseActivity {

    private static final String TAG = "ClassRoomListActivity";

    private static final int CLASS_STARTED = 1;
    private static final int CLASS_OVER = 2;

    private static final int CLASS_TYPE_LECTURE = 0;
    private static final int CLASS_TYPE_BREAK_OUT = 1;

    private static final long CLICK_INTERVAL = 3000L;

    private RTSInfo mRtmInfo;

    private long mLastClickTs = 0L;

    private ClassRoomListAdapter mClassRoomListAdapter;
    private final ClassRoomListAdapter.OnClassItemClickListener itemClickListener = info -> {
        Log.d("OnClassItemClick", info.toString());
        if (System.currentTimeMillis() - mLastClickTs < CLICK_INTERVAL) {
            return;
        }
        mLastClickTs = System.currentTimeMillis();
        if (info.status <= CLASS_STARTED) {
            EduRTCManager.ins().getRTMClient().joinClass(info.roomId, new IRequestCallback<JoinClassResult>() {
                @Override
                public void onSuccess(JoinClassResult data) {
                    joinClass(data);
                }

                @Override
                public void onError(int errorCode, String message) {
                    JoinClassResult joinClassResult = new JoinClassResult();
                    joinClassResult.errorCode = errorCode;
                    joinClass(joinClassResult);
                }
            });
        } else if (info.status == CLASS_OVER) {
            Intent intent = new Intent(ClassRoomListActivity.this, ClassHistoryListActivity.class);
            intent.putExtra(EXTRA_CLASS_ID, info.roomId);
            intent.putExtra(EXTRA_ROOM_TITLE, info.getDecodedRoomName());
            startActivity(intent);
        }
    };

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_class_room_list);
        EducationDataManager.init();
        requestPermissions(Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA);
        initRtmInfo();
    }

    /**
     * 获取RTM信息
     */
    private void initRtmInfo() {
        Intent intent = getIntent();
        if (intent == null) {
            return;
        }
        mRtmInfo = intent.getParcelableExtra(RTSInfo.KEY_RTM);
        if (mRtmInfo == null || !mRtmInfo.isValid()) {
            finish();
        }
    }

    @Override
    protected void onGlobalLayoutCompleted() {
        super.onGlobalLayoutCompleted();

        // title
        ImageView backArrow = findViewById(R.id.title_bar_left_iv);
        backArrow.setImageResource(R.drawable.back_arrow);
        backArrow.setOnClickListener(v -> finish());
        ImageView refresh = findViewById(R.id.title_bar_right_iv);
        refresh.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        refresh.setImageResource(R.drawable.refresh);
        refresh.setOnClickListener(v -> getRoomList());

        // list
        RecyclerView classListRv = findViewById(R.id.class_list_rv);
        classListRv.setLayoutManager(new LinearLayoutManager(this, RecyclerView.VERTICAL, false));
        mClassRoomListAdapter = new ClassRoomListAdapter(itemClickListener);
        classListRv.setAdapter(mClassRoomListAdapter);
        classListRv.addItemDecoration(new ClassItemDecoration());

        initRTC();
    }

    /**
     * 初始化RTC
     */
    private void initRTC() {
        EduRTCManager.ins().initEngine(mRtmInfo);
        RTSBaseClient rtmClient = EduRTCManager.ins().getRTMClient();
        if (rtmClient == null) {
            finish();
            return;
        }
        rtmClient.login(mRtmInfo.rtmToken, (resultCode, message) -> {
            if (resultCode == RTSBaseClient.LoginCallBack.SUCCESS) {
                getRoomList();
            } else {
                SafeToast.show("Login Rtm Fail Error:" + resultCode + ",Message:" + message);
            }
        });
    }

    private void getRoomList() {
        // 活跃课堂
        EduRTCManager.ins().getRTMClient().requestActiveClassList(new IRequestCallback<UpdateActiveClassListEvent>() {
            @Override
            public void onSuccess(UpdateActiveClassListEvent data) {
                refreshActiveClassEvent(data);
            }

            @Override
            public void onError(int errorCode, String message) {

            }
        });
        // 历史记录
        EduRTCManager.ins().getRTMClient().requestHistoryClassList(new IRequestCallback<UpdateHistoryClassListEvent>() {
            @Override
            public void onSuccess(UpdateHistoryClassListEvent data) {
                refreshHistoryClassEvent(data);
            }

            @Override
            public void onError(int errorCode, String message) {

            }
        });
    }


    @Override
    protected void setupStatusBar() {
        WindowUtils.setLayoutFullScreen(getWindow());
    }

    @Override
    protected void onResume() {
        super.onResume();
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        EduRTCManager.ins().getRTMClient().removeAllEventListener();
        EducationDataManager.release();
        EduRTCManager.destroyRooms();
        EduRTCManager.destroyEngine();
    }

    public void refreshActiveClassEvent(UpdateActiveClassListEvent event) {
        if (event != null && event.getEduActiveRoomInfoList() != null && mClassRoomListAdapter != null) {
            mClassRoomListAdapter.setActiveClassList(event.getEduActiveRoomInfoList());
        }
    }

    public void refreshHistoryClassEvent(UpdateHistoryClassListEvent event) {
        if (event != null && event.getEduHistoryRoomInfoList() != null && mClassRoomListAdapter != null) {
            mClassRoomListAdapter.setHistoryClassList(event.getEduHistoryRoomInfoList());
        }
    }

    private void joinClass(JoinClassResult result) {
        mLastClickTs = 0;
        if (result == null || result.roomInfo == null || TextUtils.isEmpty(result.roomInfo.roomId)) {
            LectureClassRoomMainActivity.openClassRoomMainActivityFailed(ClassRoomListActivity.this, result == null ? 0 : result.errorCode);
            return;
        }
        if (result.roomInfo.roomType == CLASS_TYPE_LECTURE) {
            LectureClassRoomMainActivity.openClassRoomMainActivity(ClassRoomListActivity.this, result.roomInfo.appId,
                    result.token, result.roomInfo.roomId, result.roomInfo.getDecodedRoomName(),
                    result.groupToken, result.groupUserList,
                    result.teacherInfo.userId, result.teacherInfo.userName,
                    result.teacherInfo.isMicOn, result.teacherInfo.isCameraOn,
                    SolutionDataManager.ins().getUserId(), SolutionDataManager.ins().getUserName(), result.isMicOn,
                    result.roomInfo.isRecording, result.roomInfo.status == CLASS_STARTED,
                    result.roomInfo.beginClassTimeReal, System.currentTimeMillis() - result.roomInfo.beginClassTimeReal / 1000_000,
                    result.roomInfo.enableInteractive, result.roomInfo.enableGroupSpeech,
                    result.currentMicUser, result.errorCode);
        } else if (result.roomInfo.roomType == CLASS_TYPE_BREAK_OUT) {
            BreakoutClassRoomMainActivity.openClassRoomMainActivity(ClassRoomListActivity.this, result.roomInfo.appId,
                    result.token, result.roomInfo.roomId, result.roomInfo.getDecodedRoomName(),
                    result.groupRoomId, result.groupToken, result.groupUserList,
                    result.teacherInfo.userId, result.teacherInfo.userName,
                    result.teacherInfo.isMicOn, result.teacherInfo.isCameraOn,
                    SolutionDataManager.ins().getUserId(), SolutionDataManager.ins().getUserName(), result.isMicOn,
                    result.roomInfo.isRecording, result.roomInfo.status == CLASS_STARTED,
                    result.roomInfo.beginClassTimeReal, System.currentTimeMillis() - result.roomInfo.beginClassTimeReal / 1000_000,
                    result.roomInfo.enableInteractive, result.roomInfo.enableGroupSpeech,
                    result.currentMicUser, result.errorCode);
        } else {
            LectureClassRoomMainActivity.openClassRoomMainActivityFailed(ClassRoomListActivity.this, result.errorCode);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1000 && resultCode == RESULT_OK) {
            showClassEndDialog();
        }
    }

    private void showClassEndDialog() {
        CommonDialog dialog = new CommonDialog(this);
        dialog.setCancelable(true);
        dialog.setMessage("课程已结束");
        dialog.setPositiveListener((v) -> dialog.dismiss());
        dialog.show();
    }

    public static class ClassItemDecoration extends RecyclerView.ItemDecoration {
        private final float mHeight = Utilities.dip2Px(36);
        private final Paint mPaint = new Paint();

        public ClassItemDecoration() {
        }

        @Override
        public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
            ClassRoomListAdapter adapter = (ClassRoomListAdapter) parent.getAdapter();
            if (adapter != null && parent.getChildAdapterPosition(view) == adapter.getActiveClassSize()) {
                outRect.top = (int) mHeight;
            }
        }

        @Override
        public void onDraw(@NonNull Canvas c, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
            float left = (float) parent.getWidth() / 2 - Utilities.dip2Px(32);
            int childCount = parent.getChildCount();
            mPaint.setTextSize(Utilities.sp2px(16));
            mPaint.setColor(Color.WHITE);
            mPaint.setStyle(Paint.Style.FILL);
            ClassRoomListAdapter adapter = (ClassRoomListAdapter) parent.getAdapter();
            for (int i = 0; i < childCount; i++) {
                View child = parent.getChildAt(i);
                int pos = parent.getChildAdapterPosition(child);
                if (adapter != null && pos == adapter.getActiveClassSize()) {
                    c.drawText("历史课堂", left, child.getTop() - Utilities.dip2Px(23), mPaint);
                }
            }
        }
    }

    @Keep
    @SuppressWarnings("unused")
    public static void prepareSolutionParams(Activity activity, IAction<Object> doneAction) {
        Log.d(TAG, "prepareSolutionParams() invoked");
        IRequestCallback<ServerResponse<RTSInfo>> callback = new IRequestCallback<ServerResponse<RTSInfo>>() {
            @Override
            public void onSuccess(ServerResponse<RTSInfo> response) {
                RTSInfo data = response == null ? null : response.getData();
                if (data == null || !data.isValid()) {
                    onError(-1, "");
                    return;
                }
                Intent intent = new Intent(Intent.ACTION_MAIN);
                intent.setClass(Utilities.getApplicationContext(), ClassRoomListActivity.class);
                intent.putExtra(KEY_RTM, data);
                activity.startActivity(intent);
                if (doneAction != null) {
                    doneAction.act(null);
                }
            }

            @Override
            public void onError(int errorCode, String message) {
                if (doneAction != null) {
                    doneAction.act(null);
                }
            }
        };
        JoinRTSRequest request = new JoinRTSRequest();
        request.scenesName = EduConstants.SOLUTION_NAME_ABBR;
        request.loginToken = SolutionDataManager.ins().getToken();
        request.volcAccountId = EduConstants.ACCOUNT_ID;
        request.vodSpace = EduConstants.VOD_SPACE;

        JoinRTSManager.setAppInfoAndJoinRTM(request, callback);
    }
}
