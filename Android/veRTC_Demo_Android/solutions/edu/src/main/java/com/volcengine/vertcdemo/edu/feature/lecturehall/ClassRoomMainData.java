package com.volcengine.vertcdemo.edu.feature.lecturehall;

import android.text.TextUtils;

import com.volcengine.vertcdemo.edu.bean.EduUserInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class ClassRoomMainData {
    public String mAppId;
    public String mRoomToken;
    public String mRoomId;
    public String mRoomName;

    public String mGroupToken;
    public ArrayList<EduUserInfo> mGroupUserList = new ArrayList<>();

    public EduUserInfo mTeacherInfo;

    public String mSelfUserId;
    public String mSelfUserName;
    public boolean mIsSelfMicOn = false;

    public boolean mIsRecord = false;

    public boolean mIsClassStart = false;
    public long mClassStartAt = 0L;
    public long mClassDuration = 0L;

    public boolean mIsVideoInteract = false;
    public boolean mIsGroupSpeech = false;

    public boolean mIsRaiseHand = false;

    private final ArrayList<EduUserInfo> mMicOnStudentList = new ArrayList<>();

    public void addMicOnStudent(EduUserInfo userInfo) {
        if (userInfo == null || TextUtils.isEmpty(userInfo.userId)) {
            return;
        }
        for (EduUserInfo info : mMicOnStudentList) {
            if (TextUtils.equals(info.userId, userInfo.userId)) {
                return;
            }
        }
        mMicOnStudentList.add(userInfo);
    }

    public void removeMicOnStudent(EduUserInfo userInfo) {
        if (userInfo == null || TextUtils.isEmpty(userInfo.userId)) {
            return;
        }
        synchronized (mMicOnStudentList) {
            ListIterator<EduUserInfo> listIterator = mMicOnStudentList.listIterator();
            while (listIterator.hasNext()) {
                EduUserInfo temp = listIterator.next();
                if (TextUtils.equals(temp.userId, userInfo.userId)) {
                    listIterator.remove();
                }
            }
        }
    }

    public void addMicOnStudent(List<EduUserInfo> userInfoList) {
        if (userInfoList == null || userInfoList.size() == 0) {
            return;
        }
        for (EduUserInfo userInfo : userInfoList) {
            addMicOnStudent(userInfo);
        }
    }

    public ArrayList<EduUserInfo> getMicOnStudentList() {
        return mMicOnStudentList;
    }

    public int errorCode = 200;

    public boolean isSelf(String uid) {
        return TextUtils.equals(mSelfUserId, uid);
    }
}
