import { message } from 'antd';
import { useDispatch, useSelector } from '@src/store';
import { JoinStatus, SceneType, setJoining } from '@/renderer/store/slices/scene';
import { DeviceState, RoomMicStatus, UserRole } from '@/renderer/types/state';
import { useHistory } from 'react-router';

import { isRtsError } from '@/renderer/utils/rtsUtils';
import { BoardClient } from '../board';
import { logout } from '@/renderer/store/slices/user';
import { RtcClient } from '../rtc';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';

const useJoinRoom = <
  R extends {
    code: number;
    response: any;
  }
>(
  scene: SceneType,
  localUser: {
    camera: DeviceState;
    mic: DeviceState;
    user_role: UserRole;
  },
  rtsApi: (p: any) => Promise<R>,
  afterFn: (p: R) => void
) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const joinRoom = async (payload: {
    user_name: string;
    user_role?: UserRole;
    camera: DeviceState;
    mic: DeviceState;
  }) => {
    dispatch(setJoining(JoinStatus.Joinning));

    const res = await rtsApi(payload);

    console.log('join room res', res);

    if (isRtsError(res)) {
      // todo rts错误对应的提示
      console.error('join room rts error', res);
      return false;
    }

    // rts 服务端错误
    if (res.code !== 200) {
      dispatch(setJoining(JoinStatus.NotJoined));

      if (res.code === 403) {
        message.error(`该房间已有${scene === SceneType.Meeting ? '其他主持人' : '老师'}`);
      }
      if (res.code === 401) {
        message.error('房间人数已满');
      }
      if (res.code === 450) {
        message.error('登录过期，请重新登录');
        dispatch(logout());
        history.push(`/login`);
      }
      return false;
    }

    afterFn(res);

    // 会同时进白板房间
    BoardClient.setConfig({
      room_id: res.response.wb_room_id,
      user_id: res.response.wb_user_id,
      token: res.response.wb_token,
    });

    await RtcClient.joinRoom(res.response.token);

    if (localUser.camera === DeviceState.Open && devicePermissions.video) {
      await RtcClient.startVideoCapture();
    }

    if (devicePermissions.audio) {
      console.log('use join room --', 1);
      await RtcClient.startAudioCapture();

      // 当前用户主动关闭麦克风，不推流

      if (localUser.mic === DeviceState.Closed) {
        RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
      }

      // 房间是全体静音状态
      if (res.response.room.room_mic_status === RoomMicStatus.AllMuted) {
        if (res.response.user.user_role !== UserRole.Host) {
          RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
        }
      }
    }

    user?.user_id && RtcClient.removeVideoPlayer(user.user_id);

    dispatch(setJoining(JoinStatus.Joined));
    return true;
  };

  return joinRoom;
};

export default useJoinRoom;
