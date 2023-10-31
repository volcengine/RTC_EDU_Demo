import Board, {
  WhiteBoardRoomEventsTypes,
  WhiteBoardRoom,
  IWhiteBoardRoomEvents,
  WebPageInfo,
  Env,
  IToolMode,
  EditMode,
} from '@volcengine/white-board-manage';
// import WhiteBoard from '@volcengine/white-board-manage/type/core/WhiteBoard';

interface BoardRoomConfig {
  boardViewId?: string;
  appId: string;
  room_id: string;
  user_id: string;
  token: string;
  options?: {
    autoFlip: boolean;
  };
}

interface BoardEventHandler {
  onLoginResult: IWhiteBoardRoomEvents['onLoginResult'];
  onVRTCError: IWhiteBoardRoomEvents['onVRTCError'];
  onError: IWhiteBoardRoomEvents['onError'];
  onJoinRoomResult: IWhiteBoardRoomEvents['onJoinRoomResult'];
  onCreateWhiteBoard: IWhiteBoardRoomEvents['onCreateWhiteBoard'];
  onCloseWhiteBoard: IWhiteBoardRoomEvents['onCloseWhiteBoard'];
  onActiveWhiteBoardChanged: IWhiteBoardRoomEvents['onActiveWhiteBoardChanged'];
}

export class BoardClient {
  config: Partial<BoardRoomConfig>;

  room: WhiteBoardRoom | undefined;

  // 工具
  editType: IToolMode | undefined;

  // 编辑模式
  editMode?: EditMode;

  // 白板尺寸
  boardSize?: { width: number; height: number };

  // 光标同步
  cursorSync?: boolean;

  private listening: boolean;

  private _roomEventHandlers?: Partial<IWhiteBoardRoomEvents>;

  constructor() {
    this.config = {};
    Board.setEnv(Env.kEnvProduct);

    this.listening = false;
  }

  setConfig = (config: Partial<BoardRoomConfig>): void => {
    this.config = {
      ...this.config,
      ...config,
    };
  };

  setAppId = (appId: string): void => {
    this.config.appId = appId;
  };

  createRoom = (
    boardViewId: string,
    handlers: BoardEventHandler,
    size: {
      width: number;
      height: number;
    }
  ) => {
    if (this.room) {
      if (!this.listening) {
        this.addRoomEventListener(handlers);
      }
      return;
    }

    this.config.boardViewId = boardViewId;

    this.room = Board.createWhiteBoardRoom(
      boardViewId,
      this.config.appId!,
      this.config.room_id!,
      this.config.user_id!,
      this.config.token!,
      size
    );

    this.addRoomEventListener(handlers);

    this.room.login();
  };

  leaveRoom = (): void => {
    try {
      if (this.room) {
        this.room?.leaveRoom();
        Board.destroyWhiteBoardRoom(this.room);
      }
    } catch (error) {}

    // todo 白板内部会调用重复销毁，待sdk更新
    // this.board.forEach((board) => {
    //   // todo fix ts types
    //   this.room?.destroyWhiteBoard(board as unknown as WhiteBoard);
    // });
    this.removeEventListener();
    this.room = undefined;
    this.listening = false;
  };

  /**
   * 白板房间事件监听
   * @param handlers
   */
  addRoomEventListener = (handlers: BoardEventHandler): void => {
    if (this.listening) {
      return;
    }
    this.listening = true;

    this._roomEventHandlers = {
      ...handlers,

      onActiveWhiteBoardChanged: (e) => {
        this.setEditMode();
        this.setEditType();
        this.changeBoardSize();
        this.enableCursorSync();
        handlers.onActiveWhiteBoardChanged(e);
      },
    };

    this.room?.on(WhiteBoardRoomEventsTypes.onLoginResult, handlers.onLoginResult);
    this.room?.on(WhiteBoardRoomEventsTypes.onVRTCError, handlers.onVRTCError);
    this.room?.on(
      WhiteBoardRoomEventsTypes.onActiveWhiteBoardChanged,
      handlers.onActiveWhiteBoardChanged
    );

    this.room?.on(WhiteBoardRoomEventsTypes.onError, handlers.onError);
    this.room?.on(WhiteBoardRoomEventsTypes.onJoinRoomResult, handlers.onJoinRoomResult);
    this.room?.on(
      WhiteBoardRoomEventsTypes.onCloseWhiteBoard,
      this._roomEventHandlers!.onCloseWhiteBoard!
    );
    this.room?.on(
      WhiteBoardRoomEventsTypes.onCreateWhiteBoard,
      this._roomEventHandlers!.onCreateWhiteBoard!
    );
  };

  removeEventListener = (): void => {
    this.listening = false;
    if (!this.room) {
      return;
    }

    this.room.off(WhiteBoardRoomEventsTypes.onLoginResult, this._roomEventHandlers?.onLoginResult);
    this.room.off(WhiteBoardRoomEventsTypes.onVRTCError, this._roomEventHandlers?.onVRTCError);
    this.room.off(WhiteBoardRoomEventsTypes.onError, this._roomEventHandlers?.onError);
    this.room.off(
      WhiteBoardRoomEventsTypes.onCloseWhiteBoard,
      this._roomEventHandlers?.onCloseWhiteBoard
    );
    this.room.off(
      WhiteBoardRoomEventsTypes.onJoinRoomResult,
      this._roomEventHandlers?.onJoinRoomResult
    );
    this.room.off(
      WhiteBoardRoomEventsTypes.onCreateWhiteBoard,
      this._roomEventHandlers?.onCreateWhiteBoard
    );
  };

  /**
   * 创建白板页
   * @param insertPageId
   * @param pageConfig
   * @param options
   */
  createPage = (
    insertPageId: string,
    pageConfig: Partial<WebPageInfo>,
    options?: {
      autoFlip: boolean;
    }
  ): void => {
    const activeBoard = this.room?.getActiveWhiteBoard();
    activeBoard?.createPage(insertPageId, pageConfig, {
      autoFlip: true,
      ...options,
    });
  };

  /**
   * 将图片添加到白板上
   * @param pageId
   * @param pageConfig
   * @param fileId
   */
  addImgToBoard = (url: string): void => {
    const activeBoard = this.room?.getActiveWhiteBoard();
    activeBoard?.addImage(url, {});
  };

  /**
   * 删除某页白板
   * @param pageId
   */
  deletePage = (pageId: string): void => {
    const activeBoard = this.room?.getActiveWhiteBoard();
    activeBoard?.removePages([pageId]);
  };

  /**
   * 页面跳转
   * @param pageId
   */
  flipPage = (pageId: string): void => {
    const activeBoard = this.room?.getActiveWhiteBoard();
    activeBoard?.flipPage(pageId);
  };

  setEditType = (tool?: IToolMode) => {
    this.editType = tool !== undefined ? tool : this.editType;
    const activeBoard = this.room?.getActiveWhiteBoard();
    if (this.editType !== undefined) {
      activeBoard?.setEditType(this.editType);
    }
  };

  setEditMode = (mode?: EditMode) => {
    this.editMode = mode !== undefined ? mode : this.editMode;
    const activeBoard = this.room?.getActiveWhiteBoard();
    if (this.editMode !== undefined) {
      activeBoard?.setEditMode(this.editMode);
    }
  };

  changeBoardSize = (size?: { width: number; height: number }) => {
    this.boardSize = size !== undefined ? size : this.boardSize;
    const activeBoard = this.room?.getActiveWhiteBoard();
    if (this.boardSize !== undefined) {
      activeBoard?.changeBoardSize(this.boardSize);
    }
  };

  enableCursorSync = (enable?: boolean) => {
    this.cursorSync = enable !== undefined ? enable : this.cursorSync;
    const activeBoard = this.room?.getActiveWhiteBoard();
    if (this.cursorSync !== undefined) {
      activeBoard?.enableCursorSync(this.cursorSync);
    }
  };
}

export default new BoardClient();
