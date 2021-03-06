package com.volcengine.vertcdemo.edudemo.core.eventbus;

import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.edudemo.bean.EduRecordInfo;

import java.util.ArrayList;
import java.util.List;

public class UpdateHistoryListOfClassEvent extends ArrayList implements RTMBizResponse {

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
