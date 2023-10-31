import { v4 as uuidv4 } from 'uuid';
import { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector } from '@/store';
import BoardAddSvg from '@/assets/images/board/BoardAdd.svg';
import { BoardClient } from '@/core/board';
import { Icon } from '@/components';

import DeleteSvg from './Delete.svg';

import styles from './index.module.less';
import FileSelect from './FileSelect';
import BoardContext from '../BoardContext';
import useUpdatePreviewBoard from './hooks/useUpdatePreviewBoard';

function BoardPages() {
  const boardPagePreviewOpen = useSelector((state) => state.ui.boardPagePreviewOpen);

  const {
    curBoard,
    curPageId,
    closedId,
    // setCurPageId, setCurFile, fileList, setFileList
  } = useContext(BoardContext);

  const [ previewBoard, updatePreviewBoard ] = useUpdatePreviewBoard();

  const previewflipPage = (pageId: string) => {
    if (curPageId === pageId) {
      return;
    }

    BoardClient.flipPage(pageId);
  };

  const handleAddPage = () => {
    const pageId = `board_${uuidv4()}`;

    BoardClient.createPage(curPageId!, {
      pageId,
    });
  };

  // 删除白板页面
  const handleDeleteBoardPage = (pageId: string) => {
    console.log('whiteboard handleDeleteBoard', pageId);

    BoardClient.deletePage(pageId);
  };

  useEffect(() => {
    curBoard && curPageId && updatePreviewBoard();
  }, [curPageId, curBoard, closedId]);

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
            onClick={() => previewflipPage(item.pageId)}
          >
            <span className={styles.previewIndex}>{index + 1}</span>
            <div className={styles.pageImg}>
              <img src={item.url} />
            </div>
            {previewBoard.length > 1 && (
              <button
                onClick={(e) => {
                  console.log('delete');
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
