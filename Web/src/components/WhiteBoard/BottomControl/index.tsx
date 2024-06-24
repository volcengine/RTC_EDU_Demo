import { useCallback, useContext, useEffect, useState } from 'react';
import { WhiteBoardEventsTypes } from '@volcengine/white-board-manage';
import { Pagination } from '@/components';
import BoardContext from '../BoardContext';
import styles from './index.module.less';

function BottomControl() {
  const { curBoard } = useContext(BoardContext);
  const [, _refresh] = useState({});
  const refreshUI = useCallback(() => _refresh({}), []);

  const pageflip = (pageNum: number) => {
    console.log('pageflip', pageNum);
    curBoard?.flipPage(pageNum - 1);
  };

  const total = curBoard?.getAllPageInfo()?.length || 1;
  const current = (curBoard?.getCurrentPageIndex() || 0) + 1;

  useEffect(() => {
    if (!curBoard) {
      return;
    }

    curBoard.on(WhiteBoardEventsTypes.onPageCountChanged, refreshUI);
    curBoard.on(WhiteBoardEventsTypes.onPageIndexChanged, refreshUI);
    return () => {
      curBoard.off(WhiteBoardEventsTypes.onPageCountChanged, refreshUI);
      curBoard.off(WhiteBoardEventsTypes.onPageIndexChanged, refreshUI);
    };
  }, [curBoard]);

  return (
    <div className={styles.control}>
      <Pagination current={current} total={total} onChange={pageflip} />
      {/* 
      <span className={styles.sperature} />

      <button onClick={() => {}} className={styles.previewBtn}>
        预览
      </button> */}
    </div>
  );
}

export default BottomControl;
