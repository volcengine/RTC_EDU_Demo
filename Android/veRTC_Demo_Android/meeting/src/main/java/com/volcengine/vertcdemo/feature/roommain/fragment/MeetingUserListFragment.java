package com.volcengine.vertcdemo.feature.roommain.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.feature.roommain.AbsMeetingFragment;
import com.volcengine.vertcdemo.feature.roommain.MeetingUserAdapter;
import com.volcengine.vertcdemo.framework.meeting.MeetingUserObserverTransfer;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MeetingUserListFragment extends AbsMeetingFragment {

    private LinearLayoutManager mLayoutManager;
    private MeetingUserObserverTransfer mTransfer;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meeting_linear_user, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        RecyclerView recyclerView = view.findViewById(R.id.users_page_conversation);
        MeetingUserAdapter userAdapter = new MeetingUserAdapter(getUIRoom(), getDataProvider().getUsers(), 1.0f / 3);
        recyclerView.setItemAnimator(null);
        recyclerView.setAdapter(userAdapter);
        mLayoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(mLayoutManager);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                subscribeVideoStream();
            }
        });
        mTransfer = new MeetingUserObserverTransfer(userAdapter);
        getDataProvider().addHandler(mTransfer);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        getDataProvider().removeHandler(mTransfer);
    }

    private void subscribeVideoStream() {
        int fromItem = mLayoutManager.findFirstVisibleItemPosition();
        if (fromItem == RecyclerView.NO_POSITION) {
            return;
        }
        int toItem = mLayoutManager.findLastVisibleItemPosition();
        if (toItem == RecyclerView.NO_POSITION) {
            return;
        }
        List<MeetingUserInfo> userList = getUIRoom().getDataProvider().getUsers();
        Set<String> subVideoStreamUserIds = new HashSet<>();
        for (int i = fromItem; i <= toItem && i < userList.size(); i++) {
            MeetingUserInfo userInfo = userList.get(i);
            if (userInfo.isMe) {
                continue;
            }
            subVideoStreamUserIds.add(userInfo.userId);
        }
        getUIRoom().subscribeVideoStream(subVideoStreamUserIds);
    }
}