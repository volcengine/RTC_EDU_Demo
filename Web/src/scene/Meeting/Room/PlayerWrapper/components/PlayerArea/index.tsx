import { useMemo, useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from '@/store';

import CloseUpIcon from '@/assets/images/CloseUP.svg';
import PageStepArrow from '@/assets/images/PageStepArrow.svg';
import { Icon } from '@/components';
import { setPlayersAreaOpen } from '@/store/slices/ui';

import styles from './index.module.less';
import Player from '../Player';
import { IMeetingUser } from '@/store/slices/meetingRoom';
import useSortUser from '@/utils/useSortUser';

const PageSize = 6;

/**
 * 共享 & 白板视图下player列表
 */
function PlayerArea() {
  const dispatch = useDispatch();
  const room = useSelector((state) => state.meetingRoom);
  const activeSpeakers = room.activeSpeakers;

  const playersAreaOpen = useSelector((state) => state.ui.playersAreaOpen);
  const [curPage, setCurPage] = useState(0);
  const pageCount = useMemo(
    () => Math.ceil((room.remoteUsers.length + 1) / PageSize),
    [room.remoteUsers]
  );

  const handleCloseIcon = () => {
    dispatch(setPlayersAreaOpen(!playersAreaOpen));
  };

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
    <div
      className={styles.playersArea}
      style={{
        height: playersAreaOpen ? 114 : 32,
      }}
    >
      <div
        className={styles.playerWrapper}
        style={{
          display: playersAreaOpen ? 'flex' : 'none',
        }}
      >
        {room.remoteUsers?.length > PageSize - 1 && (
          <div className={classnames(styles.prePage, styles.pageBtn)} onClick={() => handlePre()}>
            <Icon src={PageStepArrow} />
          </div>
        )}
        {curPageUsers?.map((user) => {
          return <Player user={user} key={user?.user_id} className={styles.inlinePlayer} />;
        })}

        {room.remoteUsers?.length > PageSize - 1 && (
          <div className={classnames(styles.nextPage, styles.pageBtn)} onClick={() => handleNext()}>
            <Icon src={PageStepArrow} />
          </div>
        )}
      </div>

      <div
        className={`${styles.hideButton} ${playersAreaOpen ? '' : styles.hidePlayer} `}
        onClick={handleCloseIcon}
      >
        <Icon src={CloseUpIcon} />
      </div>
    </div>
  );
}

export default PlayerArea;
