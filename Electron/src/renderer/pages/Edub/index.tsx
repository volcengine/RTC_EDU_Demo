import { useEffect } from 'react';
import React from 'react';
import * as rtsApi from './apis/rtsApi';

import JoinRoom from '@src/components/JoinRoom';
import { JoinStatus, SceneType } from '@src/store/slices/scene';
import { BaseUser, DeviceState, ShareStatus, ShareType } from '@src/types/state';
import { useDispatch, useSelector } from '@src/store';

import Room from './Room';
import {
  changeLocalUserName,
  localUserChangeCamera,
  localUserChangeMic,
  localUserJoinRoom,
} from '@src/store/slices/edubRoom';

import { joinRoom as edubJoinRoom, JoinEdubRoomRes } from './apis/rtsApi';
import { SendServerMessageRes } from '@src/types/rtsTypes';

import useJoinRoom from '@/renderer/core/hooks/useJoinRoom';
import useSceneMounted from '@/renderer/core/rtcHooks/useSceneMounted';
import { ipcRenderer, remote } from 'electron';
import useDeviceListener from '@/renderer/core/rtcHooks/useDeviceListener';
import useRTSListener from './hooks/useRTSListener';

const settingWindowId = remote.getGlobal('shareWindowId').settingWindowId;

function Edub() {
  const dispatch = useDispatch();

  const { hasEngine } = useSceneMounted(SceneType.Edub);

  const localUser = useSelector((state) => state.edubRoom.localUser);
  const devicesInfo = useSelector((state) => state.device);
  const joinStatus = useSelector((state) => state.scene.joinStatus);

  const handleChangeName = (user: { user_name: string }) => {
    dispatch(changeLocalUserName(user.user_name));
  };

  const handleLocalCameraChange = (state: DeviceState) => {
    dispatch(localUserChangeCamera(state));
  };
  const handleLocalMicChange = (state: DeviceState) => {
    dispatch(localUserChangeMic(state));
  };

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
    ipcRenderer.sendTo(settingWindowId, 'getDeviceList', devicesInfo);
  }, [devicesInfo]);

  useRTSListener();

  useDeviceListener(hasEngine);

  if (joinStatus !== JoinStatus.Joined) {
    return (
      <JoinRoom
        scene={SceneType.Edub}
        localUser={localUser as BaseUser}
        onChangeCamera={handleLocalCameraChange}
        onChangeMic={handleLocalMicChange}
        beforeJoin={handleChangeName}
        onJoinRoom={joinRoom}
      />
    );
  }

  return <Room />;
}

export default Edub;
