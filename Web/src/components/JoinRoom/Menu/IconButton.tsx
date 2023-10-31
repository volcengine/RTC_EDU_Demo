import { Icon } from '@/components';
import styles from './index.module.less';

interface IProps {
  src: string;
  onClick?: () => void;
  iconClassName?: string;
}

function IconButton(props: IProps) {
  const { src, onClick, iconClassName } = props;

  return (
    <div className={styles.iconButton} onClick={onClick}>
      <Icon src={src} className={iconClassName} />
    </div>
  );
}

export default IconButton;
