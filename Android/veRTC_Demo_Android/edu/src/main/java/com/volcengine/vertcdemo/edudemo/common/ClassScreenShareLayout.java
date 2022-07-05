package com.volcengine.vertcdemo.edudemo.common;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.volcengine.vertcdemo.edu.R;


public class ClassScreenShareLayout extends FrameLayout {
    public ClassScreenShareLayout(@NonNull Context context) {
        super(context);
        initView();
    }

    public ClassScreenShareLayout(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public ClassScreenShareLayout(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    private void initView() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_class_screen_share, this, true);
    }
}
