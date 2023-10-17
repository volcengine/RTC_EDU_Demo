package com.volcengine.vertcdemo.feature.roommain;

import android.content.Context;
import android.os.Build;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.List;

public class MeetingUserWindowView extends FrameLayout {

    public MeetingUserWindowView(Context context) {
        super(context);
        init(context);
    }

    public MeetingUserWindowView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public MeetingUserWindowView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public MeetingUserWindowView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
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

    private MeetingUserInfo mUserInfo;
    private UIMeetingRoom mMeetingCore;

    private void init(Context context) {
        View.inflate(context, R.layout.view_user_window, this);
        mTalkingNameHighlight = findViewById(R.id.talking_highlight_name);
        mTalkingHighlight = findViewById(R.id.talking_highlight);
        mUserNamePrefix = findViewById(R.id.user_name_prefix);
        mHostTag = findViewById(R.id.host_tag);
        mUserName = findViewById(R.id.user_name);
        mUserMicOff = findViewById(R.id.user_mic_off);
        mUserScreenShareOn = findViewById(R.id.user_share_screen_status);
        mVideoRendererContainer = findViewById(R.id.video_renderer_container);
    }

    public void bind(UIMeetingRoom meetingCore, MeetingUserInfo info) {
        mMeetingCore = meetingCore;
        mUserInfo = info;
        updateUserInfo();
        updateAudioStatus();
        updateAudioSpeakingStatus();
        updateVideoRenderer();
        updateShareStatus();
    }

    public void updateByPayload(Object payload) {
        if (IUIMeetingDef.UserUpdateReason.ON_MIC_CHANGED.equals(payload)) {
            updateAudioStatus();
            updateAudioSpeakingStatus();
        } else if (IUIMeetingDef.UserUpdateReason.ON_CAM_CHANGED.equals(payload)) {
            updateVideoRenderer();
        } else if (IUIMeetingDef.UserUpdateReason.ON_SHARE_CHANGED.equals(payload)) {
            updateShareStatus();
        } else if (IUIMeetingDef.UserUpdateReason.ON_HOST_CHANGED.equals(payload)) {
            updateHostTag();
        }
    }

    public void updateByPayloads(List<Object> payload) {
        if (payload.contains(IUIMeetingDef.UserUpdateReason.ON_MIC_CHANGED)) {
            updateAudioStatus();
            updateAudioSpeakingStatus();
        }
        if (payload.contains(IUIMeetingDef.UserUpdateReason.ON_CAM_CHANGED)) {
            updateVideoRenderer();
        }
        if (payload.contains(IUIMeetingDef.UserUpdateReason.ON_SHARE_CHANGED)) {
            updateShareStatus();
        }
        if (payload.contains(IUIMeetingDef.UserUpdateReason.ON_HOST_CHANGED)) {
            updateHostTag();
        }
    }

    private void updateUserInfo() {
        if (mUserInfo != null && !TextUtils.isEmpty(mUserInfo.userName)) {
            if (mUserInfo.isMe) {
                mUserName.setText(mUserInfo.userName + getContext().getString(R.string.me_tag));
            } else {
                mUserName.setText(mUserInfo.userName);
            }
            mUserNamePrefix.setText(mUserInfo.userName.substring(0, 1));
        } else {
            mUserName.setText("");
            mUserNamePrefix.setText("");
        }
        updateHostTag();
    }

    private void updateHostTag() {
        boolean isHost = mUserInfo != null && mUserInfo.isHost;
        Log.d("lvying", "MeetingUserWindowView updateUserInfo isMe:" + (mUserInfo != null && mUserInfo.isMe)
                + ",isHost:" + isHost, new Throwable());
        if (isHost) {
            mHostTag.setVisibility(View.VISIBLE);
            mHostTag.setText(mMeetingCore.getRoleDesc().hostDesc());
        } else {
            mHostTag.setVisibility(View.GONE);
        }
    }

    private void updateAudioStatus() {
        boolean isMicOn = mUserInfo != null && mUserInfo.isMicOn;
        mUserMicOff.setVisibility(isMicOn ? View.GONE : View.VISIBLE);
    }

    private void updateAudioSpeakingStatus() {
        boolean speaking = mUserInfo != null && mUserInfo.isMicOn && mUserInfo.isSpeaking;
        mTalkingNameHighlight.setVisibility(speaking ? View.VISIBLE : View.INVISIBLE);
        mTalkingHighlight.setVisibility(speaking ? View.VISIBLE : View.INVISIBLE);
    }

    private void updateShareStatus() {
        boolean isSharing = mUserInfo != null && mUserInfo.isShareOn;
        mUserScreenShareOn.setVisibility(isSharing ? View.VISIBLE : View.GONE);
    }

    private void updateVideoRenderer() {
        if (mUserInfo == null || !mUserInfo.isCameraOn) {
            mVideoRendererContainer.setVisibility(View.GONE);
            mVideoRendererContainer.removeAllViews();
            return;
        }

        if (mUserInfo.isMe) {
            mMeetingCore.getUIRtcCore().setupLocalVideoRenderer(mVideoRendererContainer);
        } else {
            mMeetingCore.getUIRtcCore().setupRemoteVideoRenderer(mVideoRendererContainer, mUserInfo.roomId, mUserInfo.userId);
        }
        mVideoRendererContainer.setVisibility(View.VISIBLE);
    }
}
