import { Radio, RadioChangeEvent, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ScreenEncoderConfig } from '@volcengine/rtc';
import { useSelector } from '@/store';
import ShareIcon from '@/assets/images/Share.svg';
import BoardIcon from '@/assets/images/Board.svg';
import ArrowIcon from '@/assets/images/Arrow.svg';

import { Icon, MenuIconButton } from '@/components';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';

import { RtcClient } from '@/core/rtc';
import styles from './index.module.less';
import { ShareConfig, ShareType } from '@/types/state';

export default function () {
  const room = useSelector((state) => state.edubRoom);

  const [showOptions, setShowOptions] = useState(false);

  const [shareScreenConfig, setShareScreenConfig] = useState<ShareConfig>(ShareConfig.Text);

  const shareType = room.share_type;

  const btnRef = useRef<HTMLDivElement>(null);

  const handleShareScreenConfigChange = (e: RadioChangeEvent) => {
    const newConfig = e.target.value;

    const encodeConfig: ScreenEncoderConfig = {
      width: 1920,
      height: 1080,
      frameRate: 15,
      maxKbps: 3000,
      contentHint: ShareConfig.Text,
    };

    // if (newConfig === ShareConfig.Detail) {
    //   encodeConfig.frameRate = 15;
    //   encodeConfig.maxKbps = 3000;
    //   encodeConfig.contentHint = ShareConfig.Detail;
    // }

    // if (newConfig === ShareConfig.Text) {
    //   encodeConfig.frameRate = 5;
    //   encodeConfig.contentHint = ShareConfig.Text;
    // }

    if (newConfig === ShareConfig.Motion) {
      encodeConfig.width = 1280;
      encodeConfig.height = 720;
      encodeConfig.frameRate = 30;
      encodeConfig.contentHint = ShareConfig.Motion;
    }
    setShareScreenConfig(newConfig);

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

    await rtsApi.edubStartShare({
      share_type: ShareType.Screen,
    });
    // if (shareType === ShareType.Board) {
    // } else {
    //   await RtcClient.stopScreenCapture();
    //   await rtsApi.edubStopShare();
    // }
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
        text="屏幕共享"
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
          <Radio.Group onChange={handleShareScreenConfigChange} value={shareScreenConfig}>
            <Radio value={ShareConfig.Text}>清晰度优先</Radio>
            <Radio value={ShareConfig.Motion}>流畅度优先</Radio>
            {/* <Radio value={ShareConfig.Detail}>
                  智能模式
                  <span className={styles.shareDesc}>根据共享内容自动切换清晰或流畅模式</span>
                </Radio> */}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}
