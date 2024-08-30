import type { IWhiteBoard } from '@volcengine/white-board-manage';
import { createContext } from 'react';

interface BoardContextType {
  curBoard?: IWhiteBoard;
  curBoardId?: number | string;
  curPageIndex?: number;
  curPageId?: string;
  closedId?: number | string;
}

const BoardContext = createContext({} as BoardContextType);
export default BoardContext;
