import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IEdubJoinRoom,
  IEdubLeaveRoom,
  IEdubLinkmicJoin,
  IEdubLinkmicLeave,
  IEdubOperateSelfCamera,
  IEdubOperateSelfMic,
  IEdubSharePermissionPermit,
  IEdubStartShare,
  IEdubStopShare,
} from '@src/pages/Edub/hooks/informType';
import {
  DeviceState,
  BaseUser,
  Permission,
  RecordStatus,
  RoomMicStatus,
  ShareStatus,
  ShareType,
  UserRole,
  PullBoardStreamType,
} from '@src/types/state';
import { ILinkmicApplyList, JoinEdubRoomRes } from '@src/pages/Edub/apis/rtsApi';
import { AudioPropertiesInfo } from '@volcengine/vertc-electron-sdk/js/types';

export interface IEdubUser extends BaseUser {
  isActive?: boolean;
}

export enum LinkStatus {
  NotLink = 'notlink',
  Applying = 'applying',
  Linking = 'linking',
}

export interface EdubRoomState {
  wb_stream_user_id?: string;
  app_id?: string;
  base_time?: number; // 服务器时间
  experience_time_limit?: number;
  ext?: string;
  host_user_id?: string;
  host_user_name?: string;
  operate_self_mic_permission?: Permission;
  record_start_time?: number;
  record_status?: RecordStatus;
  room_id?: string;
  room_mic_status?: RoomMicStatus;
  room_name?: string;
  share_status?: ShareStatus;
  share_type?: ShareType;
  share_user_id?: string;
  share_user_name?: string;
  start_time: number;
  status?: number;
  /**
   * 当前用户是老师，则 teacher === localuser
   *
   * 当前用户是学生，则 teacher 和 localuser 分开
   *
   * remoteUsers是除localuser和teacher之外的学生用户
   */
  teacher?: Partial<
    IEdubUser & {
      rtcStatus?: {
        joined?: boolean;
        screen?: boolean;
        stream?: boolean;
      };
    }
  >;
  localUser: Partial<
    IEdubUser & {
      // 需要在端侧维护连麦申请状态
      // todo 此时学生如果掉线了呢？
      applyLinking?: boolean;
      // 学生维护自己的连麦状态
      linked?: boolean;
      pull_wb_stream_type: PullBoardStreamType;
    }
  >;
  remoteUsers: IEdubUser[];
  /**
   * 连麦用户是除学生之外的其他用户
   */

  linkmic_user_list: (IEdubUser & {
    rtcStatus: {
      joined?: boolean;
      screen?: boolean;
      stream?: boolean;
    };
  })[];

  /**
   * 连麦申请列表
   */
  linkmic_apply_list: IEdubUser[];
  apply_user_count: number;
  linkStatus: LinkStatus;
  activeSpeakers: string[];
}

const initialState: EdubRoomState = {
  start_time: -1,
  share_status: ShareStatus.Sharing,
  share_type: ShareType.Board,
  localUser: {
    isLocal: true,
    mic: DeviceState.Open,
    camera: DeviceState.Open,
  },
  linkmic_user_list: [],
  remoteUsers: [],
  linkmic_apply_list: [],
  apply_user_count: 0,
  linkStatus: LinkStatus.NotLink,
  activeSpeakers: [],
};

/**
 * 房间信息
 */
export const edubRoomSlice = createSlice({
  name: 'edubRoom',
  initialState,
  reducers: {
    setEdubRoom: (state, action: PayloadAction<EdubRoomState>) => {
      return action.payload;
    },

    /**
     * @param state
     * @param action
     */
    localUserJoinRoom: (state, action: PayloadAction<JoinEdubRoomRes>) => {
      state.app_id = action.payload.room.app_id;
      state.base_time = action.payload.room.base_time;
      state.experience_time_limit = action.payload.room.experience_time_limit;
      state.ext = action.payload.room.ext;
      state.host_user_id = action.payload.room.host_user_id;
      state.host_user_name = action.payload.room.host_user_name;
      state.operate_self_mic_permission = action.payload.room.operate_self_mic_permission;
      state.record_start_time = action.payload.room.record_start_time;
      state.record_status = action.payload.room.record_status;
      state.room_id = action.payload.room.room_id;
      state.room_mic_status = action.payload.room.room_mic_status;
      state.room_name = action.payload.room.room_name;
      state.share_status = action.payload.room.share_status ?? ShareStatus.NotSharing;
      state.share_type = action.payload.room.share_type;

      state.share_user_id = action.payload.room.share_user_id;
      state.share_user_name = action.payload.room.share_user_name;
      state.start_time = action.payload.room.start_time;
      state.wb_stream_user_id = action.payload.wb_stream_user_id;

      state.linkmic_user_list = action.payload.linkmic_user_list.map((user) => {
        return {
          ...user,
          rtcStatus: {},
        };
      });
      state.linkmic_apply_list = [];
      state.remoteUsers = action.payload.user_list.filter((user) => {
        // 非当前用户
        return (
          user.user_id !== action.payload.user.user_id ||
          // 非老师
          user.user_role !== UserRole.Host
        );
      });

      // 老师在共享屏幕，改成共享白板
      if (
        action.payload.room.share_type === ShareType.Screen &&
        action.payload.user.user_role === UserRole.Host
      ) {
        state.share_type = ShareType.Board;
        state.localUser = {
          ...action.payload.user,
          share_type: ShareType.Board,
          isLocal: true,
        };
        state.teacher = {
          ...(action.payload.teacher || {}),
          share_type: ShareType.Board,
          isLocal: action.payload.teacher?.user_id === action.payload.user.user_id,
        };
      } else {
        state.localUser = { ...action.payload.user, isLocal: true };
        state.share_type = action.payload.room.share_type;
        state.teacher = {
          ...(action.payload.teacher || {}),
          isLocal: action.payload.teacher?.user_id === action.payload.user.user_id,
        };
      }
    },

    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.localUser.user_role = action.payload;
    },

    changeLocalUserName: (state, action: PayloadAction<string>) => {
      state.localUser!.user_name = action.payload;
    },

    /**
     * 本地用户退房，房间状态初始化
     * done
     * @param state
     */
    localUserLeaveRoom: (state) => {
      state.app_id = initialState.app_id;
      state.base_time = initialState.base_time;
      state.experience_time_limit = initialState.experience_time_limit;
      state.ext = initialState.ext;
      state.host_user_id = initialState.host_user_id;
      state.host_user_name = initialState.host_user_name;
      state.operate_self_mic_permission = initialState.operate_self_mic_permission;
      state.record_start_time = initialState.record_start_time;
      state.record_status = initialState.record_status;
      state.room_id = initialState.room_id;
      state.room_mic_status = initialState.room_mic_status;
      state.room_name = initialState.room_name;
      state.share_status = initialState.share_status ?? ShareStatus.NotSharing;
      state.share_type = initialState.share_type;
      state.share_user_id = initialState.share_user_id;
      state.share_user_name = initialState.share_user_name;
      state.start_time = initialState.start_time;
      state.teacher = initialState.teacher;
      state.linkmic_user_list = initialState.linkmic_user_list;
      state.linkmic_apply_list = [];
      state.linkStatus = LinkStatus.NotLink;

      state.remoteUsers = initialState.remoteUsers;

      state.localUser = {
        isLocal: true,
        mic: DeviceState.Open,
        camera: DeviceState.Open,
      };
    },

    // done
    localUserChangeMic: (state, action: PayloadAction<DeviceState>) => {
      state!.localUser!.mic = action.payload;
    },

    // done
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
      if (state.teacher?.user_id === action.payload.userId) {
        state.teacher.rtcStatus = {
          ...state.teacher.rtcStatus,
          ...action.payload.rtcStatus,
        };
      } else {
        state.linkmic_user_list?.forEach((user) => {
          if (user.user_id === action.payload.userId) {
            user.rtcStatus = {
              ...user.rtcStatus,
              ...action.payload.rtcStatus,
            };
          }
        });
      }
    },

    remoteUserJoinRoom: (state, action: PayloadAction<IEdubJoinRoom>) => {
      const findIndex = state.remoteUsers!.findIndex(
        (user) => user.user_id === action.payload.user.user_id
      );

      // 如果远端用户是老师，只更新老师的信息
      if (action.payload.user.user_role === UserRole.Host) {
        state.teacher = action.payload.user;
        return;
      }

      if (findIndex > -1) {
        state.remoteUsers![findIndex] = { ...action.payload.user };
      } else if (findIndex === -1) {
        state.remoteUsers!.push({ ...action.payload.user });
      }

      // 连麦用户重复进房，踢掉
      const linkedIndex = state.linkmic_user_list!.findIndex(
        (u) => u.user_id === action.payload.user.user_id
      );

      if (linkedIndex > -1) {
        state.linkmic_user_list!.splice(linkedIndex, 1);
      }
    },
    remoteUserLeaveRoom: (state, action: PayloadAction<IEdubLeaveRoom>) => {
      const user = action.payload.user;

      // 老师退房
      if (user.user_role === UserRole.Host) {
        state.teacher = initialState.teacher;
        return;
      }
      state.activeSpeakers = state.activeSpeakers.filter(
        (id) => id !== action.payload.user.user_id
      );

      // 成员列表
      const findIndex = state.remoteUsers!.findIndex(
        (user) => user.user_id === action.payload.user.user_id
      );

      if (findIndex > -1) {
        state.remoteUsers!.splice(findIndex, 1);
      }

      // 连麦用户退房后，不在麦上
      const linkedIndex = state.linkmic_user_list!.findIndex(
        (u) => u.user_id === action.payload.user.user_id
      );

      if (linkedIndex > -1) {
        state.linkmic_user_list!.splice(linkedIndex, 1);
      }

      // 连麦申请用户退房，连麦列表移除
      const applyIndex = state.linkmic_apply_list!.findIndex(
        (u) => u.user_id === action.payload.user.user_id
      );

      if (applyIndex > -1) {
        state.linkmic_apply_list!.splice(applyIndex, 1);
      }
    },

    stopShare: (state, action: PayloadAction<Pick<IEdubStopShare, 'user_id'>>) => {
      if (state.localUser.user_role === UserRole.Host) {
        state.localUser.share_type = ShareType.Board;
      }

      state.teacher!.share_type = ShareType.Board;
      state.share_user_id = action.payload.user_id;
      state.share_status = ShareStatus.Sharing;

      state.share_type = ShareType.Board;
    },

    startShare: (state, action: PayloadAction<IEdubStartShare>) => {
      if (state.localUser.user_role === UserRole.Host) {
        state.localUser.share_type = ShareType.Screen;
      }
      state.teacher!.share_type = ShareType.Screen;

      state.share_user_id = action.payload.user_id;
      state.share_user_name = action.payload.user_name;
      state.share_status = ShareStatus.Sharing;

      state.share_type = ShareType.Screen;
    },

    remoteUserChangeMic: (state, action: PayloadAction<IEdubOperateSelfMic>) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.mic = action.payload.operate;
        }
      });

      state.linkmic_user_list?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.mic = action.payload.operate;
        }
      });

      if (state.teacher?.user_id === action.payload.user_id) {
        state.teacher.mic = action.payload.operate;
      }
    },

    remoteUserChangeCamera: (state, action: PayloadAction<IEdubOperateSelfCamera>) => {
      state.remoteUsers?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.camera = action.payload.operate;
        }
      });

      state.linkmic_user_list?.forEach((user) => {
        if (user.user_id === action.payload.user_id) {
          user.camera = action.payload.operate;
        }
      });

      if (state.teacher?.user_id === action.payload.user_id) {
        state.teacher.camera = action.payload.operate;
      }
    },

    setSharePermit: (
      state,
      action: PayloadAction<Pick<IEdubSharePermissionPermit, 'user_id' | 'permit'>>
    ) => {
      if (state.localUser.user_id === action.payload.user_id) {
        state.localUser.share_permission = action.payload.permit;
      } else {
        state.linkmic_user_list = state.linkmic_user_list.map((user) => {
          if (user.user_id === action.payload.user_id) {
            user.share_permission = action.payload.permit;
            return { ...user };
          }
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
        state.localUser!.audio_properties_info = audioInfo;

        // 本端如果是老师
        if (state.localUser.user_role === UserRole.Host) {
          state.teacher!.audio_properties_info = audioInfo;
        }
        // 本端不是老师
        state.linkmic_user_list = state.linkmic_user_list?.map((user) => {
          if (user.user_id === state.localUser.user_id) {
            user.audio_properties_info = audioInfo;
          }

          return user;
        });
      } else {
        // 远端的音频信息
        // 可能是其他连麦用户的
        state.linkmic_user_list = state.linkmic_user_list?.map((user) => {
          if (audioInfo[user.user_id]) {
            user.audio_properties_info = audioInfo[user.user_id];
          }
          return user;
        });
        // 可能是老师的
        if (Object.keys(audioInfo).includes(state.teacher?.user_id!)) {
          state.teacher!.audio_properties_info = audioInfo[state.teacher?.user_id!];
        }
      }
    },

    setRecordStatus: (state, action: PayloadAction<RecordStatus>) => {
      state.record_status = action.payload;
    },

    setLinkmicApplyList: (state, action: PayloadAction<ILinkmicApplyList>) => {
      state.linkmic_apply_list = action.payload.linkmic_apply_list;
    },

    setLinkmicJoin: (state, action: PayloadAction<IEdubLinkmicJoin>) => {
      const user = action.payload.user;
      if (user.user_id === state.localUser.user_id) {
        state.localUser.linked = true;
      }
      state.linkmic_user_list!.push({ ...user, rtcStatus: {} });
    },

    setLinkmicLeave: (state, action: PayloadAction<IEdubLinkmicLeave>) => {
      const user = action.payload.user;

      if (user.user_id === state.localUser.user_id) {
        state.localUser.linked = true;
      }
      const findIndex = state.linkmic_user_list!.findIndex((u) => u.user_id === user.user_id);

      if (findIndex > -1) {
        state.linkmic_user_list!.splice(findIndex, 1);
      }
    },

    setApplyLinkCount: (state, action: PayloadAction<number>) => {
      state.apply_user_count = action.payload;
    },

    setLinkStatus: (state, action: PayloadAction<LinkStatus>) => {
      state.linkStatus = action.payload;
    },

    appendRemoteUsers: (state, action: PayloadAction<IEdubUser[]>) => {
      state.remoteUsers.push(...action.payload);
    },
  },
});

export const {
  setEdubRoom,
  changeLocalUserName,
  localUserJoinRoom,
  localUserLeaveRoom,
  setUserRole,
  localUserChangeMic,
  localUserChangeCamera,
  remoteUserJoinRoom,
  remoteUserLeaveRoom,
  stopShare,
  startShare,
  remoteUserChangeMic,
  remoteUserChangeCamera,
  setRecordStatus,
  setSharePermit,
  setAudioInfo,
  setRtcStatus,
  setLinkmicApplyList,
  setLinkmicJoin,
  setLinkmicLeave,
  setApplyLinkCount,
  setLinkStatus,
  setActiveSpeaker,
  appendRemoteUsers,
} = edubRoomSlice.actions;

export default edubRoomSlice.reducer;
