import { RtcClient } from '@src/core/rtc';
import { BoardClient } from '@src/core/board';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from '@src/store';
import { removeAllUserInRtcRoom } from '@/renderer/store/modules/rtcRoom';
import { resetMessage } from '@/renderer/store/modules/publicMessage';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';
import { JoinStatus, setJoining } from '@/renderer/store/slices/scene';
import { setAudioPlayBack, setCamera, setMicrophone } from '@/renderer/store/modules/devices';
import { ProcessEvent } from '@/types';
import { ipcRenderer } from 'electron';

const useLeaveRoom = (
  pathname: string = '/',
  {
    onLeaveRoom,
  }: {
    onLeaveRoom?: () => void;
  }
) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const leaveRoom = useCallback(async () => {
    if (BoardClient.room) {
      console.log('离开房间，白板退房');
      BoardClient.leaveRoom();
    }

    ipcRenderer.send(ProcessEvent.RecoverWindow);

    RtcClient.stopScreenVideoCapture();
    RtcClient.stopScreenAudioCapture();
    RtcClient.stopAudioCapture();
    RtcClient.stopVideoCapture();
    RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeBoth);
    RtcClient.room?.unpublishScreen(MediaStreamType.kMediaStreamTypeBoth);

    const devices = await RtcClient.getDevices();

    dispatch(setCamera(devices.videoInputs[0]?.device_id));
    dispatch(setMicrophone(devices.audioInputs[0]?.device_id));
    dispatch(setAudioPlayBack(devices.audioOutputs[0]?.device_id));

    RtcClient.room?.leaveRoom();
    RtcClient.room?.destroy();
    console.log('离开房间，销毁引擎');
    RtcClient.destroyEngine();
    history.push(`${pathname}${location.search}`);
    dispatch(setJoining(JoinStatus.NotJoined));
    onLeaveRoom && onLeaveRoom();
    dispatch(removeAllUserInRtcRoom());
    dispatch(resetMessage());
  }, []);

  return leaveRoom;
};

export default useLeaveRoom;
