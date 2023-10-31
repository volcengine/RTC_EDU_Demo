import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatch,
  useSelector as Selector,
} from 'react-redux';

import rtsSlices from './slices/rts';
import userSlices from './slices/user';
import deviceSlices from './slices/devices';
import edubRoomSlices from './slices/edubRoom';
import meetingRoomSlices from './slices/meetingRoom';
import edusRoomSlices from './slices/edusRoom';

import uiSlices from './slices/ui';
import settingSlices from './slices/setting';
import sceneSlices from './slices/scene';
import symbolSlices from './slices/symbols';
import boardSlices from './slices/board';

const store = configureStore({
  reducer: {
    user: userSlices,
    rts: rtsSlices,
    device: deviceSlices,
    edubRoom: edubRoomSlices,
    edusRoom: edusRoomSlices,
    meetingRoom: meetingRoomSlices,
    ui: uiSlices,
    setting: settingSlices,
    scene: sceneSlices,
    symbols: symbolSlices,
    board: boardSlices,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export const useDispatch = () => dispatch<typeof store.dispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = Selector;

export default store;
