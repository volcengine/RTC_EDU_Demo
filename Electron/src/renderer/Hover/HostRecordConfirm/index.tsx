import React, { useMemo } from 'react';
import { ipcRenderer } from 'electron';
import { Button } from 'antd';
import { remote } from 'electron';
import styles from './index.less';
import { ProcessEvent, WindowType } from '@/types';
import { RecordStatus } from '@/renderer/types/state';
import { useSelector } from '@/renderer/store';
import useSceneRoom from '@/renderer/core/hooks/useSceneRoom';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

const HostConfirmRecord: React.FC = () => {
  const room = useSceneRoom();

  const content = useMemo(() => {
    if (room?.record_status === RecordStatus.NotRecoading) {
      return {
        btnText: '开始录制',
        title: '确定要开始录制',
        text: '录制功能仅做体验，本产品仅用于功能体验， 单次录制不超过15分钟，录制文件保留时间为1周。',
        onClickStartRecord: () => {
          ipcRenderer.sendTo(mainWindowId, 'startRecord');
          hideWindow();
        },
      };
    } else {
      return {
        btnText: '停止录制',
        title: '确定要停止录制',
        text: '',
        onClickStartRecord: () => {
          ipcRenderer.sendTo(mainWindowId, 'stopRecord');
          hideWindow();
        },
      };
    }
  }, [room?.record_status]);
  const handleCancel = () => {
    hideWindow();
  };
  const hideWindow = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.HOST_RECORD_COMFIRM, 'close');
  };
  return (
    <div className={styles.inform}>
      <div className={styles.title}>{content.title}</div>
      {content?.text && (
        <div className={styles.text}>
          <span className={styles.symbol}>*</span>
          <span>{content.text}</span>
        </div>
      )}
      <div className={styles.confirm}>
        <Button type="primary" onClick={content.onClickStartRecord}>
          {content.btnText}
        </Button>
      </div>
      <div className={styles.cancel}>
        <Button onClick={handleCancel}>取消</Button>
      </div>
    </div>
  );
};

export default HostConfirmRecord;
