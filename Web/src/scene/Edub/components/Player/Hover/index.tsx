import MicrophoneOffIcon from '@/assets/images/MicrophoneOff.svg';
import MicrophoneOnIcon from '@/assets/images/MicrophoneOn.svg';
import CameraOffIcon from '@/assets/images/CameraOff.svg';
import CameraOnIcon from '@/assets/images/CameraOn.svg';
import ShareIcon from '@/assets/images/Share.svg';
import NoShareIcon from '@/assets/images/NoShare.svg';
import UnlinkIcon from '@/assets/images/Unlink.svg';
import { RtcClient } from '@/core/rtc';
import { DeviceState, BaseUser, Permission, UserRole } from '@/types/state';
import { Icon } from '@/components';
import { DeviceType } from '@/components/DeviceButton/utils';
import { useHandleDevice } from '@/scene/Edub/hooks';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';

import styles from './index.module.less';
import { useDispatch } from '@/store';
import { setSharePermit } from '@/store/slices/edubRoom';

interface HoverProps {
  user?: BaseUser;
  localUser?: BaseUser;
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
        <span>{user?.mic === DeviceState.Closed ? '打开' : '关闭'}</span>
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
        <span>{user?.camera === DeviceState.Closed ? '打开' : '关闭'}</span>
      </div>

      {localIsHost && (
        <div className={styles.opItem} onClick={() => handleShare()}>
          <span className={styles.opIcon}>
            <Icon
              src={user?.share_permission === Permission.NoPermission ? NoShareIcon : ShareIcon}
              className={`${styles.svgIcon}`}
            />
          </span>

          <span>{user?.share_permission === Permission.NoPermission ? '授权白板' : '取消白板'}</span>
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
