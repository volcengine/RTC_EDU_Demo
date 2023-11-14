import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';

interface ToastProps {
  isShow: boolean;
  message: string;
  children?: React.ReactNode;
}

const Toast: React.FC<ToastProps> = (props) => {
  const { isShow, message, children = '' } = props;

  return (
    <Modal className={styles.toast} centered={true} closable={false} title={message} open={isShow} footer={null}>
      <div className={styles.body}>{children}</div>
    </Modal>
  );
};

export default Toast;
