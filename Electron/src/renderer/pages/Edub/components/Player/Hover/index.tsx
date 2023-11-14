import MicrophoneOffIcon from '@assets/images/device/MicOff.svg';
import MicrophoneOnIcon from '@assets/images/device/MicOn.svg';
import CameraOffIcon from '@assets/images/device/CameraOff.svg';
import CameraOnIcon from '@assets/images/device/CameraOn.svg';
import WhiteBoardShareGreen from '@assets/images/WhiteBoardShareGreen.svg';
import WhiteBoardShareRed from '@assets/images/WhiteBoardShareRed.svg';
import UnlinkIcon from '@assets/images/device/Unlink.svg';
import { RtcClient } from '@src/core/rtc';
import { DeviceState, BaseUser, Permission, UserRole } from '@src/types/state';
import { Icon } from '@src/components';
import * as rtsApi from '@src/pages/Edub/apis/rtsApi';

import styles from './index.module.less';
import { useHandleDevice } from '../../../hooks';
import React from 'react';
import { DeviceType } from '@/renderer/components/DeviceButton/utils';
import { useDispatch } from '@/renderer/store';
import { setSharePermit } from '@/renderer/store/slices/edubRoom';

interface HoverProps {
  user?: Partial<BaseUser>;
  localUser?: Partial<BaseUser>;
}

export default function (props: HoverProps) {
  const { user, localUser } = props;

  const handleDevice = useHandleDevice(user);

  const dispatch = useDispatch();

  const handleUnLink = async () => {
    if (localUser?.user_role !== UserRole.Host) {
      // 学生主动下麦
      await rtsApi.edubLinkmicLeave();

      RtcClient.stopAudioCapture();
      RtcClient.stopVideoCapture();
      // todo: 待确认: 收回白板权限
    } else {
      // 老师踢人
      await rtsApi.edubLinkmicKick({
        kick_user_id: user?.user_id!,
      });
    }
  };

  const handleShare = async () => {
    await rtsApi.edubSharePermissionPermit({
      apply_user_id: user?.user_id!,
      permit:
        user?.share_permission === Permission.NoPermission ? DeviceState.Open : DeviceState.Closed,
    });

    dispatch(
      setSharePermit({
        user_id: user?.user_id!,
        permit:
          user?.share_permission === Permission.NoPermission
            ? Permission.HasPermission
            : Permission.NoPermission,
      })
    );
  };

  const localIsHost = localUser?.user_role === UserRole.Host;

  return (
    <div className={`${styles.userOp} ${localIsHost ? styles.localIsHost : ''}`}>
      <div className={styles.opItem} onClick={() => handleDevice(DeviceType.Microphone)}>
        <span className={styles.opIcon}>
          <Icon
            className={`${styles.svgIcon} ${
              user?.mic === DeviceState.Closed ? styles.closedIcon : ''
            }`}
            src={user?.mic === DeviceState.Closed ? MicrophoneOffIcon : MicrophoneOnIcon}
          />
        </span>
        <span>{user?.mic === DeviceState.Closed ? '关闭' : '打开'}</span>
      </div>

      <div className={styles.opItem} onClick={() => handleDevice(DeviceType.Camera)}>
        <span className={styles.opIcon}>
          <Icon
            className={`${styles.svgIcon} ${
              user?.camera === DeviceState.Closed ? styles.closedIcon : ''
            }`}
            src={user?.camera === DeviceState.Closed ? CameraOffIcon : CameraOnIcon}
          />
        </span>
        <span>{user?.camera === DeviceState.Closed ? '关闭' : '打开'}</span>
      </div>

      {localIsHost && (
        <div className={styles.opItem} onClick={() => handleShare()}>
          <span className={styles.opIcon}>
            {user?.share_permission === Permission.NoPermission ? (
              <Icon
                src={WhiteBoardShareGreen}
                className={`${styles.svgIcon} ${styles.whiteboardSvgIcon}`}
              />
            ) : (
              <Icon
                src={WhiteBoardShareRed}
                className={`${styles.svgIcon} ${styles.whiteboardSvgIcon}`}
              />
            )}
          </span>

          <span>
            {user?.share_permission === Permission.NoPermission ? '授权白板' : '取消白板'}
          </span>
        </div>
      )}

      <div className={styles.opItem} onClick={handleUnLink}>
        <span className={`${styles.opIcon}`}>
          <Icon src={UnlinkIcon} className={`${styles.svgIcon} ${styles.UnlinkIcon}`} />
        </span>

        <span>下麦</span>
      </div>
    </div>
  );
}
