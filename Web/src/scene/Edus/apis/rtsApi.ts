import { EdusRoomState, IEdusUser } from '@/store/slices/edusRoom';
import { RtsError, SendServerMessageRes } from '@/types/rtsTypes';
import { DeviceState, Permission, ShareType, Silence, UserRole } from '@/types/state';
import { getNull, getRes, getResponse, sendServerMessage } from '@/utils/rtsUtils';

export interface JoinEdusRoomRes {
  room: Omit<
    EdusRoomState,
    'localUser' | 'remoteUsers' | 'linkmic_user_list' | 'linkmic_apply_list' | 'teacher'
  >; // 房间信息
  user: IEdusUser; // 本人 user 信息
  teacher?: IEdusUser; // 老师信息
  linkmic_user_list: IEdusUser[]; // user数组，按照进房时间排序
  user_list: IEdusUser[]; // user数组，按照进房时间排序
  token: string; // 加入rtc房间需要的token
  wb_room_id: string; // 白板 room id
  wb_user_id: string; // 白板 user id
  wb_token: string; // 白板 token
  wb_stream_user_id: string; // 互动白板 rtc 推流 user_id
}

export interface ReconnectRes {
  room: Omit<EdusRoomState, 'localUser' | 'remoteUsers'>;
  user: IEdusUser;
  user_list: IEdusUser[];
}

export interface GetUserListRes {
  user_count: number;
  user_list: IEdusUser[];
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
  user_role: UserRole;
  is_silence?: Silence;
}): Promise<SendServerMessageRes<JoinEdusRoomRes> | RtsError> => {
  return sendServerMessage('edusJoinRoom', getRes, data);
};

/**
 * 告知业务服务器用户离房
 * @param data
 * @returns
 */
export const leaveRoom = async (): Promise<null | RtsError> => {
  return sendServerMessage('edusLeaveRoom', getNull);
};

/**
 * 结束房间
 * @returns
 */
export const finishRoom = async (): Promise<null | RtsError> => {
  return sendServerMessage('edusFinishRoom', getNull);
};

/**
 * 断线之后重连，调用此接口获取当前房间信息
 * @param data
 * @returns
 */
export const reSync = async (): Promise<SendServerMessageRes<ReconnectRes> | RtsError> => {
  return sendServerMessage('edusResync', getRes);
};

/**
 * 获取房间内用户列表
 * @param data
 * @returns
 */
export const getUserList = async (): Promise<GetUserListRes | RtsError> => {
  return sendServerMessage('edusGetUserList', getResponse);
};

/**
 * 本地用户操作自己的摄像头
 * @param data
 * @returns
 */
export const operateSelfCamera = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateSelfCamera', getNull, data);
};

/**
 * 本地用户操作自己的麦克风
 * @param data
 * @returns
 */
export const operateSelfMic = async (data: { operate: DeviceState }): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateSelfMic', getNull, data);
};

/**
 * 申请麦克风权限
 * @param data
 * @returns
 */
export const operateSelfMicApply = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateSelfMicApply', getNull, data);
};

/**
 * 本地用户开始共享
 * @param data
 * @returns
 */
export const startShare = async (data: { share_type: ShareType }): Promise<null | RtsError> => {
  return sendServerMessage('edusStartShare', getNull, data);
};

/**
 * 本地用户停止共享
 * @returns
 */
export const finishShare = async (): Promise<null | RtsError> => {
  return sendServerMessage('edusFinishShare', getNull);
};

/**
 * 申请共享权限
 * @returns
 */
export const sharePermissionApply = async (): Promise<null | RtsError> => {
  return sendServerMessage('edusSharePermissionApply', getNull);
};

/**
 * 操纵参会人摄像头
 * @returns
 */
export const operateOtherCamera = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateOtherCamera', getNull, data);
};

/**
 * 操纵参会人麦克风
 * @returns
 */
export const operateOtherMic = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateOtherMic', getNull, data);
};

/**
 * 操纵参会人屏幕共享权限
 * @returns
 */
export const operateOtherSharePermission = async (data: {
  operate_user_id: string;
  operate: Permission;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateOtherSharePermission', getNull, data);
};

/**
 * 发送全员禁言消息
 * @returns
 */
export const vcOperateAllMic = async (data: {
  operate_self_mic_permission: Permission;
  operate: DeviceState.Closed;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateAllMic', getNull, data);
};

/**
 * 学生请求麦克风使用权限后, 老师答复
 * @param data
 * @returns
 */
export const operateSelfMicPermit = async (data: {
  apply_user_id: string;
  permit: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusOperateSelfMicPermit', getNull, data);
};

/**
 * 学生请求屏幕共享权限后, 老师答复
 * @param data
 * @returns
 */
export const sharePermissionPermit = async (data: {
  apply_user_id: string;
  permit: Permission;
}): Promise<null | RtsError> => {
  return sendServerMessage('edusSharePermissionPermit', getNull, data);
};
