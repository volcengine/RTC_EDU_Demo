import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button } from 'antd';
import { remote } from 'electron';
import styles from './index.less';
import { ProcessEvent, WindowType } from '@/types';
import { useSelector } from '@/renderer/store';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

const HostRecieveRecord: React.FC = () => {
  const { reqOpenRecordList } = useSelector((state) => state.messageType);

  const onClickStartRecord = () => {
    ipcRenderer.sendTo(mainWindowId, 'startRecord');
    hideWindow();
  };
  const handleCancel = () => {
    ipcRenderer.sendTo(mainWindowId, 'rejectRecord');
    hideWindow();
  };
  const hideWindow = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.HOST_RECORD_RECIVE, 'close');
  };

  return (
    <div className={styles.inform}>
      <div className={styles.title}>{`${reqOpenRecordList?.[0]?.userName || ''}发起录制申请`}</div>
      <div className={styles.confirm}>
        <Button type="primary" onClick={onClickStartRecord}>
          同意
        </Button>
      </div>
      <div className={styles.cancel}>
        <Button onClick={handleCancel}>拒绝</Button>
      </div>
    </div>
  );
};

export default HostRecieveRecord;
