// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.core;

import com.volcengine.vertcdemo.core.SolutionDataManager;

public class EducationDataManager {

    private EducationDataManager() {
    }

    public static void init() {

    }

    public static void release() {

    }

    public static String getRoomId() {
        return "";
    }

    public static String getUid() {
        return SolutionDataManager.ins().getUserId();
    }
}
