import React, { useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';
import classNames from 'classnames';
import Up from '@assets/images/Up.svg';

import VideoPlayer from '@components/VideoPlayer';
import Icon from '@components/Icon/index';
import { BaseUser } from '@/renderer/types/state';
import { useDispatch, useSelector } from '@/renderer/store';

import { ProcessEvent } from '@/types';

import styles from './index.less';
import { setPlayersAreaOpen } from '@/renderer/store/slices/ui';
import useSortUser from '@/renderer/utils/useSortUser';

interface ShareLayoutProps {
  isMesharingScreen?: boolean;
  room: {
    activeSpeakers: string[];
    share_user_id?: string;
    localUser: Partial<
      BaseUser & {
        isActive: boolean;
      }
    >;
    remoteUsers: Partial<
      BaseUser & {
        isActive: boolean;
      }
    >[];
  };

  renderHover?: (
    user: Partial<
      BaseUser & {
        isActive: boolean;
      }
    >,
    room: {
      share_user_id?: string;
      localUser: Partial<
        BaseUser & {
          isActive: boolean;
        }
      >;
    }
  ) => React.ReactElement;
}

const ShareLayout: React.FC<ShareLayoutProps> = (props) => {
  const { isMesharingScreen, room, renderHover } = props;
  //   const [isShowPlayer, setIsShowPlayer] = useState(true);
  const [curPage, setCurPage] = useState(0);

  const playerPages = useMemo(
    () => Math.ceil((room.remoteUsers.length + 1) / 6),
    [room.remoteUsers]
  );
  const playersAreaOpen = useSelector((state) => state.ui.playersAreaOpen);

  const dispatch = useDispatch();

  const { curPageUsers, updatePageUser } = useSortUser({
    localUser: room.localUser as BaseUser,
    remoteUsers: room.remoteUsers as BaseUser[],
    curPage: curPage,
    pageSize: 6,
    activeSpeakers: room.activeSpeakers,
    shareUserId: room.share_user_id,
  });

  const handlePre = () => {
    if (curPage <= 0) {
      return;
    }
    setCurPage(curPage - 1);
  };
  const handleNext = () => {
    if (curPage >= playerPages - 1) {
      updatePageUser();
      return;
    }
    setCurPage(curPage + 1);
  };

  const handleChangeViewShow = () => {
    if (isMesharingScreen) {
      if (playersAreaOpen) {
        ipcRenderer.send(ProcessEvent.CloseVideoWindow);
      } else {
        ipcRenderer.send(ProcessEvent.OpenVideoWindow);
      }
    }

    dispatch(setPlayersAreaOpen(!playersAreaOpen));
  };
  return (
    <div className={styles.shareView}>
      <div className={styles.videoView} style={{ display: playersAreaOpen ? 'flex' : 'none' }}>
        {playerPages > 1 && (
          <button onClick={handlePre} className={classNames(styles.prePageBtn, styles.pageFlipBtn)}>
            <Icon src={Up} className={classNames(styles.left, styles.icon)} />
          </button>
        )}
        <div className={styles.body}>
          {curPageUsers.map((item) => {
            return (
              <div key={item.user_id} className={styles.player}>
                <VideoPlayer
                  renderHover={renderHover}
                  className={styles.Player}
                  user={item}
                  room={room}
                />
              </div>
            );
          })}
        </div>
        {playerPages > 1 && (
          <button
            onClick={handleNext}
            className={classNames(styles.nextPageBtn, styles.pageFlipBtn)}
          >
            <Icon src={Up} className={classNames(styles.right, styles.icon)} />
          </button>
        )}
      </div>
      <div className={styles.control} onClick={handleChangeViewShow}>
        <Icon className={classNames(styles.icon, { [styles.down]: !playersAreaOpen })} src={Up} />
      </div>
    </div>
  );
};

export default ShareLayout;
