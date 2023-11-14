import { insertRtcRoom, removeRtcRoom } from '@src/store/modules/rtcRoom';
import { useDispatch, useSelector } from '@src/store';
import { message as Message } from 'antd';
import { RtcClient } from '@src/core/rtc';
import { useEffect } from 'react';
import {
  ConnectionState,
  MediaStreamType,
  RenderMode,
} from '@volcengine/vertc-electron-sdk/js/types';
import {
  localUserJoinRoom,
  localUserLeaveRoom,
  setRtcStatus,
} from '@/renderer/store/slices/edubRoom';
import useDuplicateLogin from '@/renderer/core/hooks/useDuplicateLogin';
import { isRtsError } from '@/renderer/utils/rtsUtils';
import useLeaveRoom from '@/renderer/core/rtcHooks/useLeaveRoom';
import * as rtsApi from '../apis/rtsApi';

const useRTCEventListener = () => {
  const room = useSelector((state) => state.edubRoom);

  const dispatch = useDispatch();

  const logout = useDuplicateLogin();

  const handleUserJoin = (user_info: any) => {
    console.log('rtc callback onUserJoin', user_info);

    dispatch(insertRtcRoom(user_info.uid));
  };

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const handleUserLeave = (userId: string) => {
    console.log('rtc callback onUserLeave', userId);
    // TODO: 杀进程时
    dispatch(removeRtcRoom(userId));
  };

  const handleUserPublishStream = (userId: string, type: MediaStreamType) => {
    console.log('handleUserPublishStream', userId, type);
    // if (
    //   type === MediaStreamType.kMediaStreamTypeVideo ||
    //   type === MediaStreamType.kMediaStreamTypeBoth
    // ) {
    //   dispatch(insertRtcRoom(userId));
    // }
  };

  const handleUserUnPublishStream = (userId: string, type: MediaStreamType) => {
    console.log('handleUserUnPublishStream', userId, type);

    // if (
    //   type === MediaStreamType.kMediaStreamTypeVideo ||
    //   type === MediaStreamType.kMediaStreamTypeBoth
    // ) {
    //   dispatch(removeRtcRoom(userId));
    // }
  };

  const handleUserPublishScreen = (userId: string, type: MediaStreamType) => {
    console.log('handleUserPublishScreen', userId, type);
    // if (room.share_user_id === userId && screenRef.current) {
    //   RtcClient.engine?.setupRemoteScreen(room.share_user_id!, room.room_id!, screenRef.current, {
    //     renderMode: RenderMode.FIT,
    //     mirror: false,
    //   });
    // }

    dispatch(
      setRtcStatus({
        userId,
        rtcStatus: {
          screen: true,
        },
      })
    );
  };

  const handleUserUnpublishScreen = (userId: string, type: MediaStreamType) => {
    console.log('handleUserUnpublishScreen', userId, type);
    dispatch(
      setRtcStatus({
        userId,
        rtcStatus: {
          screen: false,
        },
      })
    );
  };

  const handleLogout = () => {
    console.log('-----rtc error 重新登了.................');
    Message.error('相同ID用户已登录，您已被强制下线!');

    logout();
    dispatch(localUserLeaveRoom());
  };
  const handleLoginResult = async () => {
    console.log('handleLoginResult rts 登录成功');
    try {
      const syncRes = await rtsApi.reSync();
      console.log(syncRes);
      if (!isRtsError(syncRes)) {
        const { code, response } = syncRes;
        if (code === 200) {
          dispatch(localUserJoinRoom(response));
        } else {
          leaveRoom();
        }
      }
    } catch (err) {
      console.error('error:', err);
      leaveRoom();
    }
  };

  useEffect(() => {
    RtcClient.room?.on('onUserJoined', handleUserJoin);
    RtcClient.room?.on('onUserLeave', handleUserLeave);
    RtcClient.room?.on('onUserPublishStream', handleUserPublishStream);
    RtcClient.room?.on('onUserUnpublishStream', handleUserUnPublishStream);
    RtcClient.room?.on('onUserPublishScreen', handleUserPublishScreen);
    RtcClient.room?.on('onUserUnpublishScreen', handleUserUnpublishScreen);
    // RtcClient.engine?.on('onLogout', handleLogout);
    RtcClient.engine?.on('onLogout', handleLogout);
    RtcClient.engine?.on('onLoginResult', handleLoginResult);

    return () => {
      RtcClient.room?.removeAllListeners('onUserJoined');
      RtcClient.room?.removeAllListeners('onUserLeave');
      RtcClient.room?.removeAllListeners('onUserPublishStream');
      RtcClient.room?.removeAllListeners('onUserUnpublishStream');
      RtcClient.room?.removeAllListeners('onUserPublishScreen');
      RtcClient.room?.removeAllListeners('onUserUnpublishScreen');
      RtcClient.engine?.removeAllListeners('onLogout');
      RtcClient.engine?.removeAllListeners('onLoginResult');
    };
  }, [room]);
};

export default useRTCEventListener;
