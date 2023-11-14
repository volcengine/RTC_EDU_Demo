import { v4 as uuidv4 } from 'uuid';
import { useContext, useEffect,useRef, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from '@src/store';
import BoardAddSvg from '@assets/images/board/BoardAdd.svg';
import { BoardClient } from '@src/core/board';
import { Icon } from '@src/components';

import DeleteSvg from './Delete.svg';

import styles from './index.module.less';
import FileSelect from './FileSelect';
import BoardContext from '../BoardContext';
import React from 'react';

function BoardPages() {
  const boardPagePreviewOpen = useSelector((state) => state.ui.boardPagePreviewOpen);
  const [previewBoardList, setPreviewBoardList] = useState<
    {
      pageId: string;
      url?: string;
    }[]
  >([]);

  const {
    curBoard,
    curPageId,
    closedId,
    // setCurPageId, setCurFile, fileList, setFileList
  } = useContext(BoardContext);

  const updateTime = useRef<number>(Date.now());

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
    if (curBoard && curPageId) {
      const boardInfo = BoardClient.room?.getActiveWhiteBoard();
      console.log('更新白板页面');
      if (boardInfo) {
		const curUpdateTime = Date.now();
        updateTime.current = curUpdateTime;
        Promise.all(
          boardInfo.getAllPageInfo().map(async (page) => {
            const url = page.bkInfo?.bkImage || (await boardInfo.exportPageSnapshot(page.pageId));
            return {
              url,
              pageId: page.pageId,
            };
          })
        ).then((res) => {
			if (curUpdateTime >= updateTime.current) {
				console.log('更新白板页面', res, boardInfo);
				setPreviewBoardList(res);
			  }
        });
      }
    }
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
        {previewBoardList.map((item, index) => (
          <div
            className={classNames(styles.page, curPageId === item.pageId ? styles.activePage : '')}
            key={`${item}-${index}`}
            onClick={() => previewflipPage(item.pageId)}
          >
            <span className={styles.previewIndex}>{index + 1}</span>
            <div className={styles.pageImg}>
              <img src={item.url} />
            </div>
            {previewBoardList.length > 1 && (
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
