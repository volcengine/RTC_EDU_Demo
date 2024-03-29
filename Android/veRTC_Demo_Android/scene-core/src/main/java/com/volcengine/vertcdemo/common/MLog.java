package com.volcengine.vertcdemo.common;

import android.util.Log;

public class MLog {

    public static void init() {

    }

    public static void release() {

    }

    public static void i(String tag, String msg) {
        Log.i(tag, msg);
        persistenceLog(tag + ":" + msg);
    }

    public static void d(String tag, String msg) {
        Log.d(tag, msg);
        persistenceLog(tag + ":" + msg);
    }

    public static void d(String tag, String msg, Throwable throwable) {
        Log.d(tag, msg, throwable);
        persistenceLog(tag + ":" + msg);
    }

    public static void w(String tag, String msg) {
        Log.w(tag, msg);
        persistenceLog(tag + ":" + msg);
    }

    public static void e(String tag, String msg) {
        Log.e(tag, msg);
        persistenceLog(tag + ":" + msg);
    }

    public static void e(String tag, String msg, Throwable throwable) {
        Log.e(tag, msg, throwable);
        persistenceLog(tag + ":" + msg);
    }

    public static void persistenceLog(String log) {

    }
}
