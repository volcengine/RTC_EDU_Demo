import { useEffect, useMemo } from 'react';

import { RtcClient } from '@/core/rtc';

import styles from './index.module.less';
import { BaseUser, UserRole } from '@/types/state';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';
import { EdubRoomState } from '@/store/slices/edubRoom';

interface ScreenViewProps {
  localUser?: Partial<BaseUser>;
  user?: EdubRoomState['teacher'];
}

export default function (props: ScreenViewProps) {
  const { localUser, user } = props;

  const isLocalShare = useMemo(() => {
    return localUser?.user_role === UserRole.Host;
  }, [localUser]);

  const domId = useMemo(() => {
    return `remote-${user?.user_id}-1`;
  }, [user?.user_id]);

  const handleStopShare = async () => {
    await RtcClient.stopScreenCapture();
    await rtsApi.stopShare();
  };

  useEffect(() => {
    if (domId && !isLocalShare && user?.user_id && user?.rtcStatus?.screen) {
      RtcClient.setScreenPlayer(user?.user_id, domId);
    }

    return () => {
      if (user?.user_id && !user?.rtcStatus?.screen) {
        RtcClient.setScreenPlayer(user?.user_id, undefined);
      }
    };
  }, [domId, isLocalShare, user?.user_id, user?.rtcStatus?.screen]);

  return (
    <div className={styles.shareViewWrapper}>
      <div className={styles.shareWrapper}>
        {isLocalShare && (
          <div className={styles.stopButton} onClick={handleStopShare}>
            停止屏幕共享
          </div>
        )}
        {!isLocalShare && <div id={domId} className={styles.shareDom} />}
      </div>
    </div>
  );
}
