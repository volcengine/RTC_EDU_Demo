import LoadingImg from '@/assets/images/Loading.png';
import styles from './index.module.less';

function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      <img src={LoadingImg} className="loadingIcon" alt="loading" />
      <span className={styles.text}>加载中...</span>
    </div>
  );
}

export default Loading;
