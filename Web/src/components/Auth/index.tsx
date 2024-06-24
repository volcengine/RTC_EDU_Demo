import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import * as Apis from '@/apis/login';
import { setRTSParams } from '@/store/slices/rts';
import { RtcClient } from '@/core/rtc';
import { useDispatch, useSelector } from '@/store';
import { SceneType } from '@/store/slices/scene';
import { VerifiedStatus } from './types';
import useHideUserAuth from './useHideUserAuth';
import { BASENAME, userConfig } from '@/config';


const Auth: React.FC<{ children: React.ReactNode }> = function (props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [verified, setVerified] = useState<VerifiedStatus>(VerifiedStatus.Waiting);

  const user = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();

  const hideUser = useMemo(() => {
    const name = searchParams.get('username');
    const roomId = searchParams.get('roomId');
    const visibility = searchParams.get('visibility');
    const role = searchParams.get('role');

    return {
      name,
      roomId,
      visibility,
      role,
    };
  }, [searchParams]);

  const scene = useMemo(() => {
    let scene;
    if (location.pathname.includes(SceneType.Edub)) {
      scene = SceneType.Edub;
    } else if (location.pathname.includes(SceneType.Edus)) {
      scene = SceneType.Edus;
    } else if (location.pathname.includes(SceneType.Meeting)) {
      scene = SceneType.Meeting;
    }
    return scene;
  }, []);

  useHideUserAuth({
    scene,
    hideUser,
    onVerify: setVerified,
  });

  /**
   * 1. 未登录，跳转到登录页面
   * 2. 已登录，校验token
   *   2.1 校验失败，跳转到登录页面
   *   2.2 校验通过，获取rtc参数并存储，跳转到进房页面
   */
  useEffect(() => {
    if (location.pathname.includes('/replay')) {
      setVerified(VerifiedStatus.Pass);
      return;
    }

    if (hideUser.visibility === 'false') {
      return;
    }

    if (!user?.login_token && !user?.user_id) {
      setVerified(VerifiedStatus.Failed);
      navigate('/login');
    } else {
      // 如果没有联网，则不操作
      if (!navigator.onLine) {
        return;
      }

      // 如果已经创建过engine了，说明已经登录了
      if (RtcClient.hasEngine) {
        return;
      }

      const verifyLoginToken = async (
        user: Partial<Record<'user_id' | 'login_token', string | undefined>>
      ) => {
        const rtsRes = await Apis.setAppInfo({
          login_token:  user?.login_token!,
          app_id: userConfig.appId,
          app_key: userConfig.appKey,
          volc_ak: userConfig.accessKeyId,
          volc_sk: userConfig.accessKeySecret,
          account_id: userConfig.accountId,
          scenes_name: scene || 'vc',
        });

        if (rtsRes.code !== 200) {
          message.error(`获取 rts 服务参数失败，请重新登录 : ${rtsRes.code}`);
          console.error(rtsRes);
          navigate(`/login${location.search}`);
          setVerified(VerifiedStatus.Failed);
          return;
        }

        dispatch(setRTSParams(rtsRes.response));

        setVerified(VerifiedStatus.Pass);

        if (location.pathname.includes('/login')) {
          navigate(`/`);
        } else {
          const naviPath = location.pathname.replace(BASENAME, '');
          navigate(`${naviPath}${location.search}`);
        }
      };

      setVerified(VerifiedStatus.Waiting);

      verifyLoginToken(user);
    }
  }, [user, hideUser]);

  if (verified === VerifiedStatus.Waiting) {
    return null;
  }

  return children as React.ReactElement;
};

export default Auth;
