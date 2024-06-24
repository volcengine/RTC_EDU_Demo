import VERTC, { IEngineEvents, MediaType } from '@volcengine/rtc';
import { useEffect } from 'react';
import { message as Message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RtcClient } from '@/core/rtc';
import { useDispatch } from '@/store';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';
import { logout } from '@/store/slices/user';
import { useLeaveRoom } from '@/core/hooks';
import { localUserLeaveRoom, setRtcStatus } from '@/store/slices/edubRoom';

/**
 *  rtc 事件监听，处理统一逻辑。和场景相关的业务逻辑在场景的业务代码中处理
 */
const useRTCEventListener = (hasEngine: boolean) => {
  const dispatch = useDispatch();

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => {
      dispatch(localUserLeaveRoom());
    },
  });

  const updateRtcStatus = (userId: string, rtcStatus: any) => {
    dispatch(
      setRtcStatus({
        userId,
        rtcStatus,
      })
    );
  };

  const handleUserPublishScreen: IEngineEvents['onUserPublishScreen'] = async (e) => {
    const { userId } = e;
    await RtcClient.subscribeScreen(userId);

    updateRtcStatus(userId, { screen: true });
  };

  const handleUserUnpublishScreen: IEngineEvents['onUserUnpublishScreen'] = async (e) => {
    // 不需要调用 unsubscribeScreen API, 因为SDK内部会自动清除远端屏幕流的订阅
    const { userId } = e;
    updateRtcStatus(userId, { screen: false });
  };

  const handleUserPublishStream: IEngineEvents['onUserPublishStream'] = async (e) => {
    const { userId, mediaType } = e;

    if (mediaType === MediaType.VIDEO || mediaType === MediaType.AUDIO_AND_VIDEO) {
      updateRtcStatus(userId, { stream: true });
    }
  };

  const handleUserUnpublishStream: IEngineEvents['onUserUnpublishStream'] = async (e) => {
    const { userId, mediaType } = e;
    if (mediaType === MediaType.VIDEO || mediaType === MediaType.AUDIO_AND_VIDEO) {
      updateRtcStatus(userId, { stream: false });
    }
  };

  const handleTrackEnd: IEngineEvents['onTrackEnded'] = async (e) => {
    const { kind, isScreen } = e;

    if (isScreen && kind === 'video') {
      await RtcClient.stopScreenCapture();
      await rtsApi.stopShare();
    }
  };

  const navigate = useNavigate();

  const handleError: IEngineEvents['onError'] = async (e) => {
    const { errorCode } = e;
    console.error('handle rtc error', e);
    if (
      errorCode === VERTC.ErrorCode.DUPLICATE_LOGIN ||
      errorCode === VERTC.ErrorCode.RTM_DUPLICATE_LOGIN
    ) {
      Message.error('相同ID用户已登录，您已被强制下线!');
      dispatch(logout());
      await leaveRoom();
      navigate('/login');
    }
  };

  const handleUserJoined: IEngineEvents['onUserJoined'] = async (e) => {
    const {
      userInfo: { userId },
    } = e;

    updateRtcStatus(userId, { joined: true });
  };

  const handleUserLeave: IEngineEvents['onUserLeave'] = async (e) => {
    const {
      userInfo: { userId },
    } = e;
    updateRtcStatus(userId, { joined: false });
  };

  useEffect(() => {
    if (!hasEngine) {
      return;
    }
    RtcClient.engine.on(VERTC.events.onUserPublishScreen, handleUserPublishScreen);
    RtcClient.engine.on(VERTC.events.onUserUnpublishScreen, handleUserUnpublishScreen);
    RtcClient.engine.on(VERTC.events.onUserPublishStream, handleUserPublishStream);
    RtcClient.engine.on(VERTC.events.onUserUnpublishStream, handleUserUnpublishStream);
    RtcClient.engine.on(VERTC.events.onTrackEnded, handleTrackEnd);
    RtcClient.engine.on(VERTC.events.onError, handleError);
    RtcClient.engine.on(VERTC.events.onUserJoined, handleUserJoined);
    RtcClient.engine.on(VERTC.events.onUserLeave, handleUserLeave);

    return () => {
      RtcClient.engine.off(VERTC.events.onUserPublishScreen, handleUserPublishScreen);
      RtcClient.engine.off(VERTC.events.onUserUnpublishScreen, handleUserUnpublishScreen);
      RtcClient.engine.off(VERTC.events.onUserPublishStream, handleUserPublishStream);
      RtcClient.engine.off(VERTC.events.onUserUnpublishStream, handleUserUnpublishStream);
      RtcClient.engine.off(VERTC.events.onTrackEnded, handleTrackEnd);
      RtcClient.engine.off(VERTC.events.onError, handleError);
      RtcClient.engine.off(VERTC.events.onUserJoined, handleUserJoined);
      RtcClient.engine.off(VERTC.events.onUserLeave, handleUserLeave);
    };
  }, [hasEngine]);
};

export default useRTCEventListener;
