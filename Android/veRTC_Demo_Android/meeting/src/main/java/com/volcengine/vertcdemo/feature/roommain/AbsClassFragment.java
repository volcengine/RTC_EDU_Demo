package com.volcengine.vertcdemo.feature.roommain;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.volcengine.vertcdemo.core.WhiteBoardService;
import com.volcengine.vertcdemo.framework.UIRoomMgr;
import com.volcengine.vertcdemo.framework.classLarge.IUIEduDef;
import com.volcengine.vertcdemo.framework.classLarge.UIEduRoom;

public abstract class AbsClassFragment extends Fragment {

    private UIEduRoom mUIEduRoom;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mUIEduRoom = UIRoomMgr.eduRoom();
    }

    public UIEduRoom getUIRoom() {
        return mUIEduRoom;
    }

    public WhiteBoardService getWhiteBoardService(){
        return mUIEduRoom.getWhiteBoardService();
    }

    public IUIEduDef.IEduDataProvider getDataProvider() {
        return mUIEduRoom.getDataProvider();
    }
}
