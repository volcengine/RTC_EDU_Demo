package com.volcengine.vertcdemo.edudemo.core.eventbus;

public class EduTeacherCameraStatusEvent {

    public String uid;
    public boolean status;

    public EduTeacherCameraStatusEvent(String uid, boolean status) {
        this.uid = uid;
        this.status = status;
    }
}
