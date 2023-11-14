import React, { useEffect, useState } from 'react';
import MicroPhoneDark from '@assets/images/MicroPhoneDark.svg';
import MicroPhoneWhite from '@assets/images/MicroPhoneWhite.svg';
import MicroPhoneOff from '@assets/images/MicrophoneOff.svg';
import CameraDark from '@assets/images/CameraDark.svg';
import CameraWhite from '@assets/images/CameraWhite.svg';
import CameraOff from '@assets/images/CameraOff.svg';
import MemberDark from '@assets/images/MemberDark.svg';
import Link from '@assets/images/edub/Link.svg';

import MemberWhite from '@assets/images/MemberWhite.svg';
import ScreenShareGreen from '@assets/images/ScreenShareGreen.svg';
import ScreenShareGray from '@assets/images/ScreenShareGray.svg';
import WhiteBoardShareGreen from '@assets/images/WhiteBoardShareGreen.svg';
import WhiteBoardShareGray from '@assets/images/WhiteBoardShareGray.svg';
import IconButton from '@src/components/IconButton';
import styles from './index.less';
import { useSelector } from '@src/store';
import { ipcRenderer, remote } from 'electron';
import { ProcessEvent, WindowType } from '@/types';

import Utils from '@src/utils';
import Icon from '@components/Icon';
import Recording from '@assets/images/Recording.svg';
import { Theme } from '@src/store/slices/ui';
import { DeviceState, Permission, RecordStatus, UserRole } from '@/renderer/types/state';
import useSceneRoom from '@/renderer/core/hooks/useSceneRoom';
import { SceneType } from '@/renderer/store/slices/scene';
import { EdubRoomState } from '@/renderer/store/slices/edubRoom';
import classNames from 'classnames';
import { SettingButton } from '@/renderer/components';
import RecordButton from '@/renderer/components/RecordButton';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

let roomTime = 1800;
const Footer: React.FC = () => {
  const room = useSceneRoom();

  const { scene } = useSelector((state) => state.scene);

  const me = room?.localUser;

  const [leftTime, setLeftTime] = useState(roomTime);
  const theme = useSelector((state) => state.ui.theme);

  const onClickMic = () => {
    const operate = me?.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open;
    if (me?.mic === DeviceState.Closed && me?.user_role !== UserRole.Host) {
      // 打开申请麦克风弹窗
      ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.ATTENDEE_MODAL);
    } else {
      // 给主渲染进程发送消息，关闭麦克风
      ipcRenderer.sendTo(mainWindowId, 'operateMic', operate);
    }
  };
  const onClickCamera = () => {
    // 通知开关摄像头
    if (me?.camera === DeviceState.Open) {
      ipcRenderer.sendTo(mainWindowId, 'operateCamera', DeviceState.Closed);
    } else {
      ipcRenderer.sendTo(mainWindowId, 'operateCamera', DeviceState.Open);
    }
  };

  const onClickLink = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.APPLY_LINK);
  };

  const onClickMember = () => {
    // 通知主进程打开成员窗口
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.MEMBER);
  };
  const onClickScreenShare = () => {
    ipcRenderer.sendTo(mainWindowId, 'updateScreenList');
    // 打开屏幕窗口
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.SCREEN);
  };
  const onClickWhiteBoardShare = () => {
    ipcRenderer.send(ProcessEvent.RecoverWindow);
    ipcRenderer.sendTo(mainWindowId, 'operateWhiteBoard', DeviceState.Open);
  };

  const onClickSetting = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.SETTING);
  };

  // 结束共享时
  const onClickEndShare = () => {
    ipcRenderer.send(ProcessEvent.RecoverWindow);
    ipcRenderer.sendTo(mainWindowId, 'stopShare');
  };

  useEffect(() => {
    ipcRenderer.on('getTime', (e, time) => {
      console.log('getTime: ', time);
      setLeftTime(time);
    });
    return () => {
      ipcRenderer.removeAllListeners('getTime');
    };
  }, []);
  return (
    <div className={styles.footer}>
      <div className={styles.footerInfo}>
        <div className={styles.title}>会议详情</div>
        <div className={styles.roomId}>房间ID：{room?.room_id}</div>
        <div className={styles.sperature} />
        <div className={styles.roomId}>剩余体验时长：{Utils.formatTime(leftTime)}</div>
        {room?.record_status === RecordStatus.Recording && (
          <>
            <div className={styles.sperature} />
            <div className={styles.icon}>
              <Icon src={Recording} />
            </div>
          </>
        )}
      </div>
      <div className={styles.operate}>
        <IconButton
          className={styles.iconButton}
          onClick={onClickMic}
          text="麦克风"
          src={
            me?.mic === DeviceState.Open
              ? theme === Theme?.light
                ? MicroPhoneDark
                : MicroPhoneWhite
              : MicroPhoneOff
          }
        />
        <IconButton
          className={styles.iconButton}
          onClick={onClickCamera}
          text="摄像头"
          src={
            me?.camera === DeviceState.Open
              ? theme === Theme?.light
                ? CameraDark
                : CameraWhite
              : CameraOff
          }
        />
        {scene === SceneType.Edub && (
          <div className={classNames(styles.memberBtn, styles.linkBtn)}>
            <IconButton
              className={styles.iconButton}
              text="连麦"
              onClick={onClickLink}
              src={Link}
            />
            <div className={styles.userCount}>
              {(room as EdubRoomState)?.linkmic_apply_list.length || 0}
            </div>
          </div>
        )}
        <div className={styles.memberBtn}>
          <IconButton
            className={styles.iconButton}
            text="成员"
            onClick={onClickMember}
            src={theme === Theme?.light ? MemberDark : MemberWhite}
          />
          <div className={styles.userCount}>{(room?.remoteUsers.length || 0) + 1}</div>
        </div>

        <IconButton
          className={styles.iconButton}
          text="屏幕共享"
          onClick={onClickScreenShare}
          src={
            me?.share_permission === Permission.HasPermission ? ScreenShareGreen : ScreenShareGray
          }
        />
        <IconButton
          className={styles.iconButton}
          text="白板共享"
          onClick={onClickWhiteBoardShare}
          src={
            me?.share_permission === Permission.HasPermission
              ? WhiteBoardShareGreen
              : WhiteBoardShareGray
          }
        />
        <RecordButton />
        <SettingButton className={styles.settingButton} />
        <div className={styles.divider} />
        <button className={styles.finishBtn} onClick={onClickEndShare}>
          结束共享
        </button>
      </div>
    </div>
  );
};

export default Footer;
