import {
  BaseUser,
  DeviceState,
  Permission,
  RoomMicStatus,
  ShareType,
} from '@/renderer/types/state';

export interface IOnJoinRoom {
  user: BaseUser;
  user_count: number;
}

export interface IOnLeaveRoom {
  user: BaseUser;
  user_count: number;
}

export enum FinishRoomReason {
  HostClose = 0,
  TimeEnded = 1,
  Illegal = 2,
}

export interface IOnFinishRoom {
  reason: FinishRoomReason;
}

export interface IOnOperateSelfCamera {
  room_id: string;
  user_id: string;
  operate: DeviceState;
}

export interface IOnOperateSelfMic {
  room_id: string;
  user_id: string;
  operate: DeviceState;
}

export interface IOnOperateAllMic {
  room_id: string;
  user_id: string;
  operate: RoomMicStatus;
  operate_self_mic_permission: Permission;
}

export interface IOnStartShare {
  room_id: string;
  user_id: string;
  user_name: string;
  share_type: ShareType;
}

export interface IOnFinishShare {
  room_id: string;
  user_id: string;
}

export interface IOnHostChange {
  room_id: string;
  /**
   * 新的主持人userID
   */
  user_id: string;
}

export interface IOnOperateSelfMicApply {
  room_id: string;
  user_id: string;
  user_name: string;
  operate: DeviceState;
}

export interface IOnOperateSelfMicPermit {
  room_id: string;
  user_id: string;
  permit: Permission;
}

export interface IOnSharePermissionApply {
  room_id: string;
  user_id: string;
  user_name: string;
}

export interface IOnSharePermissionPermit {
  room_id: string;
  user_id: string;
  permit: Permission;
}

export interface IOnOperateOtherCamera {
  room_id: string;
  operate_user_id: string;
  operate: DeviceState;
}

export interface IOnOperateOtherMic {
  room_id: string;
  operate_user_id: string;
  operate: DeviceState;
}

export interface IOnOperateOtherSharePermission {
  room_id: string;
  operate_user_id: string;
  operate: Permission;
}

export interface IOnStartRecordApply {
  room_id: string;
  user_id: string;
  user_name: string;
}

export enum IStopRecordReason {
  HostStop = 0,
  TimeEnded = 1,
}

export enum RtsEvent {
  /**
   * 广播通知
   *
   * 有人进房
   */
  vcOnJoinRoom = 'vcOnJoinRoom',
  /**
   * 广播通知
   *
   * 有人退房
   */
  vcOnLeaveRoom = 'vcOnLeaveRoom',
  /**
   * 广播通知
   *
   * 会议结束
   */
  vcOnFinishRoom = 'vcOnFinishRoom',
  /**
   * 广播通知
   *
   * 用户操作了自己的摄像头
   */
  vcOnOperateSelfCamera = 'vcOnOperateSelfCamera',
  /**
   * 广播通知
   *
   * 用户操作了自己的麦克风
   */
  vcOnOperateSelfMic = 'vcOnOperateSelfMic',
  /**
   * 广播通知
   *
   * 全体静音
   */
  vcOnOperateAllMic = 'vcOnOperateAllMic',
  /**
   * 广播通知
   *
   * 用户开始共享
   */
  vcOnStartShare = 'vcOnStartShare',
  /**
   * 广播通知
   *
   * 用户结束共享
   */
  vcOnFinishShare = 'vcOnFinishShare',
  /**
   * 广播通知
   *
   * 开始录制
   * todo ：是否还有
   */
  vcOnStartRecord = 'vcOnStartRecord',
  /**
   * 广播通知
   *
   * 结束录制
   *  todo ：是否还有
   */
  vcOnStopRecord = 'vcOnStopRecord',
  /**
   * 广播通知
   *
   * 主持人移交
   */
  vcOnHostChange = 'vcOnHostChange',
  /**
   * 单点通知(主持人收到)
   *
   * 申请操作自己的麦克风
   */
  vcOnOperateSelfCameraApply = 'vcOnOperateSelfCameraApply',
  /**
   * 单点通知(参会人收到)
   *
   * 申请操作自己摄像头回复
   */
  vcOnOperateSelfCameraPermit = 'vcOnOperateSelfCameraPermit',
  /**
   * 单点通知(主持人收到)
   *
   * 申请操作自己的麦克风
   */
  vcOnOperateSelfMicApply = 'vcOnOperateSelfMicApply',
  /**
   * 单点通知(参会人收到)
   *
   * 申请操作自己麦克风回复
   */
  vcOnOperateSelfMicPermit = 'vcOnOperateSelfMicPermit',
  /**
   * 单点通知(主持人收到)
   *
   * 申请共享
   */
  vcOnSharePermissionApply = 'vcOnSharePermissionApply',
  /**
   * 单点通知(参会人收到)
   *
   * 申请共享回复
   */
  vcOnSharePermissionPermit = 'vcOnSharePermissionPermit',
  /**
   * 单点通知(参会人收到)
   *
   * 主持人操作参会人摄像头
   */
  vcOnOperateOtherCamera = 'vcOnOperateOtherCamera',
  /**
   * 单点通知(参会人收到)
   *
   * 主持人操作参会人麦克风
   */
  vcOnOperateOtherMic = 'vcOnOperateOtherMic',
  /**
   * 单点通知(参会人收到)
   *
   * 主持人操作参会人共享权限
   */
  vcOnOperateOtherSharePermission = 'vcOnOperateOtherSharePermission',
  /**
   * 单点通知(主持人收到)
   *
   * 参会人申请录制
   */
  vcOnStartRecordApply = 'vcOnStartRecordApply',

  /**
   * 单点通知(参会人收到)
   *
   * 申请录制结果
   */
  vcOnStartRecordPermit = 'vcOnStartRecordPermit',
}

export type InformDataType = {
  message_type: string;
  timestamp: number;
} & (
  | {
      event: RtsEvent.vcOnJoinRoom;
      data: IOnJoinRoom;
    }
  | {
      event: RtsEvent.vcOnLeaveRoom;
      data: IOnLeaveRoom;
    }
  | {
      event: RtsEvent.vcOnFinishRoom;
      data: IOnFinishRoom;
    }
  | {
      event: RtsEvent.vcOnOperateSelfCamera;
      data: IOnOperateSelfCamera;
    }
  | {
      event: RtsEvent.vcOnOperateSelfMic;
      data: IOnOperateSelfMic;
    }
  | {
      event: RtsEvent.vcOnOperateAllMic;
      data: IOnOperateAllMic;
    }
  | {
      event: RtsEvent.vcOnStartShare;
      data: IOnStartShare;
    }
  | {
      event: RtsEvent.vcOnFinishShare;
      data: IOnFinishShare;
    }
  | {
      event: RtsEvent.vcOnHostChange;
      data: IOnHostChange;
    }
  | {
      event: RtsEvent.vcOnOperateSelfMicApply;
      data: IOnOperateSelfMicApply;
    }
  | {
      event: RtsEvent.vcOnOperateSelfMicPermit;
      data: IOnOperateSelfMicPermit;
    }
  | {
      event: RtsEvent.vcOnSharePermissionApply;
      data: IOnSharePermissionApply;
    }
  | {
      event: RtsEvent.vcOnSharePermissionPermit;
      data: IOnSharePermissionPermit;
    }
  | {
      event: RtsEvent.vcOnOperateOtherCamera;
      data: IOnOperateOtherCamera;
    }
  | {
      event: RtsEvent.vcOnOperateOtherMic;
      data: IOnOperateOtherMic;
    }
  | {
      event: RtsEvent.vcOnOperateOtherSharePermission;
      data: IOnOperateOtherSharePermission;
    }
  | {
      event: RtsEvent.vcOnStartRecordApply;
      data: IOnStartRecordApply;
    }
  | {
      event: RtsEvent.vcOnStartRecord;
      data: {
        room_id: string;
      };
    }
  | {
      event: RtsEvent.vcOnStopRecord;
      data: {
        room_id: string;
        reason: IStopRecordReason;
      };
    }
  | {
      event: RtsEvent.vcOnStartRecordPermit;
      data: {
        permit: Permission;
      };
    }
);
