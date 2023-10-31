import { useMemo } from 'react';
import { useSelector } from '@/store';

// import Header from '@/components/Header';
import styles from './index.module.less';
import VideoView from './VideoView';
import ScreenView from './ScreenView';
import BoardView from './BoardView';
import { ShareStatus, ShareType } from '@/types/state';

enum View {
  VideoView = 'video',
  ScreenView = 'screen',
  BoardView = 'board',
}

export default function () {
  const room = useSelector((state) => state.edusRoom);

  const view: View = useMemo(() => {
    if (!room.room_id) {
      return View.BoardView;
    }
    if (room.share_status === ShareStatus.NotSharing) {
      return View.VideoView;
    }
    if (room.share_type === ShareType.Screen) {
      return View.ScreenView;
    }
    return View.BoardView;
  }, [room.share_status, room.share_type, room.room_id]);

  return (
    <div className={styles.playerWrapper}>
      {view === View.VideoView && <VideoView />}
      {view === View.ScreenView && <ScreenView />}
      {view === View.BoardView && <BoardView />}
    </div>
  );
}
