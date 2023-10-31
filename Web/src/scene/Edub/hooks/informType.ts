import { IEdubUser } from '@/store/slices/edubRoom';

import { FinishRoomReason, StopRecordReason } from '@/types/rtsTypes';
import { DeviceState, Permission, ShareType } from '@/types/state';

export interface IEdubJoinRoom {
  user: IEdubUser;
  user_count: number;
}
export interface IEdubLeaveRoom {
  user: IEdubUser;
  user_count: number;
}
export interface IEdubFinishRoom {
  reason: FinishRoomReason;
}
export interface IEdubOperateSelfCamera {
  room_id: string;
  user_id: string;
  operate: DeviceState;
}
export interface IEdubOperateSelfMic {
  room_id: string;
  user_id: string;
  operate: DeviceState;
}
export interface IEdubStartShare {
  room_id: string;
  user_id: string;
  user_name: string;
  share_type: ShareType;
  stream_user_id: string;
}
export interface IEdubStopShare {
  room_id: string;
  user_id: string;
}
export interface IEdubStartRecord {
  room_id: string;
  start_time: number;
}
export interface IEdubStopRecord {
  room_id: string;
  reason: StopRecordReason;
}
export interface IEdubApplyUserListChange {
  apply_user_count: number;
}
export interface IEdubLinkmicJoin {
  user: IEdubUser;
}
export interface IEdubLinkmicLeave {
  user: IEdubUser;
}
export interface IEdubSharePermissionApply {
  room_id: string;
  user_id: string;
  user_name: string;
}
export interface IEdubSharePermissionPermit {
  room_id: string;
  user_id: string;
  permit: Permission;
}
export interface IEdubOperateOtherCamera {
  room_id: string;
  operate_user_id: string;
  operate: DeviceState;
}
export interface IEdubOperateOtherMic {
  room_id: string;
  operate_user_id: string;
  operate: DeviceState;
}
export interface IEdubLinkmicPermit {
  permit: Permission;
}
export interface IEdubLinkmicKick {
  room_id: string;
  kick_user_id: string;
}

export enum RtsEvent {
  /**
   * 广播通知
   *
   * 有人进房
   */
  edubOnJoinRoom = 'edubOnJoinRoom',
  /**
   * 广播通知
   *
   * 有人退房
   */
  edubOnLeaveRoom = 'edubOnLeaveRoom',
  /**
   * 广播通知
   *
   * 会议结束
   */
  edubOnFinishRoom = 'edubOnFinishRoom',
  /**
   * 广播通知
   *
   * 用户操作了自己的摄像头
   */
  edubOnOperateSelfCamera = 'edubOnOperateSelfCamera',
  /**
   * 广播通知
   *
   * 用户操作了自己的麦克风
   */
  edubOnOperateSelfMic = 'edubOnOperateSelfMic',
  /**
   * 广播通知
   *
   * 用户开始共享
   */
  edubOnStartShare = 'edubOnStartShare',
  /**
   * 广播通知
   *
   * 用户结束共享
   */
  edubOnFinishShare = 'edubOnFinishShare',
  /**
   * 广播通知
   *
   * 开始录制
   */
  edubOnStartRecord = 'edubOnStartRecord',
  /**
   * 广播通知
   *
   * 结束录制
   */
  edubOnStopRecord = 'edubOnStopRecord',
  /**
   * 广播通知
   *
   * 连麦申请用户变化
   */
  edubOnLinkmicApplyUserListChange = 'edubOnLinkmicApplyUserListChange',
  /**
   * 广播通知
   *
   * 上麦
   */
  edubOnLinkmicJoin = 'edubOnLinkmicJoin',
  /**
   * 广播通知
   *
   * 下麦
   */
  edubOnLinkmicLeave = 'edubOnLinkmicLeave',

  /**
   * 单点通知(老师收到)
   *
   * 共享权限申请(其实只有白板权限)
   */
  edubOnSharePermissionApply = 'edubOnSharePermissionApply',
  /**
   * 单点通知(学生收到)
   *
   * 共享权限(其实只有白板权限) 授予
   */
  edubOnSharePermissionPermit = 'edubOnSharePermissionPermit',
  /**
   * 单点通知(学生收到)
   *
   * 操作学生摄像头
   */
  edubOnOperateOtherCamera = 'edubOnOperateOtherCamera',
  /**
   * 单点通知(学生收到)
   *
   * 操作学生麦克风
   */
  edubOnOperateOtherMic = 'edubOnOperateOtherMic',
  /**
   * 单点通知(申请连麦的人收到)
   *
   * 申请连麦回复
   */
  edubOnLinkmicPermit = 'edubOnLinkmicPermit',
  /**
   * 单点通知(被踢者)
   *
   * 下麦
   */
  edubOnLinkmicKick = 'edubOnLinkmicKick',
}

export type InformDataType = {
  message_type: string;
  timestamp: number;
} & (
  | {
      event: RtsEvent.edubOnJoinRoom;
      data: IEdubJoinRoom;
    }
  | {
      event: RtsEvent.edubOnLeaveRoom;
      data: IEdubLeaveRoom;
    }
  | {
      event: RtsEvent.edubOnFinishRoom;
      data: IEdubFinishRoom;
    }
  | {
      event: RtsEvent.edubOnOperateSelfCamera;
      data: IEdubOperateSelfCamera;
    }
  | {
      event: RtsEvent.edubOnOperateSelfMic;
      data: IEdubOperateSelfMic;
    }
  | {
      event: RtsEvent.edubOnStartShare;
      data: IEdubStartShare;
    }
  | {
      event: RtsEvent.edubOnFinishShare;
      data: IEdubStopShare;
    }
  | {
      event: RtsEvent.edubOnStartRecord;
      data: IEdubStartRecord;
    }
  | {
      event: RtsEvent.edubOnStopRecord;
      data: IEdubStopRecord;
    }
  | {
      event: RtsEvent.edubOnLinkmicApplyUserListChange;
      data: IEdubApplyUserListChange;
    }
  | {
      event: RtsEvent.edubOnLinkmicJoin;
      data: IEdubLinkmicJoin;
    }
  | {
      event: RtsEvent.edubOnLinkmicLeave;
      data: IEdubLinkmicLeave;
    }
  | {
      event: RtsEvent.edubOnSharePermissionApply;
      data: IEdubSharePermissionApply;
    }
  | {
      event: RtsEvent.edubOnSharePermissionPermit;
      data: IEdubSharePermissionPermit;
    }
  | {
      event: RtsEvent.edubOnOperateOtherCamera;
      data: IEdubOperateOtherCamera;
    }
  | {
      event: RtsEvent.edubOnOperateOtherMic;
      data: IEdubOperateOtherMic;
    }
  | {
      event: RtsEvent.edubOnLinkmicPermit;
      data: IEdubLinkmicPermit;
    }
  | {
      event: RtsEvent.edubOnLinkmicKick;
      data: IEdubLinkmicKick;
    }
);
