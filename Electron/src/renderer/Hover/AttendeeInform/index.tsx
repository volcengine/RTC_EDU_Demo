import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { ProcessEvent, WindowType } from '@/types';

import { Button } from 'antd';
import { remote } from 'electron';
import styles from './index.less';
import { useSelector } from '@src/store';
import { MessageType } from '@src/store/modules/publicMessage';
import { DeviceState } from '@/renderer/types/state';
import { SceneType } from '@/renderer/store/slices/scene';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

/**
 * 主持人： 收到申请开麦，申请共享
 * 参会人：主持人要求开麦，要求开摄像头
 */

type CBNAME = 'handleReqOpenMic' | 'handleComfirmOpenMic' | 'handleConfirmOpenCamera';

const AttenDeeInform: React.FC = () => {
  const { message: curMessage } = useSelector((state) => state.messageType);
  const { scene } = useSelector((state) => state.scene);

  const hostText = scene === SceneType.Meeting ? '主持人' : '老师';

  const [btnText, setBtnText] = useState('申请发言');
  const [showMessage, setShowMessage] = useState(`无法自行打开麦克风，请向${hostText}申请发言`);
  const [cbName, setCbName] = useState<CBNAME>('handleReqOpenMic');

  const hideWindow = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.ATTENDEE_MODAL, 'close');
  };
  const handleCancel = () => {
    if (curMessage === MessageType.RECIVE_HOST_REQUEST_OPEN_MIC) {
      ipcRenderer.sendTo(mainWindowId, 'handleComfirmOpenMic', DeviceState.Closed);
    } else if (curMessage === MessageType.RECIVE_HOST_REQUEST_OPEN_CAMERA) {
      ipcRenderer.sendTo(mainWindowId, 'handleConfirmOpenCamera', DeviceState.Closed);
    }
    hideWindow();
  };
  const onClickConfirm = {
    handleReqOpenMic: () => {
      ipcRenderer.sendTo(mainWindowId, 'handleReqOpenMic');
      hideWindow();
    },
    handleComfirmOpenMic: () => {
      // 1. 同意打开mic
      ipcRenderer.sendTo(mainWindowId, 'handleComfirmOpenMic', DeviceState.Open);
      hideWindow();
    },
    handleConfirmOpenCamera: () => {
      // 1. 同意打开camera
      ipcRenderer.sendTo(mainWindowId, 'handleConfirmOpenCamera', DeviceState.Open);
      hideWindow();
    },
  };

  useEffect(() => {
    console.log('curMessage: ', curMessage);
    if (curMessage === MessageType.RECIVE_HOST_REQUEST_OPEN_MIC) {
      setBtnText('确认');
      setCbName('handleComfirmOpenMic');
      setShowMessage(`${hostText}请求打开你的麦克风`);
    }
    if (curMessage === MessageType.RECIVE_HOST_REQUEST_OPEN_CAMERA) {
      setBtnText('确认');
      setCbName('handleConfirmOpenCamera');
      setShowMessage(`${hostText}请求打开你的摄像头`);
    }
  }, [curMessage]);

  return (
    <div className={styles.inform}>
      <div className={styles.title}>{showMessage}</div>
      <div className={styles.confirm}>
        <Button type="primary" onClick={onClickConfirm[cbName]}>
          {btnText}
        </Button>
      </div>
      <div className={styles.cancel}>
        <Button onClick={handleCancel}>取消</Button>
      </div>
    </div>
  );
};

export default AttenDeeInform;
