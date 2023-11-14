import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from '@src/store';

import {
  Permission,
  PullBoardStreamType,
  ShareStatus,
  ShareType,
  UserRole,
} from '@src/types/state';
import WhiteBoard from '@src/components/WhiteBoard';
import ScreenView from './ScreenView';

import styles from './index.module.less';
import LinkButton from '../../components/LinkButton';
import React from 'react';
import { LinkStatus } from '@/renderer/store/slices/edubRoom';
import { RtcClient } from '@/renderer/core/rtc';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';

enum View {
  VideoView = 'video',
  ScreenView = 'screen',
  BoardView = 'board',
}

export default function () {
  const room = useSelector((state) => state.edubRoom);

  const localUser = room.localUser;
  const localIsHost = localUser.user_role === UserRole.Host;
  const linkStatus = useSelector((state) => state.edubRoom.linkStatus);

  const boradStreamref = useRef<HTMLDivElement | null>(null);

  const view: View = useMemo(() => {
    if (room.share_status === ShareStatus.NotSharing) {
      return View.VideoView;
    }
    if (room.share_type === ShareType.Screen) {
      return View.ScreenView;
    }
    return View.BoardView;
  }, [room.share_status, room.share_type]);

  const shouldJoinBoard = useMemo(() => {
    // 连麦中 & 之前拉的是视频流
    const joinWithLinked =
      linkStatus === LinkStatus.Linking &&
      localUser.pull_wb_stream_type === PullBoardStreamType.Stream;

    const withBoard = localUser.pull_wb_stream_type === PullBoardStreamType.Board;

    return joinWithLinked || withBoard;
  }, [linkStatus, localUser.pull_wb_stream_type]);

  useEffect(() => {
    if (view !== View.BoardView) {
      return;
    }
    if (
      linkStatus !== LinkStatus.Linking &&
      localUser.pull_wb_stream_type === PullBoardStreamType.Stream &&
      boradStreamref.current
    ) {
      RtcClient.room?.subscribeStream(
        room.wb_stream_user_id!,
        MediaStreamType.kMediaStreamTypeVideo
      );
      RtcClient.setVideoPlayer(room.wb_stream_user_id!, boradStreamref.current!);
    }

    return () => {
      RtcClient.room?.unsubscribeStream(
        room.wb_stream_user_id!,
        MediaStreamType.kMediaStreamTypeVideo
      );
      RtcClient.removeVideoPlayer(room.wb_stream_user_id!);
    };
  }, [linkStatus, localUser.pull_wb_stream_type, view]);

  return (
    <div
      className={styles.edubWrapper}
      style={{
        width: localIsHost ? 'calc(100% - 177px - 8px)' : 'calc(100% - 332px - 8px)',
      }}
    >
      {view === View.ScreenView && <ScreenView />}
      {view === View.BoardView && shouldJoinBoard && (
        <div className={styles.boardWrapper}>
          <WhiteBoard
            room={room}
            localEditPermission={
              !!localUser.share_permission || localUser.user_role === UserRole.Host
                ? Permission.HasPermission
                : Permission.NoPermission
            }
          />
        </div>
      )}

      {view === View.BoardView && !shouldJoinBoard && (
        <div className={styles.boardWrapper} ref={boradStreamref} />
      )}
      {room.localUser.user_role !== UserRole.Host && <LinkButton />}
    </div>
  );
}
