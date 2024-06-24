import classNames from 'classnames';
import {
  Modal,
  Popconfirm,
  Popover,
  Progress,
  Spin,
  Tooltip,
  Upload,
  message as Message,
} from 'antd';

import { useEffect, useState, useRef, useContext } from 'react';
import {
  BkFillType,
  InputFormat,
  OutputFormat,
  StorageType,
  TaskStatus,
  ToolMode,
  TranscodeMode,
  ControlType,
} from '@volcengine/white-board-manage';

import PointerSvg from '@/assets/images/board/Pointer.svg';
import LaserPenSvg from '@/assets/images/board/LaserPen.svg';
import BackgroundSvg from '@/assets/images/board/Background.svg';
import DeleteSvg from '@/assets/images/board/Delete.svg';
import EraserSvg from '@/assets/images/board/Eraser.svg';
import PenSvg from '@/assets/images/board/Pen.svg';
import RedoSvg from '@/assets/images/board/Redo.svg';
import SidebarFoldSvg from '@/assets/images/board/SidebarFold.svg';
import TextSvg from '@/assets/images/board/Text.svg';
import UndoSvg from '@/assets/images/board/Undo.svg';
import UploadSvg from '@/assets/images/board/Upload.svg';
import AlbumSvg from '@/assets/images/board/Album.svg';

// import ShapeSvg from '@/assets/images/board/Shape.svg';
import ShapeCircle from '@/assets/images/board/ShapeCircle.svg';
import ShapeLine from '@/assets/images/board/ShapeLine.svg';
import ShapeRect from '@/assets/images/board/ShapeRect.svg';
import ShapeArrow from '@/assets/images/board/ShapeArrow.svg';

import { useDispatch, useSelector } from '@/store';

import { BoardClient } from '@/core/board';
import { tosConfig } from '@/config';
import uploadFile from '@/core/tos';
import IconBtn from './IconBtn';

import styles from './index.module.less';
import PopModal from './PopModal';
import { PopType } from './types';
import { setBoardPagePreviewOpen } from '@/store/slices/ui';
import BoardContext from '../BoardContext';

type ToolType = ControlType | ToolMode | 'background' | 'upload' | 'album';

interface ToolBarProps {
  disabledUndo: boolean;
  disabledRedo: boolean;
}

function ToolBar(props: ToolBarProps) {
  const { disabledUndo, disabledRedo } = props;
  const dispatch = useDispatch();

  const boardPagePreviewOpen = useSelector((state) => state.ui.boardPagePreviewOpen);

  const [curTool, setCurTool] = useState<ToolType>();
  const [curToolShape, setCurToolShape] = useState<ToolMode>(ToolMode.RECT);

  const [brushColor, setBrushColor] = useState('rgba(235,60,54,255)');
  const [brushThickness, setBrushThickness] = useState(0);

  const [isUploading, setIsUploading] = useState(false);
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [transcodeModalVisible, setTranscodeModalVisible] = useState(false);

  const [popoverOpen, setPopoverOpen] = useState<'album' | 'upload' | undefined>(undefined);

  const albumIconRef = useRef<null | HTMLDivElement>(null);
  const uploadIconRef = useRef<null | HTMLDivElement>(null);

  //   const [tastId, setTaskId] = useState('');
  const [uploadPercent, setUploadProgress] = useState(0);
  const [transCodingPercent, setTranscodingPercent] = useState(0);

  // const whiteBoard = BoardClient.currentWhiteboard;
  const { curBoard: whiteBoard } = useContext(BoardContext);

  const handleBoardPagePreview = () => {
    dispatch(setBoardPagePreviewOpen(!boardPagePreviewOpen));
  };

  const handleToolChange = (tool: ToolType) => {
    if (tool !== curTool) {
      BoardClient.setEditType(tool as ToolMode);
      setCurTool(tool);
      if (
        [ToolMode.CIRCLE, ToolMode.LINE, ToolMode.RECT, ToolMode.ARROW].includes(tool as ToolMode)
      ) {
        setCurToolShape(tool as ToolMode);
      }
    } else {
      BoardClient.setEditType(ToolMode.POINTER);
      setCurTool(undefined);
      setCurToolShape(ToolMode.POINTER);
    }
  };

  const handleUploadAlbum = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      Message.error('图片大小超过100MB限制');
      setPopoverOpen(undefined);

      return false;
    }
    if (isUploading) {
      setPopoverOpen(undefined);

      Message.info('有任务在上传中');
      return false;
    }

    // 上传tos拿到url
    setIsUploading(true);
    setUploadModalVisible(true);

    try {
      const url = await uploadFile({
        key: encodeURIComponent(file.name),
        file,
        onProgress: (uploadPercent: number) => {
          setUploadProgress(uploadPercent);
        },
      });
      setIsUploading(false);
      setUploadModalVisible(false);

      if (!url) {
        return;
      }
      // 对文件和图片分别处理
      const format = file.name.split('.').pop();
      if (['jpg', 'jpeg', 'png', 'bmp'].includes(format || '')) {
        BoardClient.addImgToBoard(url);
      }
    } catch (err) {
      console.error(err);
      Message.error('上传失败');
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      setPopoverOpen(undefined);
    }
    return false;
  };

  const handleUpload = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      Message.error('文件大小超过100MB限制');
      setPopoverOpen(undefined);

      return false;
    }
    if (isUploading) {
      setPopoverOpen(undefined);

      Message.info('有任务在上传中');
      return false;
    }
    // 上传tos拿到url
    setIsUploading(true);
    setUploadModalVisible(true);
    try {
      const url = await uploadFile({
        key: encodeURIComponent(file.name),
        file,
        onProgress: (uploadPercent: number) => {
          setUploadProgress(uploadPercent);
        },
      });
      setIsUploading(false);
      setUploadModalVisible(false);

      if (!url) {
        return;
      }
      // 对文件和图片分别处理
      const format = file.name.split('.').pop();

      // 将文件转码成图片后展示
      if (isTranscoding) {
        Message.warning('存在转码任务进行中');
        return false;
      }
      setIsTranscoding(true);
      setTranscodeModalVisible(true);
      const appid = BoardClient.config?.appId;
      if (!appid) return;
      const transcodeRes = await BoardClient.room
        ?.createTranscodeTask({
          transcode_mode: TranscodeMode.static,
          app_id: appid,
          resource: url,
          operator: BoardClient.config!.user_id!,
          transcode_config: {
            input_format: InputFormat[format as keyof typeof InputFormat],
            output_format: OutputFormat.png,
            output_width: screen.width,
            output_height: screen.height,
            thumbnail: false,
          },
          storage_config: {
            type: StorageType.Tos,
            tos_config: {
              account_id: tosConfig.accountId,
              bucket: tosConfig.bucket,
            },
          },
          onProgress: (transcodePercent: number, transcodeStatus: TaskStatus, taskId: string) => {
            setTranscodingPercent(transcodePercent);
          },
        })
        .catch((err: Error) => {
          console.error(err);
          Message.error(`转码失败`);
        });
      setIsTranscoding(false);
      setTranscodingPercent(0);
      setTranscodeModalVisible(false);
      if (transcodeRes) {
        const { images } = transcodeRes;
        const pics: string[] = images
          .sort((a: any, b: any) => a.page_id - b.page_id)
          .map((i: any) => i.img);

        const pageConfig = pics.map((item, index) => {
          return {
            pageId: `${file.name}-${index}-${Date.now()}`,
            bkInfo: {
              bkImage: item,
              bkImageFillType: BkFillType.kCenter,
            },
          };
        });

        const id = Date.now();

        BoardClient.room?.createWhiteBoard({
          boardId: id % 10000000,
          pages: pageConfig,
          boardName: (file.name.split('.')[0] || '').slice(0, 9),
        });
      }
    } catch (err) {
      console.error(err);
      Message.error('上传失败');
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      setPopoverOpen(undefined);
    }
    return false;
  };

  const getShapeIcon = (curTool?: ToolMode) => {
    if (curTool === ToolMode.CIRCLE) {
      return ShapeCircle;
    }

    if (curTool === ToolMode.LINE) {
      return ShapeLine;
    }

    if (curTool === ToolMode.ARROW) {
      return ShapeArrow;
    }
    return ShapeRect;
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (albumIconRef.current?.contains(e.target as unknown as HTMLElement)) {
        return;
      }

      if (uploadIconRef.current?.contains(e.target as unknown as HTMLElement)) {
        return;
      }

      const findUploadNode = (e.target as unknown as HTMLElement)?.querySelector('.ant-upload');

      if (Boolean(findUploadNode)) {
        return;
      }

      setPopoverOpen(undefined);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={styles.boardToolBar}>
      <div className={styles.boardToolBarSection}>
        <Tooltip title="选择/移动" placement="right">
          <IconBtn
            icon={PointerSvg}
            className={classNames(curTool === ToolMode.POINTER && styles.activeIcon)}
            onClick={() => handleToolChange(ToolMode.POINTER)}
          />
        </Tooltip>

        <Popconfirm
          icon={null}
          overlayClassName={styles.toolPopconfirm}
          title={
            <PopModal
              setBrushColor={setBrushColor}
              brushColor={brushColor}
              setBrushThickness={setBrushThickness}
              brushThickness={brushThickness}
              whiteBoard={whiteBoard!}
              kind={PopType.pencilBrush}
              mode={curTool as ToolMode}
              onToolChange={handleToolChange}
            />
          }
          placement="right"
        >
          <Tooltip title="画笔" placement="right">
            <IconBtn
              icon={PenSvg}
              className={classNames(curTool === ToolMode.PENCIL_BRUSH && styles.activeIcon)}
              onClick={() => handleToolChange(ToolMode.PENCIL_BRUSH)}
            />
          </Tooltip>
        </Popconfirm>

        <Tooltip title="激光笔" placement="right">
          <IconBtn
            icon={LaserPenSvg}
            className={classNames(curTool === ToolMode.LASER && styles.activeIcon)}
            onClick={() => handleToolChange(ToolMode.LASER)}
          />
        </Tooltip>

        <Tooltip title="文字" placement="right">
          <Popconfirm
            icon={null}
            overlayClassName={styles.toolPopconfirm}
            title={
              <PopModal
                setBrushColor={setBrushColor}
                brushColor={brushColor}
                setBrushThickness={setBrushThickness}
                brushThickness={brushThickness}
                whiteBoard={whiteBoard!}
                kind={PopType.textbox}
                mode={curTool as ToolMode}
                onToolChange={handleToolChange}
              />
            }
            placement="right"
          >
            <IconBtn
              icon={TextSvg}
              onClick={() => {
                handleToolChange(ToolMode.TEXT);
              }}
              className={classNames(curTool === ToolMode.TEXT && styles.activeIcon)}
              key="textbox"
            />
          </Popconfirm>
        </Tooltip>

        <Tooltip title="形状" placement="right">
          <Popconfirm
            icon={null}
            overlayClassName={classNames(styles.toolPopconfirm, styles.shapeToolPopconfirm)}
            title={
              <PopModal
                setBrushColor={setBrushColor}
                brushColor={brushColor}
                setBrushThickness={setBrushThickness}
                brushThickness={brushThickness}
                whiteBoard={whiteBoard!}
                kind={PopType.shape}
                mode={curToolShape as ToolMode}
                onToolChange={handleToolChange}
              />
            }
            placement="right"
          >
            <IconBtn
              icon={getShapeIcon(curToolShape)}
              onClick={() => {
                if (
                  [ToolMode.CIRCLE, ToolMode.LINE, ToolMode.RECT, ToolMode.ARROW].includes(
                    curTool as ToolMode
                  )
                ) {
                  return;
                }
                handleToolChange(curToolShape);
              }}
              className={classNames(
                [ToolMode.CIRCLE, ToolMode.LINE, ToolMode.RECT, ToolMode.ARROW].includes(
                  curTool as ToolMode
                ) && styles.activeIcon,
                styles.shapeIcon
              )}
            />
          </Popconfirm>
        </Tooltip>

        <Tooltip title="橡皮擦" placement="right">
          <IconBtn
            icon={EraserSvg}
            className={classNames(curTool === ToolMode.ERASER && styles.activeIcon)}
            onClick={() => handleToolChange(ToolMode.ERASER)}
          />
        </Tooltip>

        <Tooltip title="背景" placement="right">
          <Popconfirm
            icon={null}
            overlayClassName={styles.toolPopconfirm}
            title={
              <PopModal
                setBrushColor={setBrushColor}
                brushColor={brushColor}
                setBrushThickness={setBrushThickness}
                brushThickness={brushThickness}
                whiteBoard={whiteBoard!}
                kind={PopType.background}
                mode={curTool as ToolMode}
                onToolChange={handleToolChange}
              />
            }
            placement="right"
          >
            <IconBtn
              icon={BackgroundSvg}
              className={classNames(curTool === 'background' && styles.activeIcon)}
              onClick={() => {
                setCurTool('background');
              }}
            />
          </Popconfirm>
        </Tooltip>

        <Tooltip title="撤销" placement="right">
          <IconBtn
            icon={UndoSvg}
            className={classNames(disabledUndo && styles.disabledIcon)}
            onClick={() => {
              setCurTool(ControlType.UNDO);
              whiteBoard?.undo();
            }}
          />
        </Tooltip>

        <Tooltip title="恢复" placement="right">
          <IconBtn
            icon={RedoSvg}
            className={classNames(disabledRedo && styles.disabledIcon)}
            onClick={() => {
              setCurTool(ControlType.REDO);
              whiteBoard?.redo();
            }}
          />
        </Tooltip>

        <Tooltip title="图片" placement="right">
          <Popover
            open={popoverOpen === 'album'}
            content={
              <div className={styles['upload-selection']}>
                <Upload
                  beforeUpload={handleUploadAlbum}
                  showUploadList={false}
                  accept=".jpg,.jpeg,.png,.bmp"
                >
                  <div className={styles['upload-item']}>
                    <div className={styles['upload-type']}>上传图片</div>
                    <div className={styles['upload-format']}>支持 JPG、JPEG、PNG、BMP 格式</div>
                  </div>
                </Upload>
              </div>
            }
            trigger="click"
            placement="right"
          >
            <IconBtn
              ref={albumIconRef}
              icon={AlbumSvg}
              className={classNames(curTool === 'album' && styles.activeIcon)}
              onClick={() => {
                setPopoverOpen('album');
                if (curTool !== 'album') {
                  setCurTool('album');
                }
              }}
            />
          </Popover>
        </Tooltip>

        <Tooltip title="清空画板" placement="right">
          <IconBtn
            icon={DeleteSvg}
            onClick={() => {
              setCurTool(ControlType.CLEAR);
              whiteBoard?.clearPage();
            }}
          />
        </Tooltip>

        <Tooltip title="文件" placement="right">
          <Popover
            open={popoverOpen === 'upload'}
            content={
              <div className={styles['upload-selection']}>
                <Upload
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept=".ppt,.pptx,.doc,.docx,.pdf"
                >
                  <div className={styles['upload-item']}>
                    <div className={styles['upload-type']}>上传静态文件</div>
                    <div className={styles['upload-format']}>
                      支持 PPT、PPTX、DOC、DOCX、PDF 格式
                    </div>
                  </div>
                </Upload>
              </div>
            }
            trigger="click"
            placement="right"
          >
            <IconBtn
              ref={uploadIconRef}
              icon={UploadSvg}
              className={classNames(curTool === 'upload' && styles.activeIcon)}
              onClick={() => {
                setPopoverOpen('upload');

                if (curTool !== 'upload') {
                  setCurTool('upload');
                }
              }}
            />
          </Popover>
        </Tooltip>
      </div>

      <div className={classNames(styles.boardToolBarSection, styles.toolbarBottom)}>
        <IconBtn icon={SidebarFoldSvg} onClick={handleBoardPagePreview} />
      </div>

      <Modal
        title="上传中"
        open={uploadModalVisible}
        footer={null}
        onCancel={() => setUploadModalVisible(false)}
      >
        {isUploading && <Spin />}
        <Progress percent={uploadPercent} showInfo={false} />
      </Modal>
      <Modal
        title="转码中"
        open={transcodeModalVisible}
        footer={null}
        onCancel={() => setTranscodeModalVisible(false)}
      >
        {isTranscoding && <Spin />}
        <Progress percent={transCodingPercent} showInfo={false} />
      </Modal>
    </div>
  );
}

export default ToolBar;
