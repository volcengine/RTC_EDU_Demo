import React from 'react';
import { Modal } from 'antd';
import styles from './index.module.less';

interface ToastProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  width?: number;
}

function Toast(props: ToastProps) {
  const { open, title, children = '', width } = props;

  return (
    <Modal
      className={styles.toast}
      closable={false}
      title={title}
      open={open}
      centered
      footer={null}
      width={width}
    >
      {children}
    </Modal>
  );
}

export default Toast;
