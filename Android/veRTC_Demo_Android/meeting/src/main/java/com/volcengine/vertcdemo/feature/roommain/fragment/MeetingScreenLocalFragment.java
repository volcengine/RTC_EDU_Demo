package com.volcengine.vertcdemo.feature.roommain.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Switch;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.volcengine.vertcdemo.feature.roommain.AbsMeetingFragment;
import com.volcengine.vertcdemo.meeting.R;

public class MeetingScreenLocalFragment extends AbsMeetingFragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meeting_screen_local, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Switch audioSharingSwitch = view.findViewById(R.id.local_audio_share_switch);
        View stopShareView = view.findViewById(R.id.local_stop_share);
        boolean screenAudio = getUIRoom().getRtcDataProvider().isSharingScreenAudio();
        stopShareView.setOnClickListener(v -> {
            getUIRoom().stopScreenSharing();
        });
        audioSharingSwitch.setChecked(screenAudio);
        audioSharingSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                getUIRoom().publishScreenAudio();
            } else {
                getUIRoom().unPublishScreenAudio();
            }
        });
    }
}
