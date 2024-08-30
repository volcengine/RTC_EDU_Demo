import { v4 as uuidv4 } from 'uuid';
import { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { WhiteBoardEventsTypes } from '@volcengine/white-board-manage';
import { useSelector } from '@/store';
import BoardAddSvg from '@/assets/images/board/BoardAdd.svg';
import { BoardClient } from '@/core/board';
import { Icon } from '@/components';
import DeleteSvg from './Delete.svg';
import styles from './index.module.less';
import FileSelect from './FileSelect';
import BoardContext from '../BoardContext';
import useUpdatePreviewBoard from './hooks/useUpdatePreviewBoard';
import type { IPreviewBoard } from '@/store/slices/board';

function BoardPages() {
  const boardPagePreviewOpen = useSelector((state) => state.ui.boardPagePreviewOpen);
  const { curBoard, curBoardId, curPageId, closedId } = useContext(BoardContext);
  const [previewBoard, updatePreviewBoard] = useUpdatePreviewBoard();
  const [, _refresh] = useState({});
  const refreshUI = useCallback(() => _refresh({}), []);

  const previewflipPage = (item: IPreviewBoard) => {
    if (curPageId === item.pageId) {
      return;
    }
    BoardClient.flipPage(item.pageIndex);
  };

  const handleAddPage = () => {
    const pageId = `board_${uuidv4()}`;
    BoardClient.createPage({
      pageId,
    });
  };

  // 删除白板页面
  const handleDeleteBoardPage = (pageId: string) => {
    BoardClient.deletePage(pageId);
  };

  useEffect(() => {
    if (!curBoard) {
      return;
    }
    curBoard.on(WhiteBoardEventsTypes.onPageIndexChanged, refreshUI);
    return () => {
      curBoard.off(WhiteBoardEventsTypes.onPageIndexChanged, refreshUI);
    };
  }, [curBoard]);

  useEffect(() => {
    curBoardId && curPageId && updatePreviewBoard();
    return () => {
      curBoardId && curPageId && updatePreviewBoard();
    }
  }, [curPageId, curBoardId, closedId]);

  return (
    <div
      className={styles.boardPagesWrapper}
      style={{
        display: boardPagePreviewOpen ? 'block' : 'none',
      }}
    >
      <FileSelect />

      <div className={styles.boardPages}>
        {previewBoard.map((item, index) => (
          <div
            className={classNames(styles.page, curPageId === item.pageId ? styles.activePage : '')}
            key={`${item}-${index}`}
            onClick={() => previewflipPage(item)}
          >
            <span className={styles.previewIndex}>{index + 1}</span>
            <div className={styles.pageImg}>
              <img src={item.url} />
            </div>
            {previewBoard.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBoardPage(item.pageId);
                }}
              >
                <Icon src={DeleteSvg} />
              </button>
            )}
          </div>
        ))}

        <div className={classNames(styles.page, styles.pageAdd)} onClick={handleAddPage}>
          <span>
            <Icon src={BoardAddSvg} />
          </span>
          <span>添加白板</span>
        </div>
      </div>
    </div>
  );
}

export default BoardPages;
