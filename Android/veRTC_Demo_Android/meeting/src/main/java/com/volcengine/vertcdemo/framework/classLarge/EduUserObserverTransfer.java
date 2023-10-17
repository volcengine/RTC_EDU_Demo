package com.volcengine.vertcdemo.framework.classLarge;

import android.annotation.SuppressLint;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;

import java.util.List;

public class EduUserObserverTransfer implements IUIEduDef.IUserDataObserver {

    private final RecyclerView.Adapter<?> mAdapter;

    public EduUserObserverTransfer(@NonNull RecyclerView.Adapter<?> adapter) {
        mAdapter = adapter;
    }

    @SuppressLint("NotifyDataSetChanged")
    @Override
    public void onUserDataRenew(List<EduUserInfo> userList) {
        mAdapter.notifyDataSetChanged();
    }

    @Override
    public void onUserInserted(EduUserInfo user, int position) {
        mAdapter.notifyItemInserted(position);
    }

    @Override
    public void onUserUpdated(EduUserInfo user, int position) {
        mAdapter.notifyItemRangeChanged(position, 1);
    }

    @Override
    public void onUserUpdated(EduUserInfo user, int position, Object payload) {
        mAdapter.notifyItemRangeChanged(position, 1, payload);
    }

    @Override
    public void onUserRemoved(EduUserInfo user, int position) {
        mAdapter.notifyItemRemoved(position);
    }

    @Override
    public void onUserMoved(EduUserInfo user, int fromPosition, int toPosition) {
        mAdapter.notifyItemMoved(fromPosition, toPosition);
    }
}
