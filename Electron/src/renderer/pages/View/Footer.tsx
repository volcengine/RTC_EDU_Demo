import React, { useEffect, useState } from 'react';
import styles from './index.less';
import MicroPhoneDark from '@assets/images/MicroPhoneDark.svg';
import MicroPhoneOff from '@assets/images/MicrophoneOff.svg';
import CameraDark from '@assets/images/CameraDark.svg';
import CameraOff from '@assets/images/CameraOff.svg';
import MemberDark from '@assets/images/MemberDark.svg';
import ScreenShareGreen from '@assets/images/ScreenShareGreen.svg';
import ScreenShareGray from '@assets/images/ScreenShareGray.svg';
import WhiteBoardShareGreen from '@assets/images/WhiteBoardShareGreen.svg';
import WhiteBoardShareGray from '@assets/images/WhiteBoardShareGray.svg';
import WhiteBoardShareRed from '@assets/images/WhiteBoardShareRed.svg';
import EndRed from '@assets/images/EndRed.svg';
import ArrowIcon from '@assets/images/Arrow.svg';
import Tooltip from 'antd/es/tooltip';
import { message as Message } from 'antd';
import * as rtsApi from './apis';

import IconButton from './IconButton';
import { Button, Radio, RadioChangeEvent } from 'antd';
import { MessageType, updateMessage } from '@src/store/modules/publicMessage';

import {
  DeviceState,
  Permission,
  RecordStatus,
  RoomMicStatus,
  ShareConfig,
  ShareStatus,
  ShareType,
  UserRole,
} from '@/renderer/types/state';
import {
  localUserChangeCamera,
  localUserChangeMic,
  localUserLeaveRoom,
} from '@/renderer/store/slices/meetingRoom';
import { useDispatch, useSelector } from '@/renderer/store';
import { setCamera, setMicrophone } from '@/renderer/store/modules/devices';
import { RtcClient } from '@/renderer/core/rtc';
import useLeaveRoom from '@/renderer/core/rtcHooks/useLeaveRoom';
import { setShareScreenConfig, setUserListDrawOpen } from '@/renderer/store/slices/ui';
import { getScreenConfig } from '@/renderer/core/utils';
import RecordButton from '@/renderer/components/RecordButton';
import { SettingButton } from '@/renderer/components';

interface FooterProps {
  onClickScreenShare: () => void;
  onClickWhiteBoardShare: () => void;
  onClickStopWhiteBoardShare: () => void;
  onClickSetting: () => void;
  onClickRecord: () => void;
}

enum LeaveType {
  SELF = 0,
  ALl = 1,
}

const Footer: React.FC<FooterProps> = (props) => {
  const room = useSelector((state) => state.meetingRoom);

  const { devicePermissions, cameraList, microphoneList, selectedCamera, selectedMicrophone } =
    useSelector((state) => state.device);
  const { localUser, remoteUsers } = room;
  const dispatch = useDispatch();
  const {
    onClickScreenShare,
    onClickWhiteBoardShare,
    onClickStopWhiteBoardShare,
    onClickSetting,
    onClickRecord,
  } = props;
  const [showCameraList, setShowCameraList] = useState(false);
  const [showMicList, setShowMicList] = useState(false);
  const [showScreenConfig, setShowScreenConfig] = useState(false);
  const shareScreenConfig = useSelector((state) => state.ui.screenEncodeConfig);

  const ui = useSelector((state) => state.ui);

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const audioCaptureAuthority = devicePermissions.audio;

  const videoCaptureAuthority = devicePermissions.video;

  // 点击摄像头
  const onClickCamera = () => {
    if (videoCaptureAuthority === false) {
      if (process.platform === 'win32') {
        Message.error('摄像头权限已关闭，请至设备设置页开启，然后重新启动应用');
      } else {
        Message.error('摄像头权限已关闭，请至设备设置页开启');
      }
      return;
    }
    const operate = localUser.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open;
    dispatch(localUserChangeCamera(operate));
  };
  // 点击麦克风
  const onClickMic = () => {
    if (audioCaptureAuthority === false) {
      if (process.platform === 'win32') {
        Message.error('麦克风权限已关闭，请至设备设置页开启，开启后重新启动应用');
      } else {
        Message.error('麦克风权限已关闭，请至设备设置页开启');
      }
      return;
    }
    // 未开启全体静音、允许自己打开麦克风、主持人身份、执行闭麦操作时
    if (
      room.room_mic_status === RoomMicStatus.AllowMic ||
      room.operate_self_mic_permission === Permission.HasPermission ||
      localUser.user_role === UserRole.Host ||
      localUser.mic === DeviceState.Open
    ) {
      const operate = localUser.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open;
      // 调用rtc接口
      dispatch(localUserChangeMic(operate));
    } else {
      // 申请开麦
      dispatch(updateMessage(MessageType.REQUEST_OPEN_MIC));
    }
  };

  // 展示可用摄像头列表
  const getCameras = () => {
    setShowCameraList(!showCameraList);
  };

  const handleShareScreenConfigChange = (e: RadioChangeEvent) => {
    const newConfig = e.target.value;
    const encodeConfig = getScreenConfig(newConfig);
    dispatch(setShareScreenConfig(newConfig));

    RtcClient.engine?.setScreenVideoEncoderConfig(encodeConfig);
    setShowScreenConfig(false);
  };

  const changeCamera = (e: RadioChangeEvent) => {
    dispatch(setCamera(e.target.value));
    RtcClient.engine?.setVideoCaptureDevice(e.target.value);
  };
  // 展示可用麦克风列表
  const getMicphones = () => {
    setShowMicList(!showMicList);
  };
  const changeMic = (e: RadioChangeEvent) => {
    dispatch(setMicrophone(e.target.value));

    RtcClient.engine?.setAudioCaptureDevice(e.target.value);
  };

  /**
   * 1. 主持人点击全员离开
   * 2. 单独离开或者参会人离开
   */
  const handleLeaveRoom = async (type: LeaveType) => {
    if (room.share_user_id === localUser.user_id) {
      rtsApi.finishShare();
    }

    RtcClient.removeVideoPlayer(localUser.user_id!);

    if (type === LeaveType.ALl) {
      await rtsApi.finishRoom();
    } else {
      if (remoteUsers.length === 0 && localUser.user_role === UserRole.Host) {
        await rtsApi.finishRoom();
      } else {
        await rtsApi.leaveRoom();
      }
    }

    // 清空加入房间获取的信息
    await leaveRoom();
  };

  const HostToolTip = (
    <div className={styles.hostToolTip}>
      <div>
        <Button
          type="primary"
          onClick={() => {
            handleLeaveRoom(LeaveType.ALl);
          }}
          danger
        >
          全员结束
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            handleLeaveRoom(LeaveType.SELF);
          }}
        >
          暂时离开
        </Button>
      </div>
    </div>
  );
  const ParticipatorToolTip = (
    <div className={styles.attendeeToolTip}>
      <Button
        onClick={() => {
          handleLeaveRoom(LeaveType.SELF);
        }}
      >
        确认离开
      </Button>
    </div>
  );

  const handleUserList = () => {
    dispatch(setUserListDrawOpen(!ui.userListDrawOpen));
  };

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.leftBtns}>
          <div className={styles.btnwrap}>
            <IconButton
              onClick={onClickMic}
              src={localUser.mic === DeviceState.Open ? MicroPhoneDark : MicroPhoneOff}
              text="麦克风"
            />
            <div
              className={`${styles.ArrowIcon} ${showMicList ? '' : styles.ArrowIconRotate}`}
              onClick={getMicphones}
            >
              <img src={ArrowIcon} alt="arrow" />
            </div>

            <div
              className={styles.devicesList}
              onMouseLeave={() => {
                setShowMicList(false);
              }}
              style={{
                display: showMicList ? 'block' : 'none',
              }}
            >
              <div className={styles.mediaDevicesContent}>
                <Radio.Group onChange={changeMic} value={selectedMicrophone}>
                  {microphoneList?.map((device) => (
                    <Radio value={device.device_id} key={device.device_id}>
                      {device.device_name}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </div>
          <div className={styles.btnwrap}>
            <IconButton
              onClick={onClickCamera}
              src={localUser.camera === DeviceState.Open ? CameraDark : CameraOff}
              text="摄像头"
            />
            <div
              className={`${styles.ArrowIcon} ${showCameraList ? '' : styles.ArrowIconRotate}`}
              onClick={getCameras}
            >
              <img src={ArrowIcon} alt="arrow" />
            </div>

            <div
              className={styles.devicesList}
              onMouseLeave={() => {
                setShowCameraList(false);
              }}
              style={{
                display: showCameraList ? 'block' : 'none',
              }}
            >
              <div className={styles.mediaDevicesContent}>
                <Radio.Group onChange={changeCamera} value={selectedCamera}>
                  {cameraList?.map((device) => (
                    <Radio value={device.device_id} key={device.device_id}>
                      {device.device_name}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.middleBtns}>
          <div className={styles.btnwrap}>
            <IconButton onClick={handleUserList} src={MemberDark} text="成员" />
            <div className={styles.userCount}>{remoteUsers.length + 1}</div>
          </div>
          <div className={styles.btnwrap}>
            <IconButton
              onClick={onClickScreenShare}
              src={
                localUser.share_permission === Permission.HasPermission
                  ? ScreenShareGreen
                  : ScreenShareGray
              }
              text="屏幕共享"
            />
            <div
              className={`${styles.ArrowIcon} ${showScreenConfig ? '' : styles.ArrowIconRotate}`}
              onClick={() => setShowScreenConfig(true)}
            >
              <img src={ArrowIcon} alt="arrow" />
            </div>
            <div
              className={styles.devicesList}
              onMouseLeave={() => {
                setShowScreenConfig(false);
              }}
              style={{
                display: showScreenConfig ? 'block' : 'none',
              }}
            >
              <div className={styles.mediaDevicesContent}>
                <Radio.Group onChange={handleShareScreenConfigChange} value={shareScreenConfig}>
                  <Radio value={ShareConfig.Text}>清晰度优先</Radio>
                  <Radio value={ShareConfig.Motion}>流畅度优先</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
          {room.share_status === ShareStatus.Sharing &&
          room.share_type === ShareType.Board &&
          localUser.share_permission === Permission.HasPermission ? (
            <IconButton
              onClick={onClickStopWhiteBoardShare}
              src={WhiteBoardShareRed}
              text="结束白板共享"
            />
          ) : (
            <IconButton
              onClick={onClickWhiteBoardShare}
              src={
                localUser.share_permission === Permission.HasPermission
                  ? WhiteBoardShareGreen
                  : WhiteBoardShareGray
              }
              text="白板共享"
            />
          )}
          <RecordButton />
          <SettingButton className={styles.settingBtn} />
        </div>
        {remoteUsers.length > 0 ? (
          <Tooltip
            title={localUser.user_role === UserRole.Host ? HostToolTip : ParticipatorToolTip}
            placement="topRight"
            color="#FFFFFF"
            trigger="click"
          >
            <div className={styles.rightBtns}>
              <IconButton src={EndRed} text="结束通话" />
            </div>
          </Tooltip>
        ) : (
          <div className={styles.rightBtns}>
            <IconButton
              onClick={() => {
                handleLeaveRoom(LeaveType.SELF);
              }}
              src={EndRed}
              text="结束通话"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Footer;
