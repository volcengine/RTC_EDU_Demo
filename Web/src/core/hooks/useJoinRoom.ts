import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MediaType } from '@volcengine/rtc';
import { useDispatch, useSelector } from '@/store';
import { RtcClient } from '@/core/rtc';

import { BoardClient } from '@/core/board';
import { logout } from '@/store/slices/user';
import { DeviceState, RoomMicStatus, Silence, UserRole } from '@/types/state';
import { isRtsError } from '@/utils/rtsUtils';
import { JoinStatus, SceneType, setJoining } from '@/store/slices/scene';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);
  const [searchParams] = useSearchParams();

  const joinRoom = async (payload: {
    user_name: string;
    user_role?: UserRole;
    camera: DeviceState;
    mic: DeviceState;
    is_silence?: Silence;
  }): Promise<boolean> => {
    const params = payload;
    const visibility = searchParams.get('visibility');
    if (visibility === 'false') {
      params.is_silence = Silence.silence;
    }

    dispatch(setJoining(JoinStatus.Joinning));

    const res = await rtsApi(payload);

    if (isRtsError(res)) {
      console.error('join room rts error', res);
      return false;
    }

    // rts 服务端错误
    if (res.code !== 200) {
      if (res.code === 403) {
        message.error(`该房间已有${scene === SceneType.Meeting ? '其他主持人' : '老师'}`);
      }
      if (res.code === 401) {
        message.error('房间人数已满');
      }
      if (res.code === 450) {
        message.error('登录过期，请重新登录');
        dispatch(logout());
        navigate(`/login${location.search}`);
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

    await RtcClient.joinRoom(res.response.token, payload.user_name);

    if (localUser.camera === DeviceState.Open && devicePermissions.video) {
      await RtcClient.startVideoCapture();
    }

    if (devicePermissions.audio) {
      // 当前用户主动关闭麦克风，不推流
      const isLocalUserMuted = localUser.mic === DeviceState.Closed;

      // 房间是全体静音状态
      const isLocalUserInAllMuted = res.response.room.room_mic_status === RoomMicStatus.AllMuted
        && res.response.user.user_role !== UserRole.Host;

      if (isLocalUserMuted || isLocalUserInAllMuted) {
        RtcClient.muteStream(MediaType.AUDIO);
      } else {
        RtcClient.unmuteStream(MediaType.AUDIO);
      }
    }

    RtcClient.setVideoPlayer(user?.user_id!, undefined);

    dispatch(setJoining(JoinStatus.Joined));

    return true;
  };

  return joinRoom;
};

export default useJoinRoom;
