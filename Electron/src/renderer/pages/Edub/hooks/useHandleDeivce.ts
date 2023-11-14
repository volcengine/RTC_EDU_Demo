import { message } from 'antd';
import { useDispatch, useSelector } from '@src/store';
import { DeviceState, UserRole } from '@src/types/state';
import { RtcClient } from '@src/core/rtc';
import * as rtsApi from '../apis/rtsApi';

import { localUserChangeCamera, localUserChangeMic } from '@src/store/slices/edubRoom';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';

interface UserDevice {
  user_id?: string;
  camera?: DeviceState;
  mic?: DeviceState;
}
/**
 * 操作设备
 * 1. 老师或学生操作自己的设备
 * 2. 老师操作学生的设备
 * @param user
 * @returns
 */
const useHandleDevice = (user?: UserDevice) => {
  const room = useSelector((state) => state.edubRoom);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const dispatch = useDispatch();

  const localUser = room.localUser;
  user = user || localUser;

  const localIsHost = localUser.user_role === UserRole.Host;

  const opUserIsLocal = user?.user_id && user?.user_id === localUser.user_id;

  // 当前用户是老师或连麦状态的学生
  const localPermission = localIsHost || localUser.linked;

  const handleDevice = (device: 'camera' | 'microphone') => {
    // 如果当前操作的是自己的设备
    if (opUserIsLocal) {
      if (device === 'camera') {
        if (localUser?.camera === DeviceState.Closed) {
          if (!devicePermissions.video) {
            if (process.platform === 'win32') {
              message.error('摄像头权限已关闭，请至设备设置页开启，然后重新启动应用');
            } else {
              message.error('摄像头权限已关闭，请至设备设置页开启');
            }
            return;
          }

          RtcClient.startVideoCapture();
          RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeVideo);

          dispatch(localUserChangeCamera(DeviceState.Open));
        }

        if (localUser?.camera === DeviceState.Open) {
          RtcClient.stopVideoCapture();
          RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeVideo);

          dispatch(localUserChangeCamera(DeviceState.Closed));
        }

        rtsApi.edubOperateSelfCamera({
          operate: localUser?.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
        });
      }

      if (device === 'microphone') {
        if (!localPermission) {
          message.error('需要连麦才能发言!');
          alert('产品逻辑这里应该不会触发！');
          return;
        }

        if (localUser?.mic === DeviceState.Closed) {
          if (!devicePermissions.audio) {
            if (process.platform === 'win32') {
              message.error('麦克风权限已关闭，请至设备设置页开启，开启后重新启动应用');
            } else {
              message.error('麦克风权限已关闭，请至设备设置页开启');
            }
            return;
          }

          RtcClient.engine?.startAudioCapture();
          RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeAudio);
          dispatch(localUserChangeMic(DeviceState.Open));
        }

        if (localUser?.mic === DeviceState.Open) {
          RtcClient.stopAudioCapture();
          RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
          dispatch(localUserChangeMic(DeviceState.Closed));
        }

        rtsApi.edubOperateSelfMic({
          operate: localUser?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
        });
      }
    }
    // 老师操作学生
    else {
      if (!localIsHost) {
        alert('不是老师，没有权限，应该不能走到这里');
      }

      if (device === 'camera') {
        rtsApi.edubOperateOtherCamera({
          operate_user_id: user?.user_id!,
          operate: user?.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
        });
      }
      if (device === 'microphone') {
        rtsApi.edubOperateOtherMic({
          operate_user_id: user?.user_id!,
          operate: user?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
        });
      }
    }
  };

  return handleDevice;
};

export default useHandleDevice;
