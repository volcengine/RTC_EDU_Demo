// 公共的弹窗消息类型和存储的信息
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * 不互斥：
 * 请求开麦
 * 请求共享权限
 * 请求开启录制
 *
 * 互斥：
 * 被请求开麦
 * 被请求开摄像头
 * 自己申请开麦
 * 自己申请共享权限
 * 主持人确认开启录制
 * 主持人确认停止录制
 * 主持人开启全体静音
 * 屏幕共享
 *
 *
 * 特殊：
 * 时间到了
 *
 */

export interface Info {
  message: MessageType;
  reqOpenMicList: ReqUserInfo[];
  reqOpenShareList: ReqUserInfo[];
  reqOpenRecordList: ReqUserInfo[];
  isTimeout: boolean;
  netStatus: boolean;
}

interface ReqUserInfo {
  userId: string;
  userName: string;
}

export enum MessageType {
  EMPTY = 0,
  RECIVE_HOST_REQUEST_OPEN_MIC = 1, // 参会人收到请求打开麦克风
  RECIVE_HOST_REQUEST_OPEN_CAMERA = 2,
  REQUEST_OPEN_SHARE = 3, // 参会人请求共享
  REQUEST_OPEN_MIC = 4,
  HOST_MUTE_ALL = 5, // 主持人开启全体静音
  HOST_START_RECORD = 6, // 主持人确认
  HOST_STOP_RECORD = 7, // 主持人停止录制
}

const initialState: Info = {
  message: MessageType.EMPTY,
  reqOpenMicList: [],
  reqOpenShareList: [],
  reqOpenRecordList: [],
  isTimeout: false,
  netStatus: true,
};

export const MessageSlice = createSlice({
  name: 'messageType',
  initialState,
  reducers: {
    updateAllMessageInfo: (state, actions: PayloadAction<Info>) => {
      return actions.payload;
    },
    updateMessage: (state, actions: PayloadAction<MessageType>) => {
      state.message = actions.payload;
    },
    insertToMicList: (state, actions: PayloadAction<ReqUserInfo>) => {
      if (!state.reqOpenMicList.find((item) => item.userId === actions.payload.userId)) {
        state.reqOpenMicList.push(actions.payload);
      }
    },
    removeFromMicList: (state, actions: PayloadAction<string>) => {
      const userId = actions.payload;
      const idx = state.reqOpenMicList.findIndex((user) => user.userId === userId);
      if (idx > -1) {
        state.reqOpenMicList.splice(idx, 1);
      }
    },
    removeAllMicList: (state) => {
      state.reqOpenMicList = [];
    },
    insertToShareList: (state, actions: PayloadAction<ReqUserInfo>) => {
      if (!state.reqOpenShareList.find((item) => item.userId === actions.payload.userId)) {
        state.reqOpenShareList.push(actions.payload);
      }
    },
    removeFromShareList: (state, actions: PayloadAction<string>) => {
      const userId = actions.payload;
      const idx = state.reqOpenShareList.findIndex((user) => user.userId === userId);
      if (idx > -1) {
        state.reqOpenShareList.splice(idx, 1);
      }
    },
    removeAllShareList: (state) => {
      state.reqOpenShareList = [];
    },
    insertToRecordList: (state, actions: PayloadAction<ReqUserInfo>) => {
      if (!state.reqOpenRecordList.find((item) => item.userId === actions.payload.userId)) {
        state.reqOpenRecordList.push(actions.payload);
      }
    },
    removeAllRecordList: (state) => {
      state.reqOpenRecordList = [];
    },
    resetMessage: () => {
      return initialState;
    },
    setTimeout: (state, actions: PayloadAction<boolean>) => {
      state.isTimeout = actions.payload;
    },
    setNetStatus: (state, actions: PayloadAction<boolean>) => {
      state.netStatus = actions.payload;
    },
  },
});

export const {
  updateAllMessageInfo,
  updateMessage,
  insertToMicList,
  insertToShareList,
  removeFromMicList,
  removeFromShareList,
  removeAllMicList,
  removeAllShareList,
  resetMessage,
  insertToRecordList,
  removeAllRecordList,
  setTimeout,
  setNetStatus,
} = MessageSlice.actions;
export default MessageSlice.reducer;
