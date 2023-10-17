package com.volcengine.vertcdemo.ui.widget;

import android.content.Context;
import android.os.Build;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.volcengine.vertcdemo.meeting.R;

public class WBPagePanel extends LinearLayout {

    private TextView mPageInfoView;
    private View mPagePre;
    private View mPageNext;
    private View mPageAdd;
    private View mPageAddTips;

    public WBPagePanel(Context context) {
        super(context);
        init(context);
    }

    public WBPagePanel(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public WBPagePanel(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public WBPagePanel(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context);
    }

    private void init(Context context) {
        LayoutInflater.from(context).inflate(R.layout.view_white_board_page, this);
        mPageInfoView = findViewById(R.id.whiteboard_page_text);
        mPagePre = findViewById(R.id.whiteboard_page_pre);
        mPageNext = findViewById(R.id.whiteboard_page_next);
        mPageAdd = findViewById(R.id.whiteboard_page_add);
        mPageAddTips = findViewById(R.id.whiteboard_page_add_tips);
    }

    public TextView getPageInfoView() {
        return mPageInfoView;
    }

    public View getPagePre() {
        return mPagePre;
    }

    public View getPageNext() {
        return mPageNext;
    }

    public View getPageAdd() {
        return mPageAdd;
    }

    public View getPageAddTips() {
        return mPageAddTips;
    }
}
