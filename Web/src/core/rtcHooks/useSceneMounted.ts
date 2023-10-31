import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@/store';
import {
  setBoardPagePreviewOpen,
  setPlayersAreaOpen,
  setUserListDrawOpen,
} from '@/store/slices/ui';
import Utils from '@/utils';
import { RtcClient } from '@/core/rtc';
import { BoardClient } from '@/core/board';
import { SceneType } from '@/store/slices/scene';
import { setAiAns } from '@/store/slices/setting';

const useSceneMounted = (
  scene: SceneType
): {
  hasEngine: boolean;
} => {
  const [hasEngine, setHasEngine] = useState(false);

  const rts = useSelector((state) => state.rts);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserListDrawOpen(true));
    dispatch(setBoardPagePreviewOpen(true));
    dispatch(setPlayersAreaOpen(true));
    dispatch(setAiAns(true));

    const mount = async () => {
      await RtcClient.createEngine({
        appId: rts.app_id!,
        uid: user!.user_id!,
        rtsUid: user!.user_id!,
        loginToken: user!.login_token!,
        rtmToken: rts.rts_token!,
        serverUrl: rts.server_url!,
        serverSignature: rts.server_signature!,
        deviceId: Utils.getDeviceId()!,
      });

      BoardClient.setAppId(rts.app_id!);

      if (user.visibility === false) {
        RtcClient.engine.setUserVisibility(false);
      }

      await RtcClient.joinWithRTS();

      setHasEngine(true);
    };

    mount();

    return () => {
      RtcClient.leaveRTS();
    };
  }, [rts]);

  return {
    hasEngine,
  };
};

export default useSceneMounted;
