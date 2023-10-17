package com.volcengine.vertcdemo.core.impl;

import androidx.annotation.NonNull;

import com.google.gson.JsonObject;
import com.ss.bytertc.engine.RTCVideo;
import com.volcengine.vertcdemo.common.AbsBroadcast;
import com.volcengine.vertcdemo.core.net.rtm.RTMBaseClient;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizInform;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;

public class RtmClient extends RTMBaseClient {

    public RtmClient(@NonNull RTCVideo RTCEngine, @NonNull RtmInfo rtmInfo) {
        super(RTCEngine, rtmInfo);
    }

    @Override
    protected JsonObject getCommonParams(String cmd) {
        throw new IllegalStateException("unexpected call");
    }

    @Override
    protected void initEventListener() {
    }

    public void putEventListener(AbsBroadcast<? extends RTMBizInform> absBroadcast) {
        mEventListeners.put(absBroadcast.getEvent(), absBroadcast);
    }

    public void removeEventListener() {
        mEventListeners.clear();
    }
}
