import { useDispatch } from '@/store';
import { initialState, setToast, setUserListDrawOpen } from '@/store/slices/ui';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';
import styles from './index.module.less';
import { reviewRemoteApply } from '@/store/slices/meetingRoom';
import { ApplyType, DeviceState, Permission } from '@/types/state';
import { IOnOperateSelfMicApply } from '@/scene/Meeting/hooks/informType';

interface IProps {
  other: {
    user: IOnOperateSelfMicApply;
    text: string;
  };
  type: 'mic' | 'share';
}

function ApplyPermission(props: IProps) {
  const {
    type,
    other: { user, text },
  } = props;

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setToast(initialState.toast));
  };

  const handleApply = async () => {
    if (text === '同意') {
      if (type === 'mic') {
        rtsApi.operateSelfMicPermit({
          apply_user_id: user.user_id,
          permit: DeviceState.Open,
        });

        dispatch(
          reviewRemoteApply({
            userId: user.user_id,
            applying: ApplyType.Mic,
          })
        );
      }

      if (type === 'share') {
        rtsApi.sharePermissionPermit({
          apply_user_id: user.user_id,
          permit: Permission.HasPermission,
        });

        dispatch(
          reviewRemoteApply({
            userId: user.user_id,
            applying: ApplyType.Screen,
          })
        );
      }
    }

    if (text === '查看详情') {
      dispatch(setUserListDrawOpen(true));
    }

    handleClose();
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.confirmBtn} onClick={handleApply}>
        {text}
      </button>

      <button className={styles.canceLBtn} onClick={handleClose}>
        取消
      </button>
    </div>
  );
}

export default ApplyPermission;
