package com.volcengine.vertcdemo.feature.roommain;

import android.content.Context;
import android.os.Build;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;
import com.volcengine.vertcdemo.framework.classLarge.UIEduRoom;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.List;

public class ClassUserWindowView extends ConstraintLayout {

    public ClassUserWindowView(Context context) {
        super(context);
        init(context);
    }

    public ClassUserWindowView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public ClassUserWindowView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public ClassUserWindowView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context);
    }

    private View mTalkingNameHighlight;
    private View mTalkingHighlight;
    private TextView mUserNamePrefix;
    private TextView mHostTag;
    private TextView mUserName;
    private View mUserMicOff;
    private View mUserScreenShareOn;
    private ViewGroup mVideoRendererContainer;

    private ViewGroup mLocalUserOptContainer;
    private ImageView mSwitchMic;
    private ImageView mSwitchCam;
    private ImageView mSwitchInvisible;

    private UIEduRoom mEduRoom;
    private EduUserInfo mInfo;

    private void init(Context context) {
        View.inflate(context, R.layout.edu_view_user_window, this);
        mTalkingNameHighlight = findViewById(R.id.talking_highlight_name);
        mTalkingHighlight = findViewById(R.id.talking_highlight);
        mUserNamePrefix = findViewById(R.id.user_name_prefix);
        mHostTag = findViewById(R.id.host_tag);
        mUserName = findViewById(R.id.user_name);
        mUserMicOff = findViewById(R.id.user_mic_off);
        mUserScreenShareOn = findViewById(R.id.user_share_screen_status);
        mVideoRendererContainer = findViewById(R.id.video_renderer_container);

        mLocalUserOptContainer = findViewById(R.id.local_user_opt_container);
        mSwitchMic = findViewById(R.id.room_mic);
        mSwitchMic.setOnClickListener(v -> {
            mEduRoom.openMic(!mSwitchMic.isSelected());
            hideLocalOpt();
        });
        mSwitchCam = findViewById(R.id.room_camera);
        mSwitchCam.setOnClickListener(v -> {
            mEduRoom.openCam(!mSwitchCam.isSelected());
            hideLocalOpt();
        });
        mSwitchInvisible = findViewById(R.id.room_invisible);
        mSwitchInvisible.setOnClickListener(v -> {
            mEduRoom.linkMicLeave();
            hideLocalOpt();
        });
    }

    public void bind(UIEduRoom eduRoom, EduUserInfo info) {
        mEduRoom = eduRoom;
        mInfo = info;
        updateUserInfo();
        updateAudioStatus();
        updateAudioSpeakingStatus();
        updateVideoRenderer();
    }

    public void showLocalOpt() {
        mLocalUserOptContainer.setVisibility(mLocalUserOptContainer.getVisibility() == View.VISIBLE ? View.GONE : View.VISIBLE);
    }

    public void hideLocalOpt() {
        mLocalUserOptContainer.setVisibility(View.GONE);
    }

    public void updateByPayload(Object payload) {
        if (IUIEduDef.UserUpdateReason.ON_MIC_CHANGED.equals(payload)) {
            updateAudioStatus();
            updateAudioSpeakingStatus();
        } else if (IUIEduDef.UserUpdateReason.ON_CAM_CHANGED.equals(payload)) {
            updateVideoRenderer();
        }
    }

    public void updateByPayloads(List<Object> payload) {
        if (payload.contains(IUIEduDef.UserUpdateReason.ON_MIC_CHANGED)) {
            updateAudioStatus();
            updateAudioSpeakingStatus();
        }
        if (payload.contains(IUIEduDef.UserUpdateReason.ON_CAM_CHANGED)) {
            updateVideoRenderer();
        }
    }

    private void updateUserInfo() {
        if (mInfo != null && !TextUtils.isEmpty(mInfo.userName)) {
            if (mInfo.isMe) {
                mUserName.setText(mInfo.userName + getContext().getString(R.string.me_tag));
            } else {
                mUserName.setText(mInfo.userName);
            }
            mUserNamePrefix.setText(mInfo.userName.substring(0, 1));
        } else {
            mUserName.setText("");
            mUserNamePrefix.setText("");
        }
        boolean isHost = mInfo != null && mInfo.isHost;
        mHostTag.setVisibility(isHost ? View.VISIBLE : View.GONE);
    }

    private void updateAudioStatus() {
        boolean isMicOn = mInfo != null && mInfo.isMicOn;
        mUserMicOff.setVisibility(isMicOn ? View.GONE : View.VISIBLE);
        mSwitchMic.setSelected(isMicOn);
    }

    private void updateAudioSpeakingStatus() {
        boolean speaking = mInfo != null && mInfo.isMicOn && mInfo.isSpeaking;
        mTalkingNameHighlight.setVisibility(speaking ? View.VISIBLE : View.INVISIBLE);
        mTalkingHighlight.setVisibility(speaking ? View.VISIBLE : View.INVISIBLE);
    }


    private void updateVideoRenderer() {
        mSwitchCam.setSelected(mInfo != null && mInfo.isCameraOn);
        if (mInfo == null || !mInfo.isCameraOn) {
            mVideoRendererContainer.setVisibility(View.GONE);
            mVideoRendererContainer.removeAllViews();
            return;
        }

        if (mInfo.isMe) {
            mEduRoom.getUIRtcCore().setupLocalVideoRenderer(mVideoRendererContainer);
        } else {
            mEduRoom.getUIRtcCore().setupRemoteVideoRenderer(mVideoRendererContainer, mInfo.roomId, mInfo.userId);
        }
        mVideoRendererContainer.setVisibility(View.VISIBLE);
    }
}
