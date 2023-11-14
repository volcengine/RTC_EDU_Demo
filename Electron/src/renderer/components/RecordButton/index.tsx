import { Theme } from '@/renderer/store/slices/ui';
import { Popover } from 'antd';
import React, { useState } from 'react';
import RecordDark from '@assets/images/RecordDark.svg';
import RecordWhite from '@assets/images/RecordWhite.svg';
import { useSelector } from '@/renderer/store';
import IconButton from '../IconButton';
import PopoverContent from '../PopoverContent';
import styles from './index.module.less';

export default function RecordButton() {
  const [popOpen, setPopOpen] = useState(false);
  const theme = useSelector((state) => state.ui.theme);

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
      <IconButton
        className={styles.menuButton}
        text="录制"
        src={theme === Theme?.light ? RecordDark : RecordWhite}
        onClick={() => {
          setPopOpen(true);
        }}
      />
    </Popover>
  );
}
