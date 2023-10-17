//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.volcengine.vertcdemo.common;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.view.ViewGroup.LayoutParams;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatDialog;

import com.ss.video.rtc.demo.basic_module.R.id;
import com.ss.video.rtc.demo.basic_module.R.layout;
import com.ss.video.rtc.demo.basic_module.R.style;

public class CommonDialog extends AppCompatDialog {
    private TextView mTitleTv;
    private TextView mMessageTv;
    private Button mPositiveBtn;
    private Button mNegativeBtn;
    private View mDivider;

    public CommonDialog(Context context) {
        super(context, style.CommonDialog);
        this.setCancelable(true);
        LayoutInflater inflater = LayoutInflater.from(this.getContext());
        View view = inflater.inflate(layout.dialog_common, (ViewGroup) null);
        this.mTitleTv = (TextView) view.findViewById(id.dialog_title_tv);
        this.mMessageTv = (TextView) view.findViewById(id.dialog_msg_tv);
        this.mPositiveBtn = (Button) view.findViewById(id.dialog_positive_btn);
        this.mNegativeBtn = (Button) view.findViewById(id.dialog_negative_btn);
        this.mDivider = view.findViewById(id.dialog_btn_divider);
        setContentView(view, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
        view.setOnClickListener((v) -> {
            this.dismiss();
        });
    }

    public void setTitle(String title) {
        this.mTitleTv.setVisibility(View.VISIBLE);
        this.mTitleTv.setText(title);
    }

    public void setMessage(String txt) {
        this.mMessageTv.setText(txt);
    }

    public void setNegativeListener(View.OnClickListener listener) {
        this.mDivider.setVisibility(View.VISIBLE);
        this.mNegativeBtn.setVisibility(View.VISIBLE);
        this.mNegativeBtn.setOnClickListener(listener);
    }

    public void setPositiveListener(View.OnClickListener listener) {
        this.mPositiveBtn.setOnClickListener(listener);
    }
}
