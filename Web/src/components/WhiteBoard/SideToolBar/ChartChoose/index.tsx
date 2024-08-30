import Icon from '@ant-design/icons';
import classNames from 'classnames';
import { ToolMode } from '@volcengine/white-board-manage';
import { RectIcon, CircleIcon, LineIcon, ArrowIcon } from './ToolIcon';
import styles from './index.module.less';

interface IChartChoose {
  onToolChange: (key: ToolMode) => void;
  mode: ToolMode;
}

function ChartChoose(props: IChartChoose) {
  const { onToolChange, mode } = props;
  return (
    <div className={styles.chooseShape}>
      <div className={styles.item}>
        <Icon
          component={RectIcon}
          onClick={() => onToolChange(ToolMode.RECT)}
          className={classNames({ [styles.active]: mode === ToolMode.RECT })}
        />
      </div>
      <div className={styles.item}>
        <Icon
          component={CircleIcon}
          onClick={() => onToolChange(ToolMode.CIRCLE)}
          className={classNames({ [styles.active]: mode === ToolMode.CIRCLE })}
        />
      </div>
      <div className={styles.item}>
        <Icon
          component={LineIcon}
          onClick={() => onToolChange(ToolMode.LINE)}
          className={classNames({ [styles.active]: mode === ToolMode.LINE })}
        />
      </div>
      <div className={styles.item}>
        <Icon
          component={ArrowIcon}
          onClick={() => onToolChange(ToolMode.ARROW)}
          className={classNames({ [styles.active]: mode === ToolMode.ARROW })}
        />
      </div>
    </div>
  );
}

export default ChartChoose;
