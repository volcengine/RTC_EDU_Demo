import { Popover } from 'antd';
import { useState } from 'react';

import RecordLight from '@/assets/images/RecordLight.svg';
import RecordOn from '@/assets/images/RecordOn.svg';
import { RecordStatus } from '@/types/state';

import { useSelector } from '@/store';

import styles from './index.module.less';
import { MenuIconButton, PopoverContent } from '@/components';

export default function () {
  const room = useSelector((state) => state.edusRoom);
  const [popOpen, setPopOpen] = useState(false);

  const handleClick = () => {
    setPopOpen(true);
  };

  return (
    <div className={styles.menuButton}>
        <Popover
          open={popOpen}
          placement="top"
          content={
            <PopoverContent
              onOk={() => {
                setPopOpen(false);
              }}
              titleText='暂时不支持录制功能'
            />
          }
        >
          <MenuIconButton
            onClick={handleClick}
            text={room.record_status === RecordStatus.Recording ? '录制中' : '录制'}
            icon={room.record_status === RecordStatus.Recording ? RecordOn : RecordLight}
          />
        </Popover>
    </div>
  );
}
