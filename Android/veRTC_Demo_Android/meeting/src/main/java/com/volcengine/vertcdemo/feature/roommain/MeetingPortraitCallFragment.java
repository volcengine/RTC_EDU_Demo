package com.volcengine.vertcdemo.feature.roommain;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingUserPageFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingUserPipFragment;
import com.volcengine.vertcdemo.meeting.R;

public class MeetingPortraitCallFragment extends AbsMeetingFragment {

    private static final String TAG = "PortraitCallFragment";

    private final MeetingUserPipFragment mPipFragment = new MeetingUserPipFragment();
    private final MeetingUserPageFragment mPagerUserFragment = new MeetingUserPageFragment();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meeting_portrait_call, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        getDataProvider().getUserCount().observe(getViewLifecycleOwner(), userCount -> {
            if (userCount <= 2) {
                MLog.d(TAG, "pip mode");
                getChildFragmentManager().beginTransaction().remove(mPipFragment).remove(mPagerUserFragment).add(R.id.room_root, mPipFragment).commit();
            } else {
                MLog.d(TAG, "page mode");
                getChildFragmentManager().beginTransaction().remove(mPipFragment).remove(mPagerUserFragment).add(R.id.room_root, mPagerUserFragment).commit();
            }
        });
    }
}
