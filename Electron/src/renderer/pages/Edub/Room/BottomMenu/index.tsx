import { useSelector } from '@src/store';
import { BaseUser } from '@src/types/state';

import { DeviceButton, SettingButton, UserListButton } from '@src/components';

import styles from './index.module.less';
import Stop from './StopButton';
import ApplyButton from './ApplyButton';
import { useHandleDevice } from '../../hooks';
import RecordButton from '../../components/RecordButton';
import React from 'react';
import { DeviceType } from '@/renderer/components/DeviceButton/utils';
import ShareButton from './ShareButton';
import { ScreenCaptureSourceInfo } from '@volcengine/vertc-electron-sdk/js/types';
import { ScreenListInfo } from '@/renderer/components/ScreenListModal';

interface BottomMenuProps {
  filterScreenIds: number[];
  screenListInfo: ScreenListInfo[];
  setFilterScreenIds: React.Dispatch<React.SetStateAction<number[]>>;
  setScreenList: React.Dispatch<React.SetStateAction<ScreenCaptureSourceInfo[]>>;
}

export default function (props: BottomMenuProps) {
  const { filterScreenIds, screenListInfo, setFilterScreenIds, setScreenList } = props;

  const room = useSelector((state) => state.edubRoom);
  const localUser = room.localUser;

  const handleDevice = useHandleDevice();

  return (
    <div className={styles.menuWrapper}>
      <div className={styles.menuLeft}>
        <DeviceButton
          localUser={localUser as Required<BaseUser>}
          deviceType={DeviceType.Microphone}
          text="麦克风"
          onDeivce={handleDevice}
        />
        <DeviceButton
          localUser={localUser as Required<BaseUser>}
          deviceType={DeviceType.Camera}
          text="摄像头"
          onDeivce={handleDevice}
        />
      </div>

      <div className={styles.menuMiddle}>
        <UserListButton room={room} />

        <ApplyButton />

        <ShareButton
          filterScreenIds={filterScreenIds}
          screenListInfo={screenListInfo}
          setFilterScreenIds={setFilterScreenIds}
          setScreenList={setScreenList}
        />

        <RecordButton />

        <SettingButton text="设置" />
      </div>

      <div className={styles.menuRight}>
        <Stop />
      </div>
    </div>
  );
}
