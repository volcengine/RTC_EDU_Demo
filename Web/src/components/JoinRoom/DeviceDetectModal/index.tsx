import { Button, Modal, Select, Progress } from 'antd';
import VERTC, { LocalAudioPropertiesInfo } from '@volcengine/rtc';
import { useEffect, useState } from 'react';
import { Icon } from '@/components';
import { useSelector, useDispatch } from '@/store';
import { RtcClient } from '@/core/rtc';
import MicrophoneOn from '@/assets/images/MicrophoneOn.svg';
import VolumeOn from '@/assets/images/VolumeOn.svg';

import testMP4 from '@/assets/mp4/test_misic.mp4';
import { setCamera, setMicrophone, setAudioPlayBack } from '@/store/slices/devices';

import styles from './index.module.less';

interface IDetectModalProps {
  open: boolean;
  onClose: () => void;
}

const PlayerDomId = 'detect-preview-player';

export default function (props: IDetectModalProps) {
  const { open, onClose } = props;

  const devices = useSelector((state) => state.device);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [curVideoCaptureDevice, setCurVideoCaptureDevice] = useState(devices.selectedCamera);
  const [curAudioCaptureDevice, setCurAudioCaptureDevice] = useState(devices.selectedMicrophone);
  const [curAudioPlaybackDevice, setCurAudioPlaybackDevice] = useState(
    devices.selectedAudioPlayBack
  );
  const [audioPlaybackVolumePercent, setAudioPlaybackVolumePercent] = useState(0);
  const [audioCaptureVolumePercent, setAudioCaptureVolumePercent] = useState(0);

  const [startAudioPlaybackDeviceTest, setStartAudioPlaybackDeviceTest] = useState(false);

  const handleCloseModal = async (setNewDevice?: boolean) => {
    RtcClient.setVideoPlayer(user?.user_id!, undefined);
    if (!setNewDevice) {
      RtcClient.switchDevice('camera', devices.selectedCamera!);
      RtcClient.switchDevice('microphone', devices.selectedMicrophone!);
      RtcClient.switchDevice('playback', devices.selectedAudioPlayBack!);
      setCurVideoCaptureDevice(devices.selectedCamera!);
      setCurAudioCaptureDevice(devices.selectedMicrophone!);
      setCurAudioPlaybackDevice(devices.selectedAudioPlayBack!);
    }
    RtcClient.engine.stopAudioPlaybackDeviceTest();
    onClose();
  };

  /**
   * 关闭设备检测弹窗
   * 1. 停止捕获流
   * 2. 更新选中的设备
   */
  const handleCloseModalWithOk = async () => {
    dispatch(setCamera(curVideoCaptureDevice));
    dispatch(setMicrophone(curAudioCaptureDevice));
    dispatch(setAudioPlayBack(curAudioPlaybackDevice));

    await handleCloseModal(true);
  };

  // 切换视频采集设备
  const hanleVideoCaptureDeviceChange = (value: string) => {
    setCurVideoCaptureDevice(value);
    RtcClient.switchDevice('camera', value);
  };

  // 切换音频采集设备
  const hanleAudioCaptureDeviceChange = (value: string) => {
    console.log('hanleAudioCaptureDeviceChange', value);
    setCurAudioCaptureDevice(value);
    RtcClient.switchDevice('microphone', value);
  };
  // 切换音频播放设备
  const handleAudioPlaybackDeviceChange = (value: string) => {
    setCurAudioPlaybackDevice(value);
    RtcClient.switchDevice('playback', value);
  };

  // 处理音频播放回调
  const handlePlaybackVolueCallback = (volume: number) => {
    const temp = (volume / 255) * 100;
    setAudioPlaybackVolumePercent(temp);
  };

  // 处理本地音频信息回调
  const handleLocalVolumeCallback = (info: LocalAudioPropertiesInfo[]) => {
    const { audioPropertiesInfo } = info[0];
    const { linearVolume } = audioPropertiesInfo;
    const temp = (linearVolume / 255) * 100;
    setAudioCaptureVolumePercent(temp);
  };

  useEffect(() => {
    if (open) {
      // 打开弹窗
      RtcClient.setVideoPlayer(user?.user_id!, PlayerDomId);
      console.log('增加音频监听');
      RtcClient.engine.on(
        VERTC.events.onAudioPlaybackDeviceTestVolume,
        handlePlaybackVolueCallback
      );
      RtcClient.engine.on(VERTC.events.onLocalAudioPropertiesReport, handleLocalVolumeCallback);
    } else {
      setAudioPlaybackVolumePercent(0);
      setAudioCaptureVolumePercent(0);
      setStartAudioPlaybackDeviceTest(false);
      RtcClient.engine.stopAudioPlaybackDeviceTest();
    }

    return () => {
      // 关闭弹窗取消事件监听
      if (open) {
        RtcClient.engine.off(
          VERTC.events.onAudioPlaybackDeviceTestVolume,
          handlePlaybackVolueCallback
        );
        RtcClient.engine.off(VERTC.events.onLocalAudioPropertiesReport, handleLocalVolumeCallback);
      }
    };
  }, [open]);

  useEffect(() => {
    setCurVideoCaptureDevice(devices.selectedCamera);
    setCurAudioCaptureDevice(devices.selectedMicrophone);
    setCurAudioPlaybackDevice(devices.selectedAudioPlayBack);
  }, [devices]);

  // 测试播放设备
  const handlePlaybackMisic = () => {
    if (!startAudioPlaybackDeviceTest) {
      setStartAudioPlaybackDeviceTest(true);
      RtcClient.engine.startAudioPlaybackDeviceTest(testMP4, 200);
    } else {
      setStartAudioPlaybackDeviceTest(false);
      RtcClient.engine.stopAudioPlaybackDeviceTest();
    }
  };

  return (
    <Modal
      className={styles.modal}
      title="设备检测"
      open={open}
      centered
      width={800}
      onCancel={() => handleCloseModal()}
      footer={
        <Button type="primary" onClick={handleCloseModalWithOk}>
          完成
        </Button>
      }
    >
      <div className={styles.modalBody}>
        <div className={styles.camera}>
          <span className={styles.label}>摄像头</span>
          <Select
            value={curVideoCaptureDevice}
            onChange={hanleVideoCaptureDeviceChange}
            style={{ width: 240 }}
          >
            {devices.cameraList?.map((item) => {
              const { deviceId, label } = item;
              return (
                <Select.Option key={deviceId} vaue={deviceId}>
                  {label}
                </Select.Option>
              );
            })}
          </Select>
          <div className={styles.preview} id={PlayerDomId} />
        </div>
        <div className={styles.mic}>
          <div className={styles.microphone}>
            <span className={styles.label}>麦克风</span>
            <Select
              style={{ width: 240 }}
              value={curAudioCaptureDevice}
              onChange={hanleAudioCaptureDeviceChange}
            >
              {devices.microphoneList?.map((item) => {
                const { deviceId, label } = item;
                return (
                  <Select.Option key={deviceId} vaue={deviceId}>
                    {label}
                  </Select.Option>
                );
              })}
            </Select>
            <div className={styles.micDisplay}>
              <Icon src={MicrophoneOn} className={`${styles.iconLight} ${styles.iconScale}`} />
              <Progress
                className={styles.volumeProgress}
                type="line"
                size="small"
                showInfo={false}
                percent={audioCaptureVolumePercent}
                steps={27}
              />
            </div>
          </div>
          <div className={styles.playback}>
            <span className={styles.label}>扬声器</span>
            <Select
              style={{ width: 240 }}
              value={curAudioPlaybackDevice}
              onChange={handleAudioPlaybackDeviceChange}
            >
              {devices.audioPlayBackList?.map((item) => {
                const { deviceId, label } = item;
                return (
                  <Select.Option key={deviceId} vaue={deviceId}>
                    {label}
                  </Select.Option>
                );
              })}
            </Select>
            <div className={styles.volumeDisplay}>
              <Icon src={VolumeOn} className={styles.iconLight} />
              <Progress
                size="small"
                className={styles.volumeProgress}
                showInfo={false}
                percent={audioPlaybackVolumePercent}
                steps={27}
              />
              <div className={styles.playBtn} onClick={handlePlaybackMisic}>
                {startAudioPlaybackDeviceTest ? '停止' : '播放'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
