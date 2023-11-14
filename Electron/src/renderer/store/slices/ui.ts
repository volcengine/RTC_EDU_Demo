import { ShareConfig } from '@/renderer/types/state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIProps {
  boardPagePreviewOpen: boolean;
  userListDrawOpen: boolean;
  playersAreaOpen: boolean;
  theme: Theme;
  screenEncodeConfig: ShareConfig;
}

export enum Theme {
  dark = 'dark',
  light = 'light',
}

let initialState: UIProps = {
  userListDrawOpen: false,
  playersAreaOpen: true,
  boardPagePreviewOpen: true,
  theme: Theme.light,
  screenEncodeConfig: ShareConfig.Text,
};

export const ui = createSlice({
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

    setShareScreenConfig: (state, action: PayloadAction<ShareConfig>) => {
      state.screenEncodeConfig = action.payload;
    },
  },
});

export const {
  setBoardPagePreviewOpen,
  setUserListDrawOpen,
  setPlayersAreaOpen,
  setShareScreenConfig,
} = ui.actions;

export default ui.reducer;
