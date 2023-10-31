import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import JoinRoom from '@/components/JoinRoom';
import { JoinStatus, SceneType, setJoining, setScene } from '@/store/slices/scene';

import Room from './Room';
import { useDevice, useSceneMounted } from '@/core/rtcHooks';
import { useDispatch, useSelector } from '@/store';
import {
  changeLocalUserName,
  localUserChangeCamera,
  localUserChangeMic,
  localUserJoinRoom,
  localUserLeaveRoom,
} from '@/store/slices/edusRoom';
import { BaseUser, DeviceState, ShareStatus, ShareType, UserRole } from '@/types/state';
import { RtcClient } from '@/core/rtc';
import { useJoinRoom, useLeaveRoom, useNetStatusChange } from '@/core/hooks';
import { SendServerMessageRes } from '@/types/rtsTypes';
import { joinRoom as edusJoinRoom, JoinEdusRoomRes } from '@/scene/Edus/apis/rtsApi';
import Loading from '@/components/Loading';
import { isRtsError } from '@/utils/rtsUtils';
import * as rtsApi from '@/scene/Edus/apis/rtsApi';
import { BoardClient } from '@/core/board';
import { useRTCEventListener } from './hooks';
import useRTSListener from './hooks/useRTSListener';
import { SiteVisitStatus, setSiteVisitStatus } from '@/store/slices/symbols';

function Scene() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const dispatch = useDispatch();
  
  const roomId = searchParams.get('roomId');
  const username = searchParams.get('username');
  const role = searchParams.get('role');

  const { hasEngine } = useSceneMounted(SceneType.Edus);

  const localUser = useSelector((state) => state.edusRoom.localUser);

  const devicePermissions = useSelector((state) => state.device.devicePermissions);
  const joinStatus = useSelector((state) => state.scene.joinStatus);
  const siteVisitStatus = useSelector((state) => state.symbols.siteVisitStatus);

  const autoJoin = useRef<boolean>(true);
  useRTSListener();

  useRTCEventListener(hasEngine);

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

  useDevice({
    onMicNoPermission: () => handleLocalMicChange(DeviceState.Closed),
    onCameraNoPermission: () => handleLocalCameraChange(DeviceState.Closed),
  });

  const handleJoin = (res: SendServerMessageRes<JoinEdusRoomRes>) => {
    const { user } = res.response;

    if (user.share_status === ShareStatus.Sharing && user.share_type === ShareType.Screen) {
      rtsApi.finishShare();
    }

    dispatch(localUserJoinRoom(res.response));
  };

  const joinRoom = useJoinRoom(
    SceneType.Edus,
    localUser as BaseUser,
    edusJoinRoom as unknown as (p: any) => Promise<SendServerMessageRes<JoinEdusRoomRes>>,
    handleJoin
  );

  useEffect(() => {
    // 房间页面打开时，执行进房逻辑
    const mount = async () => {
      console.log('小班课加载');
      if (roomId && username && hasEngine && joinStatus === JoinStatus.NotJoined) {
        RtcClient.setRoomId(roomId);

        const res = await joinRoom({
          user_name: username!,
          camera: localUser.camera!,
          mic: localUser.mic!,
          user_role: +role! as UserRole,
        });

        autoJoin.current = false;
        if (res) {
          dispatch(setJoining(JoinStatus.Joined));
        } else {
          dispatch(setJoining(JoinStatus.NotJoined));
        }
      }
    };
    if (devicePermissions.video !== undefined) {
      mount();
      dispatch(setScene(SceneType.Edus));
    }
  }, [roomId, username, hasEngine, devicePermissions]);

  useEffect(() => {
    if (!location.search) dispatch(setSiteVisitStatus(SiteVisitStatus.login));
    if (location.search && siteVisitStatus === SiteVisitStatus.login) {
      dispatch(setSiteVisitStatus(SiteVisitStatus.edu));
    }
  }, [ location ])

  const handleLeaveRoom = async () => {
    await RtcClient.engine?.leaveRoom();
    await BoardClient.leaveRoom();
    await rtsApi.leaveRoom();
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
    return null;
  }

  /**
   * 如果成功进房，显示房间内
   */
  if (joinStatus === JoinStatus.Joined) {
    return <Room />;
  }

  /**
   * 通过url进房 ,进房状态，显示loading
   */

  if (username && roomId && autoJoin.current) {
    return <Loading />;
  }

  return (
    <JoinRoom
      localUser={localUser as BaseUser}
      onChangeCamera={handleLocalCameraChange}
      onChangeMic={handleLocalMicChange}
      scene={SceneType.Edus}
      beforeJoin={handleLocalJoin}
      onJoinRoom={joinRoom}
    />
  );
}

export default Scene;
