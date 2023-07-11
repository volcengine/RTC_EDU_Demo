// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.event;

import com.volcengine.vertcdemo.common.GsonUtils;
import com.volcengine.vertcdemo.core.net.rts.RTSBizResponse;
import com.volcengine.vertcdemo.edu.bean.EduRoomInfo;

import java.util.ArrayList;
import java.util.List;

public class UpdateActiveClassListEvent extends ArrayList implements RTSBizResponse {

    private List<EduRoomInfo> eduRoomInfoList;

    public List<EduRoomInfo> getEduActiveRoomInfoList() {
        if (eduRoomInfoList == null || eduRoomInfoList.size() != size()) {
            eduRoomInfoList = new ArrayList<>();
            for (int i = 0; i < size(); i++) {
                Object obj = get(i);
                if (obj != null) {
                    try {
                        EduRoomInfo roomInfo = GsonUtils.gson().fromJson(GsonUtils.gson().toJson(obj), EduRoomInfo.class);
                        if (roomInfo != null) {
                            eduRoomInfoList.add(roomInfo);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return eduRoomInfoList;
    }
}
