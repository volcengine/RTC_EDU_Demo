package com.volcengine.vertcdemo.core;

import android.content.Context;
import android.text.TextUtils;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.ss.video.byteboard.IWhiteBoardRoomEventHandler;
import com.ss.video.byteboard.OnResult;
import com.ss.video.byteboard.WhiteBoard;
import com.ss.video.byteboard.WhiteBoardRoom;
import com.ss.video.byteboard.WhiteBoardRoomManager;
import com.ss.video.byteboard.model.page.BoardInfo;
import com.ss.video.byteboard.model.page.PPTInfo;
import com.volcengine.vertcdemo.common.IAction;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.meeting.R;

import java.util.List;

public class WhiteBoardService {

    private static final String TAG = "WhiteBoardService";

    private final Context mContext;
    public String mAppId, mRoomId, mUserId, mToken;
    private WhiteBoardRoomManager mWBRoomManager;
    private WhiteBoardRoom mWBRoom;
    private ViewGroup mWhiteBoardContainer;
    private volatile WhiteBoard mWhiteBoard;

    private final MutableLiveData<Boolean> mJoinState = new MutableLiveData<>(Boolean.FALSE);
    private final MutableLiveData<String> mCurrentBoardName = new MutableLiveData<>();

    public WhiteBoardService(Context context) {
        mContext = context;
        WhiteBoardRoomManager.setDeviceID(SolutionDataManager.ins().getDeviceId());
    }

    public void dispose() {
        leaveRoom();
    }

    public WhiteBoard getWhiteBoard() {
        return mWhiteBoard;
    }

    public void setAuthInfo(String appId, String roomId, String userId, String token) {
        mAppId = appId;
        mRoomId = roomId;
        mUserId = userId;
        mToken = token;
    }

    public MutableLiveData<Boolean> getJoinState() {
        return mJoinState;
    }

    public MutableLiveData<String> getCurrentBoardName() {
        return mCurrentBoardName;
    }

    public void setWhiteBoardContainer(@NonNull ViewGroup container) {
        mWhiteBoardContainer = container;
    }

    public void joinRoom() {
        MLog.d(TAG, "WhiteBoardService joinRoom");
        leaveRoom();
        if (mWhiteBoardContainer == null) {
            throw new IllegalStateException("mWhiteBoardContainer is null when join room");
        }
        WhiteBoardRoomManager.create(mContext, mAppId, mWhiteBoardContainer, new OnResult<WhiteBoardRoomManager>() {
            @Override
            public void onSuccess(WhiteBoardRoomManager whiteBoardRoomManager) {
                mWBRoomManager = whiteBoardRoomManager;
                mWBRoomManager.joinRoom(mRoomId, mUserId, mToken, null, mWBRoomEventHandler, new OnResult<WhiteBoardRoom>() {

                    @Override
                    public void onSuccess(WhiteBoardRoom whiteBoardRoom) {
                        mWBRoom = whiteBoardRoom;
                        MLog.d(TAG, "WhiteBoardRoomManager create success roomId:" + mWBRoom.getRoomID());
                    }

                    @Override
                    public void onError(String s) {
                        MLog.d(TAG, "WhiteBoardRoomManager create failed:" + s);
                    }
                });
            }

            @Override
            public void onError(String s) {
                MLog.d(TAG, "WhiteBoardRoomManager create failed:" + s);
            }
        });
    }

    public void leaveRoom() {
        if (mWBRoomManager == null) {
            return;
        }
        MLog.d(TAG, "WhiteBoardService leaveRoom");
        if (mWBRoom != null) {
            mWBRoom.leaveRoom();
            mWBRoomManager.destroyWhiteBoardRoom(mWBRoom);
            mWBRoom = null;
        }
        mWBRoomManager = null;
        WhiteBoardRoomManager.destroy();
    }

    private final IWhiteBoardRoomEventHandler mWBRoomEventHandler = new IWhiteBoardRoomEventHandler() {

        @Override
        public void onError(String errCode, String message) {
            MLog.e(TAG, "error: " + errCode + ",message:" + message + " in IWhiteBoardRoomEventHandler");
        }

        @Override
        public void onCreateWhiteBoard(String userId, int boardId, WhiteBoard whiteBoard, PPTInfo pptInfo) {
            MLog.d(TAG, "onCreateWhiteBoard() wbId:" + whiteBoard.getWhiteBoardId());
        }

        @Override
        public void onCurrentWhiteBoardChanged(String userId, int activeBoardId, WhiteBoard whiteBoard) {
            mWhiteBoard = whiteBoard;
            updateCurrentBoardInfo(whiteBoard.getWhiteBoardId());
            mJoinState.postValue(true);
        }

        @Override
        public void onRemoveWhiteBoard(String userId, int boardId, PPTInfo pptInfo) {

        }
    };

    private void updateCurrentBoardInfo(int boardId) {
        if (mWBRoom != null) {
            mWBRoom.getWhiteBoardInfo(boardId, new OnResult<BoardInfo>() {
                @Override
                public void onSuccess(BoardInfo boardInfo) {
                    String currentBoardName = TextUtils.isEmpty(boardInfo.getBoardName())
                            ? mContext.getString(R.string.black_whiteboard)
                            : boardInfo.getBoardName();
                    mCurrentBoardName.postValue(currentBoardName);
                }

                @Override
                public void onError(String s) {
                }
            });
        }
    }

    public void switchWhiteBoard(int boardId) {
        if (mWBRoom != null) {
            mWBRoom.switchWhiteBoard(boardId);
        }
    }

    public void getAllWhiteBoardInfo(IAction<List<BoardInfo>> action) {
        if (action == null) {
            return;
        }
        if (mWBRoom != null) {
            mWBRoom.getAllWhiteBoardInfo(new OnResult<List<BoardInfo>>() {
                @Override
                public void onSuccess(List<BoardInfo> boardInfos) {
                    if (boardInfos == null || boardInfos.size() == 0) {
                        return;
                    }
                    action.act(boardInfos);
                }

                @Override
                public void onError(String s) {
                }
            });
        }
    }

}
