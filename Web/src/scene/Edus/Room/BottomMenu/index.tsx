import { Popover, message as Message } from 'antd';
import { useState } from 'react';
import { DeviceButton, PopoverContent, SettingButton, UserListButton } from '@/components';
import { useSelector } from '@/store';
import BoardButton from './BoardButton';
import styles from './index.module.less';
import Record from './Record';
import ShareButton from './ShareButton';
import * as rtsApi from '@/scene/Edus/apis/rtsApi';
import Stop from './Stop';
import { BaseUser, DeviceState, Permission, UserRole } from '@/types/state';
import { DeviceType } from '@/components/DeviceButton/utils';
import useHandleDevice from '../../hooks/useHandleDeivce';

export default function () {
  const room = useSelector((state) => state.edusRoom);
  const [popOpen, setPopOpen] = useState(false);

  const localUser = room.localUser;

  const handleDevice = useHandleDevice();

  const handleApplyMic = async () => {
    setPopOpen(false);
    Message.info('你已申请发言');
    await rtsApi.operateSelfMicApply({
      operate: DeviceState.Open,
    });
  };

  const hasMicPermission =
    localUser.user_role === UserRole.Host ||
    room.operate_self_mic_permission === Permission.HasPermission ||
    localUser.mic === DeviceState.Open;

  const handleMicClick = (device: DeviceType) => {
    if (hasMicPermission) {
      handleDevice(device);
    }
    setPopOpen(true);
  };

  return (
    <div className={styles.menuWrapper}>
      <div className={styles.menuLeft}>
        {hasMicPermission ? (
          <DeviceButton
            localUser={localUser as Required<BaseUser>}
            deviceType={DeviceType.Microphone}
            text="麦克风"
            onDeivce={handleDevice}
          />
        ) : (
          <Popover
            trigger="click"
            overlayClassName={styles.micPopover}
            open={popOpen}
            placement="topLeft"
            content={
              <PopoverContent
                okText="申请权限"
                onOk={handleApplyMic}
                onCancel={() => {
                  setPopOpen(false);
                }}
                titleText="暂无麦克风权限，请向老师申请"
              />
            }
          >
            <DeviceButton
              localUser={localUser as Required<BaseUser>}
              deviceType={DeviceType.Microphone}
              text="麦克风"
              onDeivce={handleMicClick}
            />
          </Popover>
        )}
        <DeviceButton
          localUser={localUser as Required<BaseUser>}
          deviceType={DeviceType.Camera}
          text="摄像头"
          onDeivce={handleDevice}
        />
      </div>

      <div className={styles.menuMiddle}>
        <UserListButton room={room} />

        <ShareButton />

        <BoardButton />

        <Record />

        <SettingButton text="设置" />
      </div>

      <div className={styles.menuRight}>
        <Stop />
      </div>
    </div>
  );
}
