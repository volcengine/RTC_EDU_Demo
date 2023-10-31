import { Checkbox } from 'antd';
import { useState } from 'react';
import { Toast } from '@/components';
import styles from './index.module.less';
import { Permission } from '@/types/state';

interface IProps {
  onOk: (operate_self_mic_permission: Permission) => void;
  onCancel: () => void;
  open: boolean;
}

export default function (props: IProps) {
  const { onOk, onCancel, open } = props;

  const [operateSelfMic, setOperateSelfMic] = useState(true);

  const handleMuteAll = () => {
    onOk(operateSelfMic ? Permission.HasPermission : Permission.NoPermission);
    setTimeout(() => {
      setOperateSelfMic(true);
    }, 100);
  };

  return (
    <Toast open={open} title="将全体以及新加入的参会人静音" width={320}>
      <Checkbox
        className={styles.openMicCheckbox}
        checked={operateSelfMic}
        onChange={(e) => {
          setOperateSelfMic(e.target.checked);
        }}
      >
        参会人自己打开麦克风
      </Checkbox>
      <div className={styles.btns}>
        <button className={styles.muteButton} onClick={handleMuteAll}>
          全员静音
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          取消
        </button>
      </div>
    </Toast>
  );
}
