package com.volcengine.vertcdemo.feature.roommain;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.volcengine.vertcdemo.core.WhiteBoardService;
import com.volcengine.vertcdemo.framework.UIRoomMgr;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;

public abstract class AbsMeetingFragment extends Fragment {

    private UIMeetingRoom mUIMeetingRoom;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mUIMeetingRoom = UIRoomMgr.meetingRoom();
    }

    public UIMeetingRoom getUIRoom() {
        return mUIMeetingRoom;
    }

    public WhiteBoardService getWhiteBoardService(){
        return mUIMeetingRoom.getWhiteBoardService();
    }

    public IUIMeetingDef.IMeetingDataProvider getDataProvider() {
        return mUIMeetingRoom.getDataProvider();
    }
}
