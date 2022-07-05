package com.volcengine.vertcdemo.edudemo.core.eventbus;

import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.edudemo.bean.EduRoomInfo;

import java.util.ArrayList;
import java.util.List;

public class UpdateActiveClassListEvent extends ArrayList implements RTMBizResponse {

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
