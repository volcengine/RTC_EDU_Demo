import React, { useEffect, useState, useRef } from 'react';
import Header from '@components/Header';
import styles from './index.less';
import { message as Message } from 'antd';
import Menu, { JoinParams } from './Menu';
import SettingModal from './SettingModal';
import camPause from '@assets/images/camPause.png';
import { ipcRenderer } from 'electron';

import { RtcClient } from '@src/core/rtc';
import { ProcessEvent } from '@/types';
import { DeviceState, UserRole } from '@/renderer/types/state';
import { useSelector } from '@/renderer/store';
import Back from './Back';
import { SceneType } from '@/renderer/store/slices/scene';

// 进入该页面时，已经登陆rts，后续调用rts接口
let first = true;

interface IProps {
  scene: SceneType;
  /**
   * 处理进房页面的form参数
   * @param formValue
   * @returns
   */
  beforeJoin?: (formValue: JoinParams) => void;
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

const JoinRoom: React.FC<IProps> = (props) => {
  const { scene, beforeJoin, localUser, onChangeCamera, onChangeMic, onJoinRoom } = props;

  const [isShowModal, setIsShowModal] = useState(false);
  const videoPreView = useRef<HTMLDivElement | null>(null);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  // 打开检测设备弹窗
  const onClickSetting = () => {
    setIsShowModal(true);
  };

  useEffect(() => {
    const mount = async () => {
      if (devicePermissions.video === undefined) {
        return;
      }

      if (!devicePermissions.video) {
        onChangeCamera && onChangeCamera(DeviceState.Closed);
      }

      if (!devicePermissions.audio) {
        onChangeMic && onChangeMic(DeviceState.Closed);
      }

      if (localUser.mic === DeviceState.Open && devicePermissions.audio) {
        console.log('join room page', 2);
        await RtcClient.startAudioCapture();
      }

      if (localUser.camera === DeviceState.Open && devicePermissions.video) {
        await RtcClient.startVideoCapture();
      }

      if (videoPreView.current) {
        RtcClient.removeVideoPlayer('');
        if (localUser.camera === DeviceState.Open) {
          RtcClient.setVideoPlayer('', videoPreView.current);
        }
      }
    };

    mount();
  }, [devicePermissions, localUser.camera, localUser.mic, videoPreView.current]);

  useEffect(() => {
    // todo check 每个场景只弹出一次
    if (first) {
      Message.info('本产品仅适用于功能体验，单次会议体验时长为30min');
    }
    first = false;
  }, []);

  useEffect(() => {
    ipcRenderer.send(ProcessEvent.IsShareWindow);
    ipcRenderer.on('shareWindow', () => {
      ipcRenderer.send(ProcessEvent.RecoverWindow);
    });
    return () => {
      ipcRenderer.removeAllListeners('shareWindow');
    };
  }, []);

  return (
    <div className={styles.joinContainer}>
      <Header className={styles.joinRoomHeader} />
      <div
        className={styles.videoPreview}
        ref={videoPreView}
        style={{
          background: localUser.camera === DeviceState.Open ? '#000' : '#282e3a',
        }}
      >
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
        scene={scene}
        beforeJoin={beforeJoin}
        onJoinRoom={onJoinRoom}
        onClickSetting={onClickSetting}
        videoRef={videoPreView}
      />
      <SettingModal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        videoRef={videoPreView}
      />
      <Back />
    </div>
  );
};

export default JoinRoom;
