package com.volcengine.vertcdemo.framework.meeting;

import android.annotation.SuppressLint;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;

import java.util.List;

public class MeetingUserObserverTransfer implements IUIMeetingDef.IUserDataObserver {

    private final RecyclerView.Adapter<?> mAdapter;

    public MeetingUserObserverTransfer(@NonNull RecyclerView.Adapter<?> adapter) {
        mAdapter = adapter;
    }

    @SuppressLint("NotifyDataSetChanged")
    @Override
    public void onUserDataRenew(List<MeetingUserInfo> userList) {
        mAdapter.notifyDataSetChanged();
    }

    @Override
    public void onUserInserted(MeetingUserInfo user, int position) {
        mAdapter.notifyItemInserted(position);
    }

    @Override
    public void onUserUpdated(MeetingUserInfo user, int position) {
        mAdapter.notifyItemRangeChanged(position, 1);
    }

    @Override
    public void onUserUpdated(MeetingUserInfo user, int position, Object payload) {
        mAdapter.notifyItemRangeChanged(position, 1, payload);
    }

    @Override
    public void onUserRemoved(MeetingUserInfo user, int position) {
        mAdapter.notifyItemRemoved(position);
    }

    @Override
    public void onUserMoved(MeetingUserInfo user, int fromPosition, int toPosition) {
        mAdapter.notifyItemMoved(fromPosition, toPosition);
    }
}
