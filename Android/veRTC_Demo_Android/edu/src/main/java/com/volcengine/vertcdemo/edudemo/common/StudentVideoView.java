package com.volcengine.vertcdemo.edudemo.common;

import android.content.Context;
import android.graphics.Color;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.TextureView;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;
import com.volcengine.vertcdemo.edudemo.core.EduRTCManager;

public class StudentVideoView extends FrameLayout {

    private FrameLayout mViewContainer;
    private TextView mStudentName;
    private EduUserInfo mUserInfo;

    public StudentVideoView(@NonNull Context context) {
        super(context);
        initView();
    }

    public StudentVideoView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public StudentVideoView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    private void initView() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_edu_student, this, true);
        mViewContainer = findViewById(R.id.layout_edu_student_video);
        mStudentName = findViewById(R.id.layout_edu_student_name);
    }

    public void bindInfo(EduUserInfo info, boolean isFromClass) {
        if (info == null) {
            mViewContainer.removeAllViews();
            mStudentName.setText(null);
            setCameraStatus(false, null, isFromClass);
        } else {
            mStudentName.setText(info.userName);
            setCameraStatus(info.isMicOn, info.userId, isFromClass);
        }
        mUserInfo = info;
    }

    public String getUserId() {
        return mUserInfo == null ? null : mUserInfo.userId;
    }

    private void setCameraStatus(boolean isOn, String uid, boolean isFromClass) {
        if (mUserInfo == null || !TextUtils.equals(uid, mUserInfo.userId) || mUserInfo.isMicOn != isOn) {
            // ???????????????????????????????????????????????????????????????????????????????????????????????????view
            mViewContainer.removeAllViews();
        }
        EduRTCManager.setUidInClass(uid, isOn);
        // ?????????????????????????????? ?????? ??????????????????????????????????????????
        if (isOn == isFromClass) {
            TextureView view = EduRTCManager.getUserRenderView(uid);
            // ???????????????view??????
            if (mViewContainer.getChildCount() == 0 || mViewContainer.getChildAt(0) != view) {
                Utilities.removeFromParent(view);
                if (TextUtils.equals(uid, SolutionDataManager.ins().getUserId())) {
                    EduRTCManager.setupLocalVideo(view);
                } else {
                    if (isFromClass) {
                        EduRTCManager.setupClassRemoteVideo(uid, view);
                    } else {
                        EduRTCManager.setupGroupRemoteVideo(uid, view);
                    }
                }
                mViewContainer.addView(view, new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            }
        } else {
            TextView tv = new TextView(Utilities.getApplicationContext());
            tv.setText("?????????");
            tv.setGravity(Gravity.CENTER);
            tv.setTextSize(Utilities.dip2Px(7));
            tv.setTextColor(Color.parseColor("#86909C"));
            mViewContainer.addView(tv, new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        }
    }
}
