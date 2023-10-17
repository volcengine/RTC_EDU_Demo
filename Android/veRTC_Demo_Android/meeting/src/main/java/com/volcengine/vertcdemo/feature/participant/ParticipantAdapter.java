package com.volcengine.vertcdemo.feature.participant;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.MeetingUserObserverTransfer;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.List;

public class ParticipantAdapter extends RecyclerView.Adapter<ParticipantAdapter.ParticipantViewHolder> {

    private final UIMeetingRoom mUIMeetingRoom;
    private final IUIMeetingDef.IMeetingDataProvider mDataProvider;
    private final UserOptionCallback mUserOptionCallback;
    private final MeetingUserObserverTransfer mTransfer;

    private List<MeetingUserInfo> mUserList;

    public ParticipantAdapter(@NonNull UIMeetingRoom uiMeetingRoom, UserOptionCallback userOptionCallback) {
        mUIMeetingRoom = uiMeetingRoom;
        mDataProvider = uiMeetingRoom.getDataProvider();
        mTransfer = new MeetingUserObserverTransfer(this);
        mUserOptionCallback = userOptionCallback;
    }

    @NonNull
    @Override
    public ParticipantViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_item_participant, parent, false);
        return new ParticipantViewHolder(view, mUserOptionCallback);
    }

    @Override
    public void onBindViewHolder(@NonNull ParticipantViewHolder holder, int position) {
        holder.bindUser(mUserList.get(position), mUIMeetingRoom.getDataProvider().isHost(), mUIMeetingRoom.getRoleDesc().hostDesc());
    }

    @Override
    public void onBindViewHolder(@NonNull ParticipantViewHolder holder, int position, @NonNull List<Object> payloads) {
        if (payloads.contains(IUIMeetingDef.UserUpdateReason.ON_MIC_CHANGED)) {
            holder.bindVolume(mUserList.get(position));
        } else if (payloads.contains(IUIMeetingDef.UserUpdateReason.ON_HOST_CHANGED)) {
            holder.bindHostTag(mUserList.get(position), mUIMeetingRoom.getRoleDesc().hostDesc());
        } else {
            super.onBindViewHolder(holder, position, payloads);
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    public void attach() {
        mUserList = mDataProvider.getUsers();
        mDataProvider.addHandler(mTransfer);
        notifyDataSetChanged();
    }

    @SuppressLint("NotifyDataSetChanged")
    public void detach() {
        mDataProvider.removeHandler(mTransfer);
        mUserList = null;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        return mUserList != null ? mUserList.size() : 0;
    }

    static class ParticipantViewHolder extends RecyclerView.ViewHolder {
        private final UserOptionCallback mOptionCallback;
        public TextView mPrefixTv;
        public TextView mUidTv;
        public TextView mHostTv;
        public TextView mMeTagTv;
        public ImageView mScreenShare;
        public View mUserNameHighlight;
        public ImageView mAudioAvailable;
        public ImageView mVideoAvailable;
        public ImageView mHasSharePermit;
        public ImageView mApplyPermit;

        public ParticipantViewHolder(@NonNull View itemView, UserOptionCallback userOptionCallback) {
            super(itemView);
            mPrefixTv = itemView.findViewById(R.id.user_prefix);
            mUidTv = itemView.findViewById(R.id.user_txt_tv);
            mHostTv = itemView.findViewById(R.id.user_host_tv);
            mMeTagTv = itemView.findViewById(R.id.user_me);
            mUserNameHighlight = itemView.findViewById(R.id.user_name_highlight);
            mScreenShare = itemView.findViewById(R.id.user_share_screen_status);
            mApplyPermit = itemView.findViewById(R.id.user_apply_permit);
            mAudioAvailable = itemView.findViewById(R.id.user_audio_available);
            mVideoAvailable = itemView.findViewById(R.id.user_video_available);
            mHasSharePermit = itemView.findViewById(R.id.user_share_permit);
            mOptionCallback = userOptionCallback;
        }

        public void bindUser(MeetingUserInfo user, boolean isHost, String hostDesc) {
            String userName = user.userName == null ? " " : user.userName;
            mPrefixTv.setText(userName.substring(0, 1));
            mUidTv.setText(userName);
            mHostTv.setVisibility(user.isHost ? View.VISIBLE : View.GONE);
            mHostTv.setText(hostDesc);
            mMeTagTv.setVisibility(user.isMe ? View.VISIBLE : View.GONE);
            mScreenShare.setVisibility(user.isShareOn ? View.VISIBLE : View.GONE);
            bindVolume(user);
            mVideoAvailable.setSelected(user.isCameraOn);
            mHasSharePermit.setSelected(user.isHost || user.hasSharePermission);
            if (isHost && (user.applyMicPermission || user.applySharePermission)) {
                mApplyPermit.setVisibility(View.VISIBLE);
            } else {
                mApplyPermit.setVisibility(View.GONE);
            }
            mApplyPermit.setOnClickListener(v -> mOptionCallback.onClickPermit(user));
            mAudioAvailable.setOnClickListener(v -> mOptionCallback.onClickMic(user));
            mVideoAvailable.setOnClickListener(v -> mOptionCallback.onClickCam(user));
            mHasSharePermit.setOnClickListener(v -> mOptionCallback.onClickSharePermission(user));
        }

        public void bindVolume(MeetingUserInfo user) {
            mAudioAvailable.setSelected(user.isMicOn);
            if (user.isMicOn && user.isSpeaking) {
                mUserNameHighlight.setVisibility(View.VISIBLE);
            } else {
                mUserNameHighlight.setVisibility(View.GONE);
            }
        }

        public void bindHostTag(MeetingUserInfo user, String hostDesc) {
            mHostTv.setVisibility(user.isHost ? View.VISIBLE : View.GONE);
            mHostTv.setText(hostDesc);
        }
    }

    public interface UserOptionCallback {

        void onClickPermit(MeetingUserInfo user);

        void onClickMic(MeetingUserInfo user);

        void onClickCam(MeetingUserInfo user);

        void onClickSharePermission(MeetingUserInfo user);
    }
}