package com.volcengine.vertcdemo.framework.meeting.internal;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ss.video.rtc.demo.basic_module.ui.CommonDialog;
import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.feature.participant.ParticipantActivity;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingDataProviderImpl;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingRoomImpl;
import com.volcengine.vertcdemo.meeting.R;

import java.util.Set;
import java.util.concurrent.ConcurrentSkipListSet;

public class MeetingPermitManager extends AbsMeetingManager implements IMeetingRtmEventHandler {

    private static final String TAG = "MeetingPermitManager";
    private final Set<String> mUsersApplyMicPermit = new ConcurrentSkipListSet<>();
    private final Set<String> mUsersApplySharePermit = new ConcurrentSkipListSet<>();
    private boolean mOperateSelfMicPermission = true;

    public MeetingPermitManager(@NonNull UIRtcCore uiRtcCore, @NonNull MeetingRoomImpl uiMeetingCore, @NonNull MeetingDataProviderImpl dataProvider) {
        super(uiRtcCore, uiMeetingCore, dataProvider);
        getMeetingRoom().addHandler(this);
    }

    @Override
    public void dispose() {
        getMeetingRoom().removeHandler(this);
    }

    @Override
    public void onJoinRoom(MeetingTokenInfo info) {
        mUsersApplyMicPermit.clear();
        mUsersApplySharePermit.clear();
        mOperateSelfMicPermission = info.roomInfo.operateSelfMicPermission;
        getDataProvider().setHasMicPermit(info.user.hasMicPermission);
        getDataProvider().setHasSharePermit(info.user.hasSharePermission);
    }

    @Override
    public void onReSync(MeetingTokenInfo info) {
        onJoinRoom(info);
    }

    @Override
    public void onEnableLocalMic(boolean enable) {
        if (enable) {
            return;
        }
        // one-time permit after all user's mic permit disable by host
        if (!mOperateSelfMicPermission) {
            getDataProvider().setHasMicPermit(false);
        }
    }

    @Override
    public void onEnableAllMicByHost(boolean enable, boolean micPermit) {
        MLog.d(TAG, "onEnableAllMicByHost enable: " + enable + ", micPermit: " + micPermit);
        if (getMeetingRoom().getDataProvider().isHost()) {
            return;
        }
        mOperateSelfMicPermission = micPermit;
        getDataProvider().setHasMicPermit(micPermit);
        onEnableMicByHost(enable);
    }

    @Override
    public void onEnableMicByHost(boolean enable) {
        runOnUIThread(() -> enableMicByHost(enable));
    }

    public void enableMicByHost(boolean enable) {
        MLog.d(TAG, "enableMicByHost " + enable);
        if (!enable) {
            if (getUIRtcCore().getRtcDataProvider().isMicOpen()) {
                getUIRtcCore().openMic(false);
                getMeetingRoom().enableLocalMic(false);
                SafeToast.show(Utilities.getApplicationContext().getString(R.string.mic_mute, hostDesc()));
            }
        } else {
            Activity activity = getCurrentActivityContext();
            if (activity == null) {
                return;
            }
            getDataProvider().setHasMicPermit(true);
            CommonDialog dialog = new CommonDialog(activity);
            dialog.setMessage(activity.getString(R.string.on_ask_open_mic, hostDesc()));
            dialog.setPositiveListener(v -> {
                if (getUIRtcCore().openMic(true)) {
                    getMeetingRoom().enableLocalMic(true);
                }
                dialog.dismiss();
            });
            dialog.setNegativeListener(v -> dialog.dismiss());
            dialog.show();
        }
    }

    @Override
    public void onEnableCamByHost(boolean enable) {
        runOnUIThread(() -> enableCameraByHost(enable));
    }

    public void enableCameraByHost(boolean enable) {
        MLog.d(TAG, "enableCameraByHost " + enable);
        if (!enable) {
            if (getUIRtcCore().getRtcDataProvider().isCamOpen()) {
                getUIRtcCore().openCam(false);
                getMeetingRoom().enableLocalCam(false);
                SafeToast.show(Utilities.getApplicationContext().getString(R.string.cam_mute, hostDesc()));
            }
        } else {
            Activity activity = getCurrentActivityContext();
            if (activity == null) {
                return;
            }
            CommonDialog dialog = new CommonDialog(activity);
            dialog.setMessage(activity.getString(R.string.on_ask_open_cam, hostDesc()));
            dialog.setPositiveListener(v -> {
                if (getUIRtcCore().openCam(true)) {
                    getMeetingRoom().enableLocalCam(true);
                }
                dialog.dismiss();
            });
            dialog.setNegativeListener(v -> dialog.dismiss());
            dialog.show();
        }
    }

    @Override
    public void onChangeSharePermitByHost(boolean permit) {
        MLog.d(TAG, "onSharePermitChanged " + permit);
        getDataProvider().setHasSharePermit(permit);
        runOnUIThread(() -> {
            if (getDataProvider().hasSharePermit()) {
                if (!getDataProvider().isHost()) {
                    SafeToast.show(Utilities.getApplicationContext().getString(R.string.share_permission_granted, hostDesc()));
                }
            } else {
                if (getMeetingRoom().getDataProvider().isLocalSharingScreen()) {
                    getMeetingRoom().stopScreenSharing();
                }
                if (getMeetingRoom().getDataProvider().isLocalSharingWhiteBoard()) {
                    getMeetingRoom().stopWhiteBoardSharing();
                }
                SafeToast.show(R.string.share_permission_reverted);
            }
        });
    }

    @Override
    public void onReceiveOpenMicReply(boolean permit) {
        getDataProvider().setHasMicPermit(permit);
        runOnUIThread(() -> {
            if (getDataProvider().hasMicPermit()) {
                SafeToast.show(Utilities.getApplicationContext().getString(R.string.open_mic_as_host_demand, hostDesc()));
                if (getUIRtcCore().openMic(true)) {
                    getMeetingRoom().enableLocalMic(true);
                }
            }
        });
    }

    private Activity getCurrentActivityContext() {
        return getUIRtcCore().getRtcDataProvider().currentActivity();
    }

    // TODO(haiyangwu): delete ParticipantActivity later
    private void startParticipantActivity(Context context) {
        if (context instanceof ParticipantActivity) {
            return;
        }
        Intent intent = new Intent(context, ParticipantActivity.class);
        context.startActivity(intent);
    }

    @Override
    public void onReceiveShareApply(String userId, String userName) {
        runOnUIThread(() -> receiveShareApply(userId, userName));
    }

    public void receiveShareApply(String userId, String userName) {
        mUsersApplySharePermit.add(userId);
        Context context = getCurrentActivityContext();
        if (context == null) {
            return;
        }

        int applyUserCount = mUsersApplySharePermit.size();
        if (applyUserCount == 1) {
            showShareApplyDialog(context, userId, userName);
        } else {
            showMultiShareApplyDialog(context, applyUserCount);
        }
    }

    private CommonDialog mShareApplyDialog;

    private void dismissPreShareApplyDialog() {
        if (mShareApplyDialog != null && mShareApplyDialog.isShowing()) {
            mShareApplyDialog.dismiss();
        }
    }

    public void showShareApplyDialog(Context context, String userId, String userName) {
        dismissPreShareApplyDialog();
        mShareApplyDialog = new CommonDialog(context);
        mShareApplyDialog.setMessage(context.getString(R.string.request_turn_on_share, userName));
        mShareApplyDialog.setPositiveListener(v -> {
            mUsersApplySharePermit.remove(userId);
            getMeetingRoom().permitShare(userId, true);
            mShareApplyDialog.dismiss();
        });
        mShareApplyDialog.setNegativeListener(v -> {
            mUsersApplySharePermit.remove(userId);
            getMeetingRoom().permitShare(userId, false);
            mShareApplyDialog.dismiss();
        });
        mShareApplyDialog.show();
    }

    public void showMultiShareApplyDialog(Context context, int count) {
        dismissPreShareApplyDialog();
        mShareApplyDialog = new CommonDialog(context);
        mShareApplyDialog.setMessage(context.getString(R.string.request_turn_on_share_multi, count));
        mShareApplyDialog.setPositiveListener(v -> {
            startParticipantActivity(context);
            mShareApplyDialog.dismiss();
        });
        mShareApplyDialog.setNegativeListener(v -> mShareApplyDialog.dismiss());
        mShareApplyDialog.show();
    }

    @Override
    public void onReceiveShareReply(boolean permit) {
        MLog.d(TAG, "onReceiveShareReply " + permit);
        getDataProvider().setHasSharePermit(permit);
        runOnUIThread(() -> {
            if (getDataProvider().hasSharePermit()) {
                SafeToast.show(Utilities.getApplicationContext().getString(R.string.share_permission_granted, hostDesc()));
            } else {
                SafeToast.show(Utilities.getApplicationContext().getString(R.string.share_rejected, hostDesc()));
            }
        });
    }

    private CommonDialog mOpenMicApplyDialog;

    @Override
    public void onReceiveOpenMicApply(String userId, String userName) {
        runOnUIThread(() -> receiveOpenMicApply(userId, userName));
    }

    public void receiveOpenMicApply(String userId, String userName) {
        mUsersApplyMicPermit.add(userId);
        Context context = getCurrentActivityContext();
        if (context == null) {
            return;
        }
        int applyUserCount = mUsersApplyMicPermit.size();
        if (applyUserCount == 1) {
            showOpenMicApplyDialog(context, userId, userName);
        } else {
            showOpenMicApplyDialogMulti(context, applyUserCount);
        }
    }

    private void dismissPreOpenMicApplyDialog() {
        if (mOpenMicApplyDialog != null && mOpenMicApplyDialog.isShowing()) {
            mOpenMicApplyDialog.dismiss();
        }
    }

    public void showOpenMicApplyDialog(Context context, String userId, String userName) {
        dismissPreOpenMicApplyDialog();
        mOpenMicApplyDialog = new CommonDialog(context);
        mOpenMicApplyDialog.setMessage(context.getString(R.string.request_turn_on_mic, userName));
        mOpenMicApplyDialog.setPositiveListener(v -> {
            mUsersApplyMicPermit.remove(userId);
            getMeetingRoom().permitOpenMic(userId, true);
            mOpenMicApplyDialog.dismiss();
        });
        mOpenMicApplyDialog.setNegativeListener(v -> {
            mUsersApplyMicPermit.remove(userId);
            getMeetingRoom().permitOpenMic(userId, false);
            mOpenMicApplyDialog.dismiss();
        });
        mOpenMicApplyDialog.show();
    }

    public void showOpenMicApplyDialogMulti(Context context, int count) {
        dismissPreOpenMicApplyDialog();
        mOpenMicApplyDialog = new CommonDialog(context);
        mOpenMicApplyDialog.setMessage(context.getString(R.string.request_turn_on_mic_multi, count));
        mOpenMicApplyDialog.setPositiveListener(v -> {
            startParticipantActivity(context);
            mOpenMicApplyDialog.dismiss();
        });
        mOpenMicApplyDialog.setNegativeListener(v -> mOpenMicApplyDialog.dismiss());
        mOpenMicApplyDialog.show();
    }


    @Override
    public void onReceiveRecordApply(String userId, String userName) {
        runOnUIThread(() -> receiveRecordApply(userId, userName));
    }

    public void receiveRecordApply(String userId, String userName) {
        Context context = getCurrentActivityContext();
        if (context == null) {
            return;
        }

        CommonDialog dialog = new CommonDialog(context);
        dialog.setMessage(context.getString(R.string.request_record, userName));
        dialog.setPositiveListener(v -> {
            getMeetingRoom().startRecord();
            getMeetingRoom().permitRecord(userId, true);
            dialog.dismiss();
        });
        dialog.setNegativeListener(v -> {
            getMeetingRoom().permitRecord(userId, false);
            dialog.dismiss();
        });
        dialog.show();
    }

    @Override
    public void onReceiveRecordReply(String userId, boolean permit) {
        if (!permit) {
            runOnUIThread(() -> SafeToast.show(R.string.start_record_rejected));
        }
    }

    @Override
    public void onHostChange(String roomId, String userId) {
        String localUserId = SolutionDataManager.ins().getUserId();
        if (TextUtils.equals(userId, localUserId)) {
            getDataProvider().setHasSharePermit(true);
        }
    }

}
