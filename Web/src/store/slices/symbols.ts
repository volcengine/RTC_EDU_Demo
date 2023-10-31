import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SiteVisitStatus {
  initial,
  login,
  edu,
}

export interface SymbolState {
  siteVisitStatus: SiteVisitStatus;
}

export const initialState: SymbolState = {
  siteVisitStatus: SiteVisitStatus.initial,
};

/**
 * 状态标志位相关参数
 */
export const symbolSlice = createSlice({
  name: 'symbols',
  initialState,
  reducers: {
    setSiteVisitStatus: (state, action: PayloadAction<SiteVisitStatus>) => {
      state.siteVisitStatus = action.payload;
    },
  },
});

export const {
  setSiteVisitStatus
} = symbolSlice.actions;

export default symbolSlice.reducer;
