import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components';
import MicrophoneOff from '@/assets/images/MicrophoneOff.svg';
import MicrophoneOn from '@/assets/images/MicrophoneOn.svg';
import VideoPlayerUserIcon from '@/assets/images/VideoPlayerUser.svg';
import { RtcClient } from '@/core/rtc';
import { DeviceState, BaseUser, UserRole } from '@/types/state';

import Hover from './Hover';
import styles from './index.module.less';

interface PlayerProps {
  height: number;
  localUser?: BaseUser;
  user?: BaseUser & {
    rtcStatus?: {
      joined?: boolean;
      screen?: boolean;
      stream?: boolean;
    };
  };
}

export default function (props: PlayerProps) {
  const { user, height, localUser } = props;

  const [hover, setHover] = useState(false);

  const domId = useMemo(() => {
    return `${user?.isLocal ? 'local' : 'remote'}-${user?.user_id}-0`;
  }, [user?.user_id]);

  const isLocal = user?.user_id === localUser?.user_id && localUser?.user_id;

  const handleHover = () => {
    // hover到自己 或者老师hover到其他学生
    if (
      (isLocal || localUser?.user_role === UserRole.Host) &&
      // 当前播放器的对应的用户不是老师
      user?.user_role !== UserRole.Host
    ) {
      setHover(true);
    }
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  useEffect(() => {
    if (!user?.user_id) {
      return;
    }

    if (user?.camera === DeviceState.Open) {
      RtcClient.setVideoPlayer(user?.user_id!, domId);
    }

    if (user?.camera === DeviceState.Closed) {
      RtcClient.setVideoPlayer((user as BaseUser).user_id!, undefined);
    }

    return () => {
      if (user?.user_id) {
        RtcClient.setVideoPlayer((user as BaseUser).user_id!, undefined);
      }
    };
  }, [user?.user_id, user?.camera, user?.rtcStatus?.stream]);

  if (!user?.user_id) {
    return (
      <div
        className={`${styles.videoPlayerWrapper} ${styles.noUser} `}
        style={{
          minHeight: height,
          maxHeight: height,
        }}
      >
        <div className={styles.userIcon}>
          <Icon src={VideoPlayerUserIcon} />
        </div>

        <span>等待老师进入房间</span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.videoPlayerWrapper} ${
        user?.mic === DeviceState.Open &&
        Boolean(user?.audioPropertiesInfo?.linearVolume) &&
        'speaking'
      }`}
      style={{
        minHeight: height,
        maxHeight: height,
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <div
        id={domId}
        className={`${styles.videoPlayer} `}
        style={{
          minHeight: height - 10,
          maxHeight: height,
        }}
      />

      <div
        className={styles.userAvatar}
        style={{
          display: user?.camera === DeviceState.Open ? 'none' : 'flex',
        }}
      >
        <span>{user?.user_name?.[0]}</span>
      </div>

      <div className={styles.userInfo}>
        <Icon
          src={user?.mic === DeviceState.Closed ? MicrophoneOff : MicrophoneOn}
          className={`
            ${
              user?.mic === DeviceState.Closed
                ? 'playerMicStatusIcon'
                : styles.playerMicStatusOnIcon
            }
            ${
              user?.mic === DeviceState.Open &&
              Boolean(user?.audioPropertiesInfo?.linearVolume) &&
              styles.speakingIcon
            }`}
        />
        {user?.user_role === UserRole.Host && <span className={styles.teacherLabel}>老师</span>}

        <span className={styles.userName}>
          {user?.user_name}
          {user?.isLocal ? `(我)` : ''}
        </span>
      </div>
      {hover && <Hover user={user} localUser={localUser} />}
    </div>
  );
}
