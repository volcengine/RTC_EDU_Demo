export const ErrCodeMap = {
  400: 'input format error',
  401: 'user count exceeds limit',
  403: "room's host has exist",
  410: 'operation has not permission',
  440: 'verification code expired',
  441: 'verification code is incorrect',
  450: 'login token expired',
  451: 'login token empty',
  452: 'login token user not match',
};

export const SendServerMessageErr = 'SendServerMessageErr';

export interface RtsError {
  type: typeof SendServerMessageErr;
  message: string;
}

export interface SendServerMessageRes<T> {
  message_type: 'return';
  request_id: string;
  code: number; // 200表示成功
  message: string; // 详细错误信息
  timestamp: number; // 时间戳ms
  response: T;
}

export interface ResyncRes<RoomState, User> {
  room: Omit<RoomState, 'localUser' | 'remoteUsers'>;
  user: User;
  user_list: User[];
}

export interface RecordFile {
  duration: number;
  filename: string;
  room_id: string;
  size: number;
  start_time: number;
  url: string;
}

export interface ReconnectRes<RoomState, User> {
  room: Omit<RoomState, 'localUser' | 'remoteUsers'>;
  user: User;
  user_list: User[];
}

export enum FinishRoomReason {
  HostClose = 0,
  TimeEnded = 1,
  Illegal = 2,
}

export enum StopRecordReason {
  HostStop = 0,
  TimeEnded = 1,
}
