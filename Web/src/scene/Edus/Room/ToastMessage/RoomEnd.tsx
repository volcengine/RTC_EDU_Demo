import { useDispatch } from '@/store';
import { initialState, setToast } from '@/store/slices/ui';
import styles from './index.module.less';
import { localUserLeaveRoom } from '@/store/slices/edusRoom';
import { useLeaveRoom } from '@/core/hooks';

interface IProps {
  message: string;
}

function RoomEnd(props: IProps) {
  const { message } = props;
  const dispatch = useDispatch();

  const handleLeaveRoom = () => {
    dispatch(localUserLeaveRoom());
  };

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: handleLeaveRoom,
  });

  const handleLeave = async () => {
    dispatch(setToast(initialState.toast));
    await leaveRoom();
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.message}>{message}</span>
      <button className={styles.confirmBtn} onClick={handleLeave}>
        我知道了
      </button>
    </div>
  );
}

export default RoomEnd;
