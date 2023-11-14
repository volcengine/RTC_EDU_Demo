import { useEffect, useRef } from 'react';
import { message as Message } from 'antd';

import { useDispatch } from '@src/store';
import { resetMessage, setNetStatus } from '@/renderer/store/modules/publicMessage';
import { removeAllUserInRtcRoom } from '@/renderer/store/modules/rtcRoom';
import { ProcessEvent } from '@/types';
import { ipcRenderer } from 'electron';

/**
 * 网络状态变化
 * 未进入房间时无需监听
 * @param props
 */
const useNetStatusChange = (props: { onNetOffline: () => void; onNetOnline?: () => void }) => {
  const { onNetOffline, onNetOnline } = props;

  const timer = useRef<NodeJS.Timeout | null>(null);
  const maxLeaveRoomTimer = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();

  const handleOffline = () => {
    timer.current = setTimeout(() => {
      Message.error('你已离开房间');
      // 断网1分钟退房
      ipcRenderer.send(ProcessEvent.RecoverWindow);

      onNetOffline && onNetOffline();
      //   dispatch(leaveRoom());

      dispatch(resetMessage());
      dispatch(removeAllUserInRtcRoom());
    }, 60000);
    Message.error('网络连接已断开，请检查设置');
    dispatch(setNetStatus(false));
  };

  const handleOnline = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    Message.success('网络连接已经恢复');
    onNetOnline && onNetOnline();
    dispatch(setNetStatus(true));
  };

  // 监听网络状态
  useEffect(() => {
    console.log('monitor net status.');
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // 兜底策略，盒盖/睡眠等情况下，超过30分钟唤醒后也自动退房
  useEffect(() => {
    maxLeaveRoomTimer.current = setTimeout(async () => {
      onNetOffline();
      Message.error('本产品仅用于功能体验，单次房间时长不超过30分钟');
    }, 30 * 60 * 1000);

    return () => {
      if (maxLeaveRoomTimer.current) {
        clearTimeout(maxLeaveRoomTimer.current);
        timer.current = null;
      }
    };
  }, []);
};

export default useNetStatusChange;
