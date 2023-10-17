package com.volcengine.vertcdemo.framework.classLarge.internal;

import androidx.annotation.NonNull;

import com.volcengine.vertcdemo.framework.classLarge.bean.EduRoomTokenInfo;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingTokenInfo;
import com.volcengine.vertcdemo.framework.meeting.bean.MeetingUsersInfo;

public interface IEduRtmEventHandler {

    int SHARE_SCREEN = 0;
    int SHARE_WHITEBOARD = 1;

    int RECORD_STOPPED_BY_HOST = 0;
    int RECORD_STOPPED_TIME_LIMIT = 1;

    int ROOM_RELEASED_BY_HOST = 0;
    int ROOM_RELEASED_TIME_LIMIT = 1;

    /**
     * Join room success
     *
     * @param info
     */
    default void onJoinRoom(EduRoomTokenInfo info) {
    }

    /**
     * sync success
     *
     * @param info
     */
    default void onReSync(MeetingTokenInfo info) {
    }

    /**
     * get user list success
     *
     * @param data
     */
    default void onGetUserList(MeetingUsersInfo data) {
    }

    /**
     * enable local mic success
     *
     * @param enable
     */
    default void onEnableLocalMic(boolean enable) {
    }

    /**
     * enable local cam success
     *
     * @param enable
     */
    default void onEnableLocalCam(boolean enable) {
    }

    /**
     * as host, change remote user's share permit success
     *
     * @param userId
     * @param permit
     */
    default void onChangeRemoteUserSharePermit(String userId, boolean permit) {
    }

    /**
     * as host, change remote user's open mic permit success
     *
     * @param userId
     * @param permit
     */
    default void onPermitOpenMic(String userId, boolean permit) {
    }

    /**
     * as host, change remote user's open mic permit success
     *
     * @param userId
     * @param permit
     */
    default void onPermitShare(String userId, boolean permit) {
    }

    /**
     * A remote user enter join the room
     *
     * @param user      user info
     * @param userCount
     */
    default void onRemoteUserJoin(@NonNull EduUserInfo user, int userCount) {
    }

    /**
     * A remote user enter leave the room
     *
     * @param user      user info
     * @param userCount
     */
    default void onRemoteUserLeave(@NonNull EduUserInfo user, int userCount) {
    }

    default void onEnableAllMicByHost(boolean enable, boolean micPermit) {
    }

    /**
     * Whether a remote user is sending microphone data
     *
     * @param userId user Id
     * @param enable whether sending microphone data
     */
    default void onRemoteUserEnableMic(String userId, boolean enable) {
    }

    /**
     * Whether a remote user is sending camera data
     *
     * @param userId user Id
     * @param enable whether sending camera data
     */
    default void onRemoteUserEnableCam(String userId, boolean enable) {
    }

    /**
     * A remote user start screen sharing
     *
     * @param shareType {@link #SHARE_SCREEN} or {@link #SHARE_WHITEBOARD}
     * @param userId    user Id
     * @param userName
     */
    default void onShareStarted(@NonNull String roomId, @NonNull String userId, String userName) {
    }

    /**
     * A remote user stop screen sharing
     *
     * @param userId user Id
     */
    default void onShareStopped(@NonNull String roomId, @NonNull String userId) {
    }

    /**
     * close record started
     */
    default void onRecordStarted() {
    }

    /**
     * cloud record stopped
     *
     * @param reason {@link #RECORD_STOPPED_BY_HOST} {@link #RECORD_STOPPED_TIME_LIMIT}
     */
    default void onRecordStopped(int reason) {
    }

    /**
     * The host disable/enable the mic
     *
     * @param enable true: the user's mic is enabled, otherwise disabled
     */
    default void onEnableMicByHost(boolean enable) {
    }

    /**
     * The host disable/enable the camera
     *
     * @param enable true: the user's camera is enabled, otherwise disabled
     */
    default void onEnableCamByHost(boolean enable) {
    }

    /**
     * The host grant/revoke the share permit
     *
     * @param permit true: grant; false: revoke
     */
    default void onChangeSharePermitByHost(boolean permit) {
    }

    /**
     * Received an apply to open mic from a member
     *
     * @param userId   user id
     * @param userName user name
     */
    default void onReceiveOpenMicApply(String userId, String userName) {
    }

    /**
     * The host grant/revoke the permission to open mic
     *
     * @param permit true: grant; false" revoke
     */
    default void onReceiveOpenMicReply(boolean permit) {
    }

    /**
     * Received an apply to share from a member
     *
     * @param userId   user id
     * @param userName user name
     */
    default void onReceiveShareApply(String userId, String userName) {
    }

    /**
     * The host grant/revoke the permission to share
     *
     * @param permit true if grant otherwise false
     */
    default void onReceiveShareReply(boolean permit) {
    }

    /**
     * Received an apply to record
     *
     * @param userId   user id
     * @param userName user name
     */
    default void onReceiveRecordApply(String userId, String userName) {
    }

    /**
     * Received the permit of the record apply from host
     *
     * @param userId user id of host
     */
    default void onReceiveRecordReply(String userId, boolean permit) {
    }

    /**
     * @param reason {@link #ROOM_RELEASED_BY_HOST} {@link #ROOM_RELEASED_TIME_LIMIT}
     */
    default void onRoomReleased(int reason) {
    }

    default void onLinkMicPermit(boolean permit) {
    }

    default void onLinkMicJoin(EduUserInfo userInfo) {
    }

    default void onLinkMicLeave(EduUserInfo userInfo) {
    }

    default void onLinkMicKick() {
    }
}
