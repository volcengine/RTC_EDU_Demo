import { useSelector } from '@/renderer/store';
import {
  ApplyType,
  BaseUser,
  DeviceState,
  Permission,
  RoomMicStatus,
  UserRole,
} from '@/renderer/types/state';
import { ProcessEvent, WindowType } from '@/types';
import { ipcRenderer, remote } from 'electron';
import React, { useMemo } from 'react';
import IconButton from '@src/components/IconButton';
import styles from './index.less';
import { Tooltip } from 'antd';
import CameraGray from '@assets/images/CameraGray.svg';
import CameraRed from '@assets/images/CameraRed.svg';
import ShareOk from '@assets/images/ShareOk.svg';
import ShareNotOk from '@assets/images/ShareNotOk.svg';
import MicrophoneGray from '@assets/images/MicrophoneGray.svg';
import MicroPhoneRed from '@assets/images/MicroPhoneRed.svg';
import HandsUp from '@assets/images/HandsUp.svg';
import Sharing from '@assets/images/Sharing.svg';
import Icon from '@components/Icon';
import { SceneType } from '@/renderer/store/slices/scene';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

type MemberUser = Partial<
  BaseUser & {
    isLocal?: boolean;
    applying?: ApplyType[];
  }
>;

interface IProps {
  user?: MemberUser;
  room?: {
    localUser: MemberUser;
    room_mic_status?: RoomMicStatus;
    operate_self_mic_permission?: Permission;
    share_user_id?: string;
  };
  setIsShowMic: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowShare: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowAwardShare: React.Dispatch<React.SetStateAction<boolean>>;
  setOperateUser: React.Dispatch<
    React.SetStateAction<{ userName: string; userId: string; shareOperate?: number }>
  >;
}

const Member: React.FC<IProps> = (props) => {
  const { user, setIsShowShare, setOperateUser, setIsShowMic, setIsShowAwardShare, room } = props;

  const { scene } = useSelector((state) => state.scene);

  const hostText = scene === SceneType.Meeting ? '主持人' : '老师';

  const me = room?.localUser;

  const isReqMic = user?.applying?.includes(ApplyType.Mic);
  const isReqShare = user?.applying?.includes(ApplyType.Screen);

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
  }, [isReqMic, isReqShare]);

  const handleClickCamera = () => {
    const operate = user?.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open;
    if (me?.user_id === user?.user_id) {
      // 通知开关摄像头
      ipcRenderer.sendTo(mainWindowId, 'operateCamera', operate);
    } else if (me?.user_role === UserRole.Host) {
      // 主持人操作参会人摄像头
      ipcRenderer.sendTo(mainWindowId, 'operateUserCamera', operate, user?.user_id);
    }
  };

  const handleClickMic = () => {
    const operate = user?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open;
    if (me?.user_id === user?.user_id) {
      if (
        room?.room_mic_status === RoomMicStatus.AllowMic ||
        room?.operate_self_mic_permission === Permission.HasPermission ||
        me?.user_role === UserRole.Host ||
        me?.mic === DeviceState.Open
      ) {
        // 发送消息
        ipcRenderer.sendTo(mainWindowId, 'operateMic', operate);
      } else {
        ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.MEMBER);
      }
    } else if (me?.user_role === UserRole.Host) {
      ipcRenderer.sendTo(mainWindowId, 'operateUserMic', operate, user?.user_id);
    }
  };
  const handleClickSharePermission = () => {
    if (me?.user_role === UserRole.Host && me?.user_id !== user?.user_id) {
      const operate =
        user?.share_permission === Permission.HasPermission
          ? Permission.NoPermission
          : Permission.HasPermission;
      setIsShowAwardShare(true);
      setOperateUser({
        userId: user?.user_id!,
        userName: user?.user_name!,
        shareOperate: operate,
      });
    }
  };

  const handleClickHands = () => {
    setOperateUser({
      userId: user?.user_id!,
      userName: user?.user_name!,
    });
    if (isReqMic) {
      setIsShowMic(true);
    }
    if (isReqShare) {
      setIsShowShare(true);
    }
  };

  return (
    <>
      <div className={styles.member}>
        <div className={styles.userInfo}>
          {user?.user_role === UserRole.Host && <div className={styles.host}>{hostText}</div>}
          <div className={styles.user}>
            <div className={styles.nameInfo}>
              <div className={styles.name}>{user?.user_name || ''}</div>
              {me?.user_id === user?.user_id && <div className={styles.role}>（我）</div>}
            </div>
            <div className={styles.reqInfo}>{reqText}</div>
          </div>
          {room?.share_user_id === user?.user_id && <Icon className={styles.icon} src={Sharing} />}
        </div>
        <div
          className={styles.iconList}
          style={{
            display: scene === SceneType.Edub ? 'none' : 'flex',
          }}
        >
          {(isReqMic || isReqShare) && <IconButton onClick={handleClickHands} src={HandsUp} />}
          <IconButton
            onClick={handleClickCamera}
            src={user?.camera === DeviceState.Open ? CameraGray : CameraRed}
          />
          <IconButton
            onClick={handleClickMic}
            src={user?.mic === DeviceState.Open ? MicrophoneGray : MicroPhoneRed}
          />
          <Tooltip
            title={user?.share_permission ? '有共享权限' : '无共享权限'}
            placement="top"
            trigger="hover"
          >
            <IconButton
              onClick={handleClickSharePermission}
              src={user?.share_permission ? ShareOk : ShareNotOk}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default Member;
