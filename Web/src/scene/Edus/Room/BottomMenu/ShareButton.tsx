import { useEffect, useMemo, useRef, useState } from 'react';
import { message as Message, Popover, Radio, RadioChangeEvent, message } from 'antd';
import { ScreenEncoderConfig } from '@volcengine/rtc';
import { useSelector } from '@/store';
import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Edus/apis/rtsApi';
import ArrowIcon from '@/assets/images/Arrow.svg';

import ShareIcon from '@/assets/images/Share.svg';

import styles from './index.module.less';
import { Permission, ShareConfig, ShareType, UserRole } from '@/types/state';
import { isRtsError } from '@/utils/rtsUtils';
import { Icon, MenuIconButton, PopoverContent } from '@/components';

export default function () {
  const room = useSelector((state) => state.edusRoom);

  const [showOptions, setShowOptions] = useState(false);

  const [shareScreenConfig, setShareScreenConfig] = useState<ShareConfig>(ShareConfig.Text);
  const btnRef = useRef<HTMLDivElement>(null);

  const [popOpen, setPopOpen] = useState(false);
  const isHost = room.localUser.user_role === UserRole.Host;

  const hasSharePermission =
    isHost || room.localUser?.share_permission === Permission.HasPermission;

  const isSharing = useMemo(() => {
    return room?.share_user_id && room.share_type === ShareType.Screen;
  }, [room]);

  const handleApplyShare = () => {
    rtsApi.sharePermissionApply();
    setPopOpen(false);
  };

  const handleClick = async () => {
    if (!hasSharePermission) {
      setPopOpen(true);
      return;
    }

    const shareRes = await RtcClient.startScreenCapture();
    if (shareRes !== 'success') {
      console.error('startScreenCapture err:', shareRes);
      //   Message.error('屏幕共享失败');
      if (shareRes === 'Permission denied by system') {
        message.error('请到系统设置中打开屏幕共享权限');
      }
      return;
    }

    const res = await rtsApi.startShare({
      share_type: ShareType.Screen,
    });
    if (!isRtsError(res)) {
      Message.success('学生现在可以看到你的共享的屏幕');
    } else {
      Message.error('共享失败了');
    }
  };

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
      {hasSharePermission ? (
        <MenuIconButton
          iconClassName={isSharing ? styles.sharingIcon : styles.normalIcon}
          onClick={handleClick}
          text="屏幕共享"
          icon={ShareIcon}
        />
      ) : (
        <Popover
          trigger="click"
          //   overlayClassName={styles.micPopover}
          open={popOpen}
          placement="top"
          content={
            <PopoverContent
              okText="申请权限"
              onOk={handleApplyShare}
              onCancel={() => {
                setPopOpen(false);
              }}
              titleText="暂无共享权限，请向老师申请"
            />
          }
        >
          <MenuIconButton
            iconClassName={isSharing ? styles.sharingIcon : styles.normalIcon}
            onClick={handleClick}
            text="屏幕共享"
            icon={ShareIcon}
          />
        </Popover>
      )}

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
