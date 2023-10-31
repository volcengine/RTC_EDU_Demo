import { useMemo, useState } from 'react';
import classnames from 'classnames';
import { useSelector } from '@/store';

import styles from './index.module.less';
import Player from '../components/Player';
import { Icon } from '@/components';
import PageStepArrow from '@/assets/images/PageStepArrow.svg';
import { IMeetingUser } from '@/store/slices/meetingRoom';
import useSortUser from '@/utils/useSortUser';

const PageSize = 9;

export default function () {
  const room = useSelector((state) => state.meetingRoom);
  const activeSpeakers = room.activeSpeakers;

  const [curPage, setCurPage] = useState(0);

  const pageCount = useMemo(
    () => Math.ceil((room.remoteUsers.length + 1) / PageSize),
    [room.remoteUsers]
  );

  const { curPageUsers, updatePageUser } = useSortUser({
    localUser: room.localUser as IMeetingUser,
    remoteUsers: room.remoteUsers,
    curPage,
    pageSize: PageSize,
    activeSpeakers,
    shareUserId: room.share_user_id,
  });

  const handlePre = () => {
    if (curPage <= 0) {
      return;
    }
    setCurPage(curPage - 1);
  };
  const handleNext = () => {
    if (curPage >= pageCount - 1) {
      updatePageUser();
      return;
    }
    setCurPage(curPage + 1);
  };

  return (
    <div className={styles.videoViewWrapper}>
      <div
        className={`${styles.videoViewLayout}`}
        style={{
          //   height: pageCount > 1 ? 'calc(100% - 8px)' : '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        {curPageUsers.map((user, index) => {
          return (
            // todo: 这里接管外面的UI
            <Player
              user={user}
              key={user?.user_id || index}
              showNameIcon
              className={`${styles[`userCount-${curPageUsers.length}`]}`}
            />
          );
        })}
      </div>
      {room.remoteUsers?.length > PageSize - 1 && (
        <div className={classnames(styles.prePage, styles.pageBtn)} onClick={() => handlePre()}>
          <Icon src={PageStepArrow} />
        </div>
      )}
      {room.remoteUsers?.length > PageSize - 1 && (
        <div className={classnames(styles.nextPage, styles.pageBtn)} onClick={() => handleNext()}>
          <Icon src={PageStepArrow} />
        </div>
      )}
    </div>
  );
}
