import styles from './index.module.less';
import useRoomTime from './useRoomTime';
import RecordOn from '@/assets/images/RecordOn.svg';
import { Icon } from '@/components';

import { RecordStatus } from '@/types/state';

export default function (props: {
  room: {
    start_time: number;
    room_id?: string;
    base_time?: number;
    experience_time_limit?: number;
    record_status?: RecordStatus;
  };
}) {
  const { room } = props;
  const time = useRoomTime(room.start_time, room.base_time, room.experience_time_limit);

  return (
    <div className={styles.roomInfo}>
      <span>房间ID：{room.room_id || ''}</span>
      <span className={styles.sperature} />
      <span>{time}</span>
      {room.record_status === RecordStatus.Recording && (
        <>
          <span className={styles.sperature} />
          <span className={styles.record_wrap}>
            <Icon className={styles.record_wrapIcon} src={RecordOn} />
            <span>录制中</span>
          </span>
        </>
      )}
    </div>
  );
}
