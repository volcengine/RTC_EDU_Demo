import { useEffect } from 'react';
import VERTC, { IEngineEvents } from '@volcengine/rtc';
import { message as Message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RtcClient } from '@/core/rtc';
import { useDispatch } from '@/store';
import { logout } from '@/store/slices/user';

interface IJoinRoomRTCEventListeners {
  onDuplicateJoin?: IEngineEvents['onError'];
}

/**
 *  进房页面的事件监听，只需要处理互踢逻辑
 */
const useJoinRoomRtcListener = (props: IJoinRoomRTCEventListeners) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleError: IEngineEvents['onError'] = async (e) => {
    const { errorCode } = e;
    console.error('handle rtc error', e);
    if (
      errorCode === VERTC.ErrorCode.DUPLICATE_LOGIN ||
      errorCode === VERTC.ErrorCode.RTM_DUPLICATE_LOGIN
    ) {
      Message.error('相同ID用户已登录，您已被强制下线!');

      dispatch(logout());
      await RtcClient.stopAudioCapture();
      await RtcClient.stopScreenCapture();
      await RtcClient.stopVideoCapture();

      navigate('/login');
    }
  };

  useEffect(() => {
    RtcClient.engine.on(VERTC.events.onError, handleError);

    return () => {
      RtcClient.engine.off(VERTC.events.onError, handleError);
    };
  }, []);
};

export default useJoinRoomRtcListener;
