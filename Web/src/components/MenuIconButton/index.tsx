import { MouseEvent } from 'react';
import { Icon } from '@/components';
import styles from './index.module.less';

interface MenuIconButtonProps {
  text?: string;
  value?: boolean;
  icon: string;
  onChange?: (value: boolean) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
  iconClassName?: string;
}

function MenuIconButton(props: MenuIconButtonProps) {
  const { onChange, value, text, icon, onClick, className, iconClassName } = props;

  const handleMenuIconButtonClick = (e: MouseEvent<HTMLDivElement>) => {
    onChange && onChange(!value);
    onClick && onClick(e);
  };

  return (
    <div
      className={`${styles.menuIconButton} ${className || ''}`}
      onClick={handleMenuIconButtonClick}
    >
      <div className={`${styles.iconWrapper} ${iconClassName || ''}`}>
        <Icon src={icon} />
      </div>
      {text && <span className={styles.menuButtonText}>{text}</span>}
    </div>
  );
}

export default MenuIconButton;
