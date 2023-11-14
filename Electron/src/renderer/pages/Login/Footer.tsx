import styles from './index.less';
import React from 'react';

function Footer() {
  return (
    <div className={styles.sceneFooter}>
      <span className={styles.link}>
        <a href="https://www.volcengine.com/business_license">营业执照</a>
      </span>
      <span className={styles.link}>
        <a href="https://dxzhgl.miit.gov.cn/#/home">增值电信业务经营许可证京B2-20202418, B1.B2-20202637</a>
      </span>
      <span className={styles.link}>
        网络文化经营许可证：京网文（2020）5702-1116号
      </span>
    </div>
  );
}

export default Footer;
