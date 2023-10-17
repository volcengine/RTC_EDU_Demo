package com.volcengine.vertcdemo.framework;

import android.content.Context;

import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.UIRtcCore;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;
import com.volcengine.vertcdemo.framework.classLarge.UIEduRoom;
import com.volcengine.vertcdemo.framework.classLarge.impl.EduRoomImpl;
import com.volcengine.vertcdemo.framework.classSmall.UIClassSmallRoom;
import com.volcengine.vertcdemo.framework.classSmall.impl.ClassSmallRoomImpl;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.UIMeetingRoom;
import com.volcengine.vertcdemo.framework.meeting.impl.MeetingRoomImpl;
import com.volcengine.vertcdemo.meeting.R;

public class UIRoomMgr {

    private static final String TAG = "UIRoomMgr";

    private static UIMeetingRoom sMeetingRoomIns = null;
    private static UIEduRoom sUIEduRoomIns = null;

    public static synchronized UIMeetingRoom createMeetingRoom(Context context, RtmInfo rtmInfo, String roomId) {
        UIRtcCore uiRtcCore = UIRtcCore.ins();
        if (uiRtcCore == null) {
            MLog.w(TAG, "");
            return null;
        }

        sMeetingRoomIns = new MeetingRoomImpl(context, rtmInfo, roomId, uiRtcCore, new IUIMeetingDef.IRoleDesc() {
            @Override
            public String hostDesc() {
                return context.getString(R.string.role_host_desc_meeting);
            }

            @Override
            public String participantDesc() {
                return context.getString(R.string.role_participant_desc_meeting);
            }
        });

        return sMeetingRoomIns;
    }

    public static synchronized UIClassSmallRoom createClassSmallRoom(Context context, RtmInfo rtmInfo, String roomId) {
        UIRtcCore uiRtcCore = UIRtcCore.ins();
        if (uiRtcCore == null) {
            MLog.w(TAG, "");
            return null;
        }

        ClassSmallRoomImpl classSmallCore = new ClassSmallRoomImpl(context, rtmInfo, roomId, uiRtcCore, new IUIMeetingDef.IRoleDesc() {
            @Override
            public String hostDesc() {
                return context.getString(R.string.role_host_desc_class);
            }

            @Override
            public String participantDesc() {
                return context.getString(R.string.role_participant_desc_class);
            }
        });
        sMeetingRoomIns = classSmallCore;
        return classSmallCore;
    }

    public static synchronized UIEduRoom createEduRoom(Context context, RtmInfo rtmInfo, String roomId) {
        UIRtcCore uiRtcCore = UIRtcCore.ins();
        if (uiRtcCore == null) {
            MLog.w(TAG, "");
            return null;
        }
        sUIEduRoomIns = new EduRoomImpl(context, rtmInfo, roomId, uiRtcCore);
        return sUIEduRoomIns;
    }

    public static synchronized UIMeetingRoom meetingRoom() {
        return sMeetingRoomIns;
    }

    public static synchronized UIEduRoom eduRoom() {
        return sUIEduRoomIns;
    }

    public static synchronized void releaseMeetingRoom() {
        if (sMeetingRoomIns != null) {
            sMeetingRoomIns.dispose();
            sMeetingRoomIns = null;
        }
    }

    public static synchronized void releaseEduRoom() {
        if (sUIEduRoomIns != null) {
            sUIEduRoomIns.dispose();
            sUIEduRoomIns = null;
        }
    }
}
