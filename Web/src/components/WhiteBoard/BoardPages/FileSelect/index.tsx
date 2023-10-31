import { StatusType } from '@volcengine/white-board-manage';
import { Popover } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { BoardClient } from '@/core/board';
import { Icon } from '@/components';
import ArrowSvg from './Arrow.svg';
import DeleteSvg from '../Delete.svg';

import styles from './index.module.less';
import BoardContext from '../../BoardContext';

function FileSelect() {
  const { curBoard, curPageId, closedId } = useContext(BoardContext);

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
      const boardInfo = await BoardClient.room?.getBoardInfo();
      const activeBoard = BoardClient.room?.getActiveWhiteBoard();
      console.log('更新白板列表');

      const currentBoardInfo = boardInfo?.boards.find(
        (board) => board.boardId === activeBoard?.boardId
      );

      setBoardName(currentBoardInfo?.boardName || '白板');

      setBoards(
        (boardInfo?.boards || [])
          .filter((board) => board.status !== StatusType.Inactive)
          .map((board) => {
            return {
              name: board.boardName || '白板',
              id: board.boardId,
            };
          })
      );
    };

    getBoardInfo();
  }, [curBoard, curPageId, closedId]);

  // 切换白板文件
  const handleChangeBoard = (id: number) => {
    setPopoverOpen(false);
    const activeBoard = BoardClient.room?.getActiveWhiteBoard();
    if (id === activeBoard?.boardId) {
      return;
    }

    BoardClient.room?.setActiveWhiteBoard(id);
  };

  // 删除白板文件
  const handleDeleteBoard = (id: number) => {
    console.log('handleDeleteBoard', id);
    BoardClient.room?.closeWhiteBoard(id);
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
        <ul
          onMouseLeave={() => {
            // setPopoverOpen(false);
          }}
        >
          {boards.map((board, index) => {
            return (
              <li key={board.id}>
                <span onClick={() => handleChangeBoard(board.id)} className={styles.fileName}>
                  {board.name}
                </span>
                {index > 0 && (
                  <button
                    onClick={() => {
                      console.log('delete');
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
