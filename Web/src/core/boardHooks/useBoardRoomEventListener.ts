import {
  ErrorCode,
  Code,
  WhiteBoardEventsTypes,
  IonInitBoard,
  ImageLoadStatus,
  EditMode,
  LockBoardElementReason,
  IWhiteBoard,
  BkFillType,
  GetBoardInfoResponse,
} from '@volcengine/white-board-manage';
import { message as Message } from 'antd';
import { useEffect, useState } from 'react';

import { BoardClient } from '@/core/board';
import { Permission } from '@/types/state';
import useUpdatePreviewBoard from '@/components/WhiteBoard/BoardPages/hooks/useUpdatePreviewBoard';

const BoardUpdateTag = "BoardUpdateTag";

const InitBoardConfig = {
  boardId: 1,
  initialPage: {
    pageId: 'wb_default',
    extra: '',
  },
  boardBkInfo: {
    bkColor: 'rgba(255,255,255,1)',
    bkImage: '',
    bkImageFillType: BkFillType.kCenter,
  },
};

const useBoardRoomEventListener = (props: {
  setCurBoard: (board: number | string) => void;
  setClosedId: (id: number) => void;
  setCurPageId: (pageId: string) => void;
  localEditPermission: Permission;
}) => {
  const { setCurBoard, setCurPageId, localEditPermission, setClosedId } = props;

  const [disabledUndo, setDisabledUndo] = useState<boolean>(true);
  const [disabledRedo, setDisabledRedo] = useState<boolean>(true);

  const updatePreviewBoard = useUpdatePreviewBoard()[1];

  const handleInitBoard = async (e: IonInitBoard) => {
    console.log('WhiteBoardEventsTypes.onInitBoard', e);
  };
  const handleBoardRecordUpdated = (e: { offset: number; stackLength: number }) => {
    const { offset, stackLength } = e;
    setDisabledUndo(offset === -1);
    setDisabledRedo(offset + 1 === stackLength);
  };

  /**
   *
   * @param e
   */
  const handleCreatePages = async (e: {
    insertPageId: string;
    currentPageId: string;
    boardId: number;
  }) => {
    console.log('WhiteBoardEventsTypes.onCreatePages,创建白板页面自动翻页', e);
    setCurPageId(e.currentPageId);
    setCurBoard(`${e.boardId}-${Date.now() % 10000000}`);
  };

  /**
   * 删除白板的某一页，会自动翻页，在handleFlipPage处理
   * @param event
   */
  const handleRemovePages = (event: { currentPageId: string }) => {
    console.log('WhiteBoardEventsTypes.handleRemovePages', event, JSON.stringify(event));
    setClosedId(Date.now() % 10000000);
  };

  /**
   * 翻页。主动翻页后会触发此事件，不需要在click事件里处理
   * @param event
   */
  const handleFlipPage = (event: { currentPageId: string }) => {
    console.log('WhiteBoardEventsTypes.onFlipPage', event, JSON.stringify(event));
    const { currentPageId } = event;

    setCurPageId(currentPageId);
  };

  const handleLoadingImage = (e: { status: ImageLoadStatus; pageId: string }) => {
    // console.log('WhiteBoardEventsTypes.onLoadingImage', e);
    if (e.status === ImageLoadStatus.error) {
      Message.error('加载图片失败！');
    }
  };
  const handleRoomLoginResult = (e: {
    room_id: string;
    user_id: string;
    code: string;
    message: string;
  }) => {
    if (e.code === Code.LOGIN_SUCCESS) {
      BoardClient.room?.joinRoom();
    }
  };
  const handleRoomVRTCError = (e: { errorCode: any }) => {
    console.log('handleRoomVRTCError', e);

    if (e.errorCode === ErrorCode.DUPLICATE_LOGIN) {
      console.error('WhiteBoardRoomEventsTypes handleVRTCError 您已被踢出房间', e);
      BoardClient.room?.leaveRoom();
    }
  };
  const handleRoomError = (e: { errorCode: any }) => {
    console.log('handleRoomError', e);

    if (e.errorCode === ErrorCode.HEART_BEAR_REQUSET_ERROR) {
      console.error('WhiteBoardRoomEventsTypes handleError 心跳请求失败', e);

      BoardClient.room?.leaveRoom();
    }
  };
  const handleJoinRoomResult = async (e: {
    room_id: string;
    user_id: string;
    error_code: string;
    is_rejoin: boolean;
    message: string;
  }) => {
    if (e.error_code !== '') {
      console.error('WhiteBoardRoomEventsTypes.handleJoinRoomResult', e);
      BoardClient.room?.leaveRoom();

      return;
    }

    const boardInfo = await BoardClient.room?.getBoardInfo();

    if (boardInfo?.boards.length === 0) {
      // 没有白板信息，创建新白板
      BoardClient.room?.createWhiteBoard(
        InitBoardConfig.boardId,
        [InitBoardConfig.initialPage],
        InitBoardConfig.boardBkInfo
      );
    }
  };

  const handleLockElement = (events: { lockObjId: string; reason: LockBoardElementReason }) => {
    console.log('whiteboard 图形锁定中:', events);
  };

  const handleWhiteBoardUpdate = () => setTimeout(updatePreviewBoard, 1000);

  /**
   * 创建白板，会触发handleActiveWhiteBoardChanged，自动跳转到活跃白板，返回最新的活跃白板 && 活跃的白板页面
   * @param e
   */
  const handleRoomCreateWhiteBoard = (e: {
    white_board: IWhiteBoard;
    boardInfo: GetBoardInfoResponse;
    elapsed: number;
  }) => {
    const { white_board: whiteBoard } = e;
    // 上传文件  ->  onCreateWhiteBoard ->  board.onCreateWhiteBoardPages, 需要手动补齐board pages

    /** Magic: 当前白板 sdk 尚不支持白板绘制的回调，并且涉及老师&学生的 Preview Board 更新，定时触发，待修改 */
    const intervalId = localStorage.getItem(BoardUpdateTag);
    if (intervalId) clearInterval(+intervalId);
    const settleIntervalId = setInterval(handleWhiteBoardUpdate, 1000);
    localStorage.setItem(BoardUpdateTag, settleIntervalId.toString());
    /** Magic end */

    if (localEditPermission) {
      whiteBoard.setEditMode(EditMode.kRead);
      whiteBoard.enableCursorSync(true);
    }

    whiteBoard.on(WhiteBoardEventsTypes.onInitBoard, handleInitBoard);
    whiteBoard.on(WhiteBoardEventsTypes.onRecordUpdated, handleBoardRecordUpdated);

    whiteBoard.on(WhiteBoardEventsTypes.onCreatePages, handleCreatePages);
    whiteBoard.on(WhiteBoardEventsTypes.onRemovePages, handleRemovePages);
    whiteBoard.on(WhiteBoardEventsTypes.onFlipPage, handleFlipPage);
    whiteBoard.on(WhiteBoardEventsTypes.onLoadingImage, handleLoadingImage);
    whiteBoard.on(WhiteBoardEventsTypes.onLockElement, handleLockElement);
  };

  /**
   * 删除白板。会触发handleActiveWhiteBoardChanged，自动跳转到活跃白板 && 活跃的白板页面
   * @param event 当前删除的白板信息
   */
  const handleCloseWhiteBoard = (event: { white_board: IWhiteBoard; boardId: number }) => {
    const { white_board: whiteBoard, boardId } = event;
    setClosedId(boardId);
    // 删除白板时，取消相关的事件
    whiteBoard.off(WhiteBoardEventsTypes.onInitBoard, handleInitBoard);
    whiteBoard.off(WhiteBoardEventsTypes.onRecordUpdated, handleBoardRecordUpdated);

    whiteBoard.off(WhiteBoardEventsTypes.onCreatePages, handleCreatePages);
    whiteBoard.off(WhiteBoardEventsTypes.onRemovePages, handleRemovePages);
    whiteBoard.off(WhiteBoardEventsTypes.onFlipPage, handleFlipPage);
    whiteBoard.off(WhiteBoardEventsTypes.onLoadingImage, handleLoadingImage);
    whiteBoard.off(WhiteBoardEventsTypes.onLockElement, handleLockElement);
  };

  /**
   * 切换活跃的白板
   */
  const handleActiveWhiteBoardChanged = (event: {
    activeBoardId: number;
    whiteBoard: IWhiteBoard;
  }) => {
    const { activeBoardId, whiteBoard } = event;
    setCurBoard(`${activeBoardId}-${Date.now() % 10000000}`);

    setCurPageId(whiteBoard.getCurrentPageId());
  };

  useEffect(() => {
    return () => {
      const intervalId = localStorage.getItem(BoardUpdateTag);
      if (intervalId) clearInterval(+intervalId);
    }
  }, []);

  return {
    handlers: {
      onLoginResult: handleRoomLoginResult,
      onVRTCError: handleRoomVRTCError,
      onError: handleRoomError,
      onJoinRoomResult: handleJoinRoomResult,
      onCreateWhiteBoard: handleRoomCreateWhiteBoard,
      onCloseWhiteBoard: handleCloseWhiteBoard,
      onActiveWhiteBoardChanged: handleActiveWhiteBoardChanged,
    },
    disabledUndo,
    disabledRedo,
  };
};

export default useBoardRoomEventListener;
