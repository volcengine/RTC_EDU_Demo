import { ipcRenderer } from 'electron';
import { ProcessEvent } from '@/types/ProcessEvent';
import { BoardClient } from '@/renderer/core/board';
import { JoinStatus, setJoining } from '@/renderer/store/slices/scene';
import { removeRTSParams } from '@/renderer/store/slices/rts';
import { resetMessage } from '@/renderer/store/modules/publicMessage';
import { logout } from '@/renderer/store/slices/user';
import { useHistory } from 'react-router';
import { RtcClient } from '@src/core/rtc';
import { useDispatch } from '@/renderer/store';
import { removeAllUserInRtcRoom } from '@/renderer/store/modules/rtcRoom';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';

const useDuplicateLogin = () => {
  //logout
  const history = useHistory();
  const dispatch = useDispatch();

  const logoutAndLeaveRoom = () => {
    ipcRenderer.send(ProcessEvent.RecoverWindow);

    console.log('logout 退出登录');
    if (BoardClient.room) {
      console.log('退出登录，白板退房');
      BoardClient.leaveRoom();
    }
    RtcClient.stopScreenVideoCapture();
    RtcClient.stopScreenAudioCapture();
    RtcClient.stopAudioCapture();
    RtcClient.stopVideoCapture();

    RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeBoth);
    RtcClient.room?.unpublishScreen(MediaStreamType.kMediaStreamTypeBoth);
    RtcClient.room?.leaveRoom();
    RtcClient.room?.destroy();
    console.log('退出登录，RTC销毁引擎');
    RtcClient.destroyEngine();
    dispatch(removeRTSParams());
    dispatch(logout());
    history.push('/');
    dispatch(setJoining(JoinStatus.NotJoined));
    dispatch(removeAllUserInRtcRoom());
    dispatch(resetMessage());
  };

  return logoutAndLeaveRoom;
};

export default useDuplicateLogin;
