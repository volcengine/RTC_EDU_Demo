package com.volcengine.vertcdemo.edu.event;

import com.volcengine.vertcdemo.edu.bean.EduUserInfo;

public class GroupStudentJoinEvent {
    public EduUserInfo info;

    public GroupStudentJoinEvent(EduUserInfo info) {
        this.info = info;
    }
}
