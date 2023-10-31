import { message, Tooltip } from 'antd';
import BoardIcon from '@/assets/images/Board.svg';
import ShareIcon from '@/assets/images/Share.svg';
import MicrophoneOffIcon from '@/assets/newImg/MicrophoneOff.svg';
import MicrophoneOn from '@/assets/images/MicrophoneOn.svg';
import CameraOffIcon from '@/assets/images/CameraOff.svg';
import CameraOnIcon from '@/assets/images/CameraOn.svg';
import HasSharePermitIcon from '@/assets/images/HasSharePermit.svg';
import NoSharePermitIcon from '@/assets/images/NoSharePermit.svg';
import HandsUpIcon from '@/assets/images/HandsUp.svg';
import { Icon } from '@/components';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';
import { RtcClient } from '@/core/rtc';

import { setToast } from '@/store/slices/ui';
import { useDispatch, useSelector } from '@/store';
import {
  ApplyType,
  BaseUser,
  DeviceState,
  Permission,
  ShareStatus,
  ShareType,
  UserRole,
} from '@/types/state';
import {
  localUserChangeCamera,
  localUserChangeMic,
  setSharePermit,
} from '@/store/slices/meetingRoom';

import { getMaxWidth } from './util';
import styles from './index.module.less';
import { ToastType } from '@/scene/Meeting/Room/ToastMessage/types';

interface IProps {
  user: Partial<
    BaseUser & {
      isLocal?: boolean;
      applying?: ApplyType[];
    }
  >;
}

export default function (props: IProps) {
  const { user } = props;
  const dispatch = useDispatch();

  const room = useSelector((state) => state.meetingRoom);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const isHost = room.localUser.user_role === UserRole.Host;

  const handleMic = async () => {
    if (!isHost) {
      return;
    }

    if (!user?.isLocal) {
      rtsApi.operateOtherMic({
        operate_user_id: user?.user_id!,
        operate: user?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
      });
    } else {
      const res = await rtsApi.operateSelfMic({
        operate: user?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
      });

      if (res === null) {
        if (user?.mic === DeviceState.Closed) {
          if (!devicePermissions.audio) {
            message.error('未获得麦克风权限!');
            return;
          }

          RtcClient.startAudioCapture();
          dispatch(localUserChangeMic(DeviceState.Open));
        }

        if (user?.mic === DeviceState.Open) {
          RtcClient.stopAudioCapture();
          dispatch(localUserChangeMic(DeviceState.Closed));
        }
      } else {
        message.error(res.message);
      }
    }
  };

  const handleCamera = async () => {
    if (!isHost) {
      return;
    }
    if (!user?.isLocal) {
      rtsApi.operateOtherCamera({
        operate_user_id: user?.user_id!,
        operate: user?.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
      });
    } else {
      const res = await rtsApi.operateSelfCamera({
        operate: user?.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open,
      });

      if (res === null) {
        if (user?.camera === DeviceState.Closed) {
          if (!devicePermissions.audio) {
            message.error('未获得摄像头权限!');
            return;
          }

          RtcClient.startVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Open));
        }

        if (user?.camera === DeviceState.Open) {
          RtcClient.stopVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Closed));
        }
      } else {
        message.error(res.message);
      }
    }
  };

  const handleUserSharePerm = async () => {
    if (!isHost) {
      return;
    }

    if (!user?.isLocal) {
      const permit =
        user?.share_permission === Permission.HasPermission
          ? Permission.NoPermission
          : Permission.HasPermission;

      await rtsApi.operateOtherSharePermission({
        operate_user_id: user?.user_id!,
        operate: permit,
      });

      dispatch(
        setSharePermit({
          permit,
          isLocal: false,
          userId: user?.user_id!,
        })
      );
    }
  };

  const handleHands = async () => {
    const applyings = [...(user?.applying || [])];
    const applyType = applyings.shift();

    if (applyType === ApplyType.Mic) {
      dispatch(
        setToast({
          open: true,
          title: `${user?.user_name}正在申请发言`,
          type: ToastType.ApplyMic,
          other: {
            user,
            text: '同意',
          },
        })
      );
    }

    if (applyType === ApplyType.Screen) {
      dispatch(
        setToast({
          open: true,
          title: `${user?.user_name}正在申请共享`,
          type: ToastType.ApplyShare,
          other: {
            user,
            text: '同意',
          },
        })
      );
    }
  };

  return (
    <div className={styles.userInfoWrapper}>
      <div className={styles.userStatus}>
        {user?.user_id && user?.user_id === room.host_user_id && (
          <span className={styles.hostLabel}>主持人</span>
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
        {(user?.applying?.length || 0) > 0 && (
          <span className={styles.opIcon} onClick={handleHands}>
            <Icon src={HandsUpIcon} className={styles.handsup} />
          </span>
        )}

        <span className={styles.opIcon} onClick={handleMic}>
          <Icon
            src={user?.mic === DeviceState.Closed ? MicrophoneOffIcon : MicrophoneOn}
            className={`${styles.mediaIcon} ${styles.newIcon} ${
              user?.mic === DeviceState.Closed && styles.mediaClosed
            } ${
              user?.mic === DeviceState.Open &&
              Boolean(user?.audioPropertiesInfo?.linearVolume) &&
              styles.speakingIcon
            }`}
          />
        </span>

        <span className={styles.opIcon} onClick={handleCamera}>
          <Icon
            src={user?.camera === DeviceState.Closed ? CameraOffIcon : CameraOnIcon}
            className={`${styles.mediaIcon} ${
              user?.camera === DeviceState.Closed && styles.mediaClosed
            }`}
          />
        </span>

        <Tooltip
          title={user.share_permission === Permission.HasPermission ? '有共享权限' : '无共享权限'}
          overlayClassName={styles.tooltip}
        >
          <span className={styles.opIcon} onClick={handleUserSharePerm}>
            <Icon
              className={`${styles.mediaIconShare}`}
              src={
                user.share_permission === Permission.HasPermission
                  ? HasSharePermitIcon
                  : NoSharePermitIcon
              }
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
