import { message } from 'antd';
import { MediaType } from '@volcengine/rtc';
import { DeviceType } from '@/components/DeviceButton/utils';
import { useDispatch, useSelector } from '@/store';
import { DeviceState, UserRole } from '@/types/state';
import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';

import { localUserChangeCamera, localUserChangeMic } from '@/store/slices/edubRoom';

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

  const handleDevice = (device: DeviceType) => {
    // 如果当前操作的是自己的设备
    if (opUserIsLocal) {
      if (device === 'camera') {
        if (localUser?.camera === DeviceState.Closed) {
          if (!devicePermissions.video) {
            message.error('未获得摄像头权限!');
            return;
          }

          RtcClient.startVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Open));
        }

        if (localUser?.camera === DeviceState.Open) {
          RtcClient.stopVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Closed));
        }

        rtsApi.operateSelfCamera({
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
            message.error('未获得麦克风权限!');
            return;
          }

          RtcClient.unmuteStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Open));
        }

        if (localUser?.mic === DeviceState.Open) {
          RtcClient.muteStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Closed));
        }

        rtsApi.operateSelfMic({
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
        rtsApi.operateOtherCamera({
          operate_user_id: user?.user_id!,
          operate: user?.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
        });
      }
      if (device === 'microphone') {
        rtsApi.operateOtherMic({
          operate_user_id: user?.user_id!,
          operate: user?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
        });
      }
    }
  };

  return handleDevice;
};

export default useHandleDevice;
