package com.volcengine.vertcdemo.feature.roommain;

import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentTransaction;

import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.ss.video.rtc.demo.basic_module.ui.CommonDialog;
import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.ss.video.rtc.demo.basic_module.utils.WindowUtils;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.feature.roommain.fragment.ClassScreenFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.ClassWhiteBoardFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.ClassWhiteboardStreamFragment;
import com.volcengine.vertcdemo.framework.UIRoomMgr;
import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;
import com.volcengine.vertcdemo.framework.classLarge.UIEduRoom;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduDataProviderImpl;
import com.volcengine.vertcdemo.meeting.R;
import com.volcengine.vertcdemo.ui.widget.WBPagePanel;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ClassLargeRoomActivity extends BaseActivity {

    private static final String TAG = "ClassLargeRoomActivity";

    private final UIEduRoom mUIEduRoom = UIRoomMgr.eduRoom();

    private TextView mRoomIdTv;
    private TextView mDurationTv;
    private ImageView mLinkMicTv;
    private TextView mWhiteBoardType;
    private WBPagePanel mWhiteBoardPagePanel;
    private boolean mHasApplyLinkMic;
    private final ClassScreenFragment mScreenRemoteFragment = new ClassScreenFragment();
    private final ClassWhiteBoardFragment mWhiteBoardFragment = new ClassWhiteBoardFragment();
    private final ClassWhiteboardStreamFragment mWhiteBoardStreamFragment = new ClassWhiteboardStreamFragment();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.flags |= WindowManager.LayoutParams.FLAG_FULLSCREEN;
        getWindow().setAttributes(lp);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        setContentView(R.layout.activity_class_large_room);
    }

    @Override
    protected void onGlobalLayoutCompleted() {
        super.onGlobalLayoutCompleted();
        View backView = findViewById(R.id.title_bar_left_iv);
        backView.setOnClickListener(this::exitRoom);
        mWhiteBoardType = findViewById(R.id.whiteboard_type);
        mWhiteBoardPagePanel = findViewById(R.id.whiteboard_page_panel);
        mWhiteBoardFragment.setOutsidePanels(mWhiteBoardType, mWhiteBoardPagePanel);

        mRoomIdTv = findViewById(R.id.room_id);
        mDurationTv = findViewById(R.id.room_duration);
        mLinkMicTv = findViewById(R.id.link_mic);
        mLinkMicTv.setOnClickListener(v -> {
            if (mUIEduRoom.getDataProvider().isLickingMic()) {
                return;
            }
            if (mHasApplyLinkMic) {
                CommonDialog dialog = new CommonDialog(this);
                dialog.setMessage(this.getString(R.string.revert_apply_link_mic));
                dialog.setPositiveListener(view -> {
                    mUIEduRoom.linkMicApplyCancel();
                    mHasApplyLinkMic = false;
                    dialog.dismiss();
                });
                dialog.setNegativeListener(view -> dialog.dismiss());
                dialog.show();
                return;
            }
            if (!mUIEduRoom.getDataProvider().isLickingMic()) {
                mUIEduRoom.linkMicApply();
                mHasApplyLinkMic = true;
                SafeToast.show(R.string.already_apply_link_mic);
            }
        });
        attachToUICore();
    }

    private void attachToUICore() {
        mUIEduRoom.getDataProvider().getRoomInfo().observe(this, roomInfo -> {
            if (roomInfo != null) {
                showRoomInfo(roomInfo);
            }
        });
        mUIEduRoom.getDataProvider().getTick().observe(this, duration -> {
            if (duration != null) {
                if (duration == 0) {
                    IUIEduDef.IEduDataProvider dataProvider = mUIEduRoom.getDataProvider();
                    if (dataProvider instanceof EduDataProviderImpl) {
                        SafeToast.show(R.string.tips_time_limit);
                        ((EduDataProviderImpl) dataProvider).setRoomState(IUIEduDef.RoomState.RELEASED);
                        return;
                    }
                }
                showDuration(duration);
            }
        });
        mUIEduRoom.getDataProvider().getPullWhiteBoardStream().observe(this, pullWhiteBoardStream -> {
            if (pullWhiteBoardStream == null) {
                return;
            }
            updateRoomContent();
        });
        mUIEduRoom.getDataProvider().getPullScreenStream().observe(this, pullScreenStream -> {
            if (pullScreenStream == null) {
                return;
            }
            updateRoomContent();
        });
        mUIEduRoom.getDataProvider().getLickMicState().observe(this, linkMic -> {
            mHasApplyLinkMic = false;
            mLinkMicTv.setSelected(linkMic);
        });
        mUIEduRoom.getDataProvider().getRoomState().observe(this, roomState -> {
            if (IUIEduDef.RoomState.RELEASED.equals(roomState)) {
                MLog.w(TAG, "onRoomReleased");
                mUIEduRoom.leaveRoom();
                finish();
            }
        });
    }

    private void updateRoomContent() {
        boolean pullScreenStream = mUIEduRoom.getDataProvider().isPullScreenStream();
        FragmentTransaction trans = getSupportFragmentManager().beginTransaction();
        trans.remove(mScreenRemoteFragment);
        trans.remove(mWhiteBoardStreamFragment);
        trans.remove(mWhiteBoardFragment);
        if (pullScreenStream) {
            mWhiteBoardType.setVisibility(View.GONE);
            mWhiteBoardPagePanel.setVisibility(View.GONE);
            trans.replace(R.id.content_container, mScreenRemoteFragment).commit();
        } else {
            boolean pullWhiteBoardStream = mUIEduRoom.getDataProvider().isPullWhiteBoardStream();
            if (pullWhiteBoardStream) {
                mWhiteBoardType.setVisibility(View.GONE);
                mWhiteBoardPagePanel.setVisibility(View.GONE);
                trans.replace(R.id.content_container, mWhiteBoardStreamFragment).commit();
            } else {
                trans.replace(R.id.content_container, mWhiteBoardFragment).commit();
            }
        }
    }

    @Override
    protected void setupStatusBar() {
        WindowUtils.setLayoutFullScreen(getWindow());
    }

    private void showRoomInfo(@NonNull IUIEduDef.RoomInfo roomInfo) {
        String roomId = roomInfo.mRoomId;
        if (roomId.length() <= 6) {
            mRoomIdTv.setText(roomId);
        } else {
            mRoomIdTv.setText(String.format("%s...%s", roomId.substring(0, 3), roomId.substring(roomId.length() - 3)));
        }
        mRoomIdTv.setOnLongClickListener((v) -> {
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
        mDurationTv.setText(getString(R.string.info_remind_time, sdf.format(date)));
    }

    private void exitRoom(View an) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this, R.style.transparentDialog);
        View view = getLayoutInflater().inflate(R.layout.layout_leave_edu_room, null);
        builder.setView(view);
        TextView participantLeaveTv = view.findViewById(R.id.leave_meeting_participant);
        builder.setCancelable(true);
        final AlertDialog dialog = builder.create();
        Window window = dialog.getWindow();
        WindowManager.LayoutParams wlp = window.getAttributes();
        wlp.gravity = Gravity.LEFT | Gravity.TOP;
        wlp.x = an.getWidth() / 4;
        wlp.y = an.getHeight() * 4 / 5;
        wlp.flags &= ~WindowManager.LayoutParams.FLAG_DIM_BEHIND;
        window.setAttributes(wlp);

        participantLeaveTv.setVisibility(View.VISIBLE);
        participantLeaveTv.setOnClickListener((v) -> {
            dialog.dismiss();
            finish();
        });
        dialog.show();
    }

    @Override
    public void finish() {
        super.finish();
        mUIEduRoom.leaveRoom();
        UIRoomMgr.releaseEduRoom();
    }
}
