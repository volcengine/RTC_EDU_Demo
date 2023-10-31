import classNames from 'classnames';
// import { CompactPicker } from 'react-color';

import styles from './index.module.less';

interface IBrushthickness {
  current: number;
  onChange: (current: number) => void;
  items: { label: string; size: number }[];
}

function Brushthickness(props: IBrushthickness) {
  const { current, onChange, items } = props;

  const handleClick = (size: number) => {
    if (size === current) {
      return;
    }
    onChange(size);
  };

  return (
    <div className={classNames(styles['whiteboard-brushthickness'])}>
      <div className={styles.brushthicknessLine}>
        {items.map((item) => {
          return (
            <div
              data-size={item.size}
              data-current={current}
              key={item.label}
              onClick={() => {
                handleClick(item.size);
              }}
              className={classNames(
                styles.sizeItem,
                current >= item.size && styles.active,
                styles[`sizeItem-${item.size}`]
              )}
            >
              <span className={styles.icon} data-size={item.size} />
            </div>
          );
        })}
      </div>

      <div className={styles.brushthicknessLine}>
        {items.map((item) => {
          return (
            <div
              key={item.label}
              onClick={() => {
                handleClick(item.size);
              }}
              className={styles.label}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Brushthickness;
