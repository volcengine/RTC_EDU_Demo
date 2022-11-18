package com.volcengine.vertcdemo.edu.event;

import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.core.net.rts.RTSBizResponse;
import com.volcengine.vertcdemo.edu.bean.EduRoomInfo;

import java.util.ArrayList;
import java.util.List;

public class UpdateHistoryClassListEvent extends ArrayList implements RTSBizResponse {

    private List<EduRoomInfo> eduHistoryRoomInfoList;

    public List<EduRoomInfo> getEduHistoryRoomInfoList() {
        if (eduHistoryRoomInfoList == null || eduHistoryRoomInfoList.size() != size()) {
            eduHistoryRoomInfoList = new ArrayList<>();
            for (int i = 0; i < size(); i++) {
                Object obj = get(i);
                if (obj != null) {
                    try {
                        EduRoomInfo roomInfo = GsonUtils.gson().fromJson(GsonUtils.gson().toJson(obj), EduRoomInfo.class);
                        if (roomInfo != null) {
                            eduHistoryRoomInfoList.add(roomInfo);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return eduHistoryRoomInfoList;
    }
}
