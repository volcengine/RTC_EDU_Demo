import { useEffect, useMemo, useRef, useState } from 'react';
import { EditMode} from '@volcengine/white-board-manage';
import { BoardClient } from '@/core/board';
import { useBoardRoomEventListener } from '@/core/boardHooks';

import BoardPages from './BoardPages';
import BottomControl from './BottomControl';
import SideToolBar from './SideToolBar';
import BoardContext from './BoardContext';
import styles from './index.module.less';
import { Permission } from '@/types/state';
import { useSelector } from '@/store';
import getBoardSize from './utils';

function WhiteBoard(props: {
  localEditPermission: Permission;
  room: {
    room_id?: string;
  };
}) {
  const { localEditPermission, room } = props;

  const [curBoard, setCurBoard] = useState<number | string>();
  const [closedId, setClosedId] = useState<number | string>();
  const [curPageId, setCurPageId] = useState<string>();

  const boardWrapper = useRef<HTMLDivElement>(null);

  const { userListDrawOpen, boardPagePreviewOpen, playersAreaOpen } = useSelector(
    (state) => state.ui
  );

  const {
    handlers: roomHandlers,
    disabledUndo,
    disabledRedo,
  } = useBoardRoomEventListener({
    setCurBoard,
    setCurPageId,
    setClosedId,
    localEditPermission,
  });

  useEffect(() => {
    if (room.room_id && boardWrapper.current) {
      const size = getBoardSize(
        boardWrapper.current.offsetWidth,
        boardWrapper.current.offsetHeight
      );

      BoardClient.createRoom('board', roomHandlers, size);

      BoardClient.addRoomEventListener(roomHandlers);
    }

    return () => {
      if (room.room_id) {
        BoardClient.removeEventListener();
        BoardClient.leaveRoom();
      }
    };
  }, [room.room_id]);

  const BoardContextValue = useMemo(() => {
    return {
      curBoard,
      //   setCurBoard,
      curPageId,
      //   setCurPageId,
      closedId,
      //   setClosedId,
    };
  }, [curBoard, curPageId, closedId]);

  useEffect(() => {
    if (localEditPermission) {
      BoardClient.setEditMode(EditMode.kEditAll);
      BoardClient.enableCursorSync(true);
    } else {
      BoardClient.setEditMode(EditMode.kRead);
      BoardClient.enableCursorSync(false);
    }
  }, [localEditPermission, curBoard, curPageId, closedId]);

  const resizeBoard = () => {
    if (boardWrapper.current) {
      const size = getBoardSize(
        boardWrapper.current.offsetWidth,
        boardWrapper.current.offsetHeight
      );

      BoardClient.changeBoardSize(size);
    }
  };

  const handleResize = () => {
    requestAnimationFrame(resizeBoard);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    resizeBoard();
  }, [
    userListDrawOpen,
    boardPagePreviewOpen,
    playersAreaOpen,
    curPageId,
    boardWrapper.current,
    localEditPermission,
  ]);

  return (
    <BoardContext.Provider value={BoardContextValue}>
      {localEditPermission === Permission.HasPermission && <BoardPages />}

      {localEditPermission === Permission.HasPermission && (
        <SideToolBar disabledUndo={disabledUndo} disabledRedo={disabledRedo} />
      )}

      <div className={styles.whiteBoard} ref={boardWrapper}>
        <canvas
          id="board"
          style={{
            whiteSpace: 'nowrap',
          }}
        />
        {localEditPermission === Permission.HasPermission && (
          <BottomControl />
        )}
      </div>
    </BoardContext.Provider>
  );
}

export default WhiteBoard;
