package com.volcengine.vertcdemo.feature.roommain.fragment;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.volcengine.vertcdemo.feature.roommain.AbsClassFragment;
import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;

public class ClassWhiteboardStreamFragment extends AbsClassFragment {

    private static final String TAG = "WhiteboardStreamFragment";
    private FrameLayout mRemoteRenderContainer;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        mRemoteRenderContainer = new FrameLayout(getContext());
        mRemoteRenderContainer.setBackgroundColor(Color.YELLOW);
        return mRemoteRenderContainer;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        IUIEduDef.WhiteBoardStreamInfo info = getDataProvider().getWhiteBoardStreamInfo();
        if (info == null) {
            throw new IllegalStateException("no white board stream info, check pls");
        }
        getUIRoom().subscribeWhiteBoardStream();
        getUIRoom().getUIRtcCore().setupRemoteVideoRenderer(mRemoteRenderContainer, info.mRoomId, info.mUserId);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        getUIRoom().unsubscribeWhiteBoardStream();
    }
}
