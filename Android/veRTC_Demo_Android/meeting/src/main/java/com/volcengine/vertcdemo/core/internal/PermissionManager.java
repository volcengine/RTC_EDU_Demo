package com.volcengine.vertcdemo.core.internal;

import android.Manifest;
import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.impl.RtcDataProviderImpl;
import com.volcengine.vertcdemo.meeting.R;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import pub.devrel.easypermissions.AppSettingsDialog;
import pub.devrel.easypermissions.EasyPermissions;
import pub.devrel.easypermissions.PermissionRequest;

public class PermissionManager extends AbsRtcManager implements EasyPermissions.PermissionCallbacks {

    private static final String TAG = "PermissionManager";
    private WeakReference<Activity> mActivityRef;
    private boolean needPopupSettingDialog = false;

    public PermissionManager(@NonNull RtcDataProviderImpl dataProvider) {
        super(dataProvider);
    }

    @Override
    public void dispose() {
    }

    public void requestPermissions(@NonNull Activity activity, int requestCode) {
        MLog.d(TAG, "requestPermissions");
        mActivityRef = new WeakReference<>(activity);
        needPopupSettingDialog = false;
        List<String> permissionNeedRequest = new ArrayList<>();
        boolean micPermissionGranted = checkPermission(activity, Manifest.permission.RECORD_AUDIO, permissionNeedRequest);
        notifyMicPermission(micPermissionGranted);
        boolean camPermissionGranted = checkPermission(activity, Manifest.permission.CAMERA, permissionNeedRequest);
        notifyCamPermission(camPermissionGranted);
        if (permissionNeedRequest.isEmpty()) {
            return;
        }
        String[] array = new String[permissionNeedRequest.size()];
        permissionNeedRequest.toArray(array);
        PermissionRequest request = new PermissionRequest.Builder(activity, requestCode, array).setRationale(R.string.request_permission_tips).build();
        EasyPermissions.requestPermissions(request);
    }

    public void requestMicPermission(@NonNull Activity activity, int requestCode) {
        MLog.d(TAG, "requestMicPermission");
        mActivityRef = new WeakReference<>(activity);
        needPopupSettingDialog = true;
        PermissionRequest request = new PermissionRequest.Builder(activity, requestCode, Manifest.permission.RECORD_AUDIO).setRationale(R.string.request_permission_tips).build();
        EasyPermissions.requestPermissions(request);
    }

    public void requestCamPermission(@NonNull Activity activity, int requestCode) {
        MLog.d(TAG, "requestCamPermission");
        mActivityRef = new WeakReference<>(activity);
        needPopupSettingDialog = true;
        PermissionRequest request = new PermissionRequest.Builder(activity, requestCode, Manifest.permission.CAMERA).setRationale(R.string.request_permission_tips).build();
        EasyPermissions.requestPermissions(request);
    }

    public void reCheckPermissions(@NonNull Activity activity) {
        MLog.d(TAG, "reCheckPermissions");
        if (EasyPermissions.hasPermissions(activity, Manifest.permission.RECORD_AUDIO)) {
            notifyMicPermission(true);
        }
        if (EasyPermissions.hasPermissions(activity, Manifest.permission.CAMERA)) {
            notifyCamPermission(true);
        }
    }

    private void notifyMicPermission(boolean granted) {
        mDataProvider.setMicPermission(granted);
    }

    private void notifyCamPermission(boolean granted) {
        mDataProvider.setCamPermission(granted);
    }

    private boolean hasPermission(@NonNull Context context, String perms) {
        return EasyPermissions.hasPermissions(context, perms);
    }

    private boolean checkPermission(Activity activity, String perm, List<String> permsNeedRequest) {
        if (hasPermission(activity, perm)) {
            return true;
        } else {
            if (!EasyPermissions.somePermissionDenied(activity, perm)) {
                permsNeedRequest.add(perm);
            } else if (!EasyPermissions.permissionPermanentlyDenied(activity, perm)) {
                permsNeedRequest.add(perm);
            }
            return false;
        }
    }

    // EasyPermissions.PermissionCallbacks
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    @Override
    public void onPermissionsGranted(int requestCode, @NonNull List<String> perms) {
        MLog.d(TAG, "onPermissionsGranted " + perms);
        for (String per : perms) {
            if (Manifest.permission.RECORD_AUDIO.equals(per)) {
                notifyMicPermission(true);
            } else if (Manifest.permission.CAMERA.equals(per)) {
                notifyCamPermission(true);
            }
        }
    }

    @Override
    public void onPermissionsDenied(int requestCode, @NonNull List<String> perms) {
        MLog.d(TAG, "onPermissionsDenied " + perms);
        for (String per : perms) {
            if (Manifest.permission.RECORD_AUDIO.equals(per)) {
                notifyMicPermission(false);
                popAppSettingForPermission(per, R.string.request_mic_permission_tips);
            } else if (Manifest.permission.CAMERA.equals(per)) {
                notifyCamPermission(false);
                popAppSettingForPermission(per, R.string.request_cam_permission_tips);
            }
        }
    }

    private void popAppSettingForPermission(String perms, int rationale) {
        if (mActivityRef == null) {
            return;
        }
        Activity activity = mActivityRef.get();
        if (activity == null || activity.isFinishing()) {
            return;
        }
        if (EasyPermissions.somePermissionPermanentlyDenied(activity, Collections.singletonList(perms)) && needPopupSettingDialog) {
            MLog.d(TAG, "popup rationale dialog for" + perms);
            new AppSettingsDialog.Builder(activity).setTitle(R.string.tips_dialog_title).setRationale(rationale).build().show();
        }
    }
}
