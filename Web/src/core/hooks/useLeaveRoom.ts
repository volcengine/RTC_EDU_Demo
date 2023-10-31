import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RtcClient } from '@/core/rtc';

import { BoardClient } from '@/core/board';
import { useDispatch } from '@/store';
import { setAudioPlayBack, setCamera, setMicrophone } from '@/store/slices/devices';
import { JoinStatus, setJoining } from '@/store/slices/scene';

const useLeaveRoom = (
  pathname: string = '/',
  {
    onLeaveRoom,
  }: {
    onLeaveRoom?: () => void;
  }
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const leaveRoom = useCallback(async () => {
    await RtcClient.leaveRoom();
    await BoardClient.leaveRoom();

    const devices = await RtcClient.getDevices();

    dispatch(setCamera(devices.videoInputs[0]?.deviceId));
    dispatch(setMicrophone(devices.audioInputs[0]?.deviceId));
    dispatch(setAudioPlayBack(devices.audioOutputs[0]?.deviceId));
    dispatch(setJoining(JoinStatus.NotJoined));
    onLeaveRoom && onLeaveRoom();
    navigate(`${pathname}`);
  }, []);

  return leaveRoom;
};

export default useLeaveRoom;
