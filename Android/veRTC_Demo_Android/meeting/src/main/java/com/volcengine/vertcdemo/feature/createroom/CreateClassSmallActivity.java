package com.volcengine.vertcdemo.feature.createroom;

import android.view.View;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.volcengine.vertcdemo.core.IUIRtcDef;
import com.volcengine.vertcdemo.core.net.ErrorTool;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.framework.UIRoomMgr;
import com.volcengine.vertcdemo.framework.classSmall.UIClassSmallRoom;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;
import com.volcengine.vertcdemo.meeting.R;

public class CreateClassSmallActivity extends CreateMeetingActivity {

    @Override
    protected void onGlobalLayoutCompleted() {
        super.onGlobalLayoutCompleted();
        TextView titleTv = (findViewById(R.id.title_bar_title_tv));
        titleTv.setText(R.string.class_small);
        titleTv.setTextColor(ContextCompat.getColor(this, R.color.white));
        RadioGroup clientRole = findViewById(R.id.create_room_role);
        RadioButton roleHost = findViewById(R.id.create_room_role_host);
        roleHost.setText(R.string.create_choose_role_teacher);
        RadioButton roleAttendee = findViewById(R.id.create_room_role_attendee);
        roleAttendee.setText(R.string.create_choose_role_student);
        clientRole.setVisibility(View.VISIBLE);
        roleHost.setChecked(true);
    }

    @Override
    protected int getResLayoutId() {
        return R.layout.activity_create_class_small;
    }

    @Override
    public void joinRoom(String roomId, String userName, boolean isHost) {
        if (!mUIRtcCore.getRtcDataProvider().isNetworkConnected()) {
            SafeToast.show(R.string.network_lost_tips);
            return;
        }
        UIClassSmallRoom uiClassSmallCore = UIRoomMgr.createClassSmallRoom(this, mRtmInfo, roomId);
        if (uiClassSmallCore == null) {
            return;
        }
        uiClassSmallCore.joinRoom(userName, isHost, new IRequestCallback<MeetingTokenInfo>() {
            @Override
            public void onSuccess(MeetingTokenInfo data) {
                if (isFinishing()) {
                    return;
                }
                jumpToRoomActivity();
            }

            @Override
            public void onError(int errorCode, String message) {
                if (errorCode == IUIRtcDef.ERROR_CODE_DEFAULT) {
                    SafeToast.show(R.string.network_lost_tips);
                } else if (errorCode == IUIRtcDef.ERROR_CODE_ROOM_FULL) {
                    SafeToast.show(R.string.error_room_full);
                } else if (errorCode == IUIRtcDef.ERROR_HOST_EXIST) {
                    SafeToast.show(R.string.error_teacher_exist);
                } else {
                    SafeToast.show(ErrorTool.getErrorMessageByErrorCode(errorCode, message));
                }
            }
        });
    }
}
