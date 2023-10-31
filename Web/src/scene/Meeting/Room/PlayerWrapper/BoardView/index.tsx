import { useSelector } from '@/store';

import styles from './index.module.less';

import PlayerArea from '../components/PlayerArea';
import { WhiteBoard } from '@/components';
import { Permission, UserRole } from '@/types/state';

export default function () {
  const playersAreaOpen = useSelector((state) => state.ui.playersAreaOpen);
  const room = useSelector((state) => state.meetingRoom);

  const localUser = room.localUser;

  return (
    <div className={styles.shareViewWrapper}>
      <PlayerArea />

      <div
        className={styles.boardWrapper}
        style={{
          height: `calc(100% - ${playersAreaOpen ? 114 : 32}px )`,
        }}
      >
        <WhiteBoard
          room={room}
          localEditPermission={
            !!localUser.share_permission || localUser.user_role === UserRole.Host
              ? Permission.HasPermission
              : Permission.NoPermission
          }
        />
      </div>
    </div>
  );
}
