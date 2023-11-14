import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { login } from '@src/store/slices/user';
import { message as Message } from 'antd';
import { ipcRenderer } from 'electron';
import { useDispatch } from '@src/store';
import useLogout from './useLogout';
import { setRTSParams } from '@/renderer/store/slices/rts';

export const useHttpListener = () => {
  const dispatch = useDispatch();
  const handleLogout = useLogout({});
  const history = useHistory();

  // 监听主进程调用http接口
  useEffect(() => {
    console.log('monitor http reply.');
    ipcRenderer.on('reply', (e, apiName, jsonRes) => {
      const res = JSON.parse(jsonRes);
      console.log('reply', apiName, res);
      if (res.code === 440) {
        Message.error('验证码过期，请重新发送验证码');
        return;
      } else if (res.code === 441) {
        Message.error('验证码错误');
        return;
      } else if (res.code === 450) {
        Message.error('token过期');
        handleLogout();
        return;
      } else if (res.code === 451) {
        Message.error('token为空');
        handleLogout();
        return;
      } else if (res.code === 452) {
        handleLogout();
        Message.error('token错误');
        return;
      } else if (res.code === 500) {
        Message.error('服务器错误');
        return;
      }
      switch(apiName) {
        case 'setAppInfo':
          {
            const { response } = res;
            console.log('setAppInfo', response);
            dispatch(setRTSParams(response));
            history.push('/');
          }
          break;
        case 'passwordFreeLogin':
          {
            const { response } = res;
            console.log('passwordFreeLogin', response);
            dispatch(login(response));
          }
          break;
      }
    });
    return () => {
      console.log('removeAllListeners');
      ipcRenderer.removeAllListeners('reply');
    };
  }, []);
};

export default useHttpListener;
