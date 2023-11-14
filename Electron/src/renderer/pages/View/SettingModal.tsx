import React from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';

// TODO:其他渲染进程的录制setting
interface SettingProps {
  isShowSetting: boolean;
  setIsShowSetting: (show: boolean) => void;
}

const SettingModal: React.FC<SettingProps> = (props) => {
  const { isShowSetting, setIsShowSetting } = props;

  // 关闭弹窗
  const handleCloseModal = () => {
    setIsShowSetting(false);
  };

  // 完成
  const onFinish = () => {
    handleCloseModal();
  };

  return (
    <Modal
      className={styles.settingModal}
      title="会议设置"
      open={isShowSetting}
      centered={true}
      width={600}
      onCancel={handleCloseModal}
      footer={
        <>
          <Button onClick={handleCloseModal}>取消</Button>
          <Button type="primary" onClick={onFinish}>
            完成
          </Button>
        </>
      }
    >
      <div className={styles.meetSetting}>
        <div className={styles.selectItem}>{/*  */}</div>
      </div>
    </Modal>
  );
};

export default SettingModal;
