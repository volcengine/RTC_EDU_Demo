import { AudioPropertiesInfo } from '@volcengine/rtc';

export enum UserRole {
  Visitor = 0,
  Host = 1,
}

export enum DeviceState {
  Closed = 0,
  Open = 1,
}

export enum Permission {
  NoPermission = 0,
  HasPermission = 1,
}

// 房间内是否全体静音
export enum RoomMicStatus {
  AllMuted = 0,
  AllowMic = 1,
}

export enum RecordStatus {
  NotRecoading = 0,
  Recording = 1,
}

export enum ShareType {
  Screen = 0,
  Board = 1,
}

export enum ShareStatus {
  NotSharing = 0,
  Sharing = 1,
}

// 是否静默用户, 云录屏用户是静默用户
export enum Silence {
  notSilent = 0,
  silence = 1,
}

export enum ApplyType {
  Mic = 'mic',
  Screen = 'screen',
  Camers = 'camera',
}

export interface BaseUser {
  operate_camera_permission?: Permission;
  operate_mic_permission?: Permission;
  room_id: string;
  share_permission: Permission;
  share_status: ShareStatus;
  share_type: ShareType;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  camera: DeviceState;
  mic: DeviceState;
  join_time: number;
  is_silence?: Silence;
  audioPropertiesInfo?: AudioPropertiesInfo;
  isLocal?: boolean;
}

export enum ShareConfig {
  Detail = 'detail', // 清晰度优先
  Motion = 'motion', // 流畅度优先
}

export enum PullBoardStreamType {
  Board = 0,
  Stream = 1,
}

// 屏幕共享-清晰度优先
export const ScreenEncoderConfigForDetailMode = {
  width: 1920,
  height: 1080,
  frameRate: 15,
  maxKbps: 3000,
  contentHint: ShareConfig.Detail,
};

// 屏幕共享-流畅度优先
export const ScreenEncoderConfigForMotionMode = {
  width: 1280,
  height: 720,
  frameRate: 30,
  maxKbps: 2000,
  contentHint: ShareConfig.Motion,
};
