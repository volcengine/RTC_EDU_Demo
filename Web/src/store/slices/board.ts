import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IPreviewBoard {
    url?: string;
    pageId: string;
}

export interface BoardState {
  previewBoardList: IPreviewBoard[];
}

export const initialState: BoardState = {
    previewBoardList: [],
};

/**
 * 白板相关参数
 */
export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setPreviewBoardList: (state, action: PayloadAction<IPreviewBoard[]>) => {
      state.previewBoardList = action.payload;
    },
  },
});

export const {
   setPreviewBoardList
} = boardSlice.actions;

export default boardSlice.reducer;
