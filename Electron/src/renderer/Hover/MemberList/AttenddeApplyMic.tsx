import React, { useMemo } from 'react';
import Toast from '@src/components/Toast';
import { Button } from 'antd';
import { useDispatch, useSelector } from '@/renderer/store';
import { DeviceState } from '@/renderer/types/state';

import { ipcRenderer, remote } from 'electron';
import { removeAllMicList, removeFromMicList } from '@/renderer/store/modules/publicMessage';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

// 收到参会人要求开麦
const AttenddeApplyMic: React.FC = () => {
  const { reqOpenMicList } = useSelector((state) => state.messageType);
  const dispatch = useDispatch();

  const content = useMemo(() => {
    if (reqOpenMicList.length === 0) {
      return {};
    }
    const { userId, userName } = reqOpenMicList[0];
    if (reqOpenMicList.length === 1) {
      return {
        comfirmText: '同意',
        rejectText: '拒绝',
        title: `${userName}正在申请发言`,
        handleComfirm: () => {
          ipcRenderer.sendTo(mainWindowId, 'permitOneMic', userId, DeviceState.Open);
          dispatch(removeFromMicList(userId));
        },
        handleReject: () => {
          ipcRenderer.sendTo(mainWindowId, 'permitOneMic', userId, DeviceState.Closed);
          dispatch(removeFromMicList(userId));
        },
      };
    } else if (reqOpenMicList.length > 1) {
      return {
        comfirmText: '查看详情',
        rejectText: '取消',
        title: `${reqOpenMicList.length}位用户正在申请发言`,
        handleComfirm: () => {
          dispatch(removeAllMicList());
          ipcRenderer.sendTo(mainWindowId, 'clearAllMic');
        },
        handleReject: () => {
          dispatch(removeAllMicList());
          ipcRenderer.sendTo(mainWindowId, 'clearAllMic');
        },
      };
    }
  }, [reqOpenMicList]);
  return (
    <Toast isShow={reqOpenMicList.length > 0} message={content?.title || ''}>
      <div>
        <Button type="primary" onClick={content?.handleComfirm}>
          {content?.comfirmText}
        </Button>
      </div>
      <div>
        <Button onClick={content?.handleReject}>{content?.rejectText}</Button>
      </div>
    </Toast>
  );
};

export default AttenddeApplyMic;
