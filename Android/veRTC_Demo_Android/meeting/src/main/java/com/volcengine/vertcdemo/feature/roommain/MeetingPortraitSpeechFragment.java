package com.volcengine.vertcdemo.feature.roommain;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.FragmentTransaction;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingUserPageFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingScreenLocalFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingScreenRemoteFragment;
import com.volcengine.vertcdemo.feature.roommain.fragment.MeetingWhiteBoardFragment;
import com.volcengine.vertcdemo.meeting.R;
import com.volcengine.vertcdemo.ui.page.CircleIndicator;

public class MeetingPortraitSpeechFragment extends AbsMeetingFragment {

    private static final String TAG = "PortraitSpeechFragment";

    private ConstraintLayout mRootView;
    private View mGridDrawerLayout;
    private View mGridDrawerLayoutBg;
    private ImageView mGridDrawerLayoutIconIV;
    private TextView mTalkingUserTV;

    private FrameLayout mGridLayout;
    private ViewGroup mSpeechLayout;
    private View mExpandView;

    private final MeetingUserPageFragment mPagerUserFragment = new MeetingSpeechUserPageFragment();
    private final MeetingScreenRemoteFragment mScreenRemoteFragment = new MeetingScreenRemoteFragment();
    private final MeetingWhiteBoardFragment mWhiteBoardFragment = new MeetingWhiteBoardFragment();
    private final MeetingScreenLocalFragment mScreenLocalFragment = new MeetingScreenLocalFragment();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meeting_portrait_speech, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        MLog.d(TAG, "onViewCreated");
        mRootView = view.findViewById(R.id.room_root);
        mGridLayout = view.findViewById(R.id.room_grid);
        mGridDrawerLayout = view.findViewById(R.id.room_grid_drawer);
        mGridDrawerLayoutBg = view.findViewById(R.id.room_grid_drawer_bg);
        mGridDrawerLayoutIconIV = view.findViewById(R.id.room_grid_drawer_icon);
        mTalkingUserTV = view.findViewById(R.id.room_grid_drawer_talking);

        mSpeechLayout = view.findViewById(R.id.room_speech);
        mExpandView = view.findViewById(R.id.room_speech_full_screen);

        mGridDrawerLayout.setOnClickListener((v) -> {
            if (mGridLayout.getVisibility() == View.VISIBLE) {
                mGridLayout.setVisibility(View.GONE);
                expandShareLayout();

                mGridDrawerLayoutBg.setVisibility(View.VISIBLE);
                mGridDrawerLayoutIconIV.setImageDrawable(getResources().getDrawable(R.drawable.ic_grid_expand_portrait));
                mTalkingUserTV.setVisibility(View.VISIBLE);
            } else {
                mGridLayout.setVisibility(View.VISIBLE);
                collapseShareLayout();

                mGridDrawerLayoutBg.setVisibility(View.GONE);
                mGridDrawerLayoutIconIV.setImageDrawable(getResources().getDrawable(R.drawable.ic_grid_collapse_portrait));
                mTalkingUserTV.setVisibility(View.GONE);
            }
        });
        mExpandView.setOnClickListener(v -> {
            MLog.d(TAG, "go to landscape");
            Activity activity = getActivity();
            if (activity != null) {
                activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            }
        });

        getDataProvider().getLatestSpeaker().observe(getViewLifecycleOwner(), speaker -> {
            if (speaker != null) {
                MLog.d(TAG, "active speaker " + speaker.userId);
                onActiveSpeaker(speaker.userId);
            } else {
                onActiveSpeaker("");
            }
        });
        getDataProvider().getRoomShareState().observe(getViewLifecycleOwner(), roomShareState -> {
            if (roomShareState == null) {
                return;
            }
            FragmentTransaction trans = getChildFragmentManager().beginTransaction();
            trans.remove(mScreenLocalFragment);
            trans.remove(mScreenRemoteFragment);
            trans.remove(mWhiteBoardFragment);
            if (roomShareState.isShareScreen()) {
                if (roomShareState.mIsMe) {
                    trans.replace(R.id.speech_content_container, mScreenLocalFragment);
                    mExpandView.setVisibility(View.GONE);
                } else {
                    trans.replace(R.id.speech_content_container, mScreenRemoteFragment);
                    mExpandView.setVisibility(View.VISIBLE);
                }
            } else if (roomShareState.isShareWhiteboard()) {
                trans.replace(R.id.speech_content_container, mWhiteBoardFragment);
                mExpandView.setVisibility(View.GONE);
            }
            trans.commit();
        });

        getChildFragmentManager().beginTransaction().add(R.id.room_grid, mPagerUserFragment).commit();
    }

    private void expandShareLayout() {
        Log.d(TAG, "expandShareLayout()");
        ConstraintLayout.LayoutParams params = (ConstraintLayout.LayoutParams) mSpeechLayout.getLayoutParams();
        params.matchConstraintPercentHeight = 1.0f;
        params.topToTop = ConstraintLayout.LayoutParams.PARENT_ID;
        params.topMargin = CircleIndicator.dp2px(30);
        mRootView.updateViewLayout(mSpeechLayout, params);

        ConstraintLayout.LayoutParams drawerLayoutParams = (ConstraintLayout.LayoutParams) mGridDrawerLayout.getLayoutParams();
        drawerLayoutParams.bottomToTop = ConstraintLayout.LayoutParams.UNSET;
        mRootView.updateViewLayout(mGridDrawerLayout, drawerLayoutParams);
    }

    private void collapseShareLayout() {
        Log.d(TAG, "collapseShareLayout()");
        ConstraintLayout.LayoutParams params = (ConstraintLayout.LayoutParams) mSpeechLayout.getLayoutParams();
        params.matchConstraintPercentHeight = 0.75f;
        params.topToTop = ConstraintLayout.LayoutParams.UNSET;
        params.topMargin = 0;
        mRootView.updateViewLayout(mSpeechLayout, params);

        ConstraintLayout.LayoutParams drawerLayoutParams = (ConstraintLayout.LayoutParams) mGridDrawerLayout.getLayoutParams();
        drawerLayoutParams.bottomToTop = R.id.room_speech;
        mRootView.updateViewLayout(mGridDrawerLayout, drawerLayoutParams);
    }

    public void onActiveSpeaker(String speaker) {
        mTalkingUserTV.setText(getResources().getString(R.string.who_is_speaking, speaker));
    }

    public static class MeetingSpeechUserPageFragment extends MeetingUserPageFragment {
        @Override
        protected void updateLayout() {
            int userCount = getDataProvider().getUsers().size();
            setLayoutMode(LayoutMode.MODE2);
            updatePageNum(userCount);
        }
    }
}
