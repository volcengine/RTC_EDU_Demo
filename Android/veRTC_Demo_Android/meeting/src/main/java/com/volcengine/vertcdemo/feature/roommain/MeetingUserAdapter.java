package com.volcengine.vertcdemo.feature.roommain;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.List;

public class MeetingUserAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private final UIMeetingRoom mMeetingCore;
    private final List<MeetingUserInfo> mUserList;
    private final float mViewHeightPercent;

    public MeetingUserAdapter(UIMeetingRoom meetingCore, @NonNull List<MeetingUserInfo> userList, float viewHeightPercent) {
        mMeetingCore = meetingCore;
        mUserList = userList;
        mViewHeightPercent = viewHeightPercent;
    }

    @Override
    public int getItemCount() {
        return mUserList.size();
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.view_item_user, parent, false);
        ViewGroup.LayoutParams layoutParam = view.getLayoutParams();
        layoutParam.height = (int) (parent.getMeasuredHeight() * mViewHeightPercent);
        return new UserViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof UserViewHolder) {
            MeetingUserInfo memberInfo = mUserList.get(position);
            ((UserViewHolder) holder).bind(mMeetingCore, memberInfo);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position, @NonNull List<Object> payloads) {
        if (!payloads.isEmpty() && holder instanceof UserViewHolder) {
            ((UserViewHolder) holder).updateByPayloads(payloads);
        } else {
            super.onBindViewHolder(holder, position, payloads);
        }
    }

    public static class UserViewHolder extends RecyclerView.ViewHolder {

        private final MeetingUserWindowView mMemberView;

        public UserViewHolder(@NonNull View itemView) {
            super(itemView);
            mMemberView = itemView.findViewById(R.id.user_window);
        }

        void bind(UIMeetingRoom meetingCore, MeetingUserInfo memberInfo) {
            mMemberView.bind(meetingCore, memberInfo);
        }

        void updateByPayloads(List<Object> payloads) {
            mMemberView.updateByPayloads(payloads);
        }
    }
}
