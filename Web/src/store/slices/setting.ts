import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Resolution {
  width: number;
  height: number;
}

export interface StreamSettings {
  resolution: Resolution;
  frameRate: number;
  bitrate: number;
}

export interface SettingState {
  streamSettings: StreamSettings;
  screenStreamSettings: StreamSettings;
  aiAns: boolean;
}

const streamInitialState = {
  resolution: {
    width: 1280,
    height: 720,
  },
  frameRate: 15,
  bitrate: 1200,
};

const screenStreamInitialState = {
  resolution: {
    width: 1920,
    height: 1080,
  },
  frameRate: 15,
  bitrate: 2000,
};

const initialState: SettingState = {
  streamSettings: streamInitialState,
  screenStreamSettings: screenStreamInitialState,
  aiAns: true,
};

/**
 * 会议相关参数
 */
export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setStreamSettings: (state, action: PayloadAction<StreamSettings>) => {
      state.streamSettings = action.payload;
    },
    setScreenStreamSettings: (state, action: PayloadAction<StreamSettings>) => {
      state.screenStreamSettings = action.payload;
    },

    setAiAns: (state, action: PayloadAction<boolean>) => {
      state.aiAns = action.payload;
    },
  },
});

export const { setStreamSettings, setScreenStreamSettings, setAiAns } = settingSlice.actions;

export default settingSlice.reducer;
