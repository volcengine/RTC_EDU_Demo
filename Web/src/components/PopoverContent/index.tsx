import WarnIcon from '@/assets/images/msg/warning.png';

import styles from './index.module.less';

interface PopContent {
  onOk?: () => void;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
  titleText: string;
  titleIcon?: string;
}

function Content(props: PopContent) {
  const {
    onOk,
    okText = '确认',
    onCancel,
    cancelText = '取消',
    titleText,
    titleIcon = WarnIcon,
  } = props;
  return (
    <div className={styles.contentWrapper}>
      <span className={styles.infoTitle}>
        <img src={titleIcon} alt="icon" />
        {titleText}
      </span>
      <div className={styles.btns}>
        {
          onCancel &&
          <button className={styles.cancel} onClick={onCancel}>
            {cancelText}
          </button>
        }
        {
          onOk &&
          <button className={styles.confirm} onClick={onOk}>
            {okText}
          </button>
        }
      </div>
    </div>
  );
}

export default Content;
