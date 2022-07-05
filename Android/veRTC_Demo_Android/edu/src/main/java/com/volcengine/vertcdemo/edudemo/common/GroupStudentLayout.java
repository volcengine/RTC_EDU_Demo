package com.volcengine.vertcdemo.edudemo.common;

import android.content.Context;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;

import java.util.LinkedList;
import java.util.List;

public class GroupStudentLayout extends FrameLayout {

    private LinearLayout mGroupStudentContainer;
    private final List<EduUserInfo> mStudentList = new LinkedList<>();

    private final LayoutParams mStudentParams = new LayoutParams(
            (int) Utilities.dip2Px(120), (int) Utilities.dip2Px(80));

    public GroupStudentLayout(@NonNull Context context) {
        super(context);
        initView();
    }

    public GroupStudentLayout(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public GroupStudentLayout(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    private void initView() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_group_student_layout, this, true);
        mGroupStudentContainer = findViewById(R.id.layout_group_student_container);

        mStudentParams.leftMargin = (int) Utilities.dip2Px(4);
        mStudentParams.rightMargin = (int) Utilities.dip2Px(4);
    }

    public void setStudentList(List<EduUserInfo> infoList) {
        if (infoList == null || infoList.isEmpty() ) {
            mGroupStudentContainer.removeAllViews();
            mStudentList.clear();
            return;
        }
        int infoCount = infoList.size();
        int viewCount = mGroupStudentContainer.getChildCount();
        if (viewCount > infoCount) {
            for (int i = viewCount - 1; i >= infoCount; i--) {
                mGroupStudentContainer.removeViewAt(i);
            }
        } else if (viewCount < infoCount) {
            for (int i = 0; i < infoCount - viewCount; i++) {
                StudentVideoView videoView = new StudentVideoView(getContext());
                mGroupStudentContainer.addView(videoView, mStudentParams);
            }
        }
        mStudentList.clear();
        mStudentList.addAll(infoList);
        for (int i = 0; i < mGroupStudentContainer.getChildCount(); i++) {
            View view = mGroupStudentContainer.getChildAt(i);
            if (view instanceof StudentVideoView) {
                StudentVideoView studentVideoView = (StudentVideoView) view;
                studentVideoView.bindInfo(mStudentList.get(i), false);
            }
        }
    }

    public void clearStudentList() {
        mStudentList.clear();
        mGroupStudentContainer.removeAllViews();
    }

    public void addUser(EduUserInfo info) {
        if (info == null || TextUtils.isEmpty(info.userId)) {
            return;
        }
        removeUser(info.userId);
        mStudentList.add(info);
        StudentVideoView videoView = new StudentVideoView(getContext());
        videoView.bindInfo(info, false);
        mGroupStudentContainer.addView(videoView, mStudentParams);
    }

    public void updateUserInfo(EduUserInfo info) {
        if (info == null || TextUtils.isEmpty(info.userId)) {
            return;
        }

        for (int i = 0; i < mGroupStudentContainer.getChildCount(); i++) {
            View view = mGroupStudentContainer.getChildAt(i);
            if (view instanceof StudentVideoView) {
                StudentVideoView studentVideoView = (StudentVideoView) view;
                if (TextUtils.equals(studentVideoView.getUserId(), info.userId)) {
                    studentVideoView.bindInfo(info, false);
                    break;
                }
            }
        }
    }

    public void removeUser(String uid) {
        if (TextUtils.isEmpty(uid)) {
            return;
        }
        for (int i = 0; i < mStudentList.size(); i++) {
            if (TextUtils.equals(uid, mStudentList.get(i).userId)) {
                mStudentList.remove(i);
                break;
            }
        }
        for (int i = 0; i < mGroupStudentContainer.getChildCount(); i++) {
            View view = mGroupStudentContainer.getChildAt(i);
            if (view instanceof StudentVideoView) {
                StudentVideoView studentVideoView = (StudentVideoView) view;
                if (TextUtils.equals(studentVideoView.getUserId(), uid)) {
                    mGroupStudentContainer.removeViewAt(i);
                    break;
                }
            }
        }
    }
}
