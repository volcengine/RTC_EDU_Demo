import { createContext } from 'react';

export interface BoardState {}

interface BoardContextType {
  curBoard?: number | string;
  curPageId?: string;
  closedId?: number | string;

  //   setCurPageId: (pageId: string) => void;
  //   setCurBoard: (file: number | string) => void;
  //   setClosedId: (id: number | string) => void;
}

const BoardContext = createContext({} as BoardContextType);
export default BoardContext;
