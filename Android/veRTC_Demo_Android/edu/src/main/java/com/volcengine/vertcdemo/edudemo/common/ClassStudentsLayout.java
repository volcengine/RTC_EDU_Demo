package com.volcengine.vertcdemo.edudemo.common;

import android.content.Context;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;
import com.volcengine.vertcdemo.edudemo.core.EduRTCManager;

import java.util.LinkedList;
import java.util.List;

public class ClassStudentsLayout extends FrameLayout {

    private View mShrinkBtn;
    private View mExpandBtn;
    private TextView mRaiseHandBtn;
    private View mContentLayout;
    private LinearLayout mShowingContainer;
    private final List<EduUserInfo> mStudentList = new LinkedList<>();

    private final LayoutParams mStudentParams = new LayoutParams(
            (int) Utilities.dip2Px(120), (int) Utilities.dip2Px(80));

    public ClassStudentsLayout(@NonNull Context context) {
        super(context);
        initView();
    }

    public ClassStudentsLayout(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public ClassStudentsLayout(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    private void initView() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_student_layout, this, true);
        mContentLayout = findViewById(R.id.layout_student_content);
        mShrinkBtn = findViewById(R.id.layout_student_shrink);
        mExpandBtn = findViewById(R.id.layout_student_expand);
        mRaiseHandBtn = findViewById(R.id.layout_student_raise_hand);
        mShowingContainer = findViewById(R.id.layout_student_showing_container);

        mShrinkBtn.setOnClickListener((v) -> setContentStatus(false));
        mExpandBtn.setOnClickListener((v) -> setContentStatus(true));

        mStudentParams.leftMargin = (int) Utilities.dip2Px(4);
        mStudentParams.rightMargin = (int) Utilities.dip2Px(4);
        setStudentList(null);
        setContentStatus(true);
    }

    private void setContentStatus(boolean showContent) {
        if (showContent) {
            mContentLayout.setVisibility(VISIBLE);
            mExpandBtn.setVisibility(GONE);
        } else {
            mContentLayout.setVisibility(GONE);
            mExpandBtn.setVisibility(VISIBLE);
        }
    }

    public void setStudentList(List<EduUserInfo> infoList) {
        mShowingContainer.removeAllViews();
        if (infoList == null || infoList.isEmpty()) {
            mStudentList.clear();
            mShowingContainer.addView(new DefaultStudentView(getContext()), mStudentParams);
        } else {
            for (EduUserInfo info : infoList) {
                StudentVideoView videoView = new StudentVideoView(getContext());
                videoView.bindInfo(info, true);
                mShowingContainer.addView(videoView, mStudentParams);
            }
            mStudentList.addAll(infoList);
        }
    }

    public void addUser(EduUserInfo info) {
        if (info == null || TextUtils.isEmpty(info.userId)) {
            return;
        }
        if (mStudentList.isEmpty()) {
            mShowingContainer.removeAllViews();
        } else {
            for (EduUserInfo temp : mStudentList) {
                if (TextUtils.equals(info.userId, temp.userId)) {
                    return;
                }
            }
        }

        mStudentList.add(info);
        StudentVideoView videoView = new StudentVideoView(getContext());
        videoView.bindInfo(info, true);
        mShowingContainer.addView(videoView, mStudentParams);
    }

    public void setHandUpBtnListener(View.OnClickListener clickListener) {
        mRaiseHandBtn.setOnClickListener(clickListener);
    }

    public void removeUser(String uid) {
        if (TextUtils.isEmpty(uid)) {
            return;
        }
        for (int i = 0; i < mStudentList.size(); i++) {
            if (TextUtils.equals(uid, mStudentList.get(i).userId)) {
                mShowingContainer.removeViewAt(i);
                mStudentList.remove(i);
                break;
            }
        }
        if (mStudentList.isEmpty()) {
            mShowingContainer.removeAllViews();
            mShowingContainer.addView(new DefaultStudentView(getContext()), mStudentParams);
        }
    }

    public void clearStudentList() {
        for (EduUserInfo info : mStudentList) {
            EduRTCManager.unSubscribe(info.userId);
        }
        mStudentList.clear();
        mShowingContainer.removeAllViews();
        mShowingContainer.addView(new DefaultStudentView(getContext()), mStudentParams);
    }

    public void expand() {
        setContentStatus(true);
    }

    public void shrink() {
        setContentStatus(false);
    }

    /**
     * 设置自己的举手状态
     */
    public void setHandsUpStatus(boolean isHandsUp) {
        mRaiseHandBtn.setText(isHandsUp ? "取消举手" : "我要举手");
    }

    /**
     * 举手按钮是否可见
     */
    public void setHandsUpVisible(boolean isVisible) {
        mRaiseHandBtn.setVisibility(isVisible ? View.VISIBLE : View.INVISIBLE);
        mRaiseHandBtn.setEnabled(isVisible);
    }
}
