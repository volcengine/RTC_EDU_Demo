// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.event;

public class EduTeacherMicStatusEvent {

    public String uid;
    public boolean status;

    public EduTeacherMicStatusEvent(String uid, boolean status) {
        this.uid = uid;
        this.status = status;
    }
}
