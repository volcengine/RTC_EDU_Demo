import { Popover } from 'antd';
import { useState, useMemo } from 'react';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';
import { MenuIconButton, PopoverContent, SettingButton } from '@/components';
import { LinkStatus, localUserLeaveRoom, setLinkStatus } from '@/store/slices/edubRoom';
import useLeaveRoom from '@/core/hooks/useLeaveRoom';
import StopIcon from '@/assets/images/Stop.svg';
import styles from './index.module.less';
import { useDispatch, useSelector } from '@/store';
import { JoinStatus, setJoining } from '@/store/slices/scene';

export default function () {
  const room = useSelector((state) => state.edubRoom);
  const dispatch = useDispatch();
  const [popOpen, setPopOpen] = useState(false);
  const remoteUserNumber = useMemo(
    () => room.remoteUsers.length,
    [room.remoteUsers]
  );

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => {
      dispatch(setLinkStatus(LinkStatus.NotLink));
      dispatch(localUserLeaveRoom());
    },
  });

  const handleStop = async () => {
    await rtsApi.leaveRoom();
    await leaveRoom();
    dispatch(setJoining(JoinStatus.NotJoined));
  };

  return (
    <div className={styles.headerRight}>
      <SettingButton />
      <Popover
        open={popOpen}
        placement="bottomLeft"
        overlayClassName={styles.stopWrapper}
        content={
          <PopoverContent
            onOk={() => {
              setPopOpen(false);
              handleStop();
            }}
            onCancel={() => {
              setPopOpen(false);
            }}
            titleText="是否离开房间"
          />
        }
      >
        <MenuIconButton
          iconClassName={styles.menuCloseIcon}
          className={styles.menuButton}
          onClick={() => {
            if (remoteUserNumber > 1) {
              setPopOpen(true);
            } else {
              handleStop();
            }
          }}
          icon={StopIcon}
        />
      </Popover>
    </div>
  );
}
