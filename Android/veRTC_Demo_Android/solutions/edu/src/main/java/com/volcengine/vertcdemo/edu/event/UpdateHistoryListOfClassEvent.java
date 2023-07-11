// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.event;

import com.volcengine.vertcdemo.common.GsonUtils;
import com.volcengine.vertcdemo.core.net.rts.RTSBizResponse;
import com.volcengine.vertcdemo.edu.bean.EduRecordInfo;

import java.util.ArrayList;
import java.util.List;

public class UpdateHistoryListOfClassEvent extends ArrayList implements RTSBizResponse {

    private List<EduRecordInfo> eduRecordInfoList;

    public List<EduRecordInfo> getHistoryList() {
        if (eduRecordInfoList == null || eduRecordInfoList.size() != size()) {
            eduRecordInfoList = new ArrayList<>();
            for (int i = 0; i < size(); i++) {
                Object obj = get(i);
                if (obj != null) {
                    try {
                        EduRecordInfo roomInfo = GsonUtils.gson().fromJson(GsonUtils.gson().toJson(obj), EduRecordInfo.class);
                        if (roomInfo != null) {
                            eduRecordInfoList.add(roomInfo);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return eduRecordInfoList;
    }
}
