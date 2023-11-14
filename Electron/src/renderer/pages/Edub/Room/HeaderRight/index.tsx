import * as rtsApi from '@src/pages/Edub/apis/rtsApi';
import { Popover } from 'antd';

import { MenuIconButton, PopoverContent, SettingButton } from '@src/components';
import { LinkStatus, localUserLeaveRoom, setLinkStatus } from '@src/store/slices/edubRoom';

import StopIcon from '@assets/images/EndRed.svg';

import styles from './index.module.less';
import { useDispatch } from '@src/store';
import React, { useState } from 'react';
import useLeaveRoom from '@/renderer/core/rtcHooks/useLeaveRoom';
import classNames from 'classnames';

export default function () {
  const dispatch = useDispatch();
  const [popOpen, setPopOpen] = useState(false);

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => {
      dispatch(setLinkStatus(LinkStatus.NotLink));
      dispatch(localUserLeaveRoom());
    },
  });

  const handleStop = async () => {
    await rtsApi.edubLeaveRoom();

    await leaveRoom();
  };

  return (
    <div className={styles.headerRight}>
      <SettingButton className={classNames(styles.menuButton, styles.settingButton)} text="" />

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
            setPopOpen(true);
          }}
          icon={StopIcon}
        />
      </Popover>
    </div>
  );
}
