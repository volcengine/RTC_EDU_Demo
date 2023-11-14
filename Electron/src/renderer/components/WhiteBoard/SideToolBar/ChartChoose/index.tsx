import Icon from '@ant-design/icons';
import classNames from 'classnames';
import { Constant } from '@volcengine/white-board-manage';
import { RectIcon, CircleIcon, LineIcon, ArrowIcon } from './ToolIcon';
import styles from './index.module.less';
import React from 'react';

interface IChartChoose {
  onToolChange: (key: Constant.SHAPE_TYPE) => void;
  mode: Constant.SHAPE_TYPE;
}

function ChartChoose(props: IChartChoose) {
  const { onToolChange, mode } = props;
  return (
    <div className={styles.chooseShape}>
      <div className={styles.item}>
        <Icon
          component={RectIcon}
          onClick={() => onToolChange(Constant.SHAPE_TYPE.RECT)}
          className={classNames({ [styles.active]: mode === Constant.SHAPE_TYPE.RECT })}
        />
      </div>
      <div className={styles.item}>
        <Icon
          component={CircleIcon}
          onClick={() => onToolChange(Constant.SHAPE_TYPE.CIRCLE)}
          className={classNames({ [styles.active]: mode === Constant.SHAPE_TYPE.CIRCLE })}
        />
      </div>
      <div className={styles.item}>
        <Icon
          component={LineIcon}
          onClick={() => onToolChange(Constant.SHAPE_TYPE.LINE)}
          className={classNames({ [styles.active]: mode === Constant.SHAPE_TYPE.LINE })}
        />
      </div>
      <div className={styles.item}>
        <Icon
          component={ArrowIcon}
          onClick={() => onToolChange(Constant.SHAPE_TYPE.ARROW)}
          className={classNames({ [styles.active]: mode === Constant.SHAPE_TYPE.ARROW })}
        />
      </div>
    </div>
  );
}

export default ChartChoose;
