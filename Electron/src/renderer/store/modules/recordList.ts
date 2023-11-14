/**
 * 存储录制文件列表
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RecordFile {
  duration: number;
  filename: string;
  room_id: string;
  size: number;
  start_time: number;
  url: string;
}

export interface SympolRercoderFile {
  filename: string;
  url: string;
}

export interface RecordType {
  recordFileMap: Record<string, RecordFile[]>;
  recordFileList: SympolRercoderFile[];
}

const initialState: RecordType = {
  recordFileMap: {},
  recordFileList: [],
};

const recordList = createSlice({
  name: 'recordList',
  initialState,
  reducers: {
    setRecordFileList: (state, actions: PayloadAction<Record<string, RecordFile[]>>) => {
      state.recordFileMap = actions.payload;
    },
    setSympolRecorFiledList: (state, actions: PayloadAction<SympolRercoderFile[]>) => {
      state.recordFileList = actions.payload;
    },
  },
});

export const { setRecordFileList, setSympolRecorFiledList } = recordList.actions;
export default recordList.reducer;
