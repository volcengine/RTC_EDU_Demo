import { useEffect, useMemo } from 'react';
import { MediaType } from '@volcengine/rtc';
import { RtcClient } from '@/core/rtc';
import { LinkStatus } from '@/store/slices/edubRoom';
import { useSelector } from '@/store';
import { Permission, PullBoardStreamType, ShareStatus, ShareType, UserRole } from '@/types/state';
import { WhiteBoard } from '@/components';

import ScreenView from './ScreenView';
import styles from './index.module.less';
import LinkButton from '../../components/LinkButton';

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
      localUser.pull_wb_stream_type === PullBoardStreamType.Stream
    ) {
      RtcClient.subscribeStream(room.wb_stream_user_id!, MediaType.VIDEO);
      RtcClient.setVideoPlayer(room.wb_stream_user_id!, 'board-stream');
    }

    return () => {
      if (view !== View.BoardView) {
        return;
      }
      if (
        linkStatus !== LinkStatus.Linking &&
        localUser.pull_wb_stream_type === PullBoardStreamType.Stream
      ) {
        RtcClient.unsubscribeStream(room.wb_stream_user_id!, MediaType.VIDEO);
        RtcClient.setVideoPlayer(room.wb_stream_user_id!, undefined);
      }
    };
  }, [linkStatus, localUser.pull_wb_stream_type, view]);

  return (
    <div
      className={styles.edubWrapper}
      style={{
        width: localIsHost ? 'calc(100% - 177px - 8px)' : 'calc(100% - 332px - 8px)',
      }}
    >
      {view === View.ScreenView && <ScreenView localUser={localUser} user={room.teacher} />}
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
        <div className={styles.boardWrapper} id="board-stream" />
      )}
      {room.localUser.user_role !== UserRole.Host && <LinkButton />}
    </div>
  );
}
