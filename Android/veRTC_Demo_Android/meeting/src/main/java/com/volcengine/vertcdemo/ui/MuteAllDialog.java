//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.volcengine.vertcdemo.ui;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatDialog;

import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.meeting.R;


public class MuteAllDialog extends AppCompatDialog {

    private final CheckBox mMicPermitCb;
    private final Button mPositiveBtn;
    private final Button mNegativeBtn;

    public MuteAllDialog(Context context, IUIMeetingDef.IRoleDesc roleDesc) {
        super(context, com.ss.video.rtc.demo.basic_module.R.style.CommonDialog);
        this.setCancelable(true);
        LayoutInflater inflater = LayoutInflater.from(this.getContext());
        View view = inflater.inflate(R.layout.dialog_mute_all_mic, null);
        TextView tips = view.findViewById(R.id.mute_all_mic_desc);
        mMicPermitCb = view.findViewById(R.id.mic_permission_granted);
        mPositiveBtn = view.findViewById(R.id.dialog_positive_btn);
        mNegativeBtn = view.findViewById(R.id.dialog_negative_btn);
        tips.setText(context.getString(R.string.mute_all_audio_tips, roleDesc.participantDesc()));
        mMicPermitCb.setText(context.getString(R.string.mic_permission_granted, roleDesc.participantDesc()));
        setContentView(view, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
        view.setOnClickListener((v) -> {
            this.dismiss();
        });
    }

    public CheckBox getMicPermitCb() {
        return mMicPermitCb;
    }

    public void setNegativeListener(View.OnClickListener listener) {
        this.mNegativeBtn.setOnClickListener(listener);
    }

    public void setPositiveListener(View.OnClickListener listener) {
        this.mPositiveBtn.setOnClickListener(listener);
    }
}
