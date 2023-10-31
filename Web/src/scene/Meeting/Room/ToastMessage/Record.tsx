import { useDispatch } from '@/store';
import { initialState, setToast } from '@/store/slices/ui';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';

import styles from './index.module.less';

interface IProps {
  type: 'start' | 'stop';
  other: {
    message: string;
    userId: string;
  };
}

function Record(props: IProps) {
  const { type, other } = props;

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setToast(initialState.toast));
  };

  const handleRecord = async () => {
    // 调用rts 进行共享
    // 修改房间共享状态

    if (type === 'start') {
      await rtsApi.startRecordPermit({
        permit: 1,
        apply_user_id: other.userId,
      });
      await rtsApi.startRecord();
    }

    if (type === 'stop') {
      await rtsApi.stopRecord();
    }

    handleClose();
  };

  const handleCancel = async () => {
    // 调用rts 进行共享
    // 修改房间共享状态
    await rtsApi.startRecordPermit({
      permit: 0,
      apply_user_id: other.userId,
    });

    handleClose();
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.message}>{other.message}</span>

      <button className={styles.confirmBtn} onClick={handleRecord}>
        {type === 'start' ? '开始录制' : '结束录制'}
      </button>

      <button className={styles.canceLBtn} onClick={handleCancel}>
        取消
      </button>
    </div>
  );
}

export default Record;
