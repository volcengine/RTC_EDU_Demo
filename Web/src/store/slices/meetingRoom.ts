import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioPropertiesInfo } from '@volcengine/rtc';
import {
  IOnFinishShare,
  IOnJoinRoom,
  IOnLeaveRoom,
  IOnOperateAllMic,
  IOnOperateSelfCamera,
  IOnOperateSelfMic,
  IOnOperateSelfMicApply,
  IOnSharePermissionApply,
  IOnStartShare,
} from '@/scene/Meeting/hooks/informType';
import {
  ApplyType,
  BaseUser,
  DeviceState,
  Permission,
  RecordStatus,
  RoomMicStatus,
  ShareStatus,
  ShareType,
  Silence,
} from '@/types/state';

export interface IMeetingUser extends BaseUser {
  isActive?: boolean;
}

export interface MeetingRoomState {
  app_id?: string;
  room_id?: string;
  room_name?: string;
  host_user_id?: string;
  host_user_name?: string;
  room_mic_status: RoomMicStatus;
  operate_self_mic_permission: Permission;

  share_status: ShareStatus;
  share_type?: ShareType;
  share_user_id?: string;
  share_user_name?: string;
  start_time: number;
  base_time?: number; // 服务器时间
  experience_time_limit?: number; // 体验时长，单位s
  record_status?: RecordStatus;
  record_start_time?: number; //  最近一次开始录制的时间
  localUser: Partial<IMeetingUser & { isLocal: boolean; is_silence?: Silence }>;
  remoteUsers: (IMeetingUser & {
    rtcStatus: {
      joined?: boolean;
      screen?: boolean;
      stream?: boolean;
    };
    applying: ApplyType[];
  })[];
  activeSpeakers: string[];
}

const initialState: MeetingRoomState = {
  room_mic_status: RoomMicStatus.AllowMic,
  operate_self_mic_permission: Permission.HasPermission,
  start_time: -1,
  share_status: ShareStatus.NotSharing,

  localUser: {
    mic: DeviceState.Open,
    camera: DeviceState.Open,
  },
  remoteUsers: [],
  activeSpeakers: [],
};

/**
 * 房间信息
 */
export const roomSlice = createSlice({
  name: 'meetingRoom',
  initialState,
  reducers: {
    /**
     * @param state
     * @param action
     */
    localUserJoinRoom: (
      state,
      action: PayloadAction<{
        room: Omit<MeetingRoomState, 'localUser' | 'remoteUsers'>;
        user: IMeetingUser;
        user_list: IMeetingUser[];
      }>
    ) => {
      state.base_time = action.payload.room.base_time;
      state.app_id = action.payload.room.app_id;
      state.room_id = action.payload.room.room_id;
      state.room_name = action.payload.room.room_name;
      state.host_user_id = action.payload.room.host_user_id;
      state.host_user_name = action.payload.room.host_user_name;
      state.room_mic_status = action.payload.room.room_mic_status;
      state.operate_self_mic_permission = action.payload.room.operate_self_mic_permission;
      state.share_status = action.payload.room.share_status || ShareStatus.NotSharing;
      state.share_type = action.payload.room.share_type;
      state.share_user_id = action.payload.room.share_user_id;
      state.share_user_name = action.payload.room.share_user_name;
      state.record_status = action.payload.room.record_status;
      state.start_time = action.payload.room.start_time;

      state.localUser = { ...action.payload.user, isLocal: true };
      state.remoteUsers = action.payload.user_list
        .filter((user) => user.user_id !== action.payload.user.user_id)
        .map((user) => {
          return {
            ...user,
            applying: [],
            rtcStatus: {},
          };
        });
    },

    changeLocalUserName: (state, action: PayloadAction<string>) => {
      state.localUser!.user_name = action.payload;
      state.localUser!.isLocal = true;
    },

    /**
     * 本地用户退房，房间状态初始化
     * @param state
     */
    localUserLeaveRoom: (state) => {
      state.app_id = initialState.app_id;
      state.room_id = initialState.room_id;
      state.room_name = initialState.room_name;
      state.host_user_id = initialState.host_user_id;
      state.host_user_name = initialState.host_user_name;
      state.room_mic_status = initialState.room_mic_status;
      state.operate_self_mic_permission = initialState.operate_self_mic_permission;
      state.share_status = initialState.share_status;
      state.share_type = initialState.share_type;
      state.share_user_id = initialState.share_user_id;
      state.share_user_name = initialState.share_user_name;
      state.record_status = initialState.record_status;

      state.remoteUsers = initialState.remoteUsers;
      state.activeSpeakers = [];

      state.localUser = {
        mic: DeviceState.Open,
        camera: DeviceState.Open,
      };
    },

    localUserChangeMic: (state, action: PayloadAction<DeviceState>) => {
      state!.localUser!.mic = action.payload;
    },

    localUserChangeCamera: (state, action: PayloadAction<DeviceState>) => {
      state!.localUser!.camera = action.payload;
    },

    setRtcStatus: (
      state,
      action: PayloadAction<{
        userId: string;
        rtcStatus: {
          joined?: boolean;
          screen?: boolean;
          stream?: boolean;
        };
      }>
    ) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.userId) {
          user.rtcStatus = {
            ...user.rtcStatus,
            ...action.payload.rtcStatus,
          };
        }
      });
    },

    remoteUserJoinRoom: (state, action: PayloadAction<IOnJoinRoom>) => {
      const findIndex = state.remoteUsers!.findIndex(
        (user) => user.user_id === action.payload.user.user_id
      );

      if (findIndex > -1) {
        state.remoteUsers![findIndex] = { ...action.payload.user, applying: [], rtcStatus: {} };
      }

      if (findIndex === -1) {
        state.remoteUsers!.push({ ...action.payload.user, applying: [], rtcStatus: {} });
      }
    },
    remoteUserLeaveRoom: (state, action: PayloadAction<IOnLeaveRoom>) => {
      const findIndex = state.remoteUsers!.findIndex(
        (user) => user.user_id === action.payload.user.user_id
      );

      if (findIndex > -1) {
        state.remoteUsers!.splice(findIndex, 1);
      }

      // 远端用户离房，更新activeUser
      const activeIndex = state.activeSpeakers.findIndex(
        (user) => user === action.payload.user.user_id
      );

      if (activeIndex > -1) {
        state.activeSpeakers.splice(activeIndex, 1);
      }
    },

    stopShare: (state, action: PayloadAction<IOnFinishShare>) => {
      state.localUser!.share_status = ShareStatus.NotSharing;
      state.share_status = ShareStatus.NotSharing;
      state.share_type = undefined;
      state.share_user_id = undefined;
      state.share_user_name = undefined;

      state.remoteUsers?.forEach((user) => {
        user.share_status = ShareStatus.NotSharing;
      });
    },

    startShare: (state, action: PayloadAction<IOnStartShare>) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.share_status = ShareStatus.Sharing;
          state.share_user_id = user.user_id;
          state.share_user_name = user.user_name;
          state.localUser!.share_status = ShareStatus.NotSharing;
        } else {
          user.share_status = ShareStatus.NotSharing;
        }
      });

      if (state.localUser!.user_id === action.payload.user_id) {
        state.share_user_id = action.payload.user_id;
        state.share_user_name = state.localUser?.user_name;
        state.localUser!.share_status = ShareStatus.Sharing;
      }

      state.share_status = ShareStatus.Sharing;
      state.share_type = action.payload.share_type;
    },

    muteAll: (state, action: PayloadAction<IOnOperateAllMic>) => {
      state.room_mic_status = action.payload.operate;
      state.operate_self_mic_permission = action.payload.operate_self_mic_permission;
      if (action.payload.operate === RoomMicStatus.AllMuted) {
        state.remoteUsers?.forEach((user) => {
          if (user.user_id !== state.host_user_id) {
            user.mic = DeviceState.Closed;
          }
        });
      }
    },

    remoteUserChangeMic: (state, action: PayloadAction<IOnOperateSelfMic>) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.mic = action.payload.operate;
        }
      });
    },

    remoteUserChangeCamera: (state, action: PayloadAction<IOnOperateSelfCamera>) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.camera = action.payload.operate;
        }
      });
    },

    remoteApply: (
      state,
      action: PayloadAction<
        (IOnOperateSelfMicApply | IOnSharePermissionApply) & {
          applying: ApplyType;
        }
      >
    ) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.applying = Array.from(new Set([...user.applying, action.payload.applying]));
        }
      });
    },

    reviewRemoteApply: (
      state,
      action: PayloadAction<{
        userId: string;
        applying: ApplyType;
      }>
    ) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.userId) {
          user.applying = user.applying.filter((a) => a !== action.payload.applying);
          if (action.payload.applying === ApplyType.Screen) {
            user.share_permission = Permission.HasPermission;
          }
          if (action.payload.applying === ApplyType.Mic) {
            user.mic = DeviceState.Open;
          }
        }
      });
    },

    setSharePermit: (
      state,
      action: PayloadAction<{
        permit: Permission;
        isLocal: boolean;
        userId: string;
      }>
    ) => {
      const { isLocal, userId, permit } = action.payload;
      if (isLocal) {
        state.localUser!.share_permission = permit;
      } else {
        state.remoteUsers?.forEach((user) => {
          if (user.user_id === userId) {
            user.share_permission = permit;
          }
        });
      }
    },

    setAudioInfo: (
      state,
      action: PayloadAction<
        | {
            isLocal: true;
            audioInfo: AudioPropertiesInfo;
          }
        | {
            isLocal: false;
            audioInfo: Record<string, AudioPropertiesInfo>;
          }
      >
    ) => {
      const { isLocal, audioInfo } = action.payload;

      if (isLocal) {
        state.localUser!.audioPropertiesInfo = audioInfo;
      } else {
        state.remoteUsers = state.remoteUsers?.map((user) => {
          user.audioPropertiesInfo = audioInfo[user.user_id];
          return user;
        });
      }
    },

    setActiveSpeaker: (state, action: PayloadAction<string>) => {
      const findIndex = state.activeSpeakers.findIndex((ac) => ac === action.payload);

      if (state.localUser.user_id === action.payload) {
        state.localUser.isActive = true;
        state.remoteUsers.forEach((user) => {
          user.isActive = false;
        });
      } else {
        state.localUser.isActive = false;
        state.remoteUsers.forEach((user) => {
          if (user.user_id === action.payload) {
            user.isActive = true;
          } else {
            user.isActive = false;
          }
        });
      }
      if (findIndex > -1) {
        state.activeSpeakers.splice(findIndex, 1);
      }
      state.activeSpeakers.push(action.payload);
    },

    setRecordStatus: (state, action: PayloadAction<RecordStatus>) => {
      state.record_status = action.payload;
    },
  },
});

export const {
  changeLocalUserName,
  localUserJoinRoom,
  localUserLeaveRoom,
  localUserChangeMic,
  localUserChangeCamera,
  remoteUserJoinRoom,
  remoteUserLeaveRoom,
  stopShare,
  startShare,
  muteAll,
  remoteUserChangeMic,
  remoteUserChangeCamera,
  setRecordStatus,
  remoteApply,
  reviewRemoteApply,
  setSharePermit,
  setAudioInfo,
  setActiveSpeaker,
  setRtcStatus,
} = roomSlice.actions;

export default roomSlice.reducer;
