import { IMeetingUser, MeetingRoomState } from '@/renderer/store/slices/meetingRoom';
import { RtsError, SendServerMessageRes } from '@/renderer/types/rtsTypes';
import { DeviceState, Permission, ShareType, Silence } from '@/renderer/types/state';
import { getNull, getRes, getResponse, handleRes } from '@/renderer/utils/rtsUtils';

export interface JoinMeetingRoomRes {
  room: Omit<MeetingRoomState, 'localUser' | 'remoteUsers'>;
  user: IMeetingUser;
  user_list: IMeetingUser[];
  token: string;
  wb_room_id: string;
  wb_user_id: string;
  wb_token: string;
}

export const joinRoom = async (data: {
  user_name: string;
  camera: DeviceState;
  mic: DeviceState;
  is_silence?: Silence;
}): Promise<SendServerMessageRes<JoinMeetingRoomRes> | RtsError> => {
  return handleRes('vcJoinRoom', getRes, data);
};

export const leaveRoom = async (): Promise<null | RtsError> => {
  return handleRes('vcLeaveRoom', getNull);
};

export interface ReconnectRes {
  room: Omit<MeetingRoomState, 'localUser' | 'remoteUsers'>;
  user: IMeetingUser;
  user_list: IMeetingUser[];
}

export const reSync = async (): Promise<SendServerMessageRes<ReconnectRes> | RtsError> => {
  return handleRes('vcResync', getRes);
};

export interface GetUserListRes {
  user_count: number;
  user_list: IMeetingUser[];
}

export const getUserList = async (): Promise<SendServerMessageRes<GetUserListRes> | RtsError> => {
  return handleRes('vcGetUserList', getRes);
};

export const operateSelfCamera = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateSelfCamera', getNull, data);
};

export const operateSelfMic = async (data: { operate: DeviceState }): Promise<null | RtsError> => {
  return handleRes('vcOperateSelfMic', getNull, data);
};

export const operateSelfMicApply = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateSelfMicApply', getNull, data);
};

/**
 * 申请操作自己摄像头 - 未实现
 * @param data
 * @returns
 */
export const operateSelfCameraApply = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateSelfCameraApply', getNull, data);
};

export const startShare = async (data: { share_type: ShareType }): Promise<null | RtsError> => {
  return handleRes('vcStartShare', getNull, data);
};

export const finishShare = async (): Promise<null | RtsError> => {
  return handleRes('vcFinishShare', getNull);
};

export const sharePermissionApply = async (): Promise<null | RtsError> => {
  return handleRes('vcSharePermissionApply', getNull);
};

/**
 * 参会人申请录制
 * @returns
 */
export const startRecordApply = async (): Promise<null | RtsError> => {
  return handleRes('vcStartRecordApply', getNull);
};

/**
 * 获取录制结果
 * @returns
 */
// export const getRecordList = async (): Promise<
//   | {
//       video_list: Record<string | number, RecordFile[]>;
//     }
//   | RtsError
// > => {
//   return handleRes('vcGetRecordList', getResponse);
// };

// 主持人调用

export const finishRoom = async (): Promise<null | RtsError> => {
  return handleRes('vcFinishRoom', getNull);
};

export const operateOtherCamera = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateOtherCamera', getNull, data);
};

export const operateOtherMic = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateOtherMic', getNull, data);
};

// 全体静音
export const vcOperateAllMic = async (data: {
  operate_self_mic_permission: Permission;
  operate: DeviceState.Closed;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateAllMic', getNull, data);
};

export const operateOtherSharePermission = async (data: {
  operate_user_id: string;
  operate: Permission;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateOtherSharePermission', getNull, data);
};

/**
 * 主持人回复麦克风权限申请
 * @param data
 * @returns
 */
export const operateSelfMicPermit = async (data: {
  apply_user_id: string;
  permit: Permission;
}): Promise<null | RtsError> => {
  return handleRes('vcOperateSelfMicPermit', getNull, data);
};

export const sharePermissionPermit = async (data: {
  apply_user_id: string;
  permit: Permission;
}): Promise<null | RtsError> => {
  return handleRes('vcSharePermissionPermit', getNull, data);
};

/**
 * (主持人)开始录制
 * @returns
 */
export const startRecord = async (): Promise<null | RtsError> => {
  return handleRes('vcStartRecord', getNull);
};

/**
 * (主持人)结束录制
 * @returns
 */
export const stopRecord = async (): Promise<null | RtsError> => {
  return handleRes('vcStopRecord', getNull);
};
