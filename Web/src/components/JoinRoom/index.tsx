import { useEffect, useState } from 'react';
import { message } from 'antd';
import { MirrorType } from '@volcengine/rtc';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '@/store';
import Header from '@/components/Header';
import { RtcClient } from '@/core/rtc';
import { useJoinRoomRtcListener } from '@/core/rtcHooks';
import camPause from '@/assets/images/camPause.png';
import { DeviceState, UserRole } from '@/types/state';
import { JoinStatus, SceneType, setJoining } from '@/store/slices/scene';

import Back from './Back';
import Menu from './Menu';
import DeviceDetectModal from './DeviceDetectModal';

import styles from './index.module.less';
import { BoardClient } from '@/core/board';
import { setAudioPlayBack, setCamera, setMicrophone } from '@/store/slices/devices';

const PlayerDomId = 'preview-player';

interface IProps {
  scene: SceneType;
  /**
   * 处理进房页面的form参数
   * @param formValue
   * @returns
   */
  beforeJoin?: (formValue: { name: string; roomId: string; user_role: UserRole }) => void;
  onChangeCamera: (state: DeviceState) => void;
  onChangeMic: (state: DeviceState) => void;
  localUser: {
    mic: DeviceState;
    camera: DeviceState;
  };

  onJoinRoom: (payload: {
    user_name: string;
    user_role?: UserRole | undefined;
    camera: DeviceState;
    mic: DeviceState;
  }) => Promise<boolean>;
}

export default function (props: IProps) {
  const { scene, beforeJoin, localUser, onChangeCamera, onChangeMic, onJoinRoom } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const [detectModal, setDetectModal] = useState(false);

  /**
   * 打开设备检测弹窗
   * 在弹窗里面重新捕获流
   */
  const handleDeviceDetectModal = async () => {
    RtcClient.setVideoPlayer(user?.user_id!, undefined);
    setDetectModal(true);
  };

  /**
   * 关闭设备检测弹窗
   * 使用修改后的设备重新捕获流并预览
   */
  const handleDeviceDetectModalClose = async () => {
    setDetectModal(false);
    RtcClient.setVideoPlayer(user?.user_id!, PlayerDomId);
  };

  /**
   * 进房页退出登录
   */
  const handleLogout = async () => {
    await RtcClient.leaveRTS();
    RtcClient.destroyEngine();
    await BoardClient.leaveRoom();
    const devices = await RtcClient.getDevices();

    dispatch(setCamera(devices.videoInputs[0]?.deviceId));
    dispatch(setMicrophone(devices.audioInputs[0]?.deviceId));
    dispatch(setAudioPlayBack(devices.audioOutputs[0]?.deviceId));
    dispatch(setJoining(JoinStatus.NotJoined));
    navigate(`/login`);
  };

  useEffect(() => {
    console.log('join room mount');

    const mount = async () => {
      if (devicePermissions.video === undefined) {
        return;
      }

      if (!devicePermissions.video) {
        message.error('未获得相机权限!');
        onChangeCamera && onChangeCamera(DeviceState.Closed);
      }

      if (!devicePermissions.audio) {
        message.error('未获得麦克风权限!');
        onChangeMic && onChangeMic(DeviceState.Closed);
      }

      if (localUser.mic === DeviceState.Open && devicePermissions.audio) {
        await RtcClient.startAudioCapture();
      }

      if (localUser.camera === DeviceState.Open && devicePermissions.video) {
        await RtcClient.startVideoCapture();
        RtcClient.setMirrorType(MirrorType.MIRROR_TYPE_RENDER);
      }

      RtcClient.setVideoPlayer(user?.user_id!, PlayerDomId);
      RtcClient.engine?.enableAudioPropertiesReport({
        interval: 200,
      });
    };

    mount();
  }, [devicePermissions]);

  useJoinRoomRtcListener({});

  return (
    <div className={styles.container}>
      <Header onLogout={handleLogout} />
      <div
        className={styles['preview-player']}
        style={{
          background: localUser.camera === DeviceState.Open ? '#000' : '#282e3a',
        }}
      >
        <div id={PlayerDomId} className={styles['player']} />
        <img
          src={camPause}
          className={styles.cameraImg}
          style={{
            display: localUser.camera === DeviceState.Open ? 'none' : 'block',
          }}
        />
      </div>

      <Menu
        localUser={localUser}
        onChangeCamera={onChangeCamera}
        onChangeMic={onChangeMic}
        onDeviceDetectModal={handleDeviceDetectModal}
        scene={scene}
        beforeJoin={beforeJoin}
        onJoinRoom={onJoinRoom}
      />
      <DeviceDetectModal open={detectModal} onClose={handleDeviceDetectModalClose} />
      <Back />
    </div>
  );
}
