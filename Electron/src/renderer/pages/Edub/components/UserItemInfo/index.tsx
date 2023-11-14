import ShareIcon from '@assets/images/ScreenShareGreen.svg';
import BoardIcon from '@assets/images/WhiteBoardShareGreen.svg';
import MicrophoneOffIcon from '@assets/images/device/MicOff.svg';
import CameraOffIcon from '@assets/images/device/CameraOff.svg';
import MicrophoneOnIcon from '@assets/images/device/MicOn.svg';
import CameraOnIcon from '@assets/images/device/CameraOn.svg';

import { Icon } from '@src/components';
import { ApplyType, DeviceState, ShareStatus, ShareType, BaseUser } from '@src/types/state';

import styles from './index.module.less';
import { getMaxWidth } from './util';
import React from 'react';

export type ItemUserInfo = Partial<
  Pick<BaseUser, 'mic' | 'camera' | 'share_status' | 'user_name' | 'user_id'>
> & {
  isLocal?: boolean;
  applying?: ApplyType[];
};

export interface UserItemInfoProps {
  user: ItemUserInfo;

  room: {
    share_type: ShareType;
    host_user_id: string;
  };
}

export default function (props: UserItemInfoProps) {
  const { user, room } = props;

  return (
    <div className={styles.userInfoWrapper}>
      <div className={styles.userStatus}>
        {user?.user_id && user?.user_id === room.host_user_id && (
          <span className={styles.hostLabel}>老师</span>
        )}
        <span className={styles.userName}>
          <span
            className={styles.userNameText}
            style={{
              maxWidth: getMaxWidth(user, room),
            }}
          >
            {user?.user_name}
          </span>

          {user?.isLocal && '(我)'}
        </span>
        {user?.share_status === ShareStatus.Sharing && (
          <Icon
            src={room.share_type === ShareType.Board ? BoardIcon : ShareIcon}
            className={styles.sharingIcon}
          />
        )}
      </div>
      <div className={styles.userOperation}>
        {/* <span className={styles.opIcon}>
          <Icon
            src={user?.mic === DeviceState.Closed ? MicrophoneOffIcon : MicrophoneOnIcon}
            className={`${styles.mediaIcon}`}
          />
        </span>

        <span className={styles.opIcon}>
          <Icon
            src={user?.camera === DeviceState.Closed ? CameraOffIcon : CameraOnIcon}
            className={`${styles.mediaIcon}`}
          />
        </span> */}
      </div>
    </div>
  );
}
