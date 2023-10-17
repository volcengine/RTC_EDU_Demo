// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.login;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.common.IAction;
import com.volcengine.vertcdemo.core.SolutionDataManager;

@SuppressWarnings("unused")
@Keep
public class ILoginImpl implements ILogin {
    @Override
    public void showLoginView(@NonNull ActivityResultLauncher<Intent> launcher) {
        String token = SolutionDataManager.ins().getToken();
        if (TextUtils.isEmpty(token)) {
            final Context context = Utilities.getApplicationContext();
            launcher.launch(new Intent(context, LoginActivity.class));
        }
    }

    @Override
    public void closeAccount(IAction<Boolean> action) {
        SolutionDataManager.ins().logout();
        if (action != null) {
            action.act(true);
        }
    }
}
