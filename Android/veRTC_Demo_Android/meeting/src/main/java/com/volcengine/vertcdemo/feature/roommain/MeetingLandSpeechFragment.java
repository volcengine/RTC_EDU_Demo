package com.volcengine.vertcdemo.feature.roommain;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.Guideline;
import androidx.fragment.app.FragmentTransaction;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingUserListFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingScreenRemoteFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingWhiteBoardFragment;
import com.volcengine.vertcdemo.meeting.R;

public class MeetingLandSpeechFragment extends AbsMeetingFragment {

    private static final String TAG = "LandSpeechFragment";

    private FrameLayout mGridLayout;
    private ImageView mFullScreenMicStatus;
    private ImageView mGridDrawerLayoutIconIV;
    private Guideline mDrawerGuideline;

    private final MeetingUserListFragment mLinearUserFragment = new MeetingUserListFragment();
    private final MeetingScreenRemoteFragment mScreenRemoteFragment = new MeetingScreenRemoteFragment();
    private final MeetingWhiteBoardFragment mWhiteBoardFragment = new MeetingWhiteBoardFragment();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meeting_landscape_speech, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        MLog.d(TAG, "onViewCreated");
        mFullScreenMicStatus = view.findViewById(R.id.full_screen_mic);
        mGridLayout = view.findViewById(R.id.full_screen_room_grid);
        mGridDrawerLayoutIconIV = view.findViewById(R.id.full_screen_room_grid_drawer_icon);
        mDrawerGuideline = view.findViewById(R.id.full_screen_guideline);

        view.findViewById(R.id.full_screen_room_grid_drawer).setOnClickListener(v -> {
            if (mGridLayout.getVisibility() == View.VISIBLE) {
                mDrawerGuideline.setGuidelinePercent(1);
                mGridLayout.setVisibility(View.GONE);
                getChildFragmentManager().beginTransaction().remove(mLinearUserFragment).commit();
                mGridDrawerLayoutIconIV.setImageDrawable(getResources().getDrawable(R.drawable.ic_grid_expand_landscape));
            } else {
                getChildFragmentManager().beginTransaction().add(R.id.full_screen_room_grid, mLinearUserFragment).commit();
                mGridLayout.setVisibility(View.VISIBLE);
                mDrawerGuideline.setGuidelinePercent(0.8f);
                mGridDrawerLayoutIconIV.setImageDrawable(getResources().getDrawable(R.drawable.ic_grid_collapse_landscape));
            }
        });
        mFullScreenMicStatus.setOnClickListener(v -> {
            Activity activity = getActivity();
            if (activity != null) {
                getUIRoom().openMic(activity, !mFullScreenMicStatus.isSelected());
            }
        });
        view.findViewById(R.id.full_screen_quit).setOnClickListener(v -> {
            MLog.d(TAG, "go to portrait");
            Activity activity = getActivity();
            if (activity != null) {
                activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            }
        });

        getUIRoom().getRtcDataProvider().micState().observe(getViewLifecycleOwner(), openMic -> {
            MLog.d(TAG, "mic state: " + openMic);
            mFullScreenMicStatus.setSelected(openMic);
        });
        getUIRoom().getDataProvider().getRoomShareState().observe(getViewLifecycleOwner(), roomShareState -> {
            if (roomShareState == null) {
                return;
            }
            FragmentTransaction trans = getChildFragmentManager().beginTransaction();
            trans.remove(mScreenRemoteFragment);
            trans.remove(mWhiteBoardFragment);
            if (roomShareState.isShareScreen()) {
                if (!roomShareState.mIsMe) {
                    trans.replace(R.id.speech_content_container, mScreenRemoteFragment);
                }
            } else if (roomShareState.isShareWhiteboard()) {
                trans.replace(R.id.speech_content_container, mWhiteBoardFragment);
            }
            trans.commit();
        });
    }
}
