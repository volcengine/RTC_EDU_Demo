import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { Icon } from '@src/components';
import styles from './index.module.less';

interface MenuIconButtonProps {
  icon: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

function IconButton(props: MenuIconButtonProps, ref: React.LegacyRef<HTMLDivElement>) {
  const { icon, onClick, className } = props;

  const handleMenuIconButtonClick = (e: MouseEvent<HTMLDivElement>) => {
    onClick && onClick(e);
  };

  return (
    <div
      ref={ref}
      className={classNames(styles.toolbarIconButton, className)}
      onClick={handleMenuIconButtonClick}
    >
      <Icon src={icon} className={styles.toolbarIcon} />
    </div>
  );
}

export default React.forwardRef(IconButton);
