// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.bean;

import com.google.gson.annotations.SerializedName;
import com.volcengine.vertcdemo.core.net.rts.RTSBizResponse;

import java.util.List;

/**
 * 主动获取大班小组课同组用户返回
 */
public class GetUserListResponse implements RTSBizResponse {
    @SerializedName("group_user_list")
    public List<EduUserInfo> groupUserList;
}
