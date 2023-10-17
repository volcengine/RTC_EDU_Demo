// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: Apache-2.0

package com.volcengine.vertcdemo.login;

import android.content.Intent;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.common.IAction;

public interface ILogin {

    void showLoginView(@NonNull ActivityResultLauncher<Intent> launcher);

    void closeAccount(IAction<Boolean> action);
}
