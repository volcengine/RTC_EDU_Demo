import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Select, Progress } from 'antd';
import MicrophoneOn from '@assets/images/MicrophoneOn.svg';
import VolumeOn from '@assets/images/VolumeOn.svg';

import styles from './index.less';
import Icon from '@components/Icon';
import type { veRTCVideo } from '@volcengine/vertc-electron-sdk';
import { RenderMode } from '@volcengine/vertc-electron-sdk/js/types';
import {
  setMicrophoneList,
  setAudioPlayBackList,
  setMicrophone,
  setAudioPlayBack,
  setCamera,
  setCameraList,
} from '@src/store/modules/devices';
import { useDispatch, useSelector } from '@/renderer/store';
import { RtcClient } from '@/renderer/core/rtc';

interface SettingModalProps {
  isShowModal: boolean;
  setIsShowModal: (show: boolean) => void;
  videoRef: React.MutableRefObject<HTMLDivElement | null>;
}
const { Option } = Select;

const SettingModal: React.FC<SettingModalProps> = (props) => {
  const { isShowModal, setIsShowModal, videoRef } = props;
  const [audioCaptureVolumePercent, setAudioCaptureVolumePercent] = useState(0);
  const [audioPlaybackVolumePercent, setAudioPlaybackVolumePercent] = useState(0);
  const [curChooseVideoCaptureDevice, setCurChooseVideoCaptureDevice] = useState('');
  const [curChooseAudioCaptureDevice, setCurChooseAudioCaptureDevice] = useState('');
  const [curChooseAudioPlaybackDevice, setCurChooseAudioPlaybackDevice] = useState('');
  const [isplay, setIsPlay] = useState(false);
  const ref = useRef<any>();
  const {
    cameraList,
    microphoneList,
    audioPlayBackList,
    selectedCamera,
    selectedMicrophone,
    selectedAudioPlayBack,
  } = useSelector((state) => state.device);
  const dispatch = useDispatch();

  // 处理本地音频信息回调
  const handleLocalVolumeCallback = (info: any) => {
    const { audio_properties_info } = info[0];
    const { linearVolume } = audio_properties_info;
    const temp = (linearVolume / 255) * 100;
    setAudioCaptureVolumePercent(temp);
  };

  // 处理音频播放回调
  const handlePlaybackVolueCallback = (volume: number) => {
    const temp = (volume / 255) * 100;
    setAudioPlaybackVolumePercent(temp);
  };
  // 测试播放设备
  const handlePlaybackMisic = () => {
    const micPath = window.veTools.getAppPath() + '/test_misic.mp4';
    if (isplay) {
      setAudioPlaybackVolumePercent(0);
      RtcClient.engine?.stopAudioPlaybackDeviceTest();
    } else {
      RtcClient.engine?.startAudioPlaybackDeviceTest(micPath, 200);
    }
    setIsPlay(!isplay);
    RtcClient.engine?.on('onAudioPlaybackDeviceTestVolume', handlePlaybackVolueCallback);
  };
  // 关闭弹窗
  const handleCloseModal = (setNewDevice?: boolean) => {
    RtcClient.engine?.removeListener('onLocalAudioPropertiesReport', handleLocalVolumeCallback);
    RtcClient.engine?.removeListener(
      'onAudioPlaybackDeviceTestVolume',
      handlePlaybackVolueCallback
    );
    RtcClient.engine?.enableAudioPropertiesReport(-1, false, false);
    setIsShowModal(false);
    RtcClient.engine?.removeLocalVideo();
    videoRef.current &&
      RtcClient.engine?.setupLocalVideo(videoRef.current, '', {
        renderMode: RenderMode.FIT,
        mirror: true,
      });
    RtcClient.engine?.stopAudioPlaybackDeviceTest();
    setIsPlay(false);
    if (!setNewDevice) {
      RtcClient.engine?.setVideoCaptureDevice(selectedCamera!);
      RtcClient.engine?.setAudioCaptureDevice(selectedMicrophone!);
      RtcClient.engine?.setAudioPlaybackDevice(selectedAudioPlayBack!);
      setCurChooseVideoCaptureDevice(selectedCamera!);
      setCurChooseAudioCaptureDevice(selectedMicrophone!);
      setCurChooseAudioPlaybackDevice(selectedAudioPlayBack!);
    }
  };
  // 完成
  const onFinish = () => {
    RtcClient.engine?.setVideoCaptureDevice(curChooseVideoCaptureDevice);
    RtcClient.engine?.setAudioCaptureDevice(curChooseAudioCaptureDevice);
    RtcClient.engine?.setAudioPlaybackDevice(curChooseAudioPlaybackDevice);
    dispatch(setCamera(curChooseVideoCaptureDevice));
    dispatch(setMicrophone(curChooseAudioCaptureDevice));
    dispatch(setAudioPlayBack(curChooseAudioPlaybackDevice));
    setIsPlay(false);
    handleCloseModal(true);
  };
  // 切换视频采集设备
  const hanleVideoCaptureDeviceChange = (value: string) => {
    setCurChooseVideoCaptureDevice(value);
    RtcClient.engine?.setVideoCaptureDevice(value);
  };
  // 切换音频采集设备
  const hanleAudioCaptureDeviceChange = (value: string) => {
    setCurChooseAudioCaptureDevice(value);
    RtcClient.engine?.setAudioCaptureDevice(value);
  };
  // 切换音频播放设备
  const handleAudioPlaybackDeviceChange = (value: string) => {
    setCurChooseAudioPlaybackDevice(value);
    RtcClient.engine?.setAudioPlaybackDevice(value);
  };
  useEffect(() => {
    if (isShowModal) {
      // rtcVideo?.removeLocalVideo();
      setAudioCaptureVolumePercent(0);
      setAudioPlaybackVolumePercent(0);
      const tempAudipCaptureDevices = RtcClient.engine?.enumerateAudioCaptureDevices() as any;
      const tempVideoCaptureDevices = RtcClient.engine?.enumerateVideoCaptureDevices() as any;
      const tempAudipPlaybackDevices = RtcClient.engine?.enumerateAudioPlaybackDevices() as any;
      const videoCaptureDeviceId = RtcClient.engine?.getVideoCaptureDevice();
      const audioCaptureDeviceId = RtcClient.engine?.getAudioCaptureDevice();
      const audioPlaybackDeviceId = RtcClient.engine?.getAudioPlaybackDevice();
      setCurChooseVideoCaptureDevice(videoCaptureDeviceId!);
      setCurChooseAudioCaptureDevice(audioCaptureDeviceId!);
      setCurChooseAudioPlaybackDevice(audioPlaybackDeviceId!);
      dispatch(setCameraList(tempVideoCaptureDevices));
      dispatch(setMicrophoneList(tempAudipCaptureDevices));
      dispatch(setAudioPlayBackList(tempAudipPlaybackDevices));
      RtcClient.engine?.enableAudioPropertiesReport(200, false, false);
      RtcClient.engine?.on('onLocalAudioPropertiesReport', handleLocalVolumeCallback);
    }
  }, [isShowModal]);

  useEffect(() => {
    if (ref.current && isShowModal) {
      RtcClient.engine?.removeLocalVideo();
      RtcClient.engine?.setupLocalVideo(ref.current, '', {
        renderMode: RenderMode.FIT,
        mirror: true,
      });
    }
  }, [ref.current, isShowModal]);

  return (
    <Modal
      className={styles.modal}
      title="设备检测"
      open={isShowModal}
      centered={true}
      width={800}
      onCancel={() => handleCloseModal()}
      footer={
        <Button type="primary" onClick={onFinish}>
          完成
        </Button>
      }
    >
      <div className={styles.modalBody}>
        <div className={styles.camera}>
          <div>
            <span className={styles.label}>摄像头</span>
            <Select
              value={curChooseVideoCaptureDevice}
              onChange={hanleVideoCaptureDeviceChange}
              style={{ width: 240 }}
            >
              {cameraList.map((item) => {
                const { device_id, device_name } = item;
                return (
                  <Option key={device_id} vaue={device_id}>
                    {device_name}
                  </Option>
                );
              })}
            </Select>
            <div className={styles.preview} ref={ref} />
          </div>
        </div>
        <div className={styles.mic}>
          <div className={styles.microphone}>
            <span className={styles.label}>麦克风</span>
            <Select
              style={{ width: 240 }}
              value={curChooseAudioCaptureDevice}
              onChange={hanleAudioCaptureDeviceChange}
            >
              {microphoneList.map((item) => {
                const { device_id, device_name } = item;
                return (
                  <Option key={device_id} vaue={device_id}>
                    {device_name}
                  </Option>
                );
              })}
            </Select>
            <div className={styles.captureVolume}>
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
            <div className={styles.captureVolume} />
          </div>
          <div className={styles.playback}>
            <span className={styles.label}>扬声器</span>
            <Select
              style={{ width: 240 }}
              value={curChooseAudioPlaybackDevice}
              onChange={handleAudioPlaybackDeviceChange}
            >
              {audioPlayBackList.map((item) => {
                const { device_id, device_name } = item;
                return (
                  <Option key={device_id} vaue={device_id}>
                    {device_name}
                  </Option>
                );
              })}
            </Select>
            <div className={styles.playbackVolume}>
              <Icon src={VolumeOn} className={styles.iconLight} />
              <Progress
                className={styles.volumeProgress}
                size="small"
                showInfo={false}
                percent={audioPlaybackVolumePercent}
                steps={27}
              />
              <div className={styles.playBtn} onClick={handlePlaybackMisic}>
                {isplay ? '停止' : '播放'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingModal;
