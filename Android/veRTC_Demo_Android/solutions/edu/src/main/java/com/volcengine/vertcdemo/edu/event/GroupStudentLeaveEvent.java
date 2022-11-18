package com.volcengine.vertcdemo.edu.event;

import com.volcengine.vertcdemo.edu.bean.EduUserInfo;

public class GroupStudentLeaveEvent {
    public EduUserInfo info;

    public GroupStudentLeaveEvent(EduUserInfo info) {
        this.info = info;
    }
}
