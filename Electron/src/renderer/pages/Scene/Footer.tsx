import { DemoVersion } from '@src/config';
import styles from './index.module.less';
import React from 'react';

function Footer() {
  return (
    <div className={styles.sceneFooter}>
      <span className={styles.version}>
        Demo版本 v{DemoVersion}/ SDK版本 v{window.VERTCVideo.getSDKVersion()}
      </span>
    </div>
  );
}

export default Footer;
