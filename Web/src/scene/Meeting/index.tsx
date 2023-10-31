import { useSearchParams } from 'react-router-dom';
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
} from '@/store/slices/meetingRoom';
import { RtcClient } from '@/core/rtc';
import { useJoinRoom, useLeaveRoom, useNetStatusChange } from '@/core/hooks';
import { SendServerMessageRes } from '@/types/rtsTypes';
import { joinRoom as meetingJoinRoom, JoinMeetingRoomRes } from '@/scene/Meeting/apis/rtsApi';

import { BaseUser, DeviceState, ShareStatus, ShareType } from '@/types/state';
import Loading from '@/components/Loading';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';
import { isRtsError } from '@/utils/rtsUtils';
import { BoardClient } from '@/core/board';
import useRTCEventListener from './hooks/useRTCEventListener';
import useRTSListener from './hooks/useRTSListener';

function Meeting() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const roomId = searchParams.get('roomId');
  const username = searchParams.get('username');

  const localUser = useSelector((state) => state.meetingRoom.localUser);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);
  const joinStatus = useSelector((state) => state.scene.joinStatus);

  const autoJoin = useRef<boolean>(true);

  const { hasEngine } = useSceneMounted(SceneType.Meeting);

  useRTCEventListener(hasEngine);
  useRTSListener();

  const handleLocalJoin = (user: { name: string }) => {
    dispatch(changeLocalUserName(user.name));
  };

  const handleLocalCameraChange = (state: DeviceState) => {
    dispatch(localUserChangeCamera(state));
  };
  const handleLocalMicChange = (state: DeviceState) => {
    dispatch(localUserChangeMic(state));
  };

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  useDevice({
    onMicNoPermission: () => handleLocalMicChange(DeviceState.Closed),
    onCameraNoPermission: () => handleLocalCameraChange(DeviceState.Closed),
  });

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

  const handleJoin = (res: SendServerMessageRes<JoinMeetingRoomRes>) => {
    const { user } = res.response;

    if (user.share_status === ShareStatus.Sharing && user.share_type === ShareType.Screen) {
      rtsApi.finishShare();
    }

    dispatch(localUserJoinRoom(res.response));
  };

  const joinRoom = useJoinRoom(
    SceneType.Meeting,
    localUser as BaseUser,
    meetingJoinRoom as unknown as (p: any) => Promise<SendServerMessageRes<JoinMeetingRoomRes>>,
    handleJoin
  );

  useEffect(() => {
    // 房间页面打开时，执行进房逻辑
    const mount = async () => {
      if (roomId && username && joinStatus === JoinStatus.NotJoined && hasEngine) {
        RtcClient.setRoomId(roomId);

        const res = await joinRoom({
          user_name: username!,
          camera: localUser.camera!,
          mic: localUser.mic!,
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
      dispatch(setScene(SceneType.Meeting));
    }
  }, [roomId, username, hasEngine, devicePermissions]);

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
   * 通过url进房 ,如果是成功进房，显示房间内
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
      scene={SceneType.Meeting}
      beforeJoin={handleLocalJoin}
      onJoinRoom={joinRoom}
    />
  );
}

export default Meeting;
