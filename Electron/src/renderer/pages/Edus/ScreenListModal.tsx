import React, { useState } from 'react';
import { Modal, Image, Checkbox } from 'antd';
import styles from './index.less';
import {
  ScreenCaptureSourceInfo,
  ThumbnailInfo,
  MediaStreamType,
  ScreenCaptureSourceType,
} from '@volcengine/vertc-electron-sdk/js/types';
import { ipcRenderer } from 'electron';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { installVirtualCard } from '@src/utils';
import { ProcessEvent } from '@/types';
import { ShareType } from '@/renderer/types/state';
import * as rtsApi from './apis';
import { RtcClient } from '@/renderer/core/rtc';
import { useSelector } from '@/renderer/store';
import { getScreenConfig } from '@/renderer/core/utils';

interface ScreenListModalProps {
  isShowScreenList: boolean;
  setIsShowScreenList: (show: boolean) => void;
  setMeShareScreen: (share: boolean) => void;
  filterScreenIds: number[];
  screenListInfo: {
    type: ScreenCaptureSourceType;
    source_id: number;
    source_name: string;
    application: string;
    primaryMonitor: boolean;
    pid: number;
    region_rect: {
      width: number;
      height: number;
      x: number;
      y: number;
    };
    thumbnail: ThumbnailInfo | undefined;
  }[];
}

const ScreenListModal: React.FC<ScreenListModalProps> = (props) => {
  const {
    isShowScreenList,
    setIsShowScreenList,
    screenListInfo,
    filterScreenIds,
    setMeShareScreen,
  } = props;
  const [isShareAudio, setIsShareAudio] = useState(false);
  const shareScreenConfig = useSelector((state) => state.ui.screenEncodeConfig);

  // 点击屏幕共享窗口项,发送信令
  const handleScreenShare = (screenInfo: ScreenCaptureSourceInfo) => {
    if (screenInfo) {
      ipcRenderer.send(ProcessEvent.MiniScreen);
      setMeShareScreen(true);

      rtsApi.startShare({
        share_type: ShareType.Screen,
      });

      ipcRenderer.once('mainWindowChangeFinish', (e, mid, screenHeight) => {
        ipcRenderer.send(ProcessEvent.ShowFooter, mid, screenHeight);
        const screenSolution = getScreenConfig(shareScreenConfig);
        RtcClient.engine?.setScreenVideoEncoderConfig(screenSolution);
        console.log('setScreenVideoEncoderConfig:', screenSolution);

        RtcClient?.startScreenVideoCapture(screenInfo, {
          region_rect: {
            ...screenInfo.region_rect,
            x: 0,
            y: 0,
          },
          capture_mouse_cursor: 1,
          filter_config: filterScreenIds,
          highlight_config: {
            enable_highlight: true,
            border_color: 0xff29cca3,
            border_width: 4,
          },
        });

        if (isShareAudio) {
          if (process.platform === 'darwin') {
            const audioCaptureDevices = RtcClient.getDevices().audioInputs;
            const virtualCard = audioCaptureDevices.find(
              (item) => item.device_name === 'VeRTCVirtualSoundCard'
            );
            console.log('采集屏幕音频：', virtualCard);
            virtualCard && RtcClient?.startScreenAudioCapture(virtualCard.device_id);
          } else {
            RtcClient?.startScreenAudioCapture();
          }
        } else {
          RtcClient?.stopScreenAudioCapture();
        }

        RtcClient.room?.publishScreen(MediaStreamType.kMediaStreamTypeBoth);
      });
      ipcRenderer.send(
        ProcessEvent.ChangeMainWindow,
        screenInfo.region_rect.x,
        screenInfo.region_rect.y,
        screenInfo.region_rect.width,
        screenInfo.region_rect.height
      );
      setIsShowScreenList(false);
    }
  };
  // 改变是否共享音频时
  const handleCheckAudioShare = (e: CheckboxChangeEvent) => {
    if (process.platform === 'darwin') {
      const audioCaptureDevices = RtcClient.getDevices().audioInputs;
      const virtualCard = audioCaptureDevices.find(
        (item) => item.device_name === 'VeRTCVirtualSoundCard'
      );
      if (!virtualCard) {
        installVirtualCard();
      }
    }
    if (e.target.checked) {
      setIsShareAudio(true);
    } else {
      setIsShareAudio(false);
    }
  };
  return (
    <Modal
      width={800}
      centered={true}
      className={styles.screenList}
      onCancel={() => setIsShowScreenList(false)}
      open={isShowScreenList}
      title="选择共享的内容"
      footer={
        <div className={styles.audioCheck}>
          <Checkbox checked={isShareAudio} onChange={handleCheckAudioShare}>
            共享音频
          </Checkbox>
        </div>
      }
    >
      {screenListInfo.map((item) => {
        let {
          type,
          source_id,
          source_name = '',
          application,
          primaryMonitor,
          pid,
          region_rect,
          thumbnail,
        } = item;
        return (
          <div
            onClick={() => {
              handleScreenShare({
                type,
                source_id,
                source_name,
                application,
                primaryMonitor,
                pid,
                region_rect,
              });
            }}
            className={styles.screen}
            key={source_id}
          >
            <Image preview={false} width={160} height={90} src={thumbnail?.data} />
            <div className={styles.name}>{source_name}</div>
          </div>
        );
      })}
    </Modal>
  );
};

export default ScreenListModal;
