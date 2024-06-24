import { Popover } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { BoardClient } from '@/core/board';
import { Icon } from '@/components';
import ArrowSvg from './Arrow.svg';
import DeleteSvg from '../Delete.svg';

import styles from './index.module.less';
import BoardContext from '../../BoardContext';

function FileSelect() {
  const { curBoardId, curPageId, closedId } = useContext(BoardContext);

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const [boards, setBoards] = useState<
    {
      name: string;
      id: number;
    }[]
  >([]);
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    const getBoardInfo = async () => {
      const room = BoardClient.room;
      if (!room) {
        setBoards([]);
        return;
      }

      const boardInfo = await room.getAllWhiteBoardInfo();
      const activeBoard = (await room.getCurrentWhiteBoard())!;
      const currentBoardInfo = await room.getWhiteBoardInfo(activeBoard.getWhiteBoardId());
      setBoardName(currentBoardInfo?.boardName || '白板');
      setBoards(
        boardInfo.map((board) => {
          return {
            name: board.boardName || '白板',
            id: board.boardId,
          };
        })
      );
    };

    getBoardInfo();
  }, [curBoardId, curPageId, closedId]);

  // 切换白板文件
  const handleChangeBoard = (id: number) => {
    setPopoverOpen(false);
    const activeBoardId = BoardClient.currentWhiteboard?.getWhiteBoardId();
    if (id === activeBoardId) {
      return;
    }
    BoardClient.room?.switchWhiteBoard(id);
  };

  // 删除白板文件
  const handleDeleteBoard = (id: number) => {
    BoardClient.room?.removeWhiteBoard(id);
  };

  return (
    <Popover
      trigger="click"
      title={null}
      overlayClassName={styles['board-pop']}
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
      placement="bottom"
      content={
        <ul>
          {boards.map((board, index) => {
            return (
              <li key={board.id}>
                <span onClick={() => handleChangeBoard(board.id)} className={styles.fileName}>
                  {board.name}
                </span>
                {index > 0 && (
                  <button
                    onClick={() => {
                      handleDeleteBoard(board.id);
                    }}
                  >
                    <Icon src={DeleteSvg} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      }
    >
      <div className={styles.curFile}>
        <span className={styles.curFileName}>{boardName}</span>
        <Icon src={ArrowSvg} />
      </div>
    </Popover>
  );
}

export default FileSelect;
