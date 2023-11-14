import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatch,
  useSelector as Selector,
} from 'react-redux';

import rtcRoomUsers from './modules/rtcRoom';
import roomInfo from './modules/room';
import messageType from './modules/publicMessage';
import recordList from './modules/recordList';
import device from './modules/devices';
import ui from './slices/ui';
import user from './slices/user';
import meetingRoom from './slices/meetingRoom';
import edusRoom from './slices/edusRoom';
import edubRoom from './slices/edubRoom';

import rts from './slices/rts';
import scene from './slices/scene';

const reducers = combineReducers({
  meetingRoom,
  edusRoom,
  edubRoom,
  rtcRoomUsers,
  user,
  /**
   * @deprecated
   */
  roomInfo,
  messageType,
  recordList,
  device,
  ui,
  rts,
  scene,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatch<typeof store.dispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = Selector;
