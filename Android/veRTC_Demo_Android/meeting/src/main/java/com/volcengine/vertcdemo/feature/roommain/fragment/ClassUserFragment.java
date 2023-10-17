package com.volcengine.vertcdemo.feature.roommain.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.feature.roommain.AbsClassFragment;
import com.volcengine.vertcdemo.feature.roommain.ClassRoomUserAdapter;
import com.volcengine.vertcdemo.framework.classLarge.EduUserObserverTransfer;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class ClassUserFragment extends AbsClassFragment {

    private static final String TAG = "ClassUserFragment";

    private EduUserObserverTransfer mTransfer;
    LinearLayoutManager mLayoutManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_class_large_visible_user, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        MLog.d(TAG, "onViewCreated");

        ClassRoomUserAdapter userAdapter = new ClassRoomUserAdapter(getUIRoom(), getDataProvider().getVisibleUsers(), 1.0f / 3);
        mTransfer = new EduUserObserverTransfer(userAdapter) {
            @Override
            public void onUserUpdated(EduUserInfo user, int position) {
                if (position == 0 && !user.isFakeUser) {
                    subscribeVideoStream();
                }
                super.onUserUpdated(user, position);
            }
        };

        RecyclerView userRecyclerView = view.findViewById(R.id.user_conversation);
        mLayoutManager = new LinearLayoutManager(getContext());
        userRecyclerView.setLayoutManager(mLayoutManager);
        userRecyclerView.setAdapter(userAdapter);
        userRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                subscribeVideoStream();
            }
        });

        getDataProvider().addHandler(mTransfer);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        MLog.d(TAG, "onDestroyView");
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
        List<EduUserInfo> userList = getUIRoom().getDataProvider().getVisibleUsers();
        Set<String> subVideoStreamUserIds = new HashSet<>();
        for (int i = fromItem; i <= toItem && i < userList.size(); i++) {
            EduUserInfo userInfo = userList.get(i);
            if (userInfo.isMe) {
                continue;
            }
            subVideoStreamUserIds.add(userInfo.userId);
        }
        getUIRoom().subscribeVideoStream(subVideoStreamUserIds);
    }
}
