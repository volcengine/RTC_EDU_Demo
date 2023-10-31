import { useSelector } from '@/store';
import { BaseUser } from '@/types/state';

import { DeviceButton, SettingButton, UserListButton } from '@/components';

import styles from './index.module.less';
import Stop from './StopButton';
import ShareButton from './ShareButton';
import ApplyButton from '../../components/ApplyButton';
import { useHandleDevice } from '../../hooks';
import { DeviceType } from '@/components/DeviceButton/utils';
import RecordButton from '../../components/RecordButton';

export default function () {
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

        <ShareButton />

        <RecordButton room={room} />

        <SettingButton text="设置" />
      </div>

      <div className={styles.menuRight}>
        <Stop />
      </div>
    </div>
  );
}
