import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from '@/store';
import CloseIcon from '@/assets/images/Close.svg';
import { Icon } from '@/components';
import { setUserListDrawOpen } from '@/store/slices/ui';
import MicrophoneOffIcon from '@/assets/images/MicrophoneOff.svg';
import * as rtsApi from '@/scene/Edus/apis/rtsApi';

import { MuteAllModal, UserInfo } from './components';
import styles from './index.module.less';
import { DeviceState, Permission, RoomMicStatus, UserRole } from '@/types/state';
import { sortUserByRole } from '@/utils/useSortUser';

export default function () {
  const ui = useSelector((state) => state.ui);
  const room = useSelector((state) => state.edusRoom);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [muteModalVisible, setMuteModalVisible] = useState(false);

  const handleCloseUserListDraw = () => {
    dispatch(setUserListDrawOpen(!ui.userListDrawOpen));
  };

  const isHost = room.localUser.user_role === UserRole.Host;

  const handleMuteModal = async () => {
    if (!isHost) {
      return;
    }

    setMuteModalVisible(true);
  };

  const handleMuteAll = async (selfMicPermision: Permission) => {
    setMuteModalVisible(false);

    await rtsApi.vcOperateAllMic({
      operate_self_mic_permission: selfMicPermision,
      operate: DeviceState.Closed,
    });
  };

  return (
    <div
      className={styles.userListWrapper}
      style={{
        display: ui.userListDrawOpen ? 'block' : 'none',
      }}
    >
      <div className={styles.userListTitle}>
        <span>
          成员(
          {(room.remoteUsers?.length || 0) + (searchParams?.get('visibility') === 'false' ? 0 : 1)})
        </span>
        <span onClick={handleCloseUserListDraw}>
          <Icon src={CloseIcon} className={styles.iconClose} />
        </span>
      </div>

      <div className={styles.userListContent}>
        <UserInfo user={room.localUser!} />
        {sortUserByRole(room.remoteUsers || [], room.share_user_id)?.map((user) => {
          return <UserInfo user={user} key={user.user_id} />;
        })}
      </div>

      {isHost && (
        <div
          className={`${styles.muteAllButton} ${
            room.room_mic_status === RoomMicStatus.AllMuted && styles.muted
          }`}
          onClick={handleMuteModal}
        >
          <Icon src={MicrophoneOffIcon} className={styles.muteAllIcon} />
          全体静音
        </div>
      )}

      <MuteAllModal
        open={muteModalVisible}
        onOk={handleMuteAll}
        onCancel={() => {
          setMuteModalVisible(false);
        }}
      />
    </div>
  );
}
