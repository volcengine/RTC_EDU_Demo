import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [];

export const RoomInstanceSlice = createSlice({
  name: 'rtcRoomUsers',
  initialState,
  reducers: {
    insertRtcRoom: (state, actions: PayloadAction<string>) => {
      state.push(actions.payload);
    },
    removeRtcRoom: (state, actions: PayloadAction<string>) => {
      return state.filter((item) => {
        return item !== actions.payload;
      });
    },
    removeAllUserInRtcRoom: () => {
      return [];
    },
  },
});

export const { insertRtcRoom, removeAllUserInRtcRoom, removeRtcRoom } = RoomInstanceSlice.actions;
export default RoomInstanceSlice.reducer;
