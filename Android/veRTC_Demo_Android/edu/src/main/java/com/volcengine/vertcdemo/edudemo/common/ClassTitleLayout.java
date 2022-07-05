package com.volcengine.vertcdemo.edudemo.common;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.volcengine.vertcdemo.edu.R;

public class ClassTitleLayout extends ConstraintLayout {
    private ImageView mBackIV;
    private ImageView mRecordStatusIV;
    private TextView mClassTitleTV;
    private TextView mClassIDTV;
    private TextView mClassDurationTV;

    private boolean mIsClassStarted = false;

    private long mEnterClassMs = 0L;
    private long mClassLastMs = 0L;
    private final Runnable mCountingRunnable = this::updateDuration;

    public ClassTitleLayout(@NonNull Context context) {
        super(context);
        initView();
    }

    public ClassTitleLayout(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public ClassTitleLayout(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    private void initView() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_edu_title_layout, this, true);
        mBackIV = findViewById(R.id.layout_edu_title_back);
        mClassTitleTV = findViewById(R.id.layout_edu_title_class_title);
        mClassIDTV = findViewById(R.id.layout_edu_title_class_id);
        mClassDurationTV = findViewById(R.id.layout_edu_title_duration);
        mRecordStatusIV = findViewById(R.id.layout_edu_title_record_status);

        mClassDurationTV.setText("暂未开始上课");
        mRecordStatusIV.setVisibility(GONE);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        Log.d("ClassTitleLayout", "");
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        Log.d("ClassTitleLayout", "");
    }

    public void setTitleMessage(String className, String classId) {
        mClassTitleTV.setText(className);
        mClassIDTV.setText(String.format("课堂ID: %s", classId));
    }

    public void startClass(long enterClassAt, long classLastMs) {
        if (mIsClassStarted) {
            return;
        }
        mIsClassStarted = true;
        mEnterClassMs = enterClassAt;
        mClassLastMs = classLastMs;
        mClassDurationTV.removeCallbacks(mCountingRunnable);
        updateDuration();
    }

    public void endClass() {
        mIsClassStarted = false;
        mEnterClassMs = 0;
        mClassLastMs = 0;
        mClassDurationTV.removeCallbacks(mCountingRunnable);
        mClassDurationTV.setText("暂未开始上课");
    }

    public void setIsRecord(boolean isRecord) {
        mRecordStatusIV.setVisibility(isRecord ? View.VISIBLE : View.GONE);
    }

    public void setOnBackPressListener(View.OnClickListener listener) {
        mBackIV.setOnClickListener(listener);
    }

    private void updateDuration() {
        long duration = System.currentTimeMillis() - mEnterClassMs + mClassLastMs;
        long min = duration / 1000 / 60;
        long s = (duration / 1000) % 60;
        String str = "";
        if (min < 10) {
            str = str + "0";
        }
        str += min;
        str += ":";
        if (s < 10) {
            str = str + "0";
        }
        str += s;
        mClassDurationTV.setText(str);
        mClassDurationTV.postDelayed(mCountingRunnable, 500);
    }
}
