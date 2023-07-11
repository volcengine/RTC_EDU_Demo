// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rts.RTSBizInform;

public class EduRecordInfo implements RTSBizInform {

    @SerializedName("room_name")
    public String roomName;
    @SerializedName("video_url")
    public String videoUrl;
    // 时间单位是ns
    @SerializedName("record_begin_time")
    public long recordBeginTime;
    @SerializedName("record_end_time")
    public long recordEndTime;

    @Override
    public String toString() {
        return "EduRecordInfo{" +
                "roomName='" + roomName + '\'' +
                ", videoUrl='" + videoUrl + '\'' +
                ", recordBeginTime=" + recordBeginTime +
                ", recordEndTime=" + recordEndTime +
                '}';
    }
}
