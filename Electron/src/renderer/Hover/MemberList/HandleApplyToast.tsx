import React, { useMemo } from 'react';

import { ipcRenderer, remote } from 'electron';
import { DeviceState } from '@/renderer/types/state';
import Toast from '@src/components/Toast';
import { Button } from 'antd';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

// 处理请求
const HandleApplyToast: React.FC<{
  userName: string;
  userId: string;
  isShowMic: boolean;
  setIsShowMic: React.Dispatch<React.SetStateAction<boolean>>;
  isShowShare: boolean;
  setIsShowShare: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const { userName, userId, isShowMic, setIsShowMic, isShowShare, setIsShowShare } = props;

  const content = useMemo(() => {
    if (isShowMic) {
      return {
        title: `${userName}正在申请发言`,
        handleComfirm: () => {
          ipcRenderer.sendTo(mainWindowId, 'permitOneShare', userId, DeviceState.Open);
          setIsShowMic(false);
        },
        handleReject: () => {
          ipcRenderer.sendTo(mainWindowId, 'permitOneShare', userId, DeviceState.Closed);
          setIsShowMic(false);
        },
      };
    } else if (isShowShare) {
      return {
        title: `${userName}正在申请共享权限`,
        handleComfirm: () => {
          ipcRenderer.sendTo(mainWindowId, 'permitOneShare', userId, DeviceState.Open);
          setIsShowMic(false);
        },
        handleReject: () => {
          ipcRenderer.sendTo(mainWindowId, 'permitOneShare', userId, DeviceState.Closed);
          setIsShowShare(false);
        },
      };
    }
  }, [isShowMic, isShowShare]);

  return (
    <Toast isShow={isShowMic || isShowShare} message={content?.title || ''}>
      <div>
        <Button type="primary" onClick={content?.handleComfirm}>
          同意
        </Button>
      </div>
      <div>
        <Button onClick={content?.handleReject}>取消</Button>
      </div>
    </Toast>
  );
};

export default HandleApplyToast;
