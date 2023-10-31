import { MediaType } from '@volcengine/rtc';
import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import JoinRoom from '@/components/JoinRoom';
import { SiteVisitStatus, setSiteVisitStatus } from '@/store/slices/symbols';
import { JoinStatus, SceneType, setJoining, setScene } from '@/store/slices/scene';
import { BaseUser, DeviceState, ShareStatus, ShareType, UserRole } from '@/types/state';
import { useDispatch, useSelector } from '@/store';

import Room from './Room';
import {
  changeLocalUserName,
  localUserChangeCamera,
  localUserChangeMic,
  setUserRole,
  localUserJoinRoom,
  localUserLeaveRoom,
} from '@/store/slices/edubRoom';
import { useDevice, useSceneMounted } from '@/core/rtcHooks';
import { setUserListDrawOpen } from '@/store/slices/ui';
import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';
import { joinRoom as edubJoinRoom, JoinEdubRoomRes } from '@/scene/Edub/apis/rtsApi';
import { SendServerMessageRes } from '@/types/rtsTypes';
import { useJoinRoom, useLeaveRoom, useNetStatusChange } from '@/core/hooks';
import Loading from '@/components/Loading';
import { isRtsError } from '@/utils/rtsUtils';
import { BoardClient } from '@/core/board';
import { useRTCEventListener } from './hooks';
import useRTSListener from './hooks/useRTSListener';

function Edub() {
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();

  const roomId = searchParams.get('roomId');
  const role = searchParams.get('role');
  const username = searchParams.get('username');
  const location = useLocation();

  const { hasEngine } = useSceneMounted(SceneType.Edub);

  const localUser = useSelector((state) => state.edubRoom.localUser);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);
  const joinStatus = useSelector((state) => state.scene.joinStatus);
  const siteVisitStatus = useSelector((state) => state.symbols.siteVisitStatus);
  const autoJoin = useRef<boolean>(true);

  useRTCEventListener(hasEngine);
  useRTSListener();

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const handleLocalJoin = (user: { name: string }) => {
    dispatch(changeLocalUserName(user.name));
  };

  const handleLocalCameraChange = (state: DeviceState) => {
    dispatch(localUserChangeCamera(state));
  };
  const handleLocalMicChange = (state: DeviceState) => {
    dispatch(localUserChangeMic(state));
  };

  useDevice({
    onMicNoPermission: () => handleLocalMicChange(DeviceState.Closed),
    onCameraNoPermission: () => handleLocalCameraChange(DeviceState.Closed),
  });

  useEffect(() => {
    dispatch(setScene(SceneType.Edub));

    if (role) {
      dispatch(setUserRole(+role));

      if (+role === UserRole.Visitor) {
        dispatch(localUserChangeCamera(DeviceState.Closed));
        dispatch(localUserChangeMic(DeviceState.Closed));
      }

      if (+role === UserRole.Host) {
        dispatch(setUserListDrawOpen(false));
      }
    }
  }, [role]);

  useNetStatusChange({
    onNetOffline: () => {
      leaveRoom();
    },
    onNetOnline: async () => {
      const roomInfo = await rtsApi.reSync();
      if (!isRtsError(roomInfo)) {
        if (roomInfo.response.room.host_user_id) {
          dispatch(localUserJoinRoom(roomInfo.response));
        }
      }
    },
  });

  const handleJoin = (res: SendServerMessageRes<JoinEdubRoomRes>) => {
    const { user } = res.response;

    if (user.share_status === ShareStatus.Sharing && user.share_type === ShareType.Screen) {
      rtsApi.edubStopShare();
    }

    dispatch(localUserJoinRoom(res.response));
  };

  const joinRoom = useJoinRoom(
    SceneType.Edub,
    localUser as BaseUser,
    edubJoinRoom as unknown as (p: any) => Promise<SendServerMessageRes<JoinEdubRoomRes>>,
    handleJoin
  );

  useEffect(() => {
    // 房间页面打开时，执行进房逻辑
    const mount = async () => {
      if (
        (+role! === UserRole.Host || +role! === UserRole.Visitor) &&
        roomId &&
        joinStatus === JoinStatus.NotJoined
      ) {
        RtcClient.setRoomId(roomId);

        const res = await joinRoom({
          user_name: username!,
          user_role: +role! as UserRole,
          camera: localUser.camera!,
          mic: localUser.mic!,
        });

        autoJoin.current = false;
        if (res) {
          dispatch(setJoining(JoinStatus.Joined));
          if (+role! === UserRole.Visitor) {
            RtcClient.unpublishStream(MediaType.AUDIO);
            RtcClient.stopVideoCapture();
          }
        } else {
          dispatch(setJoining(JoinStatus.NotJoined));
        }
      }
    };
    if (roomId && username && devicePermissions.video !== undefined && hasEngine) {
      mount();
    }
  }, [roomId, username, hasEngine, devicePermissions]);

  useEffect(() => {
    /** 第一次访问 login 页面时 */
    if (!location.search) {
      dispatch(setSiteVisitStatus(SiteVisitStatus.login));
    }
    /** 通过 login 页面进入到课堂 */
    if (location.search && siteVisitStatus === SiteVisitStatus.login) {
      dispatch(setSiteVisitStatus(SiteVisitStatus.edu));
    }
  }, [ location ])

  const handleLeaveRoom = async () => {
    await RtcClient.engine?.leaveRoom();
    await BoardClient.leaveRoom();
    await rtsApi.edubLeaveRoom();
    dispatch(setJoining(JoinStatus.NotJoined));
  };

  useEffect(() => {
    const handlePopState = () => {
      if (joinStatus === JoinStatus.Joined) {
        handleLeaveRoom();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasEngine, joinStatus]);

  if (!hasEngine) {
    // todo 引擎未创建完成的时候，需要个样式？

    return null;
  }

  /**
   * 通过url进房 ,如果是成功进房，显示房间内
   */
  if (joinStatus === JoinStatus.Joined) {
    return <Room role={+role! as UserRole} />;
  }

  /**
   * 通过url进房 ,进房状态，显示loading
   */

  if (username && roomId && autoJoin.current) {
    return <Loading />;
  }

  return (
    <JoinRoom
      scene={SceneType.Edub}
      localUser={localUser as BaseUser}
      onChangeCamera={handleLocalCameraChange}
      onChangeMic={handleLocalMicChange}
      beforeJoin={handleLocalJoin}
      onJoinRoom={joinRoom}
    />
  );
}

export default Edub;
