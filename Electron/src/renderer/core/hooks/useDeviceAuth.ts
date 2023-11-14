import { useEffect } from 'react';
import { remote } from 'electron';
import { setDevicePermissions } from '@src/store/modules/devices';
import { useDispatch, useSelector } from '@src/store';
import { DeviceState } from '@/renderer/types/state';
import { localUserChangeCamera as meetingChangeCamera } from '@/renderer/store/slices/meetingRoom';
import { localUserChangeCamera as edusChangeCamera } from '@/renderer/store/slices/edusRoom';
import { localUserChangeCamera as edubChangeCamera } from '@/renderer/store/slices/edubRoom';

import { localUserChangeMic as meetingChangeMic } from '@/renderer/store/slices/meetingRoom';
import { localUserChangeMic as edusChangeMic } from '@/renderer/store/slices/edusRoom';
import { localUserChangeMic as edubChangeMic } from '@/renderer/store/slices/edubRoom';
import { message as Message } from 'antd';

/**
 * 获取设备权限
 * @param props
 */
export const useDeviceAuth = () => {
  const dispatch = useDispatch();
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const cameraAccessStatusChenged = (status: Boolean) => {
    if (status) {
      console.log('获取视频权限');
      dispatch(
        setDevicePermissions({
          video: true,
        })
      );
    } else {
      console.log('获取视频权限失败', remote.systemPreferences.getMediaAccessStatus('camera'));
      dispatch(meetingChangeCamera(DeviceState.Closed));
      dispatch(edusChangeCamera(DeviceState.Closed));
      dispatch(edubChangeCamera(DeviceState.Closed));

      dispatch(
        setDevicePermissions({
          video: false,
        })
      );
    }
  };

  const microphoneAccessStatusChenged = (status: Boolean) => {
    if (status) {
      console.log('获取音频权限');
      dispatch(
        setDevicePermissions({
          audio: true,
        })
      );
      //   RtcClient.startAudioCapture();
    } else {
      console.log('获取音频权限失败', remote.systemPreferences.getMediaAccessStatus('microphone'));
      dispatch(meetingChangeMic(DeviceState.Closed));
      dispatch(edusChangeMic(DeviceState.Closed));
      dispatch(edubChangeMic(DeviceState.Closed));
      dispatch(
        setDevicePermissions({
          audio: false,
        })
      );
    }
  };

  // 获取摄像头和麦克风权限
  useEffect(() => {
    (async () => {
      // 检查视频采集权限
      if (remote.systemPreferences.getMediaAccessStatus('camera') === 'granted') {
        cameraAccessStatusChenged(true);
      } else {
        if (process.platform === 'darwin') {
          await remote.systemPreferences.askForMediaAccess('camera');
          if (remote.systemPreferences.getMediaAccessStatus('camera') === 'granted') {
            cameraAccessStatusChenged(true);
          } else {
            Message.error('摄像头权限已关闭，请至设备设置页开启');
            cameraAccessStatusChenged(false);
          }
        } else {
          cameraAccessStatusChenged(false);
        }
      }

      // 检查音频采集权限
      if (remote.systemPreferences.getMediaAccessStatus('microphone') === 'granted') {
        microphoneAccessStatusChenged(true);
      } else {
        if (process.platform === 'darwin') {
          await remote.systemPreferences.askForMediaAccess('microphone');
          if (remote.systemPreferences.getMediaAccessStatus('microphone') === 'granted') {
            microphoneAccessStatusChenged(true);
          } else {
            microphoneAccessStatusChenged(false);
            Message.error('麦克风权限已关闭，请至设备设置页开启');
          }
        } else {
          microphoneAccessStatusChenged(false);
        }
      }
    })();
  }, []);
};

export default useDeviceAuth;
