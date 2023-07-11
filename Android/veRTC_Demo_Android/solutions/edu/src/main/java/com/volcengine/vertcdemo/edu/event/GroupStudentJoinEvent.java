// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.event;

import com.volcengine.vertcdemo.edu.bean.EduUserInfo;

public class GroupStudentJoinEvent {
    public EduUserInfo info;

    public GroupStudentJoinEvent(EduUserInfo info) {
        this.info = info;
    }
}
