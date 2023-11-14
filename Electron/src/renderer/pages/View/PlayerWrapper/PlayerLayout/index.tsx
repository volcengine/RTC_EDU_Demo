import React, { useEffect, useMemo, useState } from 'react';
import VideoPlayer from '@components/VideoPlayer';
import styles from './index.less';
import classnames from 'classnames';
import { useSelector } from '@src/store';
import useSortUser from '@src/utils/useSortUser';
import { IMeetingUser } from '@/renderer/store/slices/meetingRoom';
import { Icon } from '@/renderer/components';
import PageStepArrow from '@assets/images/PageStepArrow.svg';

interface PlayerLayoutProps {}

const PageSize = 9;

const PlayerLayout: React.FC<PlayerLayoutProps> = () => {
  const room = useSelector((state) => state.meetingRoom);
  const activeSpeakers = room.activeSpeakers;

  const [curPage, setCurPage] = useState(0);

  const { remoteUsers } = room;

  const pageCount = useMemo(() => Math.ceil((remoteUsers.length + 1) / 9), [remoteUsers]);

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
            <VideoPlayer
              user={user}
              room={room}
              key={user?.user_id || index}
              className={classnames(`${styles[`userCount-${curPageUsers.length}`]}`, styles.Player)}
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
};
export default PlayerLayout;
