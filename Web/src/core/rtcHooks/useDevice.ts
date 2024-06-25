import { useEffect } from 'react';
import VERTC, { DeviceInfo } from '@volcengine/rtc';

import {
  setCamera,
  setMicrophone,
  setAudioPlayBack,
  setCameraList,
  setMicrophoneList,
  setAudioPlayBackList,
  setDevicePermissions,
} from '@/store/slices/devices';
import { useDispatch } from '@/store';
import { RtcClient } from '@/core/rtc';

/**
 *  1. 获取设备信息，在初始化时调用，和场景无关 2. 处理设备状态变化
 *
 */
const useDevice = (props: {
  onMicNoPermission: (permission: boolean) => void;
  onCameraNoPermission: (permission: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const { onMicNoPermission, onCameraNoPermission } = props;

  useEffect(() => {
    const mount = async () => {
      RtcClient.checkPermission().then(async (permission) => {
        dispatch(setDevicePermissions(permission));

        if (!permission.audio) {
          onMicNoPermission(false);
        }
  
        if (!permission.video) {
          onCameraNoPermission(false);
        }

        const devices = await RtcClient.getDevices();
  
        dispatch(setCamera(devices.videoInputs[0]?.deviceId));
        dispatch(setMicrophone(devices.audioInputs[0]?.deviceId));
        dispatch(setAudioPlayBack(devices.audioOutputs[0]?.deviceId));
        dispatch(setCameraList(devices.videoInputs));
        dispatch(setMicrophoneList(devices.audioInputs));
        dispatch(setAudioPlayBackList(devices.audioOutputs));
      }).catch((err) => {
        console.log('check permission err: ', err);
      });
    };

    mount();
  }, []);

  /**
   *  监听摄像头设备，支持自动切换设备
   *
   */
  const handleVideoDeviceStateChanged = async (device: DeviceInfo) => {
    const devices = await RtcClient.getDevices();

    let deviceId = device.mediaDeviceInfo?.deviceId;
    if (device.deviceState === 'inactive') {
      deviceId = devices.videoInputs?.[0].deviceId || '';
    }

    RtcClient.switchDevice('camera', deviceId);
    dispatch(setCameraList(devices.videoInputs));
    dispatch(setCamera(deviceId));
  };

  /**
   *  监听麦克风设备
   *
   */
  const handleAudioDeviceStateChanged = async (device: DeviceInfo) => {
    const devices = await RtcClient.getDevices();

    if (device.mediaDeviceInfo.kind === 'audioinput') {
      let deviceId = device.mediaDeviceInfo.deviceId;
      if (device.deviceState === 'inactive') {
        deviceId = devices.audioInputs?.[0].deviceId || '';
      }
      RtcClient.switchDevice('microphone', deviceId);
      dispatch(setMicrophoneList(devices.audioInputs));
      dispatch(setMicrophone(deviceId));
    }

    if (device.mediaDeviceInfo.kind === 'audiooutput') {
      let deviceId = device.mediaDeviceInfo.deviceId;
      if (device.deviceState === 'inactive') {
        deviceId = devices.audioOutputs?.[0].deviceId || '';
      }
      RtcClient.switchDevice('playback', deviceId);
      dispatch(setAudioPlayBackList(devices.audioOutputs));
      dispatch(setAudioPlayBack(deviceId));
    }
  };

  useEffect(() => {
    // 监听设备变化
    RtcClient.engine?.on(VERTC.events.onAudioDeviceStateChanged, handleAudioDeviceStateChanged);
    RtcClient.engine?.on(VERTC.events.onVideoDeviceStateChanged, handleVideoDeviceStateChanged);
    return () => {
      // 取消设备变化的监听
      RtcClient.engine?.off(VERTC.events.onAudioDeviceStateChanged, handleAudioDeviceStateChanged);
      RtcClient.engine?.off(VERTC.events.onVideoDeviceStateChanged, handleVideoDeviceStateChanged);
    };
  }, []);
};

export default useDevice;
