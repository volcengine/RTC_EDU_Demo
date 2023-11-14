import React from 'react';
import Icon from '@components/Icon';
import styles from './index.less';

interface IProps {
  src: string;
  onClick?: () => void;
  iconClassName?: string;
}
const IconButton: React.FC<IProps> = (props: IProps) => {
  const { src, onClick, iconClassName } = props;
  return (
    <div onClick={onClick} className={styles.iconButton}>
      <Icon src={src} className={iconClassName} />
    </div>
  );
};

export default IconButton;
