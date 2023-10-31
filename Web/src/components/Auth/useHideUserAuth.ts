import { useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SceneType } from '@/store/slices/scene';
import * as Apis from '@/apis/login';
import { useDispatch } from '@/store';
import { setRTSParams } from '@/store/slices/rts';
import { login, setUserVisibility } from '@/store/slices/user';
import { VerifiedStatus } from './types';
import { BASENAME, userConfig } from '@/config';

interface IHideUser {
  name: string | null;
  roomId: string | null;
  visibility: string | null;
  role: string | null;
}

interface IHideUserAuth {
  hideUser: IHideUser;
  scene?: SceneType;
  onVerify: (status: VerifiedStatus) => void;
}

const useHideUserAuth = (props: IHideUserAuth) => {
  const { scene, hideUser, onVerify } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (hideUser.visibility === 'false' && scene) {
      const freeLogin = async () => {
        const res = await Apis.freeLoginApi({
          user_name: hideUser.name || 'hideUser',
        });

        if (res.code !== 200) {
          message.error(res.message);
          return;
        }

        const freeUser = res.response;
        const rtsRes = await Apis.setAppInfo({
          login_token: freeUser.login_token,
          app_id: userConfig.appId,
          app_key: userConfig.appKey,
          volc_ak: userConfig.accessKeyId,
          volc_sk: userConfig.accessKeySecret,
          account_id: userConfig.accountId,
          scenes_name: scene,
        });

        if (rtsRes.code !== 200) {
          message.error(rtsRes.message);
          return;
        }
        dispatch(login(freeUser));

        dispatch(setRTSParams(rtsRes.response));

        dispatch(setUserVisibility(false));
        onVerify(VerifiedStatus.Pass);
        const naviPath = location.pathname.replace(BASENAME, '');
        navigate(`${naviPath}${location.search}`);
      };

      onVerify(VerifiedStatus.Waiting);

      freeLogin();
    }
  }, [hideUser, scene]);
};

export default useHideUserAuth;
