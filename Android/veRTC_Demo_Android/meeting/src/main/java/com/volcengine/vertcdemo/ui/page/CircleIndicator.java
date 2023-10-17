package com.volcengine.vertcdemo.ui.page;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.volcengine.vertcdemo.meeting.R;

public class CircleIndicator extends View {
    private Paint circlePaint;

    private int mPageNum;
    private float mScrollPercent = 0f;
    private int mCurrentPosition;
    private int mGapSize;

    private float mRadius;
    private int mColorOn;
    private int mColorOff;

    public CircleIndicator(Context context) {
        super(context);
        init();
    }

    public CircleIndicator(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CircleIndicator(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public CircleIndicator(Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        mRadius = dp2px(3);
        circlePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mColorOn = getResources().getColor(R.color.page_indicator_on);
        mColorOff = getResources().getColor(R.color.page_indicator_off);
        mGapSize = dp2px(10);
    }

    public static int dp2px(final float dpValue) {
        final float scale = Resources.getSystem().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }

    public void setSelectDotColor(int colorOn) {
        this.mColorOn = colorOn;
    }

    public void setUnSelectDotColor(int colorOff) {
        this.mColorOff = colorOff;
    }

    public void onPageScrolled(int position, float percent) {
        mScrollPercent = percent;
        mCurrentPosition = position;
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (mPageNum <= 0) {
            return;
        }
        float left = (getWidth() - (mPageNum - 1) * mGapSize) * 0.5f;
        float height = getHeight() * 0.5f;
        circlePaint.setColor(mColorOff);
        for (int i = 0; i < mPageNum; i++) {
            canvas.drawCircle(left + i * mGapSize, height, mRadius, circlePaint);
        }
        circlePaint.setColor(mColorOn);
        canvas.drawCircle(left + mCurrentPosition * mGapSize + mGapSize * mScrollPercent, height, mRadius,
                circlePaint);
    }

    public void setPageNum(int num) {
        mPageNum = num;
        invalidate();
    }
}
