import { BkFillType, Constant, TOOL_TYPE, IWhiteBoard } from '@volcengine/white-board-manage';
import { useState } from 'react';
import { Radio, Divider, Button, Space, Upload, message } from 'antd';
import styles from './index.module.less';
import ColorPicker from '../ColorPicker';
import ImgUrlButton from '../ImageUrlButton';
import { PopType } from '../types';
import ChartChoose from '../ChartChoose';
import uploadFile from '@src/core/tos';
import Brushthickness from '../BrushThickness';
import React from 'react';

const range = [40, 70, 100];
const textRange = [300, 500, 700];

const ShapeDesc = {
  [Constant.SHAPE_TYPE.CIRCLE]: '(按住shift可绘制正圆)',
  [Constant.SHAPE_TYPE.RECT]: '(按住shift可绘制正方形)',
  [Constant.SHAPE_TYPE.LINE]: '(按住shift可绘制水平/垂直线)',
  [Constant.SHAPE_TYPE.ARROW]: '(按住shift可绘制水平/垂直线)',
};

interface PopModalProps {
  setBrushColor: (color: string) => void;
  brushColor: string;
  setBrushThickness?: (size: number) => void;
  brushThickness?: number;
  whiteBoard: IWhiteBoard;
  kind: PopType;
  mode: TOOL_TYPE | Constant.SHAPE_TYPE | 'background' | undefined;
  onToolChange: (key: Constant.SHAPE_TYPE) => void;
}

const kindMap = {
  [PopType.pencilBrush]: '画笔大小',
  [PopType.shape]: '线条粗细',
  [PopType.textbox]: '文字大小',
  [PopType.background]: '',
};

function PopModal(props: PopModalProps) {
  const [fillType, setFillType] = useState<BkFillType>(BkFillType.kFill);
  const [backgroundType, setBackGroundType] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const {
    whiteBoard,
    setBrushColor,
    setBrushThickness,
    kind,
    onToolChange,
    mode,
    brushThickness,
    brushColor,
  } = props;
  // 画笔颜色
  const handleOnBrushColorChange = (color: {
    rgb: { r: number; g: number; b: number; a?: number };
  }) => {
    const c = color.rgb;
    const brushColor = `rgba(${c.r},${c.g},${c.b},255)`;
    whiteBoard.setShapeColor(brushColor);
    whiteBoard.setPenColor(brushColor);
    whiteBoard.setTextColor(brushColor);
    setBrushColor(brushColor);
  };
  const handleOnBrushThicknessChange = (current: number) => {
    whiteBoard.setShapeSize(range[current]);
    whiteBoard.setPenSize(range[current]);
    whiteBoard.setTextFontSize(textRange[current]);
    setBrushThickness && setBrushThickness(current);
  };

  const handleUpload = async (file: File) => {
    if (isUploading) {
      message.warning('存在上传任务进行中');
      return;
    }
    setIsUploading(true);

    try {
      const url = await uploadFile({
        key: encodeURIComponent(file.name),
        file,
      });

      if (backgroundType === 0) {
        whiteBoard.changePageBackground({
          pageId: whiteBoard.getCurrentPageId(),
          img: url,
          fillType,
        });
      } else {
        whiteBoard.changeBoardBackground({
          bkImage: url,
          bkImageFillType: fillType,
        });
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setIsUploading(false);
    }

    return false;
  };

  return (
    <>
      {kind === PopType.shape && (
        <>
          <span className={styles.title}>
            形状类型
            <span className={styles.shapeDesc}>
              {ShapeDesc[mode as Constant.SHAPE_TYPE as keyof typeof ShapeDesc]}
            </span>
          </span>
          <ChartChoose onToolChange={onToolChange} mode={mode as Constant.SHAPE_TYPE} />
        </>
      )}
      {kind !== PopType.background && (
        <>
          <span className={styles.title}>{kindMap[kind]}</span>

          <Brushthickness
            current={brushThickness || 0}
            onChange={(current) => handleOnBrushThicknessChange(current)}
            items={[
              {
                label: '小',
                size: 0,
              },
              {
                label: '中',
                size: 1,
              },
              {
                label: '大',
                size: 2,
              },
            ]}
          />
        </>
      )}
      <span className={styles.title}>{`${kind === PopType.background ? '背景' : '画笔'}颜色`}</span>
      <ColorPicker color={brushColor} onChange={handleOnBrushColorChange} />
      {kind === PopType.background && (
        <>
          <Radio.Group value={backgroundType} onChange={(e) => setBackGroundType(e.target.value)}>
            <Radio value={0}>当前</Radio>
            <Radio value={1}>全局</Radio>
          </Radio.Group>
          <Divider className={styles.divider} />
          <Button
            onClick={() => {
              if (backgroundType === 0) {
                whiteBoard.changePageBackground({
                  pageId: whiteBoard.getCurrentPageId(),
                  color: brushColor,
                });
              } else {
                console.log('brushColor', brushColor);
                whiteBoard.changeBoardBackground({
                  bkColor: brushColor,
                });
              }
            }}
          >
            设置背景色
          </Button>
          <Divider className={styles.divider} />
          <Space direction="vertical">
            <Radio.Group value={fillType} onChange={(e) => setFillType(e.target.value)}>
              <Radio value={BkFillType.kFill}>fill</Radio>
              <Radio value={BkFillType.kCenter}>center</Radio>
              <Radio value={BkFillType.kHidden}>hidden</Radio>
            </Radio.Group>
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept=".jpg,.jpeg,.png,.bmp"
            >
              <Button>添加本地图片背景</Button>
            </Upload>
            <ImgUrlButton whiteBoard={whiteBoard} fillType={fillType} />
          </Space>
          <Divider className={styles.divider} />
          <Button
            onClick={() =>
              whiteBoard.changePageBackground({ pageId: whiteBoard.getCurrentPageId() })
            }
            // disabled={file?.type !== FileType.whiteBoard}
          >
            清空当前页背景
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => whiteBoard.changeBoardBackground({})}
            // disabled={file?.type !== FileType.whiteBoard}
          >
            清空全局页背景
          </Button>
        </>
      )}
    </>
  );
}

export default PopModal;
