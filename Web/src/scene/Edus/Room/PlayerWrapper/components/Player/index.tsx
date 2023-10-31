import { useEffect, useMemo } from 'react';
import { useSelector } from '@/store';
import { Icon } from '@/components';

import { RtcClient } from '@/core/rtc';
import BoardIcon from '@/assets/images/Board.svg';
import ShareIcon from '@/assets/images/Share.svg';
import VideoPlayerUser from '@/assets/images/VideoPlayerUser.svg';
import styles from './index.module.less';
import MicrophoneOff from '@/assets/images/MicrophoneOff.svg';
import MicrophoneOn from '@/assets/images/MicrophoneOn.svg';

import { Theme } from '@/store/slices/ui';
import { BaseUser, DeviceState, ShareStatus, ShareType } from '@/types/state';
import { IEdusUser } from '@/store/slices/edusRoom';

interface PlayerProps {
  user: Partial<
    IEdusUser & {
      isLocal?: boolean;
      rtcStatus?: {
        joined?: boolean;
        screen?: boolean;
        stream?: boolean;
      };
    }
  >;
  showNameIcon?: boolean;
  className?: string;
}

export default function (props: PlayerProps) {
  const { user, className, showNameIcon = false } = props;

  const hostUserId = useSelector((state) => state.edusRoom.host_user_id);
  const room = useSelector((state) => state.edusRoom);
  const theme = useSelector((state) => state.ui.theme);

  const domId = useMemo(() => {
    return `${user?.isLocal ? 'local' : 'remote'}-${user?.user_id}-0`;
  }, [user?.user_id]);

  useEffect(() => {
    if (user?.camera === DeviceState.Open) {
      RtcClient.setVideoPlayer(user?.user_id!, domId);
    }

    if (user?.camera === DeviceState.Closed) {
      RtcClient.setVideoPlayer((user as BaseUser).user_id!, undefined);
    }

    return () => {
      if (user) {
        RtcClient.setVideoPlayer((user as BaseUser).user_id!, undefined);
      }
    };
  }, [user?.user_id, user?.camera, user?.rtcStatus?.stream]);

  return (
    <div
      className={`videoPlayerWrapper ${className || ''}
      ${
        user?.mic === DeviceState.Open &&
        Boolean(user?.audioPropertiesInfo?.linearVolume) &&
        'speaking'
      } `}
    >
      <div
        id={domId}
        className={styles.videoPlayer}
        style={{
          background:
            user?.camera === DeviceState.Open
              ? 'black'
              : theme === Theme.light
              ? room.share_status === ShareStatus.Sharing
                ? '#fff'
                : '#F1F3F5'
              : '#333537',
        }}
      />

      {showNameIcon && (
        <div
          className={styles.userAvatar}
          style={{
            display: user?.camera === DeviceState.Open ? 'none' : 'flex',
          }}
        >
          <span>{user?.user_name?.[0]}</span>
        </div>
      )}
      {!showNameIcon && (
        <div
          className={styles.userAvatarIcon}
          style={{
            display: user?.camera === DeviceState.Open ? 'none' : 'flex',
          }}
        >
          <Icon src={VideoPlayerUser} />
        </div>
      )}

      <div className="userInfo">
        {user?.user_id === hostUserId && <span className="hostlabel">老师</span>}

        <Icon
          src={user?.mic === DeviceState.Closed ? MicrophoneOff : MicrophoneOn}
          className={`${
            user?.mic === DeviceState.Closed ? 'playerMicStatusIcon' : styles.playerMicStatusOnIcon
          } ${
            user?.mic === DeviceState.Open &&
            Boolean(user?.audioPropertiesInfo?.linearVolume) &&
            styles.speakingIcon
          }`}
        />
        {user?.share_status === ShareStatus.Sharing && user.user_id === room.share_user_id && (
          <Icon
            src={room.share_type === ShareType.Board ? BoardIcon : ShareIcon}
            className={styles.sharingIcon}
          />
        )}

        <span className={styles.userName}>
          {user?.user_name}
          {user?.isLocal ? `(我)` : ''}
        </span>
      </div>
    </div>
  );
}
