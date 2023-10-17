package com.volcengine.vertcdemo.feature.roommain.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.feature.roommain.AbsClassFragment;
import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;

public class ClassScreenFragment extends AbsClassFragment {

    private static final String TAG = "ClassScreenFragment";
    private FrameLayout mRemoteRenderContainer;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        mRemoteRenderContainer = new FrameLayout(getContext());
        return mRemoteRenderContainer;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        MLog.d(TAG, "onViewCreated");
        IUIEduDef.ScreenShareStreamInfo roomShareState = getDataProvider().getScreenStreamInfo();
        if (roomShareState == null) {
            throw new IllegalStateException("unexpected share state");
        }
        getUIRoom().getUIRtcCore().setupRemoteScreenRenderer(mRemoteRenderContainer, roomShareState.mRoomId, roomShareState.mUserId);
    }
}
