import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@src/components';
import MicrophoneOff from '@assets/images/device/MicOff.svg';
import MicrophoneOn from '@assets/images/device/MicOn.svg';
import VideoPlayerUserIcon from '@assets/images/VideoPlayerUser.svg';
import { RtcClient } from '@src/core/rtc';
import { DeviceState, BaseUser, UserRole } from '@src/types/state';

import Hover from './Hover';
import styles from './index.module.less';
import { useSelector } from '@/renderer/store';

interface PlayerProps {
  height: number;
  localUser?: BaseUser;
  user?: BaseUser;
}

export default function (props: PlayerProps) {
  const { user, height, localUser } = props;

  const [hover, setHover] = useState(false);

  const domId = useMemo(() => {
    return `${user?.isLocal ? 'local' : 'remote'}-${user?.user_id}-0`;
  }, [user?.user_id]);

  const videoRef = useRef<HTMLDivElement | null>(null);

  const camera = user?.camera;

  const isLocal = user?.user_id === localUser?.user_id && localUser?.user_id;
  const rtcRooomUsers = useSelector((state) => state.rtcRoomUsers);

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
    if (videoRef.current) {
      if (camera === DeviceState.Open) {
        // 摄像头打开
        if (localUser?.user_id === user?.user_id) {
          RtcClient.removeVideoPlayer(user?.user_id || '');
          RtcClient.setVideoPlayer(user?.user_id || '', videoRef.current);
        } else {
          // 当用户真正加入rtc房间时才构建视图
          if (rtcRooomUsers.indexOf(user?.user_id!) > -1) {
            RtcClient.removeVideoPlayer(user?.user_id!);
            RtcClient.setVideoPlayer(user?.user_id!, videoRef.current);
          }
        }
      }
    }
    if (camera === DeviceState.Closed) {
      // 摄像头关闭
      RtcClient.removeVideoPlayer(user?.user_id!);
    }
  }, [videoRef.current, user?.camera, rtcRooomUsers]);

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
        Boolean(user?.audio_properties_info?.linearVolume) &&
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
        ref={videoRef}
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
                ? styles.playerMicStatusOffIcon
                : styles.playerMicStatusOnIcon
            }
			${
        user?.mic === DeviceState.Open &&
        Boolean(user?.audio_properties_info?.linearVolume) &&
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
