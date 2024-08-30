import { useDispatch } from '@/store';
import { initialState, setToast } from '@/store/slices/ui';
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
    // 不支持录制功能
    handleClose();
  };

  const handleCancel = async () => {
    // 不支持录制功能
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
