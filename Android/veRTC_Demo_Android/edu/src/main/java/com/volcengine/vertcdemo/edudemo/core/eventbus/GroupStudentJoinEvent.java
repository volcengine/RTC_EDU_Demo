package com.volcengine.vertcdemo.edudemo.core.eventbus;

import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;

public class GroupStudentJoinEvent {
    public EduUserInfo info;

    public GroupStudentJoinEvent(EduUserInfo info) {
        this.info = info;
    }
}
