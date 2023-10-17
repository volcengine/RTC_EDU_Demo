package com.volcengine.vertcdemo.core.startup;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

/**
 * 通过反射执行 Application 中标记的 Start up 信息
 *
 * @see Startup
 */
public class StartupManager {
    private static final String TAG = "StartupManager";

    public static void invoke(Application application) {
        String packageName = application.getPackageName();
        Bundle metaData = null;
        try {
            ApplicationInfo applicationInfo = application.getPackageManager().getApplicationInfo(packageName, PackageManager.GET_META_DATA);
            metaData = applicationInfo.metaData;
        } catch (Exception e) {
            //ignore
        }
        if (metaData == null || metaData.keySet() == null) return;
        for (String metaKey : metaData.keySet()) {
            if (metaKey.startsWith("START_UP_")) {
                String className = metaData.getString(metaKey);
                Log.d(TAG, "invoke Libraray Startup: " + metaKey + "=" + className);
                invoke(className, application);
            }
        }
    }

    private static void invoke(String className, Application application) {
        try {
            Class<? extends Startup> clazz = (Class<? extends Startup>) Class.forName(className);
            Startup startup = clazz.newInstance();
            startup.call(application);
        } catch (Exception e) {
            Log.e(TAG, "Startup invoke failed:" + className);
        }
    }
}
