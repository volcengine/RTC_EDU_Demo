import classNames from 'classnames';
import React from 'react';

import styles from './index.module.less';

const colors = [
  'rgba(235,60,54,255)',
  'rgba(255,186,18,255)',
  'rgba(26,116,255,255)',
  'rgba(0,170,84,255)',
  'rgba(0,0,0,255)',
  'rgba(140,140,140,255)',
  'rgba(255,255,255,255)',
];

interface IColorPicker {
  color: string;
  onChange: (color: { rgb: { r: number; g: number; b: number; a?: number } }) => void;
}

function ColorTool(props: IColorPicker) {
  const { color, onChange } = props;

  const handleColorClick = (c: string) => {
    const rgb = c.replace('rgba', '').replace('(', '').replace(')', '').split(',');

    onChange({
      rgb: { r: Number(rgb[0]!), g: Number(rgb[1]!), b: Number(rgb[2]!), a: Number(rgb[3]!) },
    });
  };

  return (
    <div className={classNames(styles['whiteboard-colorpicker'])}>
      {colors.map((c) => {
        return (
          <div
            // title={c}
            key={c}
            onClick={() => {
              handleColorClick(c);
            }}
            className={classNames(styles.colorItem, color === c && styles.selectedColor)}
          >
            <span
              className={styles.colorBlock}
              style={{
                background: c,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ColorTool;
