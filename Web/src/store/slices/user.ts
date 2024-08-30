import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Utils, { StoreUtils } from '@/utils';

export type UserState =
  | (StoreUtils.UserInfo & {
      visibility: boolean;
    })
  | null;

/**
 * 当前用户信息
 */
export const userSlice = createSlice({
  name: 'user',
  initialState: { ...Utils.getUserInfo(), visibility: true },
  reducers: {
    login: (state, action: PayloadAction<StoreUtils.UserInfo>) => {
      Utils.setUserInfo(action.payload);
      state.created_at = action.payload.created_at;
      state.user_id = action.payload.user_id;
      state.user_name = action.payload.user_name;
      state.login_token = action.payload.login_token;
      state.deviceId = action.payload.deviceId || state.deviceId;
    },
    logout: (state) => {
      Utils.removeUserInfo();
      state.created_at = undefined;
      state.user_id = undefined;
      state.user_name = undefined;
      state.login_token = undefined;
      state.deviceId = undefined;
      state.visibility = true;
    },

    changeUserName: (state, action: PayloadAction<string>) => {
      state.user_name = action.payload;
      Utils.setUserName(action.payload);
    },

    setUserVisibility: (state, action: PayloadAction<boolean>) => {
      state.visibility = action.payload;
    },
  },
});

export const { login, logout, changeUserName, setUserVisibility } = userSlice.actions;

export default userSlice.reducer;
