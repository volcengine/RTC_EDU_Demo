import { Radio, RadioChangeEvent, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from '@/store';
import ShareIcon from '@/assets/images/Share.svg';
import BoardIcon from '@/assets/images/Board.svg';
import ArrowIcon from '@/assets/images/Arrow.svg';

import { Icon, MenuIconButton } from '@/components';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';

import { RtcClient } from '@/core/rtc';
import styles from './index.module.less';
import {
  ShareConfig,
  ShareType,
  ScreenEncoderConfigForMotionMode,
  ScreenEncoderConfigForDetailMode,
} from '@/types/state';

export default function () {
  const room = useSelector((state) => state.edubRoom);

  const [showOptions, setShowOptions] = useState(false);

  const [shareScreenMode, setShareScreenMode] = useState<ShareConfig>(ShareConfig.Detail);

  const shareType = room.share_type;

  const btnRef = useRef<HTMLDivElement>(null);

  const handleShareScreenConfigChange = (e: RadioChangeEvent) => {
    const chosenMode = e.target.value;

    const encodeConfig =
      chosenMode === ShareConfig.Motion
        ? ScreenEncoderConfigForMotionMode
        : ScreenEncoderConfigForDetailMode;

    setShareScreenMode(chosenMode);

    RtcClient.setScreenConfig(encodeConfig);

    setShowOptions(false);
  };

  // 大班课模式，只有老师有权限操作
  // 大班课模式，只能在白板和屏幕之间切换
  const handleClick = async () => {
    const shareRes = await RtcClient.startScreenCapture();
    if (shareRes !== 'success') {
      console.error('startScreenCapture err:', shareRes);
      if (shareRes === 'Permission denied by system') {
        message.error('请到系统设置中打开屏幕共享权限');
      }
      return;
    }

    await rtsApi.startShare({
      share_type: ShareType.Screen,
    });
  };

  useEffect(() => {
    const hidePop = (e: Event) => {
      if (!btnRef.current?.contains(e.target as unknown as HTMLElement)) {
        setShowOptions(false);
      }
    };

    window.addEventListener('click', hidePop);
    return () => {
      window.removeEventListener('click', hidePop);
    };
  }, [btnRef]);

  return (
    <div className={styles.menuButton} ref={btnRef}>
      <MenuIconButton
        iconClassName={styles.sharingIcon}
        onClick={handleClick}
        text={shareType === ShareType.Screen ? '屏幕共享' : '切至屏幕共享'}
        icon={shareType === ShareType.Screen ? ShareIcon : BoardIcon}
      />
      <div
        className={`${styles.ArrowIcon} ${showOptions ? styles.ArrowIconRotate : ''}`}
        onClick={() => {
          setShowOptions(!showOptions);
        }}
      >
        <Icon src={ArrowIcon} />
      </div>

      <div
        className={styles.devicesList}
        onMouseLeave={() => {
          setShowOptions(false);
        }}
        style={{
          display: showOptions ? 'block' : 'none',
        }}
      >
        <div className={styles.mediaDevicesContent}>
          <Radio.Group onChange={handleShareScreenConfigChange} value={shareScreenMode}>
            <Radio value={ShareConfig.Detail}>清晰度优先</Radio>
            <Radio value={ShareConfig.Motion}>流畅度优先</Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}
