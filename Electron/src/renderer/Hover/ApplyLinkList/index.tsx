import React from 'react';
import styles from './index.less';
import Icon from '@components/Icon';
import { IconButton } from '@/renderer/components';
import AllowIcon from '@assets/images/edub/Allow.svg';
import RejectIcon from '@assets/images/edub/Reject.svg';

import { ipcRenderer, remote } from 'electron';
import { ProcessEvent, WindowType } from '@/types';
import useSceneRoom from '@/renderer/core/hooks/useSceneRoom';
import { DeviceState } from '@/renderer/types/state';
import Close from '@assets/images/Close.svg';
import { EdubRoomState } from '@/renderer/store/slices/edubRoom';
import { useSelector } from '@/renderer/store';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

const ApplyLinkList = () => {
  const room: EdubRoomState = useSelector((state) => state.edubRoom);

  console.log('room', room);

  const handleApply = (user: any, state: DeviceState) => {
    ipcRenderer.sendTo(mainWindowId, 'handleApply', user, state);
  };

  const hideWindow = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.APPLY_LINK);
  };

  return (
    <div className={styles.linkList}>
      <div className={styles.header}>
        <div className={styles.memberNum}>
          连麦申请列表({room?.linkmic_apply_list?.length || 0})
        </div>
        <div onClick={hideWindow} className={styles.closeIcon}>
          <IconButton src={Close} />
        </div>
      </div>
      <ul className={styles.users}>
        {room?.linkmic_apply_list?.map((user) => {
          return (
            <li key={user.user_id} className={styles.applyUser}>
              <div>{user.user_name}</div>
              <div>
                <span
                  onClick={() => {
                    handleApply(user, DeviceState.Open);
                  }}
                >
                  <Icon src={AllowIcon} className={styles.iconAllow} />
                </span>
                <span
                  onClick={() => {
                    handleApply(user, DeviceState.Closed);
                  }}
                >
                  <Icon src={RejectIcon} />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ApplyLinkList;
