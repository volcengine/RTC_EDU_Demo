import { useDispatch } from '@/renderer/store';
import { resetMessage } from '@/renderer/store/modules/publicMessage';
import { removeAllUserInRtcRoom } from '@/renderer/store/modules/rtcRoom';
import { removeRTSParams } from '@/renderer/store/slices/rts';
import { logout } from '@/renderer/store/slices/user';
import { ProcessEvent } from '@/types/ProcessEvent';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router';
import { BoardClient } from '../board';
import { RtcClient } from '../rtc';

const useLogout = (props: { onLeaveRoom?: () => void }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { onLeaveRoom } = props;

  const handleLogout = () => {
    ipcRenderer.send(ProcessEvent.RecoverWindow);
    // 执行场景的退房逻辑，重置场景的redux
    onLeaveRoom && onLeaveRoom();

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
    history.push('/');

    // todo 重置其他渲染进程的redux (每次主渲染进程更新时，会同步其他渲染进程，应该不需要更新)
    dispatch(removeAllUserInRtcRoom());
    dispatch(removeRTSParams());
    dispatch(resetMessage());
    dispatch(logout());
  };
  return handleLogout;
};

export default useLogout;
