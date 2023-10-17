package com.volcengine.vertcdemo.entity;

import com.google.gson.annotations.SerializedName;

public class LoginInfo {
    @SerializedName("user_id")
    public String user_id;
    @SerializedName("user_name")
    public String user_name;
    @SerializedName("login_token")
    public String login_token;

    @Override
    public String toString() {
        return "LoginInfo{" +
                "user_id='" + user_id + '\'' +
                ", user_name='" + user_name + '\'' +
                ", login_token='" + login_token + '\'' +
                '}';
    }
}
