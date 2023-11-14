import { useDispatch, useSelector } from '@/renderer/store';
import { ipcRenderer, remote } from 'electron';
import React, { useMemo } from 'react';
import Toast from '@src/components/Toast';
import { removeAllShareList, removeFromShareList } from '@/renderer/store/modules/publicMessage';
import { DeviceState } from '@/renderer/types/state';
import { Button } from 'antd';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

// 收到参会人要求共享权限
const AttenddeApplyShare: React.FC = () => {
  const { reqOpenShareList } = useSelector((state) => state.messageType);
  const dispatch = useDispatch();

  const content = useMemo(() => {
    if (reqOpenShareList.length === 0) {
      return {};
    }
    const { userId, userName } = reqOpenShareList[0];
    if (reqOpenShareList.length === 1) {
      return {
        comfirmText: '同意',
        rejectText: '拒绝',
        title: `${userName}正在申请共享权限`,
        handleComfirm: () => {
          // 调用rts接口
          ipcRenderer.sendTo(mainWindowId, 'permitOneShare', userId, DeviceState.Open);
          dispatch(removeFromShareList(userId));
        },
        handleReject: () => {
          ipcRenderer.sendTo(mainWindowId, 'permitOneShare', userId, DeviceState.Closed);
          dispatch(removeFromShareList(userId));
        },
      };
    } else if (reqOpenShareList.length > 1) {
      return {
        comfirmText: '查看详情',
        rejectText: '取消',
        title: `${reqOpenShareList.length}位用户正在申请共享权限`,
        handleComfirm: () => {
          ipcRenderer.sendTo(mainWindowId, 'clearAllShare');
          dispatch(removeAllShareList());
        },
        handleReject: () => {
          ipcRenderer.sendTo(mainWindowId, 'clearAllShare');
          dispatch(removeAllShareList());
        },
      };
    }
  }, [reqOpenShareList]);
  return (
    <Toast isShow={reqOpenShareList.length > 0} message={content?.title || ''}>
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

export default AttenddeApplyShare;
