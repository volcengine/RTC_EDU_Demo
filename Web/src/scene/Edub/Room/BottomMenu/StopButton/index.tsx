import { Popover } from 'antd';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '@/store';
import StopIcon from '@/assets/images/Stop.svg';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';

import useLeaveRoom from '@/core/hooks/useLeaveRoom';

import { MenuIconButton } from '@/components';
import styles from './index.module.less';
import { localUserLeaveRoom } from '@/store/slices/edubRoom';

function Stop() {
  const [popOpen, setPopOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const room = useSelector((state) => state.edubRoom);

  const isHost = room.localUser.user_id === room.host_user_id;

  const handleLeaveRoom = () => {
    dispatch(localUserLeaveRoom());
  };

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: handleLeaveRoom,
  });

  const handleLeave = async () => {
    setPopOpen(false);

    // 学生没有结束共享的权限
    // 老师暂时离房不会结束共享

    // if (
    //   room.share_user_id === room.localUser.user_id &&
    //   room.share_status === ShareStatus.Sharing &&
    //   room.share_type === ShareType.Board
    // ) {
    //   await edubAPI.edubStopShare();
    // }

    await rtsApi.edubLeaveRoom();

    await leaveRoom();
  };

  const handleEdubRoom = async () => {
    setPopOpen(false);
    await rtsApi.edubFinishRoom();
    await leaveRoom();
  };

  const handleStopClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isHost) {
      setPopOpen(!popOpen);
      return;
    }

    handleLeave();
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
              <button className={styles.leaveConfim} onClick={handleEdubRoom}>
                结束课堂
              </button>
            )}
            {isHost ? (
              <button className={styles.leaveTemporary} onClick={handleLeave}>
                暂时离开
              </button>
            ) : (
              <button className={styles.leaveConfim} onClick={handleLeave}>
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
          text="离开"
          icon={StopIcon}
        />
      </Popover>
    </div>
  );
}

export default Stop;
