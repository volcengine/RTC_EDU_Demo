import { Popover } from 'antd';
import { useState } from 'react';
import { MenuIconButton, PopoverContent } from '@/renderer/components';
import SettingIcon from '@assets/images/device/Setting.svg';
import styles from './index.module.less';
import React from 'react';
import { useSelector } from '@/renderer/store';

interface SettingProps {
  text?: string;
  className?: string;
}

export default function (props: SettingProps) {
  const { text = '设置', className = '' } = props;

  const [popOpen, setPopOpen] = useState(false);

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
      <MenuIconButton
        className={className}
        iconClassName={styles.normalIcon}
        onClick={() => {
          setPopOpen(true);
        }}
        text={text}
        icon={SettingIcon}
      />
    </Popover>
  );
}
