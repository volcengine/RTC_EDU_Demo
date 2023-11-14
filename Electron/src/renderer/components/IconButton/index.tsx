import React from 'react';
import Icon from '@components/Icon';
import styles from './index.less';
import classNames from 'classnames';

interface IconButtonProps {
  src: string;
  className?: string;
  text?: string;
  suffix?: any;
  onMouseEnter?: any;
  onMouseLeave?: any;
  onFocus?: any;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { className, src, text, onClick = () => {}, onMouseEnter, onFocus, onMouseLeave } = props;
  return (
    <div
      className={classNames(styles.iconButton, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onClick={() => {
        onClick();
      }}
    >
      <Icon src={src} className={styles.icon} />
      {text ? <div className={styles.iconText}>{text}</div> : <></>}
    </div>
  );
};

export default IconButton;
