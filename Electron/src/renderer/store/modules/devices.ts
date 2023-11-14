/**
 * 设备列表
 */
import { DeviceState } from '@/renderer/types/state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Device {
  device_name: string;
  device_id: string;
}

export interface IDeviceState {
  selectedCamera?: string;
  selectedMicrophone?: string;
  selectedAudioPlayBack?: string;
  cameraList: Device[];
  microphoneList: Device[];
  audioPlayBackList: Device[];
  devicePermissions: {
    video: boolean;
    audio: boolean;
  };
}

const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    cameraList: [],
    microphoneList: [],
    audioPlayBackList: [],
    devicePermissions: {
      video: true,
      audio: true,
    },
  } as IDeviceState,
  reducers: {
    initAllDevices: (state, actions: PayloadAction<IDeviceState>) => {
      return actions.payload;
    },

    setCamera: (state, actions: PayloadAction<string>) => {
      state.selectedCamera = actions.payload;
    },
    setMicrophone: (state, actions: PayloadAction<string>) => {
      state.selectedMicrophone = actions.payload;
    },
    setAudioPlayBack: (state, actions: PayloadAction<string>) => {
      state.selectedAudioPlayBack = actions.payload;
    },

    setCameraList: (state, actions: PayloadAction<Device[]>) => {
      state.cameraList = actions.payload;
    },
    setMicrophoneList: (state, actions: PayloadAction<Device[]>) => {
      state.microphoneList = actions.payload;
    },
    setAudioPlayBackList: (state, actions: PayloadAction<Device[]>) => {
      state.audioPlayBackList = actions.payload;
    },

    setDevicePermissions: (
      state,
      action: PayloadAction<{
        video?: boolean;
        audio?: boolean;
      }>
    ) => {
      state.devicePermissions = {
        ...state.devicePermissions,
        ...action.payload,
      };
    },
  },
});

export const {
  initAllDevices,
  setMicrophoneList,
  setAudioPlayBackList,
  setCameraList,
  setMicrophone,
  setAudioPlayBack,
  setCamera,
  setDevicePermissions,
} = deviceSlice.actions;

export default deviceSlice.reducer;
