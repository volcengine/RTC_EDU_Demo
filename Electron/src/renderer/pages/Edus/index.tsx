import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@src/store';

import { ipcRenderer, remote } from 'electron';

import { BaseUser, DeviceState, ShareStatus, ShareType } from '@/renderer/types/state';

import {
  changeLocalUserName,
  localUserChangeCamera,
  localUserChangeMic,
  localUserJoinRoom,
} from '@/renderer/store/slices/edusRoom';

import * as rtsApi from './apis';
import { JoinStatus, SceneType } from '@/renderer/store/slices/scene';
import JoinRoom from '@/renderer/components/JoinRoom';
import useSceneMounted from '@/renderer/core/rtcHooks/useSceneMounted';
import useJoinRoom from '@/renderer/core/hooks/useJoinRoom';
import { SendServerMessageRes } from '@/renderer/types/rtsTypes';
import useDeviceListener from '@/renderer/core/rtcHooks/useDeviceListener';
import Room from './Room';
import { JoinEdusRoomRes } from './apis';
import useRTSListener from './hooks/useRTSListener';

const settingWindowId = remote.getGlobal('shareWindowId').settingWindowId;
// const hostWindowId = remote.getGlobal('shareWindowId').hostWindowId;

const View: React.FC<{}> = (props) => {
  const room = useSelector((state) => state.edusRoom);
  const devicesInfo = useSelector((state) => state.device);

  const joinStatus = useSelector((state) => state.scene.joinStatus);

  const localUser = room.localUser;

  const dispatch = useDispatch();

  const handleJoin = (res: SendServerMessageRes<JoinEdusRoomRes>) => {
    const { user } = res.response;

    if (user.share_status === ShareStatus.Sharing && user.share_type === ShareType.Screen) {
      rtsApi.finishShare();
    }

    dispatch(localUserJoinRoom(res.response));
  };

  const { hasEngine } = useSceneMounted(SceneType.Edus);

  const handleChangeName = (value: { user_name: string }) => {
    dispatch(changeLocalUserName(value.user_name));
  };

  const handleLocalCameraChange = (state: DeviceState) => {
    dispatch(localUserChangeCamera(state));
  };
  const handleLocalMicChange = (state: DeviceState) => {
    dispatch(localUserChangeMic(state));
  };

  const handleJoinRoom = useJoinRoom(
    SceneType.Edus,
    localUser as BaseUser,
    rtsApi.joinRoom as unknown as (p: any) => Promise<SendServerMessageRes<JoinEdusRoomRes>>,
    handleJoin
  );

  useEffect(() => {
    ipcRenderer.sendTo(settingWindowId, 'getDeviceList', devicesInfo);
  }, [devicesInfo]);

  useRTSListener();

  useDeviceListener(hasEngine);

  /**
   * 未进房时，进房页
   */
  if (joinStatus !== JoinStatus.Joined) {
    return (
      <JoinRoom
        localUser={localUser as BaseUser}
        onChangeCamera={handleLocalCameraChange}
        onChangeMic={handleLocalMicChange}
        scene={SceneType.Edus}
        beforeJoin={handleChangeName}
        onJoinRoom={handleJoinRoom}
      ></JoinRoom>
    );
  }

  return <Room />;
};

export default View;
