import { useEffect, useMemo, useRef, useState } from 'react';
import { message as Message, Popover, Radio, RadioChangeEvent, message } from 'antd';
import { useSelector } from '@/store';
import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Edus/apis/rtsApi';
import ArrowIcon from '@/assets/images/Arrow.svg';
import ShareIcon from '@/assets/images/Share.svg';
import styles from './index.module.less';
import {
  Permission,
  ShareConfig,
  ShareType,
  UserRole,
  ScreenEncoderConfigForMotionMode,
  ScreenEncoderConfigForDetailMode,
} from '@/types/state';
import { isRtsError } from '@/utils/rtsUtils';
import { Icon, MenuIconButton, PopoverContent } from '@/components';

export default function () {
  const room = useSelector((state) => state.edusRoom);

  const [showOptions, setShowOptions] = useState(false);

  const [shareScreenMode, setShareScreenMode] = useState<ShareConfig>(ShareConfig.Detail);
  const btnRef = useRef<HTMLDivElement>(null);

  const [popOpen, setPopOpen] = useState(false);
  const isHost = room.localUser.user_role === UserRole.Host;

  const hasSharePermission = useMemo(() => {
    return isHost || room.localUser?.share_permission === Permission.HasPermission;
  }, [room, isHost]);

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
    const chosenMode = e.target.value;

    const encodeConfig =
      chosenMode === ShareConfig.Motion
        ? ScreenEncoderConfigForMotionMode
        : ScreenEncoderConfigForDetailMode;

    setShareScreenMode(chosenMode);

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
            iconClassName={styles.noPermIcon}
            onClick={handleClick}
            text="申请屏幕共享"
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
          <Radio.Group onChange={handleShareScreenConfigChange} value={shareScreenMode}>
            <Radio value={ShareConfig.Detail}>清晰度优先</Radio>
            <Radio value={ShareConfig.Motion}>流畅度优先</Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}
