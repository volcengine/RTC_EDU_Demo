import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@src/store';
import {
  setBoardPagePreviewOpen,
  setPlayersAreaOpen,
  setUserListDrawOpen,
} from '@src/store/slices/ui';
import { RtcClient } from '@src/core/rtc';
import { BoardClient } from '@src/core/board';
import { SceneType } from '@src/store/slices/scene';

const useSceneMounted = (
  scene: SceneType
): {
  hasEngine: boolean;
} => {
  const [hasEngine, setHasEngine] = useState(false);

  const rts = useSelector((state) => state.rts);
  const user = useSelector((state) => state.user);
  const logPath = window.veTools.getLogPath();

  const dispatch = useDispatch();

  useEffect(() => {
    const appInfo = rts.app_set?.find((item) => item.scenes_name === scene);
    if (!appInfo?.app_id) {
      return;
    }

    dispatch(setUserListDrawOpen(true));
    dispatch(setBoardPagePreviewOpen(true));
    dispatch(setPlayersAreaOpen(true));
    // dispatch(setAiAns(true));

    const mount = async () => {
      await RtcClient.createEngine({
        appId: appInfo.app_id!,
        uid: user!.user_id!,
        rtsUid: user!.user_id!,
        loginToken: user!.login_token!,
        rtmToken: appInfo.rts_token!,
        serverUrl: rts.server_url!,
        serverSignature: rts.server_signature!,
        device_id: user.device_id!,
        logPath: logPath,
        params: JSON.stringify({ 'rtc.custom_media_server_ip': '' }),
      });

      BoardClient.setAppId(appInfo.app_id!);

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
