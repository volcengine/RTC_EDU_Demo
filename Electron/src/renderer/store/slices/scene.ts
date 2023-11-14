import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SceneType {
  Meeting = 'vc',
  Edub = 'edub',
  Edus = 'edus',
}

export enum JoinStatus {
  NotJoined = 'notJoined',
  Joinning = 'joinning',
  Joined = 'joined',
}

export interface SceneState {
  scene?: SceneType;
  joinStatus: JoinStatus;
}

/**
 * 当前用户信息
 */
export const sceneSlice = createSlice({
  name: 'scene',
  initialState: {
    joinStatus: JoinStatus.NotJoined,
  } as SceneState,
  reducers: {
    setScene: (state, action: PayloadAction<SceneType>) => {
      state.scene = action.payload;
    },
    setJoining: (state, action: PayloadAction<JoinStatus>) => {
      state.joinStatus = action.payload;
    },
  },
});

export const { setScene, setJoining } = sceneSlice.actions;

export default sceneSlice.reducer;
