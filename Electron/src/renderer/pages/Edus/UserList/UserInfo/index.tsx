import { useDispatch, useSelector } from '@/renderer/store';
import { useMemo } from 'react';
import styles from './index.module.less';
import { message as Message, Tooltip } from 'antd';
import {
  ApplyType,
  BaseUser,
  DeviceState,
  Permission,
  RoomMicStatus,
  UserRole,
} from '@/renderer/types/state';
import { localUserChangeCamera, localUserChangeMic } from '@/renderer/store/slices/edusRoom';
import IconButton from '../../IconButton';
import React from 'react';
import ShareOk from '@assets/images/ShareOk.svg';
import ShareNotOk from '@assets/images/ShareNotOk.svg';
import MicrophoneGray from '@assets/images/MicrophoneGray.svg';
import MicroPhoneRed from '@assets/images/MicroPhoneRed.svg';
import CameraGray from '@assets/images/CameraGray.svg';
import CameraRed from '@assets/images/CameraRed.svg';
import Icon from '@components/Icon';
import Sharing from '@assets/images/Sharing.svg';
import HandsUp from '@assets/images/HandsUp.svg';
import * as rtsApi from '@src/pages/Edus/apis';
import { MessageType, updateMessage } from '@/renderer/store/modules/publicMessage';

import MicrophoneOffIcon from '@assets/images/device/MicOff.svg';
import MicrophoneOn from '@assets/images/device/MicOn.svg';

type MemberUser = Partial<
  BaseUser & {
    isLocal?: boolean;
    applying?: ApplyType[];
  }
>;

interface IProps {
  user: MemberUser;
  setIsShowMic: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowShare: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowAwardShare: React.Dispatch<React.SetStateAction<boolean>>;
  setOperateUser: React.Dispatch<
    React.SetStateAction<{ userName: string; userId: string; shareOperate?: number }>
  >;
}

const Member: React.FC<IProps> = (props) => {
  const room = useSelector((state) => state.edusRoom);
  const { audio: audioCaptureAuthority, video: videoCaptureAuthority } = useSelector(
    (state) => state.device.devicePermissions
  );
  const me = room.localUser;
  const { user, setIsShowMic, setIsShowShare, setOperateUser, setIsShowAwardShare } = props;
  const dispatch = useDispatch();

  const isReqMic = user.applying?.includes(ApplyType.Mic);
  const isReqShare = user.applying?.includes(ApplyType.Screen);

  const reqText = useMemo(() => {
    if (isReqMic && isReqShare) {
      return '申请发言及共享';
    } else if (isReqMic) {
      return '申请发言';
    } else if (isReqShare) {
      return '申请共享';
    } else {
      return '';
    }
  }, [user.applying]);

  const handleClickCamera = () => {
    const operate = user.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open;
    if (me.user_id === user.user_id) {
      if (videoCaptureAuthority === false) {
        if (process.platform === 'win32') {
          Message.error('摄像头权限已关闭，请至设备设置页开启，然后重新启动应用');
        } else {
          Message.error('摄像头权限已关闭，请至设备设置页开启');
        }
        return;
      }
      dispatch(localUserChangeCamera(operate));
    } else if (me.user_role === UserRole.Host) {
      // 老师操作学生摄像头

      rtsApi.operateOtherCamera({
        operate_user_id: user.user_id!,
        operate,
      });

      if (operate === DeviceState.Open) {
        Message.success('申请已发送');
      }
    }
  };

  const handleClickMic = () => {
    const operate = user.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open;
    if (me.user_id === user.user_id) {
      if (audioCaptureAuthority === false) {
        if (process.platform === 'win32') {
          Message.error('麦克风权限已关闭，请至设备设置页开启，开启后重新启动应用');
        } else {
          Message.error('麦克风权限已关闭，请至设备设置页开启');
        }
        return;
      }
      if (
        room.room_mic_status === RoomMicStatus.AllowMic ||
        room.operate_self_mic_permission === Permission.HasPermission ||
        me.user_role === UserRole.Host ||
        me.mic === DeviceState.Open
      ) {
        dispatch(localUserChangeMic(operate));
      } else {
        dispatch(updateMessage(MessageType.REQUEST_OPEN_MIC));
      }
    } else if (me.user_role === UserRole.Host) {
      // 操作学生麦克风

      rtsApi.operateOtherMic({
        operate_user_id: user.user_id!,
        operate,
      });

      if (operate === DeviceState.Open) {
        Message.success('申请已发送');
      }
    }
  };
  const handleClickSharePermission = () => {
    if (me.user_role === UserRole.Host && me.user_id !== user.user_id) {
      // 操作学生共享权限
      const operate =
        user.share_permission === Permission.HasPermission
          ? Permission.NoPermission
          : Permission.HasPermission;
      setIsShowAwardShare(true);
      setOperateUser({
        userId: user.user_id!,
        userName: user.user_name!,
        shareOperate: operate,
      });
    }
  };

  const handleClickHands = () => {
    setOperateUser({
      userId: user.user_id!,
      userName: user.user_name!,
    });
    if (isReqMic) {
      setIsShowMic(true);
    }
    if (isReqShare) {
      setIsShowShare(true);
    }
  };
  return (
    <div className={styles.member}>
      <div className={styles.userInfo}>
        {user.user_role === UserRole.Host && <div className={styles.host}>老师</div>}
        <div className={styles.user}>
          <div className={styles.nameInfo}>
            <div className={styles.name}>{user.user_name || ''}</div>
            {me.user_id === user.user_id && <div className={styles.role}>（我）</div>}
          </div>
          <div className={styles.reqInfo}>{reqText}</div>
        </div>
        {room.share_user_id === user.user_id && <Icon className={styles.icon} src={Sharing} />}
      </div>
      <div className={styles.iconList}>
        {(isReqMic || isReqShare) && <IconButton onClick={handleClickHands} src={HandsUp} />}
        {/* <IconButton
          onClick={handleClickCamera}
          src={user.camera === DeviceState.Open ? CameraGray : CameraRed}
        /> */}

        <span className={styles.opIcon} onClick={handleClickMic}>
          <Icon
            src={user?.mic === DeviceState.Closed ? MicrophoneOffIcon : MicrophoneOn}
            className={`${styles.mediaIcon} ${styles.newIcon} ${
              user?.mic === DeviceState.Closed && styles.mediaClosed
            } ${
              user?.mic === DeviceState.Open &&
              Boolean(user?.audio_properties_info?.linearVolume) &&
              styles.speakingIcon
            }`}
          />
        </span>

        <IconButton
          className={styles.camera}
          onClick={handleClickCamera}
          src={user.camera === DeviceState.Open ? CameraGray : CameraRed}
        />
        {/* 
        <IconButton
          className={styles.camera}
          onClick={handleClickMic}
          src={user.mic === DeviceState.Open ? MicrophoneGray : MicroPhoneRed}
        /> */}
        <Tooltip
          title={user.share_permission === Permission.HasPermission ? '有共享权限' : '无共享权限'}
          placement="top"
          trigger="hover"
        >
          <IconButton
            onClick={handleClickSharePermission}
            src={user.share_permission === Permission.HasPermission ? ShareOk : ShareNotOk}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Member;
