import { useEffect, useRef } from 'react';
import { message as Message } from 'antd';

const useNetStatusChange = (props: { onNetOffline: () => void; onNetOnline: () => void }) => {
  const { onNetOffline, onNetOnline } = props;

  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleOffline = () => {
    timer.current = setTimeout(() => {
      // 断网1分钟退房
      Message.error('你已离开房间');
      onNetOffline();
    }, 60000);
    Message.error('网络连接已断开，请检查设置');
  };

  const handleOnline = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    Message.success('网络连接已经恢复');
    onNetOnline();
  };

  // 监听网络状态
  useEffect(() => {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};

export default useNetStatusChange;
