import { Checkbox, Form, Modal, Select } from 'antd';
import { useMemo } from 'react';

import { BASENAME } from '@/config';

import styles from './index.module.less';
import { RecordFile } from '@/types/rtsTypes';
import { useDispatch, useSelector } from '@/store';
import { setAiAns } from '@/store/slices/setting';
import { aiAnsExtension } from '@/core/rtc/RtcClient';

interface ISettingModalProps {
  open: boolean;
  onClose: () => void;
  recordList: RecordFile[];
}

function SettingModal(props: ISettingModalProps) {
  const { open, onClose, recordList } = props;
  const aiAns = useSelector((state) => state.setting.aiAns);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      aiAns,
    }),
    [aiAns]
  );

  const handleClose = () => {
    form.setFieldsValue(initialValues);
    onClose();
  };

  const handleOk = async () => {
    const { aiAns } = form.getFieldsValue();
    if (aiAns) {
      aiAnsExtension.enable();
    } else {
      aiAnsExtension.disable();
    }

    dispatch(setAiAns(aiAns));

    onClose();
  };

  return (
    <Modal
      title="设置"
      open={open}
      width={788}
      className={styles['settings-modal']}
      onCancel={handleClose}
      onOk={handleOk}
      destroyOnClose
      bodyStyle={{
        minHeight: 400,
      }}
    >
      <Form labelCol={{ span: 4 }} form={form} initialValues={initialValues}>
        <Form.Item label="查看历史回放" wrapperCol={{ span: 10 }}>
          <Select
            placeholder="选择历史回放点击链接查看"
            onSelect={(url: string) => {
              window.open(`${BASENAME}/replay?videoUrl=${url}`, '_blank');
            }}
          >
            {recordList.map((item) => {
              return (
                <Select.Option key={item.url} value={item.url}>
                  {new Date(item.start_time).toLocaleString()}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          className={styles.aiAnsFormItem}
          label="降低噪音"
          extra="消除你的键盘声，周围的敲击声等背景噪音，让其他人更能清晰地听到你的声音."
          wrapperCol={{ span: 10 }}
          name="aiAns"
          valuePropName="checked"
        >
          <Checkbox>背景音降噪</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SettingModal;
