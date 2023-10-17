//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.volcengine.vertcdemo.ui;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatDialog;

import com.ss.video.rtc.demo.basic_module.R.id;
import com.ss.video.rtc.demo.basic_module.R.layout;
import com.ss.video.rtc.demo.basic_module.R.style;
import com.ss.video.rtc.demo.basic_module.utils.WindowUtils;
import com.volcengine.vertcdemo.meeting.R;

import java.util.ArrayList;
import java.util.List;

public class ShareDialog extends AppCompatDialog {
    private final List<String> mList = new ArrayList();
    private View mView;
    private ShareDialog.OnItemClickListener mItemClick;

    public ShareDialog(Context context, List<String> list) {
        super(context, style.CommonDialog);
        mList.addAll(list);
    }

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LayoutInflater inflater = LayoutInflater.from(getContext());
        mView = inflater.inflate(layout.dialog_common_list, (ViewGroup) null, false);
        ScrollView scrollView = (ScrollView) mView.findViewById(id.dialog_list_sv);
        LinearLayout linearLayout = (LinearLayout) mView.findViewById(id.dialog_list_ll);
        Button btn = (Button) mView.findViewById(id.dialog_confirm_btn);
        btn.setText(R.string.common_cancel);
        mView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
        btn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                dismiss();
            }
        });
        scrollView.setMinimumWidth(WindowUtils.getScreenWidth(getContext()));
        View.OnClickListener listener = new View.OnClickListener() {
            public void onClick(View v) {
                int index = (Integer) v.getTag();
                if (mItemClick != null) {
                    mItemClick.onItemClick(index, (String) ShareDialog.this.mList.get(index));
                }
            }
        };
        int height = -1;

        int i;
        for (i = 0; i < mList.size(); ++i) {
            View view = inflater.inflate(layout.dialog_list_item, linearLayout, false);
            view.setTag(i);
            view.setOnClickListener(listener);
            if (height < 0) {
                view.measure(0, 0);
                height = view.getMeasuredHeight();
            }

            TextView tv = (TextView) view.findViewById(id.list_item_tv);
            tv.setText((CharSequence) mList.get(i));
            if (i == mList.size() - 1) {
                view.findViewById(id.list_item_divider).setVisibility(View.GONE);
            }

            linearLayout.addView(view, new LayoutParams(-1, -2));
        }

        i = (int) ((float) WindowUtils.getScreenHeight(getContext()) * 70.0F / 100.0F);
        if (height * mList.size() > i) {
            LayoutParams layoutParams = scrollView.getLayoutParams();
            layoutParams.height = i;
        }

    }

    public void setOnItemClickListener(OnItemClickListener itemClickListener) {
        mItemClick = itemClickListener;
    }

    public void show() {
        super.show();
        android.view.WindowManager.LayoutParams params = getWindow().getAttributes();
        params.width = WindowUtils.getScreenWidth(getContext());
        params.height = -1;
        params.gravity = 80;
        getWindow().setAttributes(params);
        getWindow().setContentView(mView);
    }

    public interface OnItemClickListener {
        void onItemClick(int var1, String var2);
    }
}
