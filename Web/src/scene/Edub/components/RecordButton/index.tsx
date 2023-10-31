import { Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { MenuIconButton, PopoverContent } from '@/components';

import RecordLight from '@/assets/images/RecordLight.svg';
import RecordOn from '@/assets/images/RecordOn.svg';

import { RecordStatus } from '@/types/state';

import styles from './index.module.less';

interface RecordButtonProps {
  room: {
    record_status?: RecordStatus;
  };
}

export default function (props: RecordButtonProps) {
  const { room } = props;

  const btnRef = useRef<HTMLDivElement>(null);

  const [popOpen, setPopOpen] = useState(false);

  useEffect(() => {
    const hidePop = (e: Event) => {
      if (!btnRef.current?.contains(e.target as unknown as HTMLElement)) {
        setPopOpen(false);
      }
    };

    window.addEventListener('click', hidePop);
    return () => {
      window.removeEventListener('click', hidePop);
    };
  }, [btnRef]);

  return (
    <Popover
      open={popOpen}
      content={
        <PopoverContent
          onOk={() => {
            setPopOpen(false);
          }}
          titleText='暂时不支持录制功能'
        />
      }
    >
      <div className={styles.menuButton} ref={btnRef}>
        <MenuIconButton
          onClick={() => {
            setPopOpen(true);
          }}
          text={room.record_status === RecordStatus.Recording ? '录制中' : '录制'}
          icon={room.record_status === RecordStatus.Recording ? RecordOn : RecordLight}
        />
      </div>
    </Popover>
  );
}
