package com.volcengine.vertcdemo.edudemo.core.eventbus;

import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;

public class GroupStudentLeaveEvent {
    public EduUserInfo info;

    public GroupStudentLeaveEvent(EduUserInfo info) {
        this.info = info;
    }
}
