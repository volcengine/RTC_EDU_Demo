import { EdubRoomState, IEdubUser } from '@src/store/slices/edubRoom';
import { DeviceState, ShareType, Silence, UserRole } from '@src/types/state';
import { RecordFile, RtsError, SendServerMessageRes } from '@src/types/rtsTypes';
import { getNull, getResponse, handleRes, getRes } from '@src/utils/rtsUtils';

// ************************ teacher ******************************

/**
 * 结束房间
 * @returns
 */
export const edubFinishRoom = async (): Promise<null | RtsError> => {
  return handleRes('edubFinishRoom', getNull);
};

/**
 * 操作他人摄像头
 * @param data
 * @returns
 */
export const edubOperateOtherCamera = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes<null>('edubOperateOtherCamera', getNull, data);
};

/**
 * 操作他人麦克风
 * @param data
 * @returns
 */
export const edubOperateOtherMic = async (data: {
  operate_user_id: string;
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes<null>('edubOperateOtherMic', getNull, data);
};

/**
 * 开启连麦
 * todo  需要吗？PRD里有提到但没明说。
 * @param data
 * @returns
 */
export const edubStartLinkmic = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubStartLinkmic', getNull);
};

/**
 * 结束连麦
 * todo  需要吗？PRD里有提到但没明说。
 * @param data
 * @returns
 */
export const edubStopLinkmic = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubStopLinkmic', getNull);
};

export interface ILinkmicApplyList {
  linkmic_apply_list: IEdubUser[];
}

/**
 * 获取连麦申请列表
 * @param data
 * @returns
 */
export const edubGetLinkmicApplyList = async (): Promise<ILinkmicApplyList | RtsError> => {
  return handleRes<ILinkmicApplyList>('edubGetLinkmicApplyList', getResponse);
};

/**
 * 申请连麦回复
 * @param data
 * @returns
 */
export const edubLinkmicPermit = async (data: {
  apply_user_id: string;
  permit: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes<null>('edubLinkmicPermit', getNull, data);
};

/**
 * 老师踢人下麦
 * @param data
 * @returns
 */
export const edubLinkmicKick = async (data: { kick_user_id: string }): Promise<null | RtsError> => {
  return handleRes<null>('edubLinkmicKick', getNull, data);
};

/**
 * - 没有共享权限申请
 * 老师主动授权也使用这个接口
 * @param data
 * @returns
 */
export const edubSharePermissionPermit = async (data: {
  apply_user_id: string;
  permit: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes<null>('edubSharePermissionPermit', getNull, data);
};

/**
 * 开始共享
 *
 * todo 默认为共享屏幕，需要检查一下参数是否要传
 * @param data
 * @returns
 */
export const edubStartShare = async (data: { share_type: ShareType }): Promise<null | RtsError> => {
  return handleRes<null>('edubStartShare', getNull, data);
};

/**
 * 停止共享
 * @returns
 */
export const edubStopShare = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubStopShare', getNull);
};

/**
 * 开始录制
 * @param data
 * @returns
 */
export const edubStartRecord = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubStartRecord', getNull);
};

/**
 * 结束录制
 * @param data
 * @returns
 */
export const edubStopRecord = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubStopRecord', getNull);
};

// ************************* common ************************************

export interface JoinEdubRoomRes {
  // todo 检查学生 or 老师加房时，房间的共享状态
  room: Omit<
    EdubRoomState,
    'localUser' | 'remoteUsers' | 'linkmic_user_list' | 'linkmic_apply_list' | 'teacher'
  >;
  user: IEdubUser;
  teacher?: IEdubUser;
  linkmic_user_list: IEdubUser[];
  user_list: IEdubUser[];
  token: string;
  // 白板
  wb_room_id: string;
  wb_user_id: string;
  wb_token: string;
  wb_stream_user_id: string;
}

export const joinRoom = async (data: {
  user_name: string;
  user_role: UserRole;
  camera: DeviceState;
  mic: DeviceState;
  is_silence?: Silence;
}): Promise<SendServerMessageRes<JoinEdubRoomRes> | RtsError> => {
  return handleRes('edubJoinRoom', getRes, data);
};

export const edubLeaveRoom = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubLeaveRoom', getNull);
};

export interface GetUserListRes {
  user_count: number;
  user_list: IEdubUser[];
}
export const edubGetUserList = async (data: {
  index: number;
  size: number;
}): Promise<GetUserListRes | RtsError> => {
  return handleRes<GetUserListRes>('edubGetUserList', getResponse, data);
};

/**
 * 操作自己摄像头
 * 只有老师和上麦学生可以调用
 * @param data
 * @returns
 */
export const edubOperateSelfCamera = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes<null>('edubOperateSelfCamera', getNull, data);
};

/**
 * 操作自己麦克风
 * 只有老师和上麦学生可以调用
 * @param data
 * @returns
 */
export const edubOperateSelfMic = async (data: {
  operate: DeviceState;
}): Promise<null | RtsError> => {
  return handleRes<null>('edubOperateSelfMic', getNull, data);
};

/**
 * 申请连麦
 * @returns
 */
export const edubLinkmicApply = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubLinkmicApply', getNull);
};

/**
 * 取消连麦申请
 * @returns
 */
export const edubLinkmicApplyCancel = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubLinkmicApplyCancel', getNull);
};

/**
 * 学生主动下麦
 * @returns
 */
export const edubLinkmicLeave = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubLinkmicLeave', getNull);
};

/**
 * 申请共享权限
 * @returns
 */
export const edubSharePermissionApply = async (): Promise<null | RtsError> => {
  return handleRes<null>('edubSharePermissionApply', getNull);
};

/**
 * 获取录制结果
 * @returns
 */
export const edubGetRecordList = async (): Promise<
  | {
      video_list: Record<string | number, RecordFile[]>;
    }
  | RtsError
> => {
  return handleRes<{
    video_list: Record<string | number, RecordFile[]>;
  }>('edubGetRecordList', getResponse);
};

export const reSync = async (): Promise<SendServerMessageRes<JoinEdubRoomRes> | RtsError> => {
  return handleRes('edubResync', getRes);
};
