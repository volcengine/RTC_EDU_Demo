package com.volcengine.vertcdemo.edudemo.core.eventbus;

public class EduTeacherMicStatusEvent {

    public String uid;
    public boolean status;

    public EduTeacherMicStatusEvent(String uid, boolean status) {
        this.uid = uid;
        this.status = status;
    }
}
