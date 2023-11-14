import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import * as Api from '@src/api';
import { RtcClient } from '@src/core/rtc';
import { useSelector, useDispatch } from '@/renderer/store';
import { useHttpListener } from '@src/core/hooks/useHttpListener';
import { userConfig } from '@/renderer/config';

const Auth: React.FC<{ children: React.ReactNode }> = function (props) {
  const { children } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { scene } = useSelector((state) => state.scene);

  // 和web端不同，不会直接跳转到进房页面

  // 监听主进程http
  useHttpListener();

  // 检查登录状态
  useEffect(() => {
    console.log('current logged user: ', user);
    if (user?.login_token) {
      // 获取服务器下发的rts信息
      Api.setAppInfo({
        login_token: user.login_token,
        app_id: userConfig.appId,
        app_key: userConfig.appKey,
        volc_ak: userConfig.accessKeyId,
        volc_sk: userConfig.accessKeySecret,
        account_id: userConfig.accountId,
        scenes_name: scene || 'vc',
      });
    } else {
      RtcClient.destroyEngine();
      // 切换到Login页面
      history.push('/login');
    }
  }, [user.login_token]);

  return children as React.ReactElement;
};

export default Auth;
