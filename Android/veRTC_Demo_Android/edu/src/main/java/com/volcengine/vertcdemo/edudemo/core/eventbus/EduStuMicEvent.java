package com.volcengine.vertcdemo.edudemo.core.eventbus;

import com.volcengine.vertcdemo.edudemo.bean.EduUserInfo;

public class EduStuMicEvent {

    public boolean isMicOn;
    public EduUserInfo info;

    public EduStuMicEvent(boolean isMicOn, EduUserInfo info) {
        this.isMicOn = isMicOn;
        this.info = info;
    }
}
