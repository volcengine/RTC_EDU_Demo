// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.feature.classroomlist;

import com.google.gson.annotations.SerializedName;
import com.vertcdemo.joinrtsparams.bean.JoinRTSRequest;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.edu.core.EduConstants;

public class EduJoinRTSRequest extends JoinRTSRequest {
    @SerializedName("account_id")
    public final String volcAccountId;
    @SerializedName("vod_space")
    public final String vodSpace;

    public EduJoinRTSRequest() {
        super(EduConstants.SOLUTION_NAME_ABBR, SolutionDataManager.ins().getToken());
        this.volcAccountId = EduConstants.ACCOUNT_ID;
        this.vodSpace = EduConstants.VOD_SPACE;
    }

    @Override
    public String toString() {
        return "EduJoinRTSRequest{" +
                "scenesName='" + scenesName + '\'' +
                ", loginToken='" + loginToken + '\'' +
                ", volcAccountId='" + volcAccountId + '\'' +
                ", vodSpace='" + vodSpace + '\'' +
                '}';
    }
}
