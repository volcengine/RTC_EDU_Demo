package com.volcengine.vertcdemo.feature.roommain;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

import com.ss.bytertc.engine.type.ConnectionState;
import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.IUIRtcDef;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.core.eventbus.TokenExpiredEvent;
import com.volcengine.vertcdemo.feature.participant.ParticipantActivity;
import com.volcengine.vertcdemo.framework.UIRoomMgr;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingDataProviderImpl;
import com.volcengine.vertcdemo.meeting.R;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.text.SimpleDateFormat;
import java.util.Date;

import pub.devrel.easypermissions.AppSettingsDialog;

public class MeetingRoomActivity extends BaseActivity implements View.OnClickListener {

    private static final String TAG = "MeetingRoomActivity";
    private static final int MAIN_MODEL_UNSET = -1;
    private static final int MAIN_MODEL_NORMAL = 0;
    private static final int MAIN_MODEL_SPEECH = 1;
    private static final int MAIN_MODEL_FULL_SCREEN = 2;

    private int mCurrentModel = MAIN_MODEL_UNSET;
    private int mScreenWidth = 0;

    private TextView mMeetingIdTv;
    private TextView mMeetingDurationTv;
    private ImageView mSwitchSpeakerIv;
    private ImageView mSwitchCameraIv;
    private ImageView mRecordStatusIv;
    private TextView mRecordStatusDescT;
    private TextView mRecordStatusDividerT;
    private View mExit;
    private ImageView mMicIv;
    private ImageView mCamIv;
    private ImageView mScreenShareIv;
    private TextView mParticipantCountsTv;
    private ImageView mParticipantIv;
    private ImageView mRecordIv;
    private TextView mRecordTv;
    private View mDisconnectTip;

    private FrameLayout mPortraitContainer;
    private FrameLayout mLandscapeContainer;

    private final MeetingPortraitCallFragment mPortraitCallFragment = new MeetingPortraitCallFragment();
    private final MeetingPortraitSpeechFragment mPortraitSpeechFragment = new MeetingPortraitSpeechFragment();
    private final MeetingLandSpeechFragment mLandSpeechFragment = new MeetingLandSpeechFragment();

    private boolean mIsLastLandScape = false;
    private boolean mIsLastSpeechMode = false;

    private final UIMeetingRoom mUIMeetingRoom = UIRoomMgr.meetingRoom();

    private final ViewTreeObserver.OnGlobalLayoutListener mOnGlobalLayoutListener = () -> {
        boolean isLandScape = isLandScape();
        boolean hasSomeoneScreenShare = mUIMeetingRoom.getDataProvider().isSharing();
        if (isLandScape == mIsLastLandScape && hasSomeoneScreenShare == mIsLastSpeechMode) {
            return;
        }
        mDisconnectTip.bringToFront();
        mIsLastLandScape = isLandScape;
        mIsLastSpeechMode = hasSomeoneScreenShare;
        if (isLandScape) {
            toggleFullScreenModel();
        } else {
            if (hasSomeoneScreenShare) {
                toggleSpeechModel();
            } else {
                toggleNormalModel();
            }
        }
    };

    private final Runnable mDelayCheck = () -> {
        if (!mUIMeetingRoom.getRtcDataProvider().isNetworkConnected()) {
            mUIMeetingRoom.leaveRoom(false);
            MeetingRoomActivity.this.finish();
        }
    };


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MLog.d(TAG, "onCreate");
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_room);
        initView();
        SolutionDemoEventManager.register(this);
        addObservers(this);
    }

    private void addObservers(LifecycleOwner owner) {
        if (mUIMeetingRoom == null) {
            return;
        }
        mSwitchSpeakerIv.setOnClickListener(v -> {
            IUIRtcDef.IRtcDataProvider dataProvider = mUIMeetingRoom.getRtcDataProvider();
            if (!dataProvider.isMicOpen() || !dataProvider.isCanSwitchAudioRoute()) {
                return;
            }
            boolean speakerPhone = dataProvider.isSpeakerPhone();
            mUIMeetingRoom.getUIRtcCore().enableSpeakerphone(!speakerPhone);
        });
        mSwitchCameraIv.setOnClickListener(v -> {
            boolean facingFront = mUIMeetingRoom.getRtcDataProvider().isFacingFront();
            mUIMeetingRoom.getUIRtcCore().switchCamera(!facingFront);
        });
        mUIMeetingRoom.getUIRtcCore().getRtcDataProvider().speakerPhone().observe(owner, speakerPhone -> {
            mSwitchSpeakerIv.setSelected(speakerPhone);
        });
        mUIMeetingRoom.getUIRtcCore().getRtcDataProvider().camState().observe(owner, openCam -> {
            mSwitchCameraIv.setVisibility(openCam ? View.VISIBLE : View.INVISIBLE);
        });
        mUIMeetingRoom.getUIRtcCore().getRtcDataProvider().facingFront().observe(owner, isFrontCamera -> {
            mSwitchCameraIv.setSelected(isFrontCamera);
        });
        mUIMeetingRoom.getDataProvider().getRoomInfo().observe(owner, roomInfo -> {
            if (roomInfo != null) {
                showRoomInfo(roomInfo);
            }
        });
        mUIMeetingRoom.getDataProvider().getTick().observe(owner, duration -> {
            if (duration != null) {
                if (duration == 0) {
                    IUIMeetingDef.IMeetingDataProvider dataProvider = mUIMeetingRoom.getDataProvider();
                    if (dataProvider instanceof MeetingDataProviderImpl) {
                        SafeToast.show(R.string.tips_time_limit);
                        ((MeetingDataProviderImpl) dataProvider).setRoomState(IUIMeetingDef.RoomState.RELEASED);
                        return;
                    }
                }
                showDuration(duration);
            }
        });
        mUIMeetingRoom.getDataProvider().getRecordState().observe(owner, isRecording -> {
            mRecordStatusIv.setVisibility(isRecording ? View.VISIBLE : View.GONE);
            mRecordStatusDescT.setVisibility(isRecording ? View.VISIBLE : View.GONE);
            mRecordStatusDividerT.setVisibility(isRecording ? View.VISIBLE : View.GONE);
        });
        mUIMeetingRoom.getRtcDataProvider().micState().observe(owner, openMic -> {
            MLog.d(TAG, "want to open mic? " + openMic);
            mMicIv.setSelected(openMic);
        });
        mUIMeetingRoom.getRtcDataProvider().camState().observe(owner, openCam -> {
            MLog.d(TAG, "want to open camera? " + openCam);
            mCamIv.setSelected(openCam);
        });
        mUIMeetingRoom.getRtcDataProvider().getNetworkConnectionState().observe(owner, state -> {
            MLog.d(TAG, "connection changed, " + state);
            if (ConnectionState.CONNECTION_STATE_CONNECTED.equals(state) || ConnectionState.CONNECTION_STATE_RECONNECTED.equals(state)) {
                mDisconnectTip.removeCallbacks(mDelayCheck);
                mDisconnectTip.setVisibility(View.GONE);
            } else {
                if (ConnectionState.CONNECTION_STATE_LOST.equals(state)) {
                    // 12s CONNECTION_STATE_DISCONNECTED
                    // 10s CONNECTION_STATE_LOST
                    // extra 80 - 22 = 38s, leave room (1min)
                    mDisconnectTip.removeCallbacks(mDelayCheck);
                    mDisconnectTip.postDelayed(mDelayCheck, 38_000);
                }
                mDisconnectTip.setVisibility(View.VISIBLE);
            }
        });
        mUIMeetingRoom.getRtcDataProvider().getRtmKickOutReason().observe(owner, kickOutReason -> {
            if (IUIRtcDef.KickOutReason.LOGIN_IN_OTHER_DEVICE.equals(kickOutReason)) {
                MLog.w(TAG, "kicked out, login in other device");
                mUIMeetingRoom.leaveRoom(false);
                finish();
            }
        });
        mUIMeetingRoom.getDataProvider().getUserCount().observe(owner, userCount -> {
            MLog.d(TAG, "user count " + userCount);
            mParticipantCountsTv.setText(userCount > 99 ? "99+" : String.valueOf(userCount));
            reDesignLayout();
        });
        mUIMeetingRoom.getDataProvider().getRoomShareState().observe(owner, roomShareInfo -> {
            if (roomShareInfo != null) {
                MLog.d(TAG, "onRoomShareSateUpdated " + roomShareInfo.mShareStatus + " shareType: " + roomShareInfo.mShareType);
                reDesignLayout();
            }
        });
        mUIMeetingRoom.getDataProvider().getRecordState().observe(owner, isRecording -> {
            mRecordIv.setSelected(isRecording);
            if (mUIMeetingRoom.getDataProvider().isHost()) {
                mRecordTv.setText(isRecording ? R.string.action_stop_record : R.string.action_record);
            } else {
                mRecordTv.setText(isRecording ? R.string.recording : R.string.action_record);
            }
        });
        mUIMeetingRoom.getDataProvider().getRoomState().observe(owner, roomState -> {
            if (IUIMeetingDef.RoomState.RELEASED.equals(roomState)) {
                MLog.w(TAG, "onRoomReleased");
                mUIMeetingRoom.leaveRoom(false);
                finish();
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == UIRtcCore.REQUEST_CODE_OF_DEVICE_PERMISSION) {
            mUIMeetingRoom.getUIRtcCore().onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    @Override
    protected void setupStatusBar() {
    }

    @Override
    protected void onGlobalLayoutCompleted() {
        super.onGlobalLayoutCompleted();
        mScreenWidth = mPortraitContainer.getWidth();
        mPortraitContainer.getViewTreeObserver().addOnGlobalLayoutListener(mOnGlobalLayoutListener);
    }

    private void initView() {
        mMeetingIdTv = findViewById(R.id.room_meeting_id);
        mSwitchSpeakerIv = findViewById(R.id.room_speaker);
        mMeetingDurationTv = findViewById(R.id.room_duration);
        mSwitchCameraIv = findViewById(R.id.room_switch_camera);
        mRecordStatusIv = findViewById(R.id.room_record_status_icon);
        mRecordStatusDescT = findViewById(R.id.room_record_status_desc);
        mRecordStatusDividerT = findViewById(R.id.room_record_status_divider);
        mExit = findViewById(R.id.room_exit);
        mMicIv = findViewById(R.id.room_bottom_mic);
        mCamIv = findViewById(R.id.room_bottom_camera);
        mScreenShareIv = findViewById(R.id.room_bottom_share);
        mParticipantCountsTv = findViewById(R.id.room_bottom_participants_counts);
        mParticipantIv = findViewById(R.id.room_bottom_participants);
        mRecordIv = findViewById(R.id.room_bottom_record);
        mRecordTv = findViewById(R.id.room_bottom_record_desc);
        mDisconnectTip = findViewById(R.id.room_disconnect_tip);
        mPortraitContainer = findViewById(R.id.room_portrait_container);
        mLandscapeContainer = findViewById(R.id.room_landscape_container);

        mExit.setOnClickListener(v -> attemptLeaveMeeting());
        mMicIv.setOnClickListener(this);
        mCamIv.setOnClickListener(this);
        mScreenShareIv.setOnClickListener(this);
        mParticipantIv.setOnClickListener(this);
        mRecordIv.setOnClickListener(this);
    }

    @Override
    public void onBackPressed() {
        attemptLeaveMeeting();
    }

    @Override
    public void finish() {
        super.finish();
        SolutionDemoEventManager.unregister(this);
        mPortraitContainer.getViewTreeObserver().removeOnGlobalLayoutListener(mOnGlobalLayoutListener);
        UIRoomMgr.releaseMeetingRoom();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == AppSettingsDialog.DEFAULT_SETTINGS_REQ_CODE) {
            mUIMeetingRoom.getUIRtcCore().reCheckPermissions();
        } else if (requestCode == UIRtcCore.REQUEST_CODE_OF_SCREEN_SHARING) {
            if (resultCode == Activity.RESULT_OK) {
                mUIMeetingRoom.onScreenSharingIntent(this, R.drawable.app_logo, R.drawable.app_logo, data);
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    private void onMicClick() {
        mUIMeetingRoom.openMic(this, !mMicIv.isSelected());
    }

    public void attemptLeaveMeeting() {
        if (mUIMeetingRoom.getDataProvider().singleUser()) {
            mUIMeetingRoom.leaveRoom(false);
            finish();
            return;
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(this, R.style.transparentDialog);
        View view = getLayoutInflater().inflate(R.layout.layout_leave_meeting_room, null);
        builder.setView(view);
        TextView hostFinishTv = view.findViewById(R.id.leave_meeting_host_finish);
        TextView hostLeaveTv = view.findViewById(R.id.leave_meeting_host);
        TextView participantLeaveTv = view.findViewById(R.id.leave_meeting_participant);
        builder.setCancelable(true);
        final AlertDialog dialog = builder.create();
        Window window = dialog.getWindow();
        WindowManager.LayoutParams wlp = window.getAttributes();
        wlp.gravity = Gravity.RIGHT | Gravity.TOP;
        wlp.x = mExit.getWidth() * 3 / 4;
        wlp.y = mExit.getHeight() * 4 / 5;
        wlp.flags &= ~WindowManager.LayoutParams.FLAG_DIM_BEHIND;
        window.setAttributes(wlp);

        if (mUIMeetingRoom.getDataProvider().isHost()) {
            hostLeaveTv.setVisibility(View.VISIBLE);
            hostFinishTv.setVisibility(View.VISIBLE);
            hostLeaveTv.setOnClickListener(v -> {
                dialog.dismiss();
                mUIMeetingRoom.leaveRoom(false);
                finish();
            });
            hostFinishTv.setOnClickListener((v) -> {
                dialog.dismiss();
                mUIMeetingRoom.leaveRoom(true);
                finish();
            });
        } else {
            participantLeaveTv.setVisibility(View.VISIBLE);
            participantLeaveTv.setOnClickListener((v) -> {
                dialog.dismiss();
                mUIMeetingRoom.leaveRoom(false);
                finish();
            });
        }
        dialog.show();
    }


    @Override
    public void onClick(View v) {
        if (v == mMicIv) {
            onMicClick();
        } else if (v == mCamIv) {
            mUIMeetingRoom.openCam(this, !mCamIv.isSelected());
        } else if (v == mScreenShareIv) {
            mUIMeetingRoom.clickShare(this);
        } else if (v == mParticipantIv) {
            Intent intent = new Intent(this, ParticipantActivity.class);
            startActivity(intent);
        } else if (v == mRecordIv) {
            mUIMeetingRoom.clickRecord(this);
        }
    }

    /**
     * 开启全屏模式
     */
    private void toggleFullScreenModel() {
        MLog.d(TAG, "toggleFullScreenModel");
        if (mCurrentModel == MAIN_MODEL_FULL_SCREEN) {
            return;
        }
        mCurrentModel = MAIN_MODEL_FULL_SCREEN;
        switchFullScreen(true);

        getSupportFragmentManager().beginTransaction()
                .remove(mPortraitCallFragment)
                .remove(mPortraitSpeechFragment)
                .replace(mLandscapeContainer.getId(), mLandSpeechFragment)
                .commit();
    }

    /**
     * 开启演讲模式
     */
    private void toggleSpeechModel() {
        MLog.d(TAG, "toggleSpeechModel");
        mCurrentModel = MAIN_MODEL_SPEECH;
        switchFullScreen(false);
        getSupportFragmentManager().beginTransaction()
                .remove(mLandSpeechFragment)
                .remove(mPortraitCallFragment)
                .replace(mPortraitContainer.getId(), mPortraitSpeechFragment)
                .commit();
    }

    /**
     * 开启通话模式
     */
    private void toggleNormalModel() {
        MLog.d(TAG, "toggleNormalModel");
        mCurrentModel = MAIN_MODEL_NORMAL;
        switchFullScreen(false);

        getSupportFragmentManager().beginTransaction()
                .remove(mLandSpeechFragment)
                .remove(mPortraitSpeechFragment)
                .replace(mPortraitContainer.getId(), mPortraitCallFragment)
                .commit();
    }

    private void switchFullScreen(boolean isFullScreen) {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        if (isFullScreen) {
            lp.flags |= WindowManager.LayoutParams.FLAG_FULLSCREEN;
            getWindow().setAttributes(lp);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        } else {
            lp.flags &= (~WindowManager.LayoutParams.FLAG_FULLSCREEN);
            getWindow().setAttributes(lp);
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        }
    }

    private void setActivityOrientation(boolean setLandscape) {
        if (setLandscape) {
            if (this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT) {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            }
        } else {
            if (this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            }
        }
    }

    public boolean isLandScape() {
        return mScreenWidth != 0 && mLandscapeContainer.getWidth() > mScreenWidth;
    }

    private void showRoomInfo(@NonNull IUIMeetingDef.RoomInfo roomInfo) {
        String roomId = roomInfo.mRoomId;
        if (roomId.length() <= 6) {
            mMeetingIdTv.setText(roomId);
        } else {
            mMeetingIdTv.setText(String.format("%s...%s", roomId.substring(0, 3), roomId.substring(roomId.length() - 3)));
        }
        mMeetingIdTv.setOnLongClickListener((v) -> {
            ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData mClipData = ClipData.newPlainText("Label", roomId);
            cm.setPrimaryClip(mClipData);
            SafeToast.show(getString(R.string.room_id_copied));
            return true;
        });
    }

    private void showDuration(long tick) {
        Date date = new Date(tick);
        SimpleDateFormat sdf = new SimpleDateFormat("mm:ss");
        mMeetingDurationTv.setText(getString(R.string.info_remind_time, sdf.format(date)));
    }

    private void reDesignLayout() {
        boolean isSharing = mUIMeetingRoom.getDataProvider().isSharing();
        if (isSharing) {
            if (mCurrentModel == MAIN_MODEL_FULL_SCREEN) {
                if (isLandScape()) {
                    toggleFullScreenModel();
                } else {
                    setActivityOrientation(true);
                }
            } else {
                boolean isLandScape = isLandScape();
                if (isLandScape) {
                    setActivityOrientation(false);
                } else {
                    toggleSpeechModel();
                }
            }
        } else {
            if (isLandScape()) {
                setActivityOrientation(false);
            } else {
                toggleNormalModel();
            }
        }
    }

    @SuppressWarnings("unused")
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onTokenExpiredEvent(TokenExpiredEvent event) {
        MLog.w(TAG, "token expired");
        finish();
    }
}
