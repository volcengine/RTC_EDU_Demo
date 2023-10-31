import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastType as MeetingToastType } from '@/scene/Meeting/Room/ToastMessage/types';
import { ToastType as EdusToastType } from '@/scene/Edus/Room/ToastMessage/types';

export enum Theme {
  dark = 'dark',
  light = 'light',
}

export interface UIState {
  userListDrawOpen: boolean;
  playersAreaOpen: boolean;
  boardPagePreviewOpen: boolean;
  theme: Theme;
  toast: {
    open: boolean;
    title: string;
    type: MeetingToastType | EdusToastType;
    other?: any;
  };
}

export const initialState: UIState = {
  userListDrawOpen: false,
  playersAreaOpen: true,
  boardPagePreviewOpen: true,
  theme: Theme.light,
  toast: {
    open: false,
    title: '',
    type: MeetingToastType.Init,
  },
};

/**
 * 会议相关参数
 */
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUserListDrawOpen: (state, action: PayloadAction<boolean>) => {
      state.userListDrawOpen = action.payload;
    },
    setPlayersAreaOpen: (state, action: PayloadAction<boolean>) => {
      state.playersAreaOpen = action.payload;
    },

    setBoardPagePreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.boardPagePreviewOpen = action.payload;
    },
    setToast: (state, action: PayloadAction<UIState['toast']>) => {
      state.toast = action.payload;
    },

    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setUserListDrawOpen,
  setToast,
  setTheme,
  setPlayersAreaOpen,
  setBoardPagePreviewOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
