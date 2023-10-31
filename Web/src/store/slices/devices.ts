import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeviceState {
  selectedCamera?: string;
  selectedMicrophone?: string;
  selectedAudioPlayBack?: string;
  cameraList: MediaDeviceInfo[];
  microphoneList: MediaDeviceInfo[];
  audioPlayBackList: MediaDeviceInfo[];
  devicePermissions: {
    video?: boolean;
    audio?: boolean;
  };
}

/**
 * 当前设备信息
 */
export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    cameraList: [],
    microphoneList: [],
    audioPlayBackList: [],
    devicePermissions: {
      video: undefined,
      audio: undefined,
    },
  } as DeviceState,
  reducers: {
    setCamera: (state, action: PayloadAction<string | undefined>) => {
      state.selectedCamera = action.payload;
    },

    setMicrophone: (state, action: PayloadAction<string | undefined>) => {
      state.selectedMicrophone = action.payload;
    },
    setAudioPlayBack: (state, action: PayloadAction<string | undefined>) => {
      state.selectedAudioPlayBack = action.payload;
    },

    setCameraList: (state, action: PayloadAction<MediaDeviceInfo[]>) => {
      state.cameraList = action.payload;
    },

    setMicrophoneList: (state, action: PayloadAction<MediaDeviceInfo[]>) => {
      state.microphoneList = action.payload;
    },

    setAudioPlayBackList: (state, action: PayloadAction<MediaDeviceInfo[]>) => {
      state.audioPlayBackList = action.payload;
    },

    setDevicePermissions: (
      state,
      action: PayloadAction<{
        video: boolean;
        audio: boolean;
      }>
    ) => {
      state.devicePermissions = action.payload;
    },
  },
});

export const {
  setCamera,
  setMicrophone,
  setAudioPlayBack,
  setCameraList,
  setMicrophoneList,
  setDevicePermissions,
  setAudioPlayBackList,
} = deviceSlice.actions;

export default deviceSlice.reducer;
