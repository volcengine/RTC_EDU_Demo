// 存储进入房间后用户的信息
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, UserRole } from '@src/utils/types';
export interface Room {
  app_id: string;
  room_id: string;
  room_name: string;
  host_user_id: string;
  host_user_name: string;
  room_mic_status: number; // 是否全体静音 0 为全体静音
  operate_self_mic_permission: number; // 参会人在全体静音情况下能发开麦
  share_status: number;
  share_type?: number;
  share_user_id: string;
  share_user_name: string;
  start_time: number;
  base_time: number;
  experience_time_limit: number;
  record_status: number;
  ext: string;
  timeGap?: number;
}

export interface Me {
  app_id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  user_role: number;
  camera: number;
  mic: number;
  share_permission: number;
  share_status: number;
  join_time: number;
  linearVolume?: number;
  nonlinearVolume?: number;
  reqOpenMic?: boolean;
  reqOpenShare?: boolean;
  activeTimeStamp?: number;
}

export enum ShareType {
  SHARE_SCREEN = 0,
  SHARE_WHITEBOARD = 1,
  NOT_SHARE = 2,
}

export interface RoomInfo {
  me: Me;
  room: Room;
  userList: Me[];
  token: string;
  wb_room_id: string;
  wb_user_id: string;
  wb_token: string;
  nts: number;
  userMap: { [key: string]: Me | null };
  activeSpeaker?: string;
}

const initialState: RoomInfo = {
  me: {
    app_id: '',
    room_id: '',
    user_id: '',
    user_name: '',
    user_role: 0,
    camera: 0,
    mic: 0,
    share_permission: 0,
    share_status: 0,
    join_time: 0,
    linearVolume: 0,
    nonlinearVolume: 0,
  },
  room: {
    app_id: '',
    room_id: '',
    room_name: '',
    host_user_id: '',
    host_user_name: '',
    room_mic_status: 0,
    operate_self_mic_permission: 1,
    share_type: 2,
    share_status: 0,
    share_user_name: '',
    share_user_id: '',
    start_time: 0,
    base_time: 0,
    experience_time_limit: 0,
    record_status: 0,
    ext: '',
    timeGap: 0,
  },
  userList: [],
  token: '',
  userMap: {},
  wb_room_id: '',
  wb_token: '',
  wb_user_id: '',
  nts: 0,
  activeSpeaker: '',
};

export const roomSlice = createSlice({
  name: 'roomInfo',
  initialState,
  reducers: {
    joinRoom: (_, actions: PayloadAction<RoomInfo>) => {
      return actions.payload;
    },
    updateMe: (state, actions: PayloadAction<Me>) => {
      state.me = actions.payload;
    },
    updateSelfMic: (state, actions: PayloadAction<number>) => {
      state.me.mic = actions.payload;
    },
    updateSelfCamera: (state, actions: PayloadAction<number>) => {
      state.me.camera = actions.payload;
    },
    updateSelfShareStatus: (state, actiosn: PayloadAction<State>) => {
      state.me.share_status = actiosn.payload;
    },
    updateSelfSharePermission: (state, actions: PayloadAction<number>) => {
      state.me.share_permission = actions.payload;
    },
    updateSelfVolume: (
      state,
      actions: PayloadAction<{ linearVolume?: number; nonlinearVolume?: number }>
    ) => {
      state.me.linearVolume = actions.payload.linearVolume;
      state.me.nonlinearVolume = actions.payload.nonlinearVolume;
    },
    updateRemoteUserVolume: (
      state,
      actions: PayloadAction<{ userId: string; linearVolume?: number; nonlinearVolume?: number }[]>
    ) => {
      // 当前同步修改map和array，后续全部改为使用map
      actions.payload.forEach((item) => {
        const tempUser = state.userList.find((user) => user.user_id === item.userId);
        if (tempUser) {
          tempUser.linearVolume = item.linearVolume;
          tempUser.nonlinearVolume = item.nonlinearVolume;
        }
        const user = state.userMap[item.userId];
        if (user) {
          user.linearVolume = item.linearVolume;
          user.nonlinearVolume = item.nonlinearVolume;
        }
      });
    },
    updateRoom: (state, actions: PayloadAction<Room>) => {
      state.room = actions.payload;
    },
    userJoin: (state, actions: PayloadAction<Me>) => {
      const { payload } = actions;
      const user = state.userMap[actions.payload.user_id];
      if (!user) {
        state.userMap[payload.user_id] = payload;
      }
      const idx = state.userList.findIndex((item) => item.user_id === payload.user_id);
      if (idx > -1) {
        state.userList[idx] = payload;
      } else {
        state.userList.push(actions.payload);
      }
    },
    userLeave: (state, actions: PayloadAction<Me>) => {
      if (state.userMap[actions.payload.user_id]) {
        state.userMap[actions.payload.user_id] = null;
      }
      state.userList = state.userList.filter((user) => user.user_id !== actions.payload.user_id);
    },
    updateUserList: (state, actions: PayloadAction<Me[]>) => {
      state.userList = actions.payload;
    },
    updateUserMap: (state, actions: PayloadAction<Record<string, Me>>) => {
      state.userMap = actions.payload;
    },
    updateUserCamera: (
      state,
      actions: PayloadAction<{
        userId: string;
        operate: number;
      }>
    ) => {
      const { userId, operate } = actions.payload;
      state.userList.forEach((user) => {
        if (user.user_id === userId) {
          user.camera = operate;
        }
      });
    },
    updateUserMicrophone: (
      state,
      actions: PayloadAction<{
        userId: string;
        operate: number;
      }>
    ) => {
      const { userId, operate } = actions.payload;
      state.userList.forEach((user) => {
        if (user.user_id === userId) {
          user.mic = operate;
        }
      });
    },
    updateUserShare: (
      state,
      actions: PayloadAction<{
        userId: string;
        operate: number;
      }>
    ) => {
      const { userId, operate } = actions.payload;
      state.userList.forEach((user) => {
        if (user.user_id === userId) {
          user.share_status = operate;
        }
      });
    },
    updateUserSharePermission: (
      state,
      actions: PayloadAction<{ userId: string; permit: number }>
    ) => {
      const { userId, permit } = actions.payload;
      state.userList.forEach((user) => {
        if (user.user_id === userId) {
          user.share_permission = permit;
        }
      });
    },
    updateUserReqMic: (state, actions: PayloadAction<{ userId: string; isReq: boolean }>) => {
      const { userId, isReq } = actions.payload;
      state.userList.forEach((user) => {
        if (user.user_id === userId) {
          user.reqOpenMic = isReq;
        }
      });
    },
    updateUserReqShare: (state, actions: PayloadAction<{ userId: string; isReq: boolean }>) => {
      const { userId, isReq } = actions.payload;
      state.userList.forEach((user) => {
        if (user.user_id === userId) {
          user.reqOpenShare = isReq;
        }
      });
    },
    updateAllUserMicroPhone: (
      state,
      actions: PayloadAction<{
        operate: number;
        operateSelfMicPermission: number;
      }>
    ) => {
      const { operate, operateSelfMicPermission } = actions.payload;
      state.room.operate_self_mic_permission = operateSelfMicPermission;
      state.room.room_mic_status = operate;
      state.userList.forEach((user) => {
        if (user.user_role !== UserRole.HOST) {
          user.mic = operate;
        }
      });
    },
    updateRoomShare: (
      state,
      actions: PayloadAction<{
        share_type: number;
        share_status: number;
        share_user_id: string;
      }>
    ) => {
      const { share_status, share_type, share_user_id } = actions.payload;
      state.room.share_status = share_status;
      state.room.share_type = share_type;
      state.room.share_user_id = share_user_id;
    },
    updateRecordStatus: (state, actions: PayloadAction<number>) => {
      state.room.record_status = actions.payload;
    },
    leaveRoom: () => {
      return initialState;
    },
    setActiveSpeaker: (state, actions: PayloadAction<string>) => {
      state.activeSpeaker = actions.payload;
    },
    setActiveTimeStamp: (state, actions: PayloadAction<{ userId: string; timeStamp: number }>) => {
      const { userId, timeStamp } = actions.payload;
      state.userList.forEach((item) => {
        if (item.user_id === userId) {
          item.activeTimeStamp = timeStamp;
        }
      });
    },
  },
});

export const {
  joinRoom,
  leaveRoom,
  updateMe,
  updateSelfCamera,
  updateSelfShareStatus,
  updateSelfMic,
  updateSelfSharePermission,
  updateSelfVolume,
  updateRemoteUserVolume,
  updateRoom,
  userJoin,
  userLeave,
  updateUserList,
  updateUserMap,
  updateUserCamera,
  updateUserMicrophone,
  updateUserReqMic,
  updateUserReqShare,
  updateAllUserMicroPhone,
  updateUserShare,
  updateUserSharePermission,
  updateRoomShare,
  updateRecordStatus,
  setActiveSpeaker,
  setActiveTimeStamp,
} = roomSlice.actions;

export default roomSlice.reducer;
