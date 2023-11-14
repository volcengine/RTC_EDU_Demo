import { ProcessEvent } from '@/types';
import { ipcRenderer } from 'electron';
import { SceneType } from '@/renderer/store/slices/scene';

// 免认证登录
export const passwordFreeLogin = (body: {
  user_name: string;
}) => {
  ipcRenderer.send(ProcessEvent.HTTP, 'passwordFreeLogin', JSON.stringify(body));
};

// 修改用户昵称
export const changeUserName = (params: { login_token: string; user_name: string }) => {
  ipcRenderer.send(ProcessEvent.HTTP, 'changeUserName', JSON.stringify(params));
};

export interface RTSState {
  app_id?: string;
  rts_token?: string;
  server_signature?: string;
  server_url?: string;
  app_set?: {
    app_id: string;
    rts_token: string;
    scenes_name: SceneType;
  }[];
}

interface ISetAppInfo {
  login_token: string;
  app_id: string;
  app_key: string;
  volc_ak: string;
  volc_sk: string;
  account_id: string;
  scenes_name: string;
}

// 使用setAppInfo
export const setAppInfo = (
  body: ISetAppInfo
) => {
  ipcRenderer.send(ProcessEvent.HTTP, 'setAppInfo', JSON.stringify(body));
};
