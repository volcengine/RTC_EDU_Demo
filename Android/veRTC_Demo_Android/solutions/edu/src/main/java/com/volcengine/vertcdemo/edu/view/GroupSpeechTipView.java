package com.volcengine.vertcdemo.edu.view;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.RelativeLayout;

import com.volcengine.vertcdemo.edu.R;


public class GroupSpeechTipView extends RelativeLayout {
    public GroupSpeechTipView(Context context) {
        super(context);
        initView();
    }

    public GroupSpeechTipView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public GroupSpeechTipView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    private void initView() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_edu_group_speech_tip, this, true);
    }
}
