// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.event;

public class EduTeacherCameraStatusEvent {

    public String uid;
    public boolean status;

    public EduTeacherCameraStatusEvent(String uid, boolean status) {
        this.uid = uid;
        this.status = status;
    }
}
