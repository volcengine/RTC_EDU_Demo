import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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

/** {en}
 * @brief
 */

/** {zh}
 * @brief 1. 获取设备信息，在初始化时调用，和场景无关 2. 处理设备状态变化
 *
 */
const useDevice = (props: {
  onMicNoPermission: (permission: boolean) => void;
  onCameraNoPermission: (permission: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const { onMicNoPermission, onCameraNoPermission } = props;
  const [searchParams] = useSearchParams();
  const visibility = searchParams.get('visibility');

  useEffect(() => {
    const mount = async () => {
      /** Magic for rtc sdk  */
      if (!navigator.mediaDevices) {
        /** If the device not support the media services */
        /** pass */
      } else if (visibility !== 'false') {
        /** Ask for permission */
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
      }
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
      });
    };

    mount();
  }, []);

  /** {en}
   * @brief
   */

  /** {zh}
   * @brief 监听摄像头设备，支持自动切换设备
   *
   */
  const handleVideoDeviceStateChanged = async (device: DeviceInfo) => {
    console.log('device hook VideoDeviceStateChanged', device);
    const devices = await RtcClient.getDevices();
    console.log('new devices', devices);

    let deviceId = device.mediaDeviceInfo?.deviceId;
    if (device.deviceState === 'inactive') {
      deviceId = devices.videoInputs?.[0].deviceId || '';
    }

    RtcClient.switchDevice('camera', deviceId);
    dispatch(setCameraList(devices.videoInputs));
    dispatch(setCamera(deviceId));
  };

  /** {en}
   * @brief
   */

  /** {zh}
   * @brief 监听麦克风设备
   *
   */
  const handleAudioDeviceStateChanged = async (device: DeviceInfo) => {
    console.log('device hook AudioDeviceStateChanged', device);
    const devices = await RtcClient.getDevices();
    console.log('new devices', devices);

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
