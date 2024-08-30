import { DeviceState, Permission, ShareType, Silence } from '@/types/state';
import { RtsError, SendServerMessageRes } from '@/types/rtsTypes';
import { getNull, getResponse, sendServerMessage, getRes } from '@/utils/rtsUtils';
import { IMeetingUser, MeetingRoomState } from '@/store/slices/meetingRoom';

export interface JoinMeetingRoomRes {
  room: Omit<
    MeetingRoomState,
    'localUser' | 'remoteUsers'
  >; // 房间信息
  user: IMeetingUser; // 本人 user 信息
  user_list: IMeetingUser[]; // user数组，按照进房时间排序
  token: string; // 加入rtc房间需要的token
  wb_room_id: string; // 白板 room id
  wb_user_id: string; // 白板 user id
  wb_token: string; // 白板 token
}

export interface ReconnectRes {
  room: Omit<MeetingRoomState, 'localUser' | 'remoteUsers'>; // 房间信息
  user: IMeetingUser; // 本人 user 信息
  user_list: IMeetingUser[]; // user数组，按照进房时间排序
}

export interface GetUserListRes {
  user_count: number; // 房间内用户数
  user_list: IMeetingUser[]; // user数组，按照进房时间排序
}

/**
 * 告知业务服务器用户进房
 * @param data
 * @returns
 */
export const joinRoom = async (data: {
  user_name: string;
  camera: DeviceState;
  mic: DeviceState;
  is_silence?: Silence;
}): Promise<SendServerMessageRes<JoinMeetingRoomRes> | RtsError> => {
  return sendServerMessage('vcJoinRoom', getRes, data);
};

/**
 * 告知业务服务器用户离房
 * @param data
 * @returns
 */
export const leaveRoom = async (): Promise<null | RtsError> => {
  return sendServerMessage('vcLeaveRoom', getNull);
};

/**
 * 关闭房间，对应全员结束。
 * @returns
 */
export const finishRoom = async (): Promise<null | RtsError> => {
  return sendServerMessage('vcFinishRoom', getNull);
};

/**
 * 断线之后重连，调用此接口获取当前房间信息
 * @param data
 * @returns
 */
export const reSync = async (): Promise<SendServerMessageRes<ReconnectRes> | RtsError> => {
  return sendServerMessage('vcResync', getRes);
};

/**
 * 获取房间内用户列表
 * @param data
 * @returns
 */
export const getUserList = async (): Promise<GetUserListRes | RtsError> => {
  return sendServerMessage('vcGetUserList', getResponse);
};

/**
 * 本地用户操作自己的摄像头
 * @param data
 * @returns
 */
export const operateSelfCamera = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateSelfCamera', getNull, data);
};

/**
 * 本地用户操作自己的麦克风
 * @param data
 * @returns
 */
export const operateSelfMic = async (data: { operate: DeviceState }): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateSelfMic', getNull, data);
};

/**
 * 申请麦克风权限
 * @param data
 * @returns
 */
export const operateSelfMicApply = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateSelfMicApply', getNull, data);
};

/**
 * 本地用户开始共享
 * @param data
 * @returns
 */
export const startShare = async (data: { share_type: ShareType }): Promise<null | RtsError> => {
  return sendServerMessage('vcStartShare', getNull, data);
};

/**
 * 本地用户停止共享
 * @returns
 */
export const finishShare = async (): Promise<null | RtsError> => {
  return sendServerMessage('vcFinishShare', getNull);
};

/**
 * 申请共享权限
 * @returns
 */
export const sharePermissionApply = async (): Promise<null | RtsError> => {
  return sendServerMessage('vcSharePermissionApply', getNull);
};

export const operateOtherCamera = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateOtherCamera', getNull, data);
};

/**
 * 操纵参会人麦克风
 * @returns
 */
export const operateOtherMic = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateOtherMic', getNull, data);
};

/**
 * 操纵参会人屏幕共享权限
 * @returns
 */
export const operateOtherSharePermission = async (data: {
  operate_user_id: string;
  operate: Permission;
}): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateOtherSharePermission', getNull, data);
};

/**
 * 发送全员禁言消息
 * @returns
 */
export const vcOperateAllMic = async (data: {
  operate_self_mic_permission: Permission; // 全员静音后，是否允许房间内观众自行开麦
  operate: DeviceState.Closed; // 是否进行全员静音
}): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateAllMic', getNull, data);
};

/**
 * 观众请求麦克风使用权限后, 主持人答复
 * @param data
 * @returns
 */
export const operateSelfMicPermit = async (data: {
  apply_user_id: string;
  permit: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('vcOperateSelfMicPermit', getNull, data);
};

/**
 * 观众请求屏幕共享权限后, 主持人答复
 * @param data
 * @returns
 */
export const sharePermissionPermit = async (data: {
  apply_user_id: string;
  permit: Permission;
}): Promise<null | RtsError> => {
  return sendServerMessage('vcSharePermissionPermit', getNull, data);
};
