import { Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { MenuIconButton, PopoverContent } from '@src/components';

import RecordLight from '@assets/images/RecordDark.svg';

import styles from './index.module.less';
import React from 'react';

export default function () {
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
          titleText="暂时不支持回看录制功能"
        />
      }
    >
      <div className={styles.menuButton} ref={btnRef}>
        <MenuIconButton
          onClick={() => {
            setPopOpen(true);
          }}
          text="录制"
          icon={RecordLight}
        />
      </div>
    </Popover>
  );
}
