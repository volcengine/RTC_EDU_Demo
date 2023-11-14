import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import Icon from '../Icon';
import ArrowIcon from './Arrow.svg';
import styles from './index.module.less';

interface IPagination {
  current: number;
  total: number;
  className?: string;
  onChange?: (current: number) => void;
}

const Pagination: React.FC<IPagination> = (props: IPagination) => {
  const { current, total, onChange, className } = props;

  const [active, setActive] = useState<number>(current);

  useEffect(() => {
    setActive(current);
  }, [current]);

  const handleGoPre = () => {
    if (active === 1) {
      return;
    }
    setActive(active - 1);
    onChange && onChange(active - 1);
  };

  const handleGoNext = () => {
    if (active === total) {
      return;
    }
    setActive(active + 1);
    onChange && onChange(active + 1);
  };

  return (
    <div className={classNames(styles.pagination, className)}>
      <button
        onClick={handleGoPre}
        disabled={active === 1}
        className={classNames(styles.pageBtn, active === 1 && styles.pageBtnDisable)}
      >
        <Icon src={ArrowIcon} />
      </button>
      <span className={styles.pageInfo}>
        <span className={styles.pageInfoActive}>{active}</span>
        <span className={styles.pageInfoSplit}>/</span>
        <span className={styles.pageInfoNext}>{total}</span>
      </span>
      <button
        onClick={handleGoNext}
        disabled={active === total}
        className={classNames(styles.pageBtn, active === total && styles.pageBtnDisable, styles.pageBtnNext)}
      >
        <Icon src={ArrowIcon} />
      </button>
    </div>
  );
};

export default Pagination;
