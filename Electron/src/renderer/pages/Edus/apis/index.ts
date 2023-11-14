import { EdusRoomState, IEdusUser } from '@/renderer/store/slices/edusRoom';
import { RtsError, SendServerMessageRes } from '@/renderer/types/rtsTypes';
import { DeviceState, Permission, ShareType, Silence, UserRole } from '@/renderer/types/state';
import { getNull, getRes, getResponse, handleRes } from '@/renderer/utils/rtsUtils';

export interface JoinEdusRoomRes {
  // todo 检查学生 or 老师加房时，房间的共享状态
  room: Omit<
    EdusRoomState,
    'localUser' | 'remoteUsers' | 'linkmic_user_list' | 'linkmic_apply_list' | 'teacher'
  >;
  user: IEdusUser;
  teacher?: IEdusUser;
  linkmic_user_list: IEdusUser[];
  user_list: IEdusUser[];
  token: string;
  // 白板
  wb_room_id: string;
  wb_user_id: string;
  wb_token: string;
  wb_stream_user_id: string;
}

export const joinRoom = async (data: {
  user_name: string;
  camera: DeviceState;
  mic: DeviceState;
  user_role: UserRole;
  is_silence?: Silence;
}): Promise<SendServerMessageRes<JoinEdusRoomRes> | RtsError> => {
  return handleRes('edusJoinRoom', getRes, data);
};

export const leaveRoom = async (): Promise<null | RtsError> => {
  return handleRes('edusLeaveRoom', getNull);
};

export interface ReconnectRes {
  room: Omit<EdusRoomState, 'localUser' | 'remoteUsers'>;
  user: IEdusUser;
  user_list: IEdusUser[];
}

export const reSync = async (): Promise<SendServerMessageRes<ReconnectRes> | RtsError> => {
  return handleRes('edusResync', getRes);
};

export interface GetUserListRes {
  user_count: number;
  user_list: IEdusUser[];
}

export const getUserList = async (): Promise<SendServerMessageRes<GetUserListRes> | RtsError> => {
  return handleRes('edusGetUserList', getRes);
};

export const operateSelfCamera = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateSelfCamera', getNull, data);
};

export const operateSelfMic = async (data: { operate: DeviceState }): Promise<null | RtsError> => {
  return handleRes('edusOperateSelfMic', getNull, data);
};

export const operateSelfMicApply = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateSelfMicApply', getNull, data);
};

/**
 * 申请操作自己摄像头 - 未实现
 * @param data
 * @returns
 */
export const operateSelfCameraApply = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateSelfCameraApply', getNull, data);
};

export const startShare = async (data: { share_type: ShareType }): Promise<null | RtsError> => {
  return handleRes('edusStartShare', getNull, data);
};

export const finishShare = async (): Promise<null | RtsError> => {
  return handleRes('edusFinishShare', getNull);
};

export const sharePermissionApply = async (): Promise<null | RtsError> => {
  return handleRes('edusSharePermissionApply', getNull);
};

/**
 * 学生申请录制
 * @returns
 */
export const startRecordApply = async (): Promise<null | RtsError> => {
  return handleRes('edusStartRecordApply', getNull);
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
//   return handleRes('edusGetRecordList', getResponse);
// };

// 老师调用

export const finishRoom = async (): Promise<null | RtsError> => {
  return handleRes('edusFinishRoom', getNull);
};

export const operateOtherCamera = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateOtherCamera', getNull, data);
};

export const operateOtherMic = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateOtherMic', getNull, data);
};

// 全体静音
export const vcOperateAllMic = async (data: {
  operate_self_mic_permission: Permission;
  operate: DeviceState.Closed;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateAllMic', getNull, data);
};

export const operateOtherSharePermission = async (data: {
  operate_user_id: string;
  operate: Permission;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateOtherSharePermission', getNull, data);
};

/**
 * 老师回复麦克风权限申请
 * @param data
 * @returns
 */
export const operateSelfMicPermit = async (data: {
  apply_user_id: string;
  permit: Permission;
}): Promise<null | RtsError> => {
  return handleRes('edusOperateSelfMicPermit', getNull, data);
};

export const sharePermissionPermit = async (data: {
  apply_user_id: string;
  permit: Permission;
}): Promise<null | RtsError> => {
  return handleRes('edusSharePermissionPermit', getNull, data);
};

/**
 * (老师)开始录制
 * @returns
 */
export const startRecord = async (): Promise<null | RtsError> => {
  return handleRes('edusStartRecord', getNull);
};

/**
 * (老师)结束录制
 * @returns
 */
export const stopRecord = async (): Promise<null | RtsError> => {
  return handleRes('edusStopRecord', getNull);
};
