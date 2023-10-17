package com.volcengine.vertcdemo.feature.roommain.fragment;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.feature.roommain.AbsMeetingFragment;
import com.volcengine.vertcdemo.feature.roommain.MeetingUserWindowView;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MeetingUserPipFragment extends AbsMeetingFragment {

    private static final String TAG = "UserPipFragment";

    private MeetingUserWindowView mLargeWindowLayout;
    private MeetingUserWindowView mSmallWindowLayout;

    private MeetingUserInfo mLargeUserInfo;
    private MeetingUserInfo mSmallUserInfo;

    private boolean mSwitchedWindow;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meeting_pip, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        MLog.d(TAG, "onViewCreated");
        mLargeWindowLayout = view.findViewById(R.id.user_large);
        mSmallWindowLayout = view.findViewById(R.id.user_small);
        mSmallWindowLayout.setOnClickListener((v) -> {
            if (mSmallUserInfo != null) {
                mSwitchedWindow = true;
            }
            bindPipUser(mSmallUserInfo, mLargeUserInfo);
        });
        getDataProvider().addHandler(mDataObserver);
        bindPipUser();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        getDataProvider().removeHandler(mDataObserver);
    }

    private void bindPipUser() {
        List<MeetingUserInfo> userList = getDataProvider().getUsers();
        if (userList.size() > 2) {
            mLargeUserInfo = null;
            mSmallUserInfo = null;
            mLargeWindowLayout.bind(getUIRoom(), null);
            mSmallWindowLayout.bind(getUIRoom(), null);
        } else {
            MeetingUserInfo user1 = userList.size() >= 1 ? userList.get(0) : null;
            MeetingUserInfo user2 = userList.size() >= 2 ? userList.get(1) : null;
            if (!mSwitchedWindow
                    && userList.size() == 2
                    && TextUtils.equals(user1 == null ? null : user1.userId,
                    SolutionDataManager.ins().getUserId())) {
                bindPipUser(user2, user1);
                return;
            }
            bindPipUser(user1, user2);
        }
    }

    private void bindPipUser(MeetingUserInfo largeUserInfo, MeetingUserInfo smallUserInfo) {
        mLargeUserInfo = largeUserInfo;
        mSmallUserInfo = smallUserInfo;

        Set<String> subVideoStreamUserIds = new HashSet<>();
        if (mLargeUserInfo == null) {
            mLargeWindowLayout.setVisibility(View.INVISIBLE);
        } else {
            mLargeWindowLayout.setVisibility(View.VISIBLE);
            if (!mLargeUserInfo.isMe) {
                subVideoStreamUserIds.add(mLargeUserInfo.userId);
            }
        }
        mLargeWindowLayout.bind(getUIRoom(), mLargeUserInfo);

        if (mSmallUserInfo == null) {
            mSmallWindowLayout.setVisibility(View.INVISIBLE);
        } else {
            mSmallWindowLayout.setVisibility(View.VISIBLE);
            if (!mSmallUserInfo.isMe) {
                subVideoStreamUserIds.add(mSmallUserInfo.userId);
            }
        }
        getUIRoom().subscribeVideoStream(subVideoStreamUserIds);
        mSmallWindowLayout.bind(getUIRoom(), mSmallUserInfo);
    }

    private final IUIMeetingDef.IUserDataObserver mDataObserver = new IUIMeetingDef.IUserDataObserver() {
        @Override
        public void onUserDataRenew(List<MeetingUserInfo> userList) {
            bindPipUser();
        }

        @Override
        public void onUserInserted(MeetingUserInfo user, int position) {
            bindPipUser();
        }

        @Override
        public void onUserUpdated(MeetingUserInfo user, int position) {
            if (user.equals(mLargeUserInfo)) {
                mLargeWindowLayout.bind(getUIRoom(), mLargeUserInfo);
            }
            if (user.equals(mSmallUserInfo)) {
                mSmallWindowLayout.bind(getUIRoom(), mSmallUserInfo);
            }
        }

        @Override
        public void onUserUpdated(MeetingUserInfo user, int position, Object payload) {
            if (user.equals(mLargeUserInfo)) {
                mLargeWindowLayout.updateByPayload(payload);
            }
            if (user.equals(mSmallUserInfo)) {
                mSmallWindowLayout.updateByPayload(payload);
            }
        }

        @Override
        public void onUserRemoved(MeetingUserInfo user, int position) {
            mSwitchedWindow = false;
            bindPipUser();
        }

        @Override
        public void onUserMoved(MeetingUserInfo user, int fromPosition, int toPosition) {
        }
    };
}
