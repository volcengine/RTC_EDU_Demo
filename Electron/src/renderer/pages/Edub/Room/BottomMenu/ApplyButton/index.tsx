import { useState } from 'react';
import { useSelector } from '@src/store';

import User from '@assets/images/device/Link.svg';
// import UserOpen from '@/assets/images/UserOpen.svg';
import CloseIcon from '@assets/images/Close.svg';
import AllowIcon from '@assets/images/edub/Allow.svg';
import RejectIcon from '@assets/images/edub/Reject.svg';

import { Icon, MenuIconButton } from '@src/components';
import styles from './index.module.less';
import { DeviceState } from '@src/types/state';
import * as rtsApi from '@src/pages/Edub/apis/rtsApi';
import React from 'react';
import { message } from 'antd';

export default function () {
  const room = useSelector((state) => state.edubRoom);
  const [showOptions, setShowOptions] = useState(false);

  const handleClick = () => {
    setShowOptions(true);
  };

  const handleApply = async (user: { user_id: string }, permit: DeviceState) => {
    if ((room.linkmic_user_list?.length || 0) >= 8) {
      message.warn('最多支持8人连麦');
      return;
    }

    await rtsApi.edubLinkmicPermit({
      apply_user_id: user.user_id,
      permit,
    });
  };

  return (
    <div className={styles.menuButton}>
      <MenuIconButton
        iconClassName={`${
          room.linkmic_apply_list?.length > 0 ? styles.countIcon : styles.normalIcon
        }`}
        onClick={handleClick}
        text="连麦申请"
        icon={User}
      />

      <div className={styles.userCount}>{room.linkmic_apply_list?.length || 0}</div>
      <div
        className={styles.applyUserList}
        onMouseLeave={() => {
          setShowOptions(false);
        }}
        style={{
          display: showOptions ? 'block' : 'none',
        }}
      >
        <div className={styles.applyLinkTitle}>
          <span>连麦申请({room.linkmic_apply_list?.length || 0})</span>
          <span
            onClick={() => {
              setShowOptions(false);
            }}
          >
            <Icon src={CloseIcon} className={styles.iconClose} />
          </span>
        </div>
        <ul className={styles.users}>
          {room.linkmic_apply_list?.map((user) => {
            return (
              <li key={user.user_id} className={styles.applyUser}>
                <div className={styles.user_name}>{user.user_name}</div>
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
    </div>
  );
}
