import {
  ErrorCode,
  WhiteBoardEventsTypes,
  ImageLoadStatus,
  CreatePageProgressResult,
  FlipPageResult,
  RemovePagesResult,
  CreateWhiteBoardResult,
  SwitchBoardResult,
  RemoveWhiteBoardResult,
  type IWhiteBoard,
} from '@volcengine/white-board-manage';
import { message as Message } from 'antd';
import { useEffect, useState } from 'react';

import { BoardClient } from '@/core/board';
import { Permission } from '@/types/state';
import useUpdatePreviewBoard from '@/components/WhiteBoard/BoardPages/hooks/useUpdatePreviewBoard';
import { type BoardRoomEventHandler } from '../board/BoardClient';

const BoardUpdateTag = 'BoardUpdateTag';

const useBoardRoomEventListener = (props: {
  setCurBoard: (board: IWhiteBoard) => void;
  setCurBoardId: (board: number | string) => void;
  setClosedId: (id: number) => void;
  setCurPageId: (pageId: string) => void;
  setCurPageIndex: (pageIndex: number) => void;
  localEditPermission: Permission;
}) => {
  const {
    setCurBoard,
    setCurBoardId,
    setCurPageId,
    setCurPageIndex,
    localEditPermission,
    setClosedId,
  } = props;

  const [disabledUndo, setDisabledUndo] = useState<boolean>(true);
  const [disabledRedo, setDisabledRedo] = useState<boolean>(true);

  const updatePreviewBoard = useUpdatePreviewBoard()[1];

  const handleBoardRecordUpdated = (e: { offset: number; stackLength: number }) => {
    const { offset, stackLength } = e;
    setDisabledUndo(offset === -1);
    setDisabledRedo(offset + 1 === stackLength);
  };

  /**
   * 创建新白板页面，会自动翻页
   * @param e
   */
  const handleCreatePages = async (e: CreatePageProgressResult) => {
    console.log('WhiteBoardEventsTypes.onCreatePages,创建白板页面自动翻页', e);
    // setCurPageId(e.currentPageId);
    // setCurBoard(`${e.boardId}-${Date.now() % 10000000}`);
  };

  /**
   * 删除白板的某一页，会自动翻页，在handleFlipPage处理
   * @param event
   */
  const handleRemovePages = (event: RemovePagesResult) => {
    console.log('WhiteBoardEventsTypes.handleRemovePages', event, JSON.stringify(event));
    setClosedId(Date.now() % 10000000);
  };

  /**
   * 翻页。主动翻页后会触发此事件，不需要在click事件里处理
   * @param event
   */
  const handleFlipPage = (event: FlipPageResult) => {
    console.log('WhiteBoardEventsTypes.onFlipPage', event, JSON.stringify(event));
    setCurPageIndex(event.currentIndex);
    const page = BoardClient.currentWhiteboard?.getPageInfoByIndex(event.currentIndex);
    if (page) {
      setCurPageId(page.pageId);
    }
  };

  const handleLoadingImage = (e: { status: ImageLoadStatus; pageId: string }) => {
    if (e.status === ImageLoadStatus.error) {
      Message.error('加载图片失败！');
    }
  };
  const handleRoomError = (e: { errorCode: any }) => {
    console.log('handleRoomError', e);

    if (e.errorCode === ErrorCode.DUPLICATE_LOGIN) {
      console.error('WhiteBoardRoomEventsTypes handleVRTCError 您已被踢出房间', e);
      BoardClient.room?.leaveRoom();
    }
  };

  const handleWhiteBoardUpdate = () => setTimeout(updatePreviewBoard, 1000);

  const listenWhiteBoard = (whiteBoard: IWhiteBoard) => {
    console.log('listen whiteboard', whiteBoard);

    // whiteBoard.on(WhiteBoardEventsTypes.onInitBoard, handleInitBoard);
    whiteBoard.on(WhiteBoardEventsTypes.onRecordUpdated, handleBoardRecordUpdated);

    whiteBoard.on(WhiteBoardEventsTypes.onCreatePagesProgress, handleCreatePages);
    whiteBoard.on(WhiteBoardEventsTypes.onRemovePages, handleRemovePages);
    whiteBoard.on(WhiteBoardEventsTypes.onPageIndexChanged, handleFlipPage);
    whiteBoard.on(WhiteBoardEventsTypes.onImageLoading, handleLoadingImage);
    // whiteBoard.on(WhiteBoardEventsTypes.onLockElement, handleLockElement);
  };

  /**
   * 创建白板，会触发handleActiveWhiteBoardChanged，自动跳转到活跃白板，返回最新的活跃白板 && 活跃的白板页面
   * @param e
   */
  const handleRoomCreateWhiteBoard = (e: CreateWhiteBoardResult) => {
    const { whiteBoard } = e;
    // 上传文件  ->  onCreateWhiteBoard ->  board.onCreateWhiteBoardPages, 需要手动补齐board pages

    /** Magic: 当前白板 sdk 尚不支持白板绘制的回调，并且涉及老师&学生的 Preview Board 更新，定时触发，待修改 */
    const intervalId = localStorage.getItem(BoardUpdateTag);
    if (intervalId) clearInterval(+intervalId);
    const settleIntervalId = setInterval(handleWhiteBoardUpdate, 1000);
    localStorage.setItem(BoardUpdateTag, settleIntervalId.toString());
    /** Magic end */

    if (localEditPermission) {
      whiteBoard.setWritable(true);
      whiteBoard.enableCursorSync(true);
    }
    listenWhiteBoard(whiteBoard);
  };

  /**
   * 删除白板。会触发handleActiveWhiteBoardChanged，自动跳转到活跃白板 && 活跃的白板页面
   * @param event 当前删除的白板信息
   */
  const handleCloseWhiteBoard = (event: RemoveWhiteBoardResult) => {
    const { boardId } = event;
    setClosedId(boardId);
    // // 删除白板时，取消相关的事件
    // whiteBoard.off(WhiteBoardEventsTypes.onRecordUpdated, handleBoardRecordUpdated);
    // whiteBoard.off(WhiteBoardEventsTypes.onCreatePagesProgress, handleCreatePages);
    // whiteBoard.off(WhiteBoardEventsTypes.onRemovePages, handleRemovePages);
    // whiteBoard.off(WhiteBoardEventsTypes.onFlipPage, handleFlipPage);
    // whiteBoard.off(WhiteBoardEventsTypes.onLoadingImage, handleLoadingImage);
    // whiteBoard.off(WhiteBoardEventsTypes.onLockElement, handleLockElement);
  };

  /**
   * 切换活跃的白板
   */
  const handleActiveWhiteBoardChanged = (event: SwitchBoardResult) => {
    const { whiteBoard, boardId } = event;
    setCurBoard(whiteBoard);
    setCurBoardId(`${boardId}-${Date.now() % 10000000}`);
    setCurPageId(whiteBoard.getCurrentPageId());
    setCurPageIndex(whiteBoard.getCurrentPageIndex());
    listenWhiteBoard(whiteBoard);
  };

  useEffect(() => {
    return () => {
      const intervalId = localStorage.getItem(BoardUpdateTag);
      if (intervalId) clearInterval(+intervalId);
    };
  }, []);

  return {
    handlers: {
      // onLoginResult: handleRoomLoginResult,
      // onVRTCError: handleRoomVRTCError,
      onError: handleRoomError,
      // onJoinRoomResult: handleJoinRoomResult,
      onCreateWhiteBoard: handleRoomCreateWhiteBoard,
      onRemoveWhiteBoard: handleCloseWhiteBoard,
      onCurrentWhiteBoardChanged: handleActiveWhiteBoardChanged,
    } satisfies BoardRoomEventHandler,
    disabledUndo,
    disabledRedo,
  };
};

export default useBoardRoomEventListener;
