import React, { useState } from 'react';
import styles from './index.less';
import { Select, Button } from 'antd';
import { ipcRenderer } from 'electron';
import { ProcessEvent, WindowType } from '@/types';
// import { remote } from 'electron';
import IconButton from '@src/components/IconButton';
import Close from '@assets/images/Close.svg';
import { useSelector } from '@/renderer/store';
const { Option } = Select;

// const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

/**
 * 共享时的设置弹窗
 * @returns
 */
const Setting: React.FC = () => {
  const { recordFileList } = useSelector((state) => state.recordList);

  const handleRecordFileChanged = (value: string) => {
    ipcRenderer.send(ProcessEvent.OpenRecord, decodeURIComponent(value));
  };
  const handleCloseModal = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.SETTING, 'close');
  };

  // 完成
  const onFinish = () => {
    handleCloseModal();
  };
  return (
    <div className={styles.setting}>
      <div className={styles.header}>
        <div>会议设置</div>
        <div onClick={handleCloseModal} className={styles.closeIcon}>
          <IconButton src={Close} />
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.body}>
        <div className={styles.meetSetting}>
          <div className={styles.selectItem}>
            <span>查看历史会议</span>
            <Select
              placeholder="选择历史会议点击链接查看"
              suffixIcon={null}
              style={{ width: 240 }}
              onChange={handleRecordFileChanged}
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
      </div>
      <div className={styles.divider} />
      <div className={styles.footer}>
        <Button onClick={handleCloseModal}>取消</Button>
        <Button type="primary" onClick={onFinish}>
          完成
        </Button>
      </div>
    </div>
  );
};

export default Setting;
