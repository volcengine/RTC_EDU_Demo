import React from 'react';
import { Button, Modal, Select } from 'antd';
import styles from './index.module.less';
import { ipcRenderer } from 'electron';

import { ProcessEvent } from '@/types';
import { useSelector } from '@src/store';

const { Option } = Select;
// TODO:其他渲染进程的录制setting
interface SettingProps {
  isShowSetting: boolean;
  setIsShowSetting: (show: boolean) => void;
}

const SettingModal: React.FC<SettingProps> = (props) => {
  const { isShowSetting, setIsShowSetting } = props;

  const { recordFileList } = useSelector((state) => state.recordList);

  // 关闭弹窗
  const handleCloseModal = () => {
    setIsShowSetting(false);
  };
  // 录制文件
  const handleSelect = (value: string) => {
    console.log('url', decodeURIComponent(value));
    ipcRenderer.send(ProcessEvent.OpenRecord, decodeURIComponent(value));
  };

  // 完成
  const onFinish = () => {
    handleCloseModal();
  };

  return (
    <Modal
      className={styles['settings-modal']}
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
        <div className={styles.selectItem}>
          <span>查看历史会议</span>
          <Select
            placeholder="选择历史会议点击链接查看"
            suffixIcon={null}
            style={{ width: 240 }}
            onSelect={handleSelect}
          >
            {recordFileList?.map((item) => {
              const { filename, url } = item;
              return (
                <Option key={url} vaue={url}>
                  {filename}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default SettingModal;
