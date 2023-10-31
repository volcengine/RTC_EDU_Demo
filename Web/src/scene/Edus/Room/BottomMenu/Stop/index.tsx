import { Popover } from 'antd';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '@/store';
import StopIcon from '@/assets/images/Stop.svg';
import { MenuIconButton } from '@/components';
import { ShareStatus, ShareType, UserRole } from '@/types/state';
import useLeaveRoom from '@/core/hooks/useLeaveRoom';

import * as rtsApi from '@/scene/Edus/apis/rtsApi';
import { localUserLeaveRoom } from '@/store/slices/edusRoom';

import styles from './index.module.less';

function Stop() {
  const [popOpen, setPopOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => {
      dispatch(localUserLeaveRoom());
    },
  });

  const room = useSelector((state) => state.edusRoom);

  const isHost = room.localUser.user_role === UserRole.Host;

  const handleStop = async () => {
    setPopOpen(false);

    if (
      room.share_user_id === room.localUser.user_id &&
      room.share_status === ShareStatus.Sharing &&
      room.share_type === ShareType.Screen
    ) {
      await rtsApi.finishShare();
    }

    await rtsApi.leaveRoom();

    await leaveRoom();
  };

  const handleEndEdusRoom = async () => {
    setPopOpen(false);
    await rtsApi.finishRoom();
    await leaveRoom();
  };

  const handleStopClick = (e: MouseEvent<HTMLDivElement>) => {
    if (room?.remoteUsers?.length) {
      setPopOpen(!popOpen);
      return;
    }

    if (isHost) {
      handleEndEdusRoom();
    } else {
      handleStop();
    }
  };

  useEffect(() => {
    const hidePop = (e: Event) => {
      if (!btnRef.current?.contains(e.target as unknown as HTMLElement)) {
        setPopOpen(false);
      }
    };

    window.addEventListener('click', hidePop);
    return () => {
      window.removeEventListener('click', hidePop);
    };
  }, [btnRef]);

  return (
    <div className={styles.menuRight} ref={btnRef}>
      <Popover
        content={
          <div className={styles.leaveBtns}>
            {isHost && (
              <button className={styles.leaveConfim} onClick={handleEndEdusRoom}>
                结束课堂
              </button>
            )}
            {isHost ? (
              <button className={styles.leaveTemporary} onClick={handleStop}>
                暂时离开
              </button>
            ) : (
              <button className={styles.leaveConfim} onClick={handleStop}>
                暂时离开
              </button>
            )}
          </div>
        }
        trigger="click"
        open={popOpen}
      >
        <MenuIconButton
          iconClassName={styles.menuCloseIcon}
          className={styles.menuButton}
          onClick={handleStopClick}
          text="结束通话"
          icon={StopIcon}
        />
      </Popover>
    </div>
  );
}

export default Stop;
