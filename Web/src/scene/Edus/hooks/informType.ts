import { IEdusUser } from '@/store/slices/edusRoom';
import { DeviceState, Permission, RoomMicStatus, ShareType } from '@/types/state';

export enum IEdusStopRecordReason {
  HostStop = 0,
  TimeEnded = 1,
}
export enum FinishRoomReason {
  HostClose = 0,
  TimeEnded = 1,
  Illegal = 2,
}

export interface IEdusOnJoinRoom {
  user: IEdusUser;
  user_count: number;
}

export interface IEdusOnLeaveRoom {
  user: IEdusUser;
  user_count: number;
}
export interface IEdusOnFinishRoom {
  reason: FinishRoomReason;
}

// 麦克风变化
export interface IEdusOnOperateSelfMic {
  room_id: string;
  user_id: string;
  operate: DeviceState;
}
export interface IEdusOnOperateSelfCamera {
  room_id: string;
  user_id: string;
  operate: DeviceState;
}

export interface IEdusOnOperateSelfCameraApply {
  room_id: string;
  user_id: string;
  user_name: string;
  operate: DeviceState;
}
export interface IEdusOnOperateSelfCameraPermit {
  room_id: string;
  user_id: string;
  permit: Permission;
}

//  操作自己麦克风变化
export interface IEdusOnOperateSelfMicApply {
  room_id: string;
  user_id: string;
  user_name: string;
  operate: DeviceState;
}

export interface IEdusOnOperateSelfMicPermit {
  room_id: string;
  user_id: string;
  permit: Permission;
}

export interface IEdusOnOperateAllMic {
  room_id: string;
  user_id: string;
  operate: RoomMicStatus;
  operate_self_mic_permission: Permission;
}

export interface IEdusOnStartShare {
  room_id: string;
  user_id: string;
  user_name: string;
  share_type: ShareType;
}

export interface IEdusOnFinishShare {
  room_id: string;
  user_id: string;
}

export interface IEdusOnStartRecordApply {
  user_name: string;
  user_id: string;
}

export interface IEdusOnSharePermissionApply {
  room_id: string;
  user_id: string;
  user_name: string;
}

export interface IEdusOnSharePermissionPermit {
  room_id: string;
  user_id: string;
  permit: Permission;
}

export interface IEdusOnOperateOtherCamera {
  room_id: string;
  operate_user_id: string;
  operate: DeviceState;
}

export interface IEdusOnOperateOtherMic {
  room_id: string;
  operate_user_id: string;
  operate: DeviceState;
}
export interface IEdusOnOperateOtherSharePermission {
  room_id: string;
  operate_user_id: string;
  operate: Permission;
}
export enum RtsEvent {
  /**
   * 广播通知
   *
   * 有人进房
   */
  edusOnJoinRoom = 'edusOnJoinRoom',
  /**
   * 广播通知
   *
   * 有人退房
   */
  edusOnLeaveRoom = 'edusOnLeaveRoom',
  /**
   * 广播通知
   *
   * 会议结束
   */
  edusOnFinishRoom = 'edusOnFinishRoom',
  /**
   * 广播通知
   *
   * 全体静音
   */
  edusOnOperateAllMic = 'edusOnOperateAllMic',
  /**
   * 广播通知
   *
   * 用户操作了自己的摄像头
   */
  edusOnOperateSelfCamera = 'edusOnOperateSelfCamera',
  /**
   * 广播通知
   *
   * 用户操作了自己的麦克风
   */
  edusOnOperateSelfMic = 'edusOnOperateSelfMic',
  /**
   * 广播通知
   *
   * 用户开始共享
   */
  edusOnStartShare = 'edusOnStartShare',
  /**
   * 广播通知
   *
   * 用户结束共享
   */
  edusOnFinishShare = 'edusOnFinishShare',
  /**
   * 广播通知
   *
   * 开始录制
   */
  edusOnStartRecord = 'edusOnStartRecord',
  /**
   * 广播通知
   *
   * 结束录制
   */
  edusOnStopRecord = 'edusOnStopRecord',

  /**
   * 单点通知(学生收到)
   *
   * 请操作自己摄像头
   */
  edusOnOperateSelfCameraApply = 'edusOnOperateSelfCameraApply',

  /**
   * 单点通知(学生收到)
   *
   * 申请操作自己摄像头回复
   */
  edusOnOperateSelfCameraPermit = 'edusOnOperateSelfCameraPermit',

  /**
   * 单点通知(老师收到)
   *
   * 申请操作自己的麦克风
   */
  edusOnOperateSelfMicApply = 'edusOnOperateSelfMicApply',

  /**
   * 单点通知(学生收到)
   *
   * 申请操作自己麦克风回复
   */
  edusOnOperateSelfMicPermit = 'edusOnOperateSelfMicPermit',

  /**
   * 单点通知(老师收到)
   *
   * 共享权限申请(其实只有白板权限)
   */
  edusOnSharePermissionApply = 'edusOnSharePermissionApply',
  /**
   * 单点通知(学生收到)
   *
   * 共享权限(其实只有白板权限) 授予
   */
  edusOnSharePermissionPermit = 'edusOnSharePermissionPermit',
  /**
   * 单点通知(学生收到)
   *
   * 操作学生摄像头
   */
  edusOnOperateOtherCamera = 'edusOnOperateOtherCamera',
  /**
   * 单点通知(学生收到)
   *
   * 操作学生麦克风
   */
  edusOnOperateOtherMic = 'edusOnOperateOtherMic',

  /**
   * 单点通知(学生收到)
   *
   * 老师操作学生共享权限
   */
  edusOnOperateOtherSharePermission = 'edusOnOperateOtherSharePermission',

  /**
   * 单点通知(老师收到)
   *
   * 学生申请录制
   */
  edusOnStartRecordApply = 'edusOnStartRecordApply',
}

export type InformDataType = {
  message_type: string;
  timestamp: number;
} & (
  | {
      event: RtsEvent.edusOnJoinRoom;
      data: IEdusOnJoinRoom;
    }
  | {
      event: RtsEvent.edusOnLeaveRoom;
      data: IEdusOnLeaveRoom;
    }
  | {
      event: RtsEvent.edusOnFinishRoom;
      data: IEdusOnFinishRoom;
    }
  | {
      event: RtsEvent.edusOnOperateSelfCamera;
      data: IEdusOnOperateSelfCamera;
    }
  | {
      event: RtsEvent.edusOnOperateSelfMic;
      data: IEdusOnOperateSelfMic;
    }
  | {
      event: RtsEvent.edusOnOperateAllMic;
      data: IEdusOnOperateAllMic;
    }
  | {
      event: RtsEvent.edusOnStartShare;
      data: IEdusOnStartShare;
    }
  | {
      event: RtsEvent.edusOnFinishShare;
      data: IEdusOnFinishShare;
    }
  | {
      event: RtsEvent.edusOnOperateSelfMicApply;
      data: IEdusOnOperateSelfMicApply;
    }
  | {
      event: RtsEvent.edusOnOperateSelfMicPermit;
      data: IEdusOnOperateSelfMicPermit;
    }
  | {
      event: RtsEvent.edusOnSharePermissionApply;
      data: IEdusOnSharePermissionApply;
    }
  | {
      event: RtsEvent.edusOnSharePermissionPermit;
      data: IEdusOnSharePermissionPermit;
    }
  | {
      event: RtsEvent.edusOnOperateOtherCamera;
      data: IEdusOnOperateOtherCamera;
    }
  | {
      event: RtsEvent.edusOnOperateOtherMic;
      data: IEdusOnOperateOtherMic;
    }
  | {
      event: RtsEvent.edusOnOperateOtherSharePermission;
      data: IEdusOnOperateOtherSharePermission;
    }
  | {
      event: RtsEvent.edusOnStartRecordApply;
      data: IEdusOnStartRecordApply;
    }
  | {
      event: RtsEvent.edusOnStartRecord;
      data: {
        room_id: string;
      };
    }
  | {
      event: RtsEvent.edusOnStopRecord;
      data: {
        room_id: string;
        reason: IEdusStopRecordReason;
      };
    }
);
