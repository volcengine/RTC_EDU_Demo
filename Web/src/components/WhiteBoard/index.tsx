import { useEffect, useMemo, useRef, useState } from 'react';
import type { IWhiteBoard } from '@volcengine/white-board-manage';
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

  const [curBoard, setCurBoard] = useState<IWhiteBoard | undefined>();
  const [curBoardId, setCurBoardId] = useState<number | string>();
  const [closedId, setClosedId] = useState<number | string>();
  const [curPageId, setCurPageId] = useState<string>();
  const [curPageIndex, setCurPageIndex] = useState<number>();

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
    setCurBoardId,
    setCurPageId,
    setCurPageIndex,
    setClosedId,
    localEditPermission,
  });

  useEffect(() => {
    if (room.room_id && boardWrapper.current) {
      const size = getBoardSize(
        boardWrapper.current.offsetWidth,
        boardWrapper.current.offsetHeight
      );

      BoardClient.joinRoom('board', roomHandlers, size);

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
      curBoardId,
      curPageId,
      curPageIndex,
      closedId,
    };
  }, [curBoard, curBoardId, curPageId, curPageIndex, closedId]);

  useEffect(() => {
    if (localEditPermission) {
      BoardClient.setWriteable(true);
      BoardClient.enableCursorSync(true);
    } else {
      BoardClient.setWriteable(false);
      BoardClient.enableCursorSync(false);
    }
  }, [localEditPermission, curBoardId, curPageId, curPageIndex, closedId]);

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
    curPageIndex,
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
        <div
          id="board"
          style={{
            whiteSpace: 'nowrap',
          }}
        />
        {localEditPermission === Permission.HasPermission && <BottomControl />}
      </div>
    </BoardContext.Provider>
  );
}

export default WhiteBoard;
