import { useEffect, useMemo } from 'react';
import { useSelector } from '@/store';

import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';

import styles from './index.module.less';
import PlayerArea from '../components/PlayerArea';

export default function () {
  const room = useSelector((state) => state.meetingRoom);

  const playersAreaOpen = useSelector((state) => state.ui.playersAreaOpen);

  const isLocalShare = useMemo(() => {
    return room.share_user_id === room.localUser?.user_id;
  }, [room.share_user_id, room.localUser]);

  const domId = useMemo(() => {
    return `remote-${room.share_user_id}-1`;
  }, [room.share_user_id]);

  const shareUser = useMemo(() => {
    return room.remoteUsers.find((user) => user.user_id === room.share_user_id);
  }, [room]);

  const handleStopShare = async () => {
    await RtcClient.stopScreenCapture();
    await rtsApi.finishShare();
  };

  useEffect(() => {
    if (domId && !isLocalShare && room.share_user_id) {
      RtcClient.setScreenPlayer(room.share_user_id, domId);
    }

    return () => {
      if (room.share_user_id) {
        RtcClient.setScreenPlayer(room.share_user_id, undefined);
      }
    };
  }, [domId, isLocalShare, shareUser?.rtcStatus?.screen]);

  return (
    <div className={styles.shareViewWrapper}>
      <PlayerArea />
      <div
        className={styles.shareWrapper}
        style={{
          height: `calc(100% - ${playersAreaOpen ? 114 : 32}px )`,
        }}
      >
        {isLocalShare && (
          <>
            <div>你正在共享屏幕</div>
            <div className={styles.stopButton} onClick={handleStopShare}>
              停止共享
            </div>
          </>
        )}
        {!isLocalShare && <div id={domId} className={styles.shareDom} />}
      </div>
    </div>
  );
}
