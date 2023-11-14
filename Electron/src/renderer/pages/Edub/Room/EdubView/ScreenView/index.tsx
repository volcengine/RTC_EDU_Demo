import { useEffect, useMemo, useRef } from 'react';

import { RtcClient } from '@src/core/rtc';

import styles from './index.module.less';
import { BaseUser, ShareType, UserRole } from '@src/types/state';
import * as rtsApi from '@src/pages/Edub/apis/rtsApi';
import React from 'react';
import { MediaStreamType, RenderMode } from '@volcengine/vertc-electron-sdk/js/types';
import { useSelector } from '@/renderer/store';

export default function () {
  const room = useSelector((state) => state.edubRoom);

  const screenRef = useRef<HTMLDivElement | null>(null);

  const domId = useMemo(() => {
    return `remote-${room.share_user_id}-1`;
  }, [room]);

  const handleUserPublishScreen = (userId: string, type: MediaStreamType) => {
    console.log('handleUserPublishScreen', userId, type);
    if (room.share_user_id === userId && screenRef.current) {
      RtcClient.engine?.setupRemoteScreen(room.share_user_id!, room.room_id!, screenRef.current, {
        renderMode: RenderMode.FIT,
        mirror: false,
      });
    }
  };

  useEffect(() => {
    if (room.share_type === ShareType.Screen) {
      if (domId && room.share_user_id && screenRef.current) {
        RtcClient.room?.subscribeScreen(room.share_user_id, MediaStreamType.kMediaStreamTypeBoth);
        RtcClient.engine?.setupRemoteScreen(room.share_user_id!, room.room_id!, screenRef.current, {
          renderMode: RenderMode.FIT,
          mirror: false,
        });
      }
    }

    return () => {
      if (room.share_user_id) {
        RtcClient.room?.unsubscribeScreen(room.share_user_id, MediaStreamType.kMediaStreamTypeBoth);
        RtcClient.engine?.removeRemoteScreen(room.share_user_id, room.room_id!);
      }
    };
  }, [domId, room.share_user_id, room.share_type, room.teacher?.rtcStatus?.screen]);

  useEffect(() => {
    RtcClient.room?.on('onUserPublishScreen', handleUserPublishScreen);

    return () => {
      RtcClient.room?.removeAllListeners('onUserUnpublishScreen');
    };
  }, []);

  return (
    <div className={styles.shareViewWrapper}>
      <div className={styles.shareWrapper}>
        <div id={domId} className={styles.shareDom} ref={screenRef} />
      </div>
    </div>
  );
}
