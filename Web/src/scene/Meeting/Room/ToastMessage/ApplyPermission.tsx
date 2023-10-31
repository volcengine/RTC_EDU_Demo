import { useDispatch } from '@/store';
import { initialState, setToast } from '@/store/slices/ui';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';

import styles from './index.module.less';
import { DeviceState } from '@/types/state';

interface IProps {
  type: 'mic' | 'share';
}

function ApplyMicPermission(props: IProps) {
  const { type } = props;

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setToast(initialState.toast));
  };

  const handleApply = async () => {
    if (type === 'mic') {
      rtsApi.operateSelfMicApply({
        operate: DeviceState.Open,
      });
    }

    if (type === 'share') {
      rtsApi.sharePermissionApply();
    }

    handleClose();
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.confirmBtn} onClick={handleApply}>
        {type === 'mic' ? '申请发言' : '申请共享'}
      </button>

      <button className={styles.canceLBtn} onClick={handleClose}>
        取消
      </button>
    </div>
  );
}

export default ApplyMicPermission;
