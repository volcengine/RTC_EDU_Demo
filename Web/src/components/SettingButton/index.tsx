import { Popover } from 'antd';
import { useState } from 'react';
import { PopoverContent } from '@/components';
import SettingIcon from '@/assets/images/Setting.svg';
import styles from './index.module.less';
import MenuIconButton from '../MenuIconButton';

interface SettingProps {
  text?: string;
}

export default function (props: SettingProps) {
  const { text } = props;

  const [popOpen, setPopOpen] = useState(false);

  return (
    <div className={styles.menuButton}>
      <Popover
        open={popOpen}
        content={
          <PopoverContent
            onOk={() => {
              setPopOpen(false);
            }}
            titleText='暂时不支持回看录制功能'
          />
        }
      >
        <MenuIconButton
          iconClassName={styles.normalIcon}
          onClick={() => {
            setPopOpen(true);
          }}
          text={text}
          icon={SettingIcon}
        />
      </Popover>
    </div>
  );
}
