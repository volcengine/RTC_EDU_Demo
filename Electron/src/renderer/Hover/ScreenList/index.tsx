import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Divider, Image, Checkbox } from 'antd';
import { ipcRenderer } from 'electron';
import { ProcessEvent, WindowType } from '@/types';
import {
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
  ThumbnailInfo,
} from '@volcengine/vertc-electron-sdk/js/types/index';
import IconButton from '@src/components/IconButton';
import Close from '@assets/images/Close.svg';

import { remote } from 'electron';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { installVirtualCard } from '@src/utils';
import classNames from 'classnames';
import { useSelector } from '@/renderer/store';
const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

interface ScreenList {
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
}

const ScreenList: React.FC<{ screenListInfo: ScreenList[] }> = ({ screenListInfo }) => {
  const [isShareAudio, setIsShareAudio] = useState(false);
  const { microphoneList } = useSelector((state) => state.device);

  const hideWindow = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.SCREEN);
  };

  const handleScreenShare = (screenInfo: ScreenCaptureSourceInfo) => {
    ipcRenderer.sendTo(mainWindowId, 'handleScreenShare', screenInfo, isShareAudio);
    hideWindow();
  };

  // 改变是否共享音频时
  const handleCheckAudioShare = (e: CheckboxChangeEvent) => {
    if (process.platform === 'darwin') {
      const virtualCard = microphoneList.find(
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
    <div className={styles.screenList}>
      <div className={styles.header}>
        <div className={styles.memberNum}>选择共享的屏幕</div>
        <div onClick={hideWindow} className={styles.closeIcon}>
          <IconButton src={Close} />
        </div>
      </div>
      <Divider />
      <div className={classNames(styles.body, { [styles.windows]: process.platform === 'win32' })}>
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
      </div>
      <Divider />
      <div className={styles.footer}>
        <div className={styles.audioCheck}>
          <Checkbox checked={isShareAudio} onChange={handleCheckAudioShare}>
            共享音频
          </Checkbox>
        </div>
      </div>
    </div>
  );
};

export default ScreenList;
