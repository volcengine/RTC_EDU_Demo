import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SceneType } from './scene';

export interface RTSState {
  app_id?: string;
  rts_token?: string;
  server_signature?: string;
  server_url?: string;
  app_set?: {
    app_id: string;
    rts_token: string;
    scenes_name: SceneType;
  }[];
}

/**
 * 当前rts相关信息
 */
export const rtsSlice = createSlice({
  name: 'rts',
  initialState: {} as RTSState,
  reducers: {
    setRTSParams: (state, action: PayloadAction<RTSState>) => {
      state.app_id = action.payload.app_id;
      state.rts_token = action.payload.rts_token;
      state.server_signature = action.payload.server_signature;
      state.server_url = action.payload.server_url;
      state.app_set = action.payload.app_set;
    },
    removeRTSParams: (state) => {
      state.app_id = undefined;
      state.rts_token = undefined;
      state.server_signature = undefined;
      state.server_url = undefined;
    },
  },
});

export const { setRTSParams, removeRTSParams } = rtsSlice.actions;

export default rtsSlice.reducer;
