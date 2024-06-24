import Board, {
  WhiteBoardRoomEventsTypes,
  IWhiteBoardRoom,
  IWhiteBoard,
  IWhiteBoardRoomEvents,
  WebPageInfo,
  Env,
  ToolMode,
  CreateWhiteBoardInfo,
  BkFillType,
} from '@volcengine/white-board-manage';

declare module '@volcengine/white-board-manage' {
  export interface IWhiteBoard {
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    setBoardSize(p: { width: number; height: number }): void;
  }
}

const defaultBoardConfig: CreateWhiteBoardInfo = {
  boardId: 1,
  pages: [
    {
      pageId: 'wb_default',
      extra: '',
    },
  ],
  bkInfo: {
    bkColor: 'rgba(255,255,255,1)',
    bkImage: '',
    bkImageFillType: BkFillType.kCenter,
  },
};

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

export interface BoardRoomEventHandler {
  // onLoginResult: IWhiteBoardRoomEvents[''];
  // onVRTCError: IWhiteBoardRoomEvents['onVRTCError'];
  onError: IWhiteBoardRoomEvents[WhiteBoardRoomEventsTypes.onError];
  // onJoinRoomResult: IWhiteBoardRoomEvents['onJoinRoomResult'];
  onCurrentWhiteBoardChanged: IWhiteBoardRoomEvents[WhiteBoardRoomEventsTypes.onCurrentWhiteBoardChanged];
  onCreateWhiteBoard: IWhiteBoardRoomEvents[WhiteBoardRoomEventsTypes.onCreateWhiteBoard];
  onRemoveWhiteBoard: IWhiteBoardRoomEvents[WhiteBoardRoomEventsTypes.onRemoveWhiteBoard];
}

export class BoardClient {
  config: Partial<BoardRoomConfig>;

  room: IWhiteBoardRoom | undefined;

  currentWhiteboard: IWhiteBoard | undefined;

  // 工具
  editType: ToolMode | undefined;

  // 是否可以编辑
  writeable?: boolean;

  // 白板尺寸
  boardSize?: { width: number; height: number };

  // 光标同步
  cursorSync?: boolean;

  private listening: boolean;

  private _roomEventHandlers?: BoardRoomEventHandler;

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

  joinRoom = async (
    boardViewId: string,
    handlers: BoardRoomEventHandler,
    size: {
      width: number;
      height: number;
    }
  ) => {
    this.config.boardViewId = boardViewId;
    Board.init({
      appId: this.config.appId!,
      domId: boardViewId,
      boardSize: size,
    });
    this.room = await Board.joinRoom({
      roomId: this.config.room_id!,
      userId: this.config.user_id!,
      token: this.config.token!,
      defaultBoardInfo: defaultBoardConfig,
    });
    this.addRoomEventListener(handlers);
  };

  leaveRoom = (): void => {
    if (this.room) {
      this.room.leaveRoom();
    }
    this.removeEventListener();
    this.room = undefined;
    this.currentWhiteboard = undefined;
    this.listening = false;
  };

  /**
   * 白板房间事件监听
   * @param handlers
   */
  addRoomEventListener = (handlers: BoardRoomEventHandler): void => {
    if (this.listening) {
      return;
    }
    if (!this.room) {
      return;
    }

    this.listening = true;
    this._roomEventHandlers = {
      ...handlers,
      onCurrentWhiteBoardChanged: (e) => {
        this.currentWhiteboard = e.whiteBoard;
        this.setWriteable();
        this.setEditType();
        this.changeBoardSize();
        this.enableCursorSync();
        handlers.onCurrentWhiteBoardChanged(e);
      },
    };

    // this.room?.on(WhiteBoardRoomEventsTypes.onLoginResult, handlers.onLoginResult);
    // this.room?.on(WhiteBoardRoomEventsTypes.onVRTCError, handlers.onVRTCError);
    this.room.on(
      WhiteBoardRoomEventsTypes.onError,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onError]!
    );
    this.room.on(
      WhiteBoardRoomEventsTypes.onCurrentWhiteBoardChanged,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onCurrentWhiteBoardChanged]!
    );
    this.room.on(
      WhiteBoardRoomEventsTypes.onRemoveWhiteBoard,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onRemoveWhiteBoard]!
    );
    this.room.on(
      WhiteBoardRoomEventsTypes.onCreateWhiteBoard,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onCreateWhiteBoard]!
    );
  };

  removeEventListener = (): void => {
    this.listening = false;
    if (!this.room || !this._roomEventHandlers) {
      return;
    }

    this.room.off(
      WhiteBoardRoomEventsTypes.onError,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onError]!
    );
    this.room.off(
      WhiteBoardRoomEventsTypes.onCurrentWhiteBoardChanged,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onCurrentWhiteBoardChanged]!
    );
    this.room.off(
      WhiteBoardRoomEventsTypes.onRemoveWhiteBoard,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onRemoveWhiteBoard]!
    );
    this.room?.off(
      WhiteBoardRoomEventsTypes.onCreateWhiteBoard,
      this._roomEventHandlers[WhiteBoardRoomEventsTypes.onCreateWhiteBoard]!
    );
  };

  /**
   * 创建白板页
   * @param insertPageId
   * @param pageConfig
   * @param options
   */
  createPage = (
    pageConfig: Partial<WebPageInfo>,
    options?: {
      autoFlip: boolean;
    }
  ): void => {
    this.currentWhiteboard?.createPages([pageConfig], {
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
    this.currentWhiteboard?.addImage(url, {});
  };

  /**
   * 删除某页白板
   * @param pageId
   */
  deletePage = (pageId: string): void => {
    this.currentWhiteboard?.removePages([pageId]);
  };

  /**
   * 页面跳转
   * @param pageIndex
   */
  flipPage = (pageIndex: number): void => {
    // const activeBoard = this.room?.getCurrentWhiteBoard();
    this.currentWhiteboard?.flipPage(pageIndex);
  };

  setEditType = (tool?: ToolMode) => {
    this.editType = tool !== undefined ? tool : this.editType;
    // const activeBoard = this.room?.getActiveWhiteBoard();
    if (this.editType !== undefined) {
      this.currentWhiteboard?.setEditType(this.editType);
    }
  };

  setWriteable = (writeable?: boolean) => {
    this.writeable = writeable !== undefined ? writeable : this.writeable;
    if (this.writeable !== undefined) {
      this.currentWhiteboard?.setWritable(this.writeable);
    }
  };

  changeBoardSize = (size?: { width: number; height: number }) => {
    this.boardSize = size !== undefined ? size : this.boardSize;
    if (this.boardSize !== undefined) {
      this.currentWhiteboard?.setBoardSize(this.boardSize);
    }
  };

  enableCursorSync = (enable?: boolean) => {
    this.cursorSync = enable !== undefined ? enable : this.cursorSync;
    if (this.cursorSync !== undefined) {
      this.currentWhiteboard?.enableCursorSync(this.cursorSync);
    }
  };
}

const client = new BoardClient();
export default client;

if (__DEV__) {
  window.__edu_board_client__ = client;
}
