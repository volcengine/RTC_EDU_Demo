package com.volcengine.vertcdemo.feature;

import com.volcengine.vertcdemo.meeting.BuildConfig;

public interface Actions {
    String LOGIN = BuildConfig.APPLICATION_ID + ".action.LOGIN";
    String EDIT_PROFILE = BuildConfig.APPLICATION_ID + ".action.EDIT_PROFILE";
}
