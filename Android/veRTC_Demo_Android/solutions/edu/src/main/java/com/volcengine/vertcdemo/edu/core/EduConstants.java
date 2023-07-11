// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.core;

import com.volcengine.vertcdemo.edu.BuildConfig;

public class EduConstants {

    public final static String SOLUTION_NAME_ABBR = "edu";

    /**
     * 火山控制台账户id， 使用教育录制功能时需要。 https://console.volcengine.com/user/basics/
     */
    public static final String ACCOUNT_ID = BuildConfig.ACCOUNT_ID;
    /**
     * 点播空间名， 使用教育录制功能时需要。https://console.volcengine.com/vod/overview/
     */
    public static final String VOD_SPACE = BuildConfig.VOD_SPACE;

    public final static String APP_ID = "app_id";
    public final static String ROOM_TOKEN = "room_token";
    public final static String ROOM_ID = "room_id";
    public final static String ROOM_NAME = "room_name";

    public final static String GROUP_ROOM_ID = "group_room_id";
    public final static String GROUP_TOKEN = "group_token";
    public final static String GROUP_USER_LIST = "group_user_list";

    public final static String TEACHER_UID = "teacher_uid";
    public final static String TEACHER_NAME = "teacher_name";
    public final static String TEACHER_MIC_ON = "teacher_mic_on";
    public final static String TEACHER_CAMERA_ON = "teacher_camera_on";

    public final static String SELF_UID = "self_uid";
    public final static String SELF_NAME = "self_name";
    public final static String SELF_MIC_ON = "self_mic_on";

    public final static String IS_RECORD = "is_record";

    public final static String IS_CLASS_START = "is_class_start";
    public final static String CLASS_START_AT = "class_start_at";
    public final static String CLASS_DURATION = "class_duration";

    public final static String IS_VIDEO_INTERACT = "is_video_interact";
    public final static String IS_GROUP_SPEECH = "is_group_speech";
    public final static String MIC_ON_STUDENTS = "mic_on_students";

    public final static String ERROR_CODE = "error_code";
}
