import { HOST } from '@/config';
import { RTSState } from '@/store/slices/rts';

const BASEURL = '/vertc_demo_me_os/login';

// 校验验证码成功时后端返回内容
export interface IUserInfo {
  user_id: string; // 校验成功时, 将 map 用户手机号至唯一的 用户 id
  user_name: string; // 用户名称
  login_token: string; // 业务服务器登陆token
  created_at: number; // 创建时间
}

// 校验验证码成功时出参
export interface ILoginReturn {
  code: number; // 成功返回情况下, 将返回 200
  message: string; // 成功返回情况下, 将返回 'ok', 失败情况下将返回失败原因
  response: IUserInfo;
}

// 加入 RTS 房间入参
interface ISetAppInfo {
  login_token: string;
  app_id: string;
  app_key: string;
  volc_ak: string;
  volc_sk: string;
  account_id: string;
  scenes_name: string;
}

/**
 * 发起业务服务器请求 - 免密登录
 * 主要用于云录屏场景
 * 云录屏场景下没有登录页面，也不需要输入验证码, 用户通过在 url 指定 userId 和 role 识别出当前是云录屏,
 * 免密登录并且获得业务服务器返回的 user_id 和 login_token
 * @param body
 * @returns
 */
export const freeLoginApi = (body: {
  user_name: string;
}): Promise<{
  code: number;
  message: string;
  response: IUserInfo;
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

/**
 * 获取加入rts房间必要的参数
 * @param body
 * @returns
 */
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
 * 更新用户名
 * @param body
 * @returns
 */
export const changeUserName = (body: {
  user_name: string;
  login_token: string;
}): Promise<{
  code: number;
  message: string;
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
