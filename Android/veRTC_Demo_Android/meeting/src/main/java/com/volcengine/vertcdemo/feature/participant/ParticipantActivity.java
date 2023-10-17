package com.volcengine.vertcdemo.feature.participant;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.ss.video.rtc.demo.basic_module.ui.CommonDialog;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.common.SolutionToast;
import com.volcengine.vertcdemo.core.IUIRtcDef;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.core.eventbus.TokenExpiredEvent;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.rtm.RTMBizResponse;
import com.volcengine.vertcdemo.framework.UIRoomMgr;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.meeting.R;
import com.volcengine.vertcdemo.ui.MuteAllDialog;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import pub.devrel.easypermissions.AppSettingsDialog;

public class ParticipantActivity extends BaseActivity {

    private static final String TAG = "ParticipantActivity";
    private TextView mTitleView;
    private ParticipantAdapter mParticipantAdapter = null;

    private final UIMeetingRoom mUIMeetingRoom = UIRoomMgr.meetingRoom();

    private final ParticipantAdapter.UserOptionCallback mUserOptionCallback = new ParticipantAdapter.UserOptionCallback() {

        @Override
        public void onClickPermit(MeetingUserInfo user) {
            if (mUIMeetingRoom.getDataProvider().isHost()) {
                if (user.applyMicPermission) {
                    mUIMeetingRoom.showOpenMicApplyDialog(ParticipantActivity.this, user.userId, user.userName);
                } else if (user.applySharePermission) {
                    mUIMeetingRoom.showShareApplyDialog(ParticipantActivity.this, user.userId, user.userName);
                }
            }
        }

        @Override
        public void onClickMic(MeetingUserInfo user) {
            if (user.isMe) {
                mUIMeetingRoom.openMic(ParticipantActivity.this, !mUIMeetingRoom.getRtcDataProvider().isMicOpen());
            } else if (mUIMeetingRoom.getDataProvider().isHost()) {
                if (user.isMicOn) {
                    disableRemoteUserMic(user.userId);
                } else {
                    enableRemoteUserMic(user.userId);
                }
            }
        }

        @Override
        public void onClickCam(MeetingUserInfo user) {
            if (user.isMe) {
                mUIMeetingRoom.openCam(ParticipantActivity.this, !mUIMeetingRoom.getRtcDataProvider().isCamOpen());
            } else if (mUIMeetingRoom.getDataProvider().isHost()) {
                if (user.isCameraOn) {
                    disableRemoteUserCamera(user.userId);
                } else {
                    enableRemoteUserCamera(user.userId);
                }
            }
        }

        @Override
        public void onClickSharePermission(MeetingUserInfo user) {
            if (user.isMe) {
                return;
            }
            if (mUIMeetingRoom.getDataProvider().isHost()) {
                if (user.hasSharePermission) {
                    revertSharePermission(user.userId);
                } else {
                    grantSharePermission(user.userId);
                }
            }
        }
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MLog.d(TAG, "onCreate");
        setContentView(R.layout.activity_participant);
        initView();
        addObservers(this);
        SolutionDemoEventManager.register(this);
    }

    private void initView() {
        ImageView backArrow = findViewById(R.id.title_bar_left_iv);
        backArrow.setOnClickListener(v -> finish());

        RecyclerView recyclerView = findViewById(R.id.users_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());
        recyclerView.setLayoutManager(layoutManager);
        mParticipantAdapter = new ParticipantAdapter(mUIMeetingRoom, mUserOptionCallback);
        mParticipantAdapter.attach();
        recyclerView.setAdapter(mParticipantAdapter);

        mTitleView = findViewById(R.id.title_bar_title_tv);
        View muteAllBtn = findViewById(R.id.users_mute_all_users);
        muteAllBtn.setVisibility(mUIMeetingRoom.getDataProvider().isHost() ? View.VISIBLE : View.GONE);
        muteAllBtn.setOnClickListener(v -> muteAllRemoteUserMic());
    }

    private void addObservers(LifecycleOwner owner) {
        mUIMeetingRoom.getRtcDataProvider().getRtmKickOutReason().observe(owner, kickOutReason -> {
            if (IUIRtcDef.KickOutReason.LOGIN_IN_OTHER_DEVICE.equals(kickOutReason)) {
                MLog.w(TAG, "kicked out, login in other device");
                finish();
            }
        });
        mUIMeetingRoom.getDataProvider().getRoomState().observe(owner, roomState -> {
            if (IUIMeetingDef.RoomState.RELEASED.equals(roomState)) {
                MLog.w(TAG, "onRoomReleased");
                finish();
            }
        });
        mUIMeetingRoom.getDataProvider().getUserCount().observe(owner, userCount -> {
            mTitleView.setText(getString(R.string.users_title, userCount));
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        MLog.d(TAG, "onDestroy");
        mParticipantAdapter.detach();
        SolutionDemoEventManager.unregister(this);
    }

    @Override
    protected void setupStatusBar() {
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == UIRtcCore.REQUEST_CODE_OF_DEVICE_PERMISSION) {
            mUIMeetingRoom.getUIRtcCore().onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == AppSettingsDialog.DEFAULT_SETTINGS_REQ_CODE) {
            mUIMeetingRoom.getUIRtcCore().reCheckPermissions();
        }
    }

    private void muteAllRemoteUserMic() {
        MuteAllDialog muteAllDialog = new MuteAllDialog(this, mUIMeetingRoom.getRoleDesc());
        muteAllDialog.setPositiveListener(v -> {
            CheckBox permissionGranted = muteAllDialog.getMicPermitCb();
            muteAllRemoteUserMic(permissionGranted.isChecked());
            muteAllDialog.dismiss();
        });
        muteAllDialog.setNegativeListener(v -> muteAllDialog.dismiss());
        muteAllDialog.show();
    }

    private void muteAllRemoteUserMic(boolean micPermit) {
        mUIMeetingRoom.enableAllRemoteUserMic(false, micPermit, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
            }

            @Override
            public void onError(int errorCode, String message) {
                SolutionToast.show(R.string.failed_mute_mic_all);
            }
        });
    }

    private void disableRemoteUserMic(String uid) {
        mUIMeetingRoom.enableRemoteUserMic(uid, false, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
            }

            @Override
            public void onError(int errorCode, String message) {
                SolutionToast.show(R.string.failed_mute_mic);
            }
        });
    }

    private void enableRemoteUserMic(String uid) {
        mUIMeetingRoom.enableRemoteUserMic(uid, true, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                SolutionToast.show(R.string.mic_unumte_request_success);
            }

            @Override
            public void onError(int errorCode, String message) {
                SolutionToast.show(R.string.mic_unumte_request_failed);
            }
        });
    }

    private void disableRemoteUserCamera(String uid) {
        mUIMeetingRoom.enableRemoteUserCam(uid, false, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
            }

            @Override
            public void onError(int errorCode, String message) {
                SolutionToast.show(R.string.failed_mute_mic);
            }
        });
    }

    private void enableRemoteUserCamera(String uid) {
        mUIMeetingRoom.enableRemoteUserCam(uid, true, new IRequestCallback<RTMBizResponse>() {
            @Override
            public void onSuccess(RTMBizResponse data) {
                SolutionToast.show(R.string.mic_unumte_request_success);
            }

            @Override
            public void onError(int errorCode, String message) {
                SolutionToast.show(R.string.mic_unumte_request_failed);
            }
        });
    }

    private void revertSharePermission(String uid) {
        CommonDialog dialog = new CommonDialog(this);
        dialog.setMessage(this.getString(R.string.revert_share_permission_tips));
        dialog.setPositiveListener(v -> {
            mUIMeetingRoom.changeRemoteUserSharePermit(uid, false);
            dialog.dismiss();
        });
        dialog.setNegativeListener(v -> dialog.dismiss());
        dialog.show();
    }

    private void grantSharePermission(String uid) {
        CommonDialog dialog = new CommonDialog(this);
        dialog.setMessage(this.getString(R.string.grant_share_permission_tips));
        dialog.setPositiveListener(v -> {
            mUIMeetingRoom.changeRemoteUserSharePermit(uid, true);
            dialog.dismiss();
        });
        dialog.setNegativeListener(v -> dialog.dismiss());
        dialog.show();
    }

    @SuppressWarnings("unused")
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onTokenExpiredEvent(TokenExpiredEvent event) {
        MLog.w(TAG, "token expired");
        finish();
    }
}
