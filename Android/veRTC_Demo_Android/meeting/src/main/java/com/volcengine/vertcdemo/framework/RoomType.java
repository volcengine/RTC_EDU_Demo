package com.volcengine.vertcdemo.framework;

public enum RoomType {
    MEETING("vc"), CLASS_SMALL("edus"), CLASS_LARGE("edub");

    private final String mSense;

    RoomType(String sense) {
        mSense = sense;
    }

    public String getSense() {
        return mSense;
    }
}
