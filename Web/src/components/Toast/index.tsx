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

  // 添加 getContainer={false} 和 forceRender 可以解决 Ant Design
  // "Instance created by `useForm` is not connect to any Form element" 问题
  return (
    <Modal
      forceRender
      className={styles.toast}
      closable={false}
      title={title}
      open={open}
      centered
      footer={null}
      width={width}
      getContainer={false}
    >
      {children}
    </Modal>
  );
}

export default Toast;
