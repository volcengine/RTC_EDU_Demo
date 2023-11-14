import { RtcClient } from '@src/core/rtc';
import { useDispatch } from '@src/store';
import {
  Device,
  setMicrophoneList,
  setAudioPlayBackList,
  setCameraList,
  setMicrophone,
  setAudioPlayBack,
  setCamera,
} from '@src/store/modules/devices';
import { useEffect } from 'react';

/**
 * 设备状态
 */
enum DeviceState {
  D_INSERT = 10, // 设备已插入
  D_REMOVE = 11, // 设备被移除
}

/**
 * 设备类型
 */
enum DeviceType {
  D_AUDIO_RENDERER = 0, // 音频渲染
  D_AUDIO_CAPTURE = 1, // 音频采集
}

export const useDeviceListener = (hasEngine: boolean) => {
  const dispatch = useDispatch();

  /**
   * 更新视频采集设备（摄像头）
   * @param device_id
   * @param devices
   */
  const updateVideoCaptureDevice = (device_id: string, devices: Device[]) => {
    RtcClient.setVideoCaptureDevice(device_id);
    dispatch(setCamera(device_id));
    dispatch(setCameraList(devices));
  };

  /**
   * 更新音频采集设备（麦克风）
   * @param device_id
   * @param devices
   */
  const updateAudioCaptureDevice = (device_id: string, devices: Device[]) => {
    RtcClient.setAudioCaptureDevice(device_id);
    dispatch(setMicrophone(device_id));
    dispatch(setMicrophoneList(devices));
  };

  /**
   * 更新音频播放设备（扬声器）
   * @param device_id
   * @param devices
   */
  const updateAudioPlaybackDevice = (device_id: string, devices: Device[]) => {
    RtcClient.setAudioPlaybackDevice(device_id);
    dispatch(setAudioPlayBack(device_id));
    dispatch(setAudioPlayBackList(devices));
  };

  const printDeviceLog = (device_id: string, device_type: number, device_state: number) => {
    // console.log(
    //   'device_id',
    //   device_id,
    //   'device_type: ',
    //   device_type,
    //   'device_state: ',
    //   device_state
    // );
  };

  const checkDealDeviceSate = (device_state: number) => {
    return device_state === DeviceState.D_INSERT || device_state === DeviceState.D_REMOVE;
  };

  /**
   * 监听视频采集设备（摄像头）
   * @param device_id
   * @param device_type
   * @param device_state
   * @param device_error
   * @returns
   */
  const handlerVideoDeviceStateChanged = (
    device_id: string,
    device_type: number,
    device_state: number,
    device_error: number
  ) => {
    printDeviceLog(device_id, device_type, device_state);
    if (!checkDealDeviceSate(device_state)) {
      return;
    }

    const devices = RtcClient.getVideoCaptureDevices();
    if (devices.length === 0) {
      console.warn('获取视频采集设备错误');
      return;
    }

    if (device_state === DeviceState.D_INSERT) {
      updateVideoCaptureDevice(device_id, devices);
    } else if (device_state === DeviceState.D_REMOVE) {
      updateVideoCaptureDevice(devices[0].device_id, devices);
    }
  };

  /**
   * 监听音频采集（麦克风）和播放（扬声器）设备
   * @param device_id
   * @param device_type
   * @param device_state
   * @param device_error
   * @returns
   */
  const handlerAudioDeviceStateChanged = (
    device_id: string,
    device_type: number,
    device_state: number,
    device_error: number
  ) => {
    printDeviceLog(device_id, device_type, device_state);
    if (!checkDealDeviceSate(device_state)) {
      return;
    }

    const captureDevices = RtcClient.getAudioCaptureDevices();
    const playbackDevices = RtcClient.getAudioPlaybackDevices();

    if (captureDevices.length === 0) {
      console.warn('获取音频采集设备错误');
      return;
    }

    // 过滤虚拟声卡
    const virtualCaptureDevice = captureDevices.find((item) => item.device_id === device_id);
    if (virtualCaptureDevice?.device_name === 'VeRTCVirtualSoundCard') {
      return;
    }

    if (device_state === DeviceState.D_INSERT) {
      if (device_type === DeviceType.D_AUDIO_RENDERER) {
        updateAudioPlaybackDevice(device_id, playbackDevices);
      } else {
        updateAudioCaptureDevice(device_id, captureDevices);
      }
    } else if (device_state === DeviceState.D_REMOVE) {
      if (device_type === DeviceType.D_AUDIO_RENDERER) {
        if (playbackDevices?.length === 0) {
          return;
        }
        updateAudioPlaybackDevice(playbackDevices[0].device_id, playbackDevices);
      } else {
        updateAudioCaptureDevice(captureDevices[0].device_id, captureDevices);
      }
    }
  };

  useEffect(() => {
    RtcClient.engine?.on('onVideoDeviceStateChanged', handlerVideoDeviceStateChanged);
    RtcClient.engine?.on('onAudioDeviceStateChanged', handlerAudioDeviceStateChanged);

    return () => {
      RtcClient.engine?.off('onVideoDeviceStateChanged', handlerVideoDeviceStateChanged);
      RtcClient.engine?.off('onAudioDeviceStateChanged', handlerAudioDeviceStateChanged);
    };
  }, [hasEngine]);

  useEffect(() => {
    const mount = async () => {
      const devices = await RtcClient.getDevices();

      console.log('xxxxx ----设备更新：', devices);

      dispatch(setCamera(devices.curCamera));
      dispatch(setMicrophone(devices.curMic));
      dispatch(setAudioPlayBack(devices.curPlayback));
      dispatch(setCameraList(devices.videoInputs));
      dispatch(setMicrophoneList(devices.audioInputs));
      dispatch(setAudioPlayBackList(devices.audioOutputs));
    };

    mount();
  }, [hasEngine]);
};

export default useDeviceListener;
