// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.view;

import android.app.Activity;
import android.app.AlertDialog;
import android.view.View;
import android.widget.TextView;

import com.volcengine.vertcdemo.edu.R;

public class EduDialogHelper {

    public static void openLeaveDialog(Activity activity, View.OnClickListener onLeave) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        View view = activity.getLayoutInflater().inflate(R.layout.layout_leave_class, null);
        builder.setView(view);
        TextView titleTv = view.findViewById(R.id.leave_class_title);
        TextView finishTv = view.findViewById(R.id.leave_class_finish);
        TextView confirmTv = view.findViewById(R.id.leave_class_confirm);
        TextView cancelTv = view.findViewById(R.id.leave_class_cancel);
        builder.setCancelable(true);
        final AlertDialog dialog = builder.create();
        finishTv.setVisibility(View.GONE);

        confirmTv.setOnClickListener((v) -> {
            dialog.dismiss();
            onLeave.onClick(v);
        });

        cancelTv.setOnClickListener((v) -> dialog.dismiss());
        dialog.show();
    }
}
