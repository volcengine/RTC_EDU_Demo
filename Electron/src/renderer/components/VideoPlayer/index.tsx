import React, { useRef, useEffect, useState } from 'react';
import styles from './index.less';
import Icon from '@components/Icon';
import MicrophoneGray from '@assets/images/MicrophoneGray.svg';
import MicroPhoneRed from '@assets/images/MicroPhoneRed.svg';
import Sharing from '@assets/images/Sharing.svg';
import { useSelector } from '@src/store';

import classnames from 'classnames';
import { BaseUser, DeviceState, UserRole } from '@/renderer/types/state';
import { RtcClient } from '@/renderer/core/rtc';
import { SceneType } from '@/renderer/store/slices/scene';

interface VideplayerProps {
  user: Partial<
    BaseUser & {
      isActive: boolean;
    }
  >;
  className: string;
  room: {
    share_user_id?: string;
    localUser: Partial<
      BaseUser & {
        isActive: boolean;
      }
    >;
  };
  renderHover?: (
    user: Partial<
      BaseUser & {
        isActive: boolean;
      }
    >,
    room: {
      share_user_id?: string;
      localUser: Partial<
        BaseUser & {
          isActive: boolean;
        }
      >;
    }
  ) => React.ReactElement;
}

const VideoPlayer: React.FC<VideplayerProps> = (props) => {
  const { user, className, room, renderHover } = props;
  const { mic, camera, user_name, user_id, room_id, user_role } = user;
  const localUser = room.localUser;
  const [hover, setHover] = useState(false);

  const rtcRooomUsers = useSelector((state) => state.rtcRoomUsers);

  const { scene } = useSelector((state) => state.scene);
  const videoRef = useRef<HTMLDivElement | null>(null);

  const hostText = scene === SceneType.Meeting ? '主持人' : '老师';

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
    if (videoRef.current) {
      if (camera === DeviceState.Open) {
        // 摄像头打开
        if (localUser.user_id === user_id) {
          RtcClient.removeVideoPlayer(user_id || '');
          RtcClient.setVideoPlayer(user_id || '', videoRef.current);
        } else {
          // 当用户真正加入rtc房间时才构建视图
          // rtc 属性在推流
          if (rtcRooomUsers.indexOf(user_id!) > -1) {
            RtcClient.removeVideoPlayer(user_id!);
            RtcClient.setVideoPlayer(user_id!, videoRef.current);
          }
        }
      }
    }
    if (camera === DeviceState.Closed) {
      // 摄像头关闭
      RtcClient.removeVideoPlayer(user_id!);
    }
  }, [videoRef.current, camera, rtcRooomUsers]);

  return (
    <div
      id="videoPlayerWrap"
      className={classnames(className, styles.Player, {
        [styles.speaking]:
          Boolean(user?.audio_properties_info?.linearVolume) && mic === DeviceState.Open,
      })}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      {/* 头像 */}
      <div id="userAvatar" className={styles.userAvatar}>
        <span>{user_name?.[0] || ''}</span>
      </div>
      {/* 视频画布 */}
      <div id="videoPlayer" ref={videoRef} className={styles.videoPlayer} />
      {/* 角标 */}
      <div className={styles.userInfo} id="userInfo">
        {user_role === UserRole.Host && (
          <span id="host" className={styles.host}>
            {hostText}
          </span>
        )}

        <Icon
          src={mic === DeviceState.Open ? MicrophoneGray : MicroPhoneRed}
          className={styles.userMicrophone}
        />
        {room.share_user_id === user_id && <Icon src={Sharing} className={styles.icon} />}
        <span className={styles.name} id="self">
          {user_name}
          {localUser.user_id === user_id ? `(我)` : ''}
        </span>
      </div>
      {hover && renderHover && renderHover(user, room)}
    </div>
  );
};

export default VideoPlayer;
