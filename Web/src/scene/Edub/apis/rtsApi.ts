import { EdubRoomState, IEdubUser } from '@/store/slices/edubRoom';
import { DeviceState, ShareType, Silence, UserRole } from '@/types/state';
import { RtsError, SendServerMessageRes } from '@/types/rtsTypes';
import { getNull, getResponse, sendServerMessage, getRes } from '@/utils/rtsUtils';

export interface JoinEdubRoomRes {
  room: Omit<
    EdubRoomState,
    'localUser' | 'remoteUsers' | 'linkmic_user_list' | 'linkmic_apply_list' | 'teacher'
  >; // 房间信息
  user: IEdubUser; // 本人 user 信息
  teacher?: IEdubUser; // 老师信息
  linkmic_user_list: IEdubUser[]; // 申请连麦 user 信息
  user_list: IEdubUser[]; // user数组，按照进房时间排序
  token: string; // 加入rtc房间需要的token
  wb_room_id: string; // 白板 room id
  wb_user_id: string; // 白板 user id
  wb_token: string; // 白板 token
  wb_stream_user_id: string; // 白板 rtc 推流 user_id
}

export interface ILinkmicApplyList {
  linkmic_apply_list: IEdubUser[]; // 获取连麦申请列表
}

export interface GetUserListRes {
  user_count: number; // 房间内用户数
  user_list: IEdubUser[]; // user数组，按照进房时间排序
}

/**
 * 告知业务服务器用户进房
 * @param data
 * @returns
 */
export const joinRoom = async (data: {
  user_name: string;
  user_role: UserRole;
  camera: DeviceState;
  mic: DeviceState;
  is_silence?: Silence;
}): Promise<SendServerMessageRes<JoinEdubRoomRes> | RtsError> => {
  return sendServerMessage('edubJoinRoom', getRes, data);
};

/**
 * 告知业务服务器用户离房
 * @param data
 * @returns
 */
export const leaveRoom = async (): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubLeaveRoom', getNull);
};

/**
 * 结束房间
 * @returns
 */
export const finishRoom = async (): Promise<null | RtsError> => {
  return sendServerMessage('edubFinishRoom', getNull);
};

/**
 * 断线之后重连，调用此接口获取当前房间信息
 * @param data
 * @returns
 */
export const reSync = async (): Promise<SendServerMessageRes<JoinEdubRoomRes> | RtsError> => {
  return sendServerMessage('edubResync', getRes);
};

/**
 * 获取房间内用户列表
 * @param data
 * @returns
 */
export const getUserList = async (data: {
  index: number;
  size: number;
}): Promise<GetUserListRes | RtsError> => {
  return sendServerMessage<GetUserListRes>('edubGetUserList', getResponse, data);
};

/**
 * 本地用户操作自己的摄像头
 * @param data
 * @returns
 */
export const operateSelfCamera = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubOperateSelfCamera', getNull, data);
};

/**
 * 本地用户操作自己的麦克风
 * @param data
 * @returns
 */
export const operateSelfMic = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubOperateSelfMic', getNull, data);
};

/**
 * 本地用户开始共享
 * @param data
 * @returns
 */
export const startShare = async (data: { share_type: ShareType }): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubStartShare', getNull, data);
};

/**
 * 本地用户停止共享
 * @returns
 */
export const stopShare = async (): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubStopShare', getNull);
};

/**
 * 操作他人摄像头
 * @param data
 * @returns
 */
export const operateOtherCamera = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubOperateOtherCamera', getNull, data);
};

/**
 * 操作他人麦克风
 * @param data
 * @returns
 */
export const operateOtherMic = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubOperateOtherMic', getNull, data);
};

/**
 * 获取连麦申请列表
 * @param data
 * @returns
 */
export const getLinkmicApplyList = async (): Promise<ILinkmicApplyList | RtsError> => {
  return sendServerMessage<ILinkmicApplyList>('edubGetLinkmicApplyList', getResponse);
};

/**
 * 申请连麦回复
 * @param data
 * @returns
 */
export const linkmicPermit = async (data: {
  apply_user_id: string;
  permit: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubLinkmicPermit', getNull, data);
};

/**
 * 踢人下麦
 * @param data
 * @returns
 */
export const linkmicKick = async (data: { kick_user_id: string }): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubLinkmicKick', getNull, data);
};

/**
 * 授予屏幕共享权限
 * @param data
 * @returns
 */
export const sharePermissionPermit = async (data: {
  apply_user_id: string;
  permit: DeviceState;
}): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubSharePermissionPermit', getNull, data);
};

/**
 * 申请连麦
 * @returns
 */
export const linkmicApply = async (): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubLinkmicApply', getNull);
};

/**
 * 取消连麦申请
 * @returns
 */
export const linkmicApplyCancel = async (): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubLinkmicApplyCancel', getNull);
};

/**
 * 主动下麦
 * @returns
 */
export const linkmicLeave = async (): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubLinkmicLeave', getNull);
};

/**
 * 申请共享权限
 * @returns
 */
export const sharePermissionApply = async (): Promise<null | RtsError> => {
  return sendServerMessage<null>('edubSharePermissionApply', getNull);
};
