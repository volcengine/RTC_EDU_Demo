import VERTC from '@volcengine/rtc';
import { DemoVersion } from '@/config';
import styles from './index.module.less';

function Footer() {
  return (
    <div className={styles.sceneFooter}>
      <span className={styles.version}>
        Demo版本 v{DemoVersion}/ SDK版本 v{VERTC.getSdkVersion()}
      </span>
    </div>
  );
}

export default Footer;
