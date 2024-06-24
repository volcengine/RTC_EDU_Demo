import { MediaType } from '@volcengine/rtc';
import { message as Message } from 'antd';
import { DeviceType } from '@/components/DeviceButton/utils';
import { useSelector, useDispatch } from '@/store';
import { DeviceState } from '@/types/state';
import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';

import { localUserChangeCamera, localUserChangeMic } from '@/store/slices/meetingRoom';

/**
 * 操作自己的设备
 * 这里只处理有权限的情况，没权限时用popover提示
 * @param user
 * @returns
 */
const useHandleDevice = () => {
  const room = useSelector((state) => state.meetingRoom);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const dispatch = useDispatch();

  const localUser = room.localUser;

  const handleDevice = async (device: DeviceType) => {
    if (device === DeviceType.Microphone) {
      if (localUser?.mic === DeviceState.Closed) {
        if (!devicePermissions.audio) {
          Message.error('未获得麦克风权限!');
          return;
        }
      }

      const res = await rtsApi.operateSelfMic({
        operate: localUser?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
      });

      if (res === null) {
        if (localUser?.mic === DeviceState.Closed) {
          RtcClient.unmuteStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Open));
        }

        if (localUser?.mic === DeviceState.Open) {
          RtcClient.muteStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Closed));
        }
      } else {
        Message.error(res.message);
      }
    }

    if (device === DeviceType.Camera) {
      if (localUser?.camera === DeviceState.Closed) {
        if (!devicePermissions.video) {
          Message.error('未获得摄像头权限!');
          return;
        }
      }

      const res = await rtsApi.operateSelfCamera({
        operate: localUser?.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
      });

      if (res === null) {
        if (localUser?.camera === DeviceState.Closed) {
          RtcClient.startVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Open));
        }

        if (localUser?.camera === DeviceState.Open) {
          RtcClient.stopVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Closed));
        }
      } else {
        Message.error(res.message);
      }
    }
  };

  return handleDevice;
};

export default useHandleDevice;
