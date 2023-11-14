import React from 'react';
import { useContext, useMemo } from 'react';
import { Pagination } from '@src/components';
import { BoardClient } from '@src/core/board';
import BoardContext from '../BoardContext';

import styles from './index.module.less';

function BottomControl() {
  const { curBoard, curPageId, closedId } = useContext(BoardContext);

  const pageflip = (pageNum: number) => {
    console.log('pageflip', pageNum);
    const board = BoardClient.room?.getActiveWhiteBoard();

    const page = board?.getAllPageInfo()?.[pageNum - 1];
    if (page) {
      BoardClient.flipPage(page.pageId);
    } else {
      throw new Error('pageId错误');
    }
  };

  const { current, total } = useMemo(() => {
    const board = BoardClient.room?.getActiveWhiteBoard();

    const current = (board?.getCurrentPageIndex() || 0) + 1;
    const total = board?.getAllPageInfo()?.length || 1;
    return {
      current,
      total,
    };
  }, [curBoard, curPageId, closedId]);

  return (
    <div className={styles.control}>
      <Pagination current={current} total={total} onChange={pageflip} />

      <span className={styles.sperature} />

      <button onClick={() => {}} className={styles.previewBtn}>
        预览
      </button>
    </div>
  );
}

export default BottomControl;
