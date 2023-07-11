// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.event;

import com.volcengine.vertcdemo.edu.bean.EduUserInfo;

public class EduStuMicEvent {

    public boolean isMicOn;
    public EduUserInfo info;

    public EduStuMicEvent(boolean isMicOn, EduUserInfo info) {
        this.isMicOn = isMicOn;
        this.info = info;
    }
}
