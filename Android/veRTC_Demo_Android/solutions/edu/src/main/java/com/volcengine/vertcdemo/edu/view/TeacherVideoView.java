// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.view;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.TextureView;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edu.bean.EduUserInfo;
import com.volcengine.vertcdemo.edu.core.EduRTCManager;
import com.volcengine.vertcdemo.utils.Utils;

public class TeacherVideoView extends ConstraintLayout {
    private FrameLayout mViewContainer;
    private FrameLayout mCameraOffIv;
    private TextView mTeacherName;
    private ImageView mTeacherMicOnIv;
    private ImageView mTeacherCameraOnIv;

    public TeacherVideoView(@NonNull Context context) {
        super(context);
        initView();
    }

    public TeacherVideoView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public TeacherVideoView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    private void initView() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_edu_teacher, this, true);
        mViewContainer = findViewById(R.id.layout_edu_teacher_video_container);
        mCameraOffIv = findViewById(R.id.layout_edu_teacher_video_camera_off);
        mTeacherName = findViewById(R.id.layout_edu_teacher_name);
        mTeacherMicOnIv = findViewById(R.id.layout_edu_teacher_mic_on);
        mTeacherCameraOnIv = findViewById(R.id.layout_edu_teacher_camera_on);
    }

    public void bindInfo(EduUserInfo info) {
        if (info == null) {
            mTeacherName.setText(null);
            setCameraStatus(false, null);
            setMicStatus(false, null);
        } else {
            mTeacherName.setText(info.userName);
            setCameraStatus(info.isCameraOn, info.userId);
            setMicStatus(info.isMicOn, info.userId);
        }
    }

    public void setCameraStatus(boolean isOn, String uid) {
        mViewContainer.removeAllViews();
        EduRTCManager.setUidInClass(uid, true);
        if (isOn) {
            TextureView view = EduRTCManager.getUserRenderView(uid);
            Utils.removeFromParent(view);
            EduRTCManager.setupClassRemoteVideo(uid, view);
            mViewContainer.addView(view, new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT));
            mCameraOffIv.setVisibility(GONE);
        } else {
            mCameraOffIv.setVisibility(VISIBLE);
        }

        mTeacherCameraOnIv.setImageResource(isOn ? R.drawable.camera_on : R.drawable.camera_off_red);
    }

    public void setMicStatus(boolean isOn, String uid) {
        mTeacherMicOnIv.setImageResource(isOn ? R.drawable.mic_on : R.drawable.mic_off_red);
    }
}
