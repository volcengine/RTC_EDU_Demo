package com.volcengine.vertcdemo.utils;

import android.text.Editable;
import android.text.InputFilter;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.ss.video.rtc.demo.basic_module.adapter.TextWatcherAdapter;
import com.volcengine.vertcdemo.common.LengthFilterWithCallback;

import java.util.regex.Pattern;

public class TextWatcherHelper {

    private static final int AUTO_DISMISS_DURATION = 2500;

    private final String mInputRegex;
    private final EditText mContentEV;
    private final TextView mErrorTV;
    private final String mLengthError;
    private final String mContentError;

    private boolean mIsLengthOverflow = false;
    private boolean mIsContentWarn = false;

    private final Runnable mErrorDismissRunnable = new Runnable() {
        @Override
        public void run() {
            mErrorTV.setVisibility(View.INVISIBLE);
        }
    };

    private final TextWatcherAdapter editWatcher = new TextWatcherAdapter() {
        @Override
        public void afterTextChanged(Editable s) {
            if (!Pattern.matches(mInputRegex, mContentEV.getText().toString())) {
                showContentError();
                mIsContentWarn = true;
            } else {
                if (mIsLengthOverflow) {
                    showLengthError();
                } else {
                    mErrorTV.setVisibility(View.INVISIBLE);
                }
                mIsContentWarn = false;
            }
        }
    };

    private void showLengthError() {
        mErrorTV.setVisibility(View.VISIBLE);
        mErrorTV.setText(mLengthError);
        mErrorTV.removeCallbacks(mErrorDismissRunnable);
        mErrorTV.postDelayed(mErrorDismissRunnable, AUTO_DISMISS_DURATION);
    }

    public void showContentError() {
        mErrorTV.setVisibility(View.VISIBLE);
        mErrorTV.setText(mContentError);
        mErrorTV.removeCallbacks(mErrorDismissRunnable);
        mErrorTV.postDelayed(mErrorDismissRunnable, AUTO_DISMISS_DURATION);
    }

    public TextWatcherHelper(EditText contentEV, TextView errorTV, String inputRegex, int contentError, int inputMaxLength, int lengthError) {
        mContentEV = contentEV;
        mErrorTV = errorTV;
        mInputRegex = inputRegex;
        mContentError = contentEV.getResources().getString(contentError);
        mLengthError = contentEV.getResources().getString(lengthError);

        InputFilter lengthFilter = new LengthFilterWithCallback(inputMaxLength, (overflow) -> {
            if (overflow) {
                if (mIsContentWarn) {
                    showContentError();
                } else {
                    showLengthError();
                }
            } else {
                if (mIsContentWarn) {
                    showContentError();
                } else {
                    mErrorTV.setVisibility(View.INVISIBLE);
                }
            }
            mIsLengthOverflow = overflow;
        });
        InputFilter[] filters = new InputFilter[]{lengthFilter};
        mContentEV.setFilters(filters);

        mContentEV.removeTextChangedListener(editWatcher);
        mContentEV.addTextChangedListener(editWatcher);
    }

    public boolean isContentWarn() {
        return mIsContentWarn;
    }
}
