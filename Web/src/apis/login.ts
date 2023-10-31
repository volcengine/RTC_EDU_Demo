import { HOST } from '@/config';
import { RTSState } from '@/store/slices/rts';

const BASEURL = '/vertc_demo_me_os/login';

interface IVerifyLoginSmsRes {
  user_id: string;
  user_name: string;
  login_token: string;
  created_at: number;
}

export const freeLoginApi = (body: {
  user_name: string;
}): Promise<{
  code: number;
  message: string;
  response: IVerifyLoginSmsRes;
}> => {
  return fetch(`${HOST}${BASEURL}`, {
    method: 'POST',
    body: JSON.stringify({
      event_name: 'passwordFreeLogin',
      content: JSON.stringify({
        user_name: body.user_name,
      }),
    }),
  }).then((res) => {
    return res.json();
  });
};

interface ISetAppInfo {
  login_token: string;
  app_id: string;
  app_key: string;
  volc_ak: string;
  volc_sk: string;
  account_id: string;
  scenes_name: string;
}

export const setAppInfo = (
  body: ISetAppInfo
): Promise<{
  code: number;
  message: string;
  response: RTSState;
}> => {
  return fetch(
    `${HOST}${BASEURL}`,
    {
      method: 'POST',
      body: JSON.stringify({
        event_name: 'setAppInfo',
        content: JSON.stringify(body),
      }),
    }
  ).then((res) => {
    return res.json();
  });
};

/**
 * 获取加入rts房间必要的信息
 * @param body
 * @returns
 */
export const changeUserName = (body: {
  user_name: string;
  login_token: string;
}): Promise<{
  code: number;
  message: string;
  response: RTSState;
}> => {
  return fetch(`${HOST}${BASEURL}`, {
    method: 'POST',
    body: JSON.stringify({
      event_name: 'changeUserName',
      content: JSON.stringify(body),
    }),
  }).then((res) => {
    return res.json();
  });
};

