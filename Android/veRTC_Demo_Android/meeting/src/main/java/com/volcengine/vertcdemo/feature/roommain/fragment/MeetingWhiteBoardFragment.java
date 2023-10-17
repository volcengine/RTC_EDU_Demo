package com.volcengine.vertcdemo.feature.roommain.fragment;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;

import com.ss.video.byteboard.IWhiteBoardEventHandler;
import com.ss.video.byteboard.OnResult;
import com.ss.video.byteboard.WhiteBoard;
import com.ss.video.byteboard.constant.WhiteBoardDefine;
import com.ss.video.byteboard.model.page.BoardInfo;
import com.ss.video.byteboard.model.page.PageInfo;
import com.ss.video.rtc.demo.basic_module.utils.Utilities;
import com.volcengine.vertcdemo.common.MLog;
import com.volcengine.vertcdemo.core.WhiteBoardService;
import com.volcengine.vertcdemo.feature.roommain.AbsMeetingFragment;
import com.volcengine.vertcdemo.framework.meeting.IUIMeetingDef;
import com.volcengine.vertcdemo.framework.meeting.internal.IMeetingRtmEventHandler;
import com.volcengine.vertcdemo.meeting.R;
import com.volcengine.vertcdemo.ui.widget.WBPagePanel;
import com.volcengine.vertcdemo.ui.widget.WBPaintPanel;
import com.volcengine.vertcdemo.ui.widget.WBToolBar;

import java.util.ArrayList;
import java.util.List;

public class MeetingWhiteBoardFragment extends AbsMeetingFragment implements WBPaintPanel.OnPanelListener, WBToolBar.OnToolBarEventListener {

    private static final String TAG = "MeetingWhiteBoardFragment";

    private final Handler mUIHandler = new Handler(Looper.getMainLooper());
    private TextView mWhiteBoardType;
    private WBPagePanel mWBPagePanel;

    private WBToolBar mWBToolBar;
    private View mWBPaintDecorator;
    private WBPaintPanel mWBPaintPanel;
    private ViewGroup whiteboardCanvasContainer;
    @Nullable
    private View mStopSharingView;

    private WhiteBoard mWhiteBoard;
    private boolean mHasSharePermit;
    private WhiteBoardDefine.EditType mEditType = WhiteBoardDefine.EditType.SELECT;
    private PopupWindow mWhiteBoardSelector;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meeting_whiteboard, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mWhiteBoardType = view.findViewById(R.id.whiteboard_type);
        mWhiteBoardType.setOnClickListener(v -> {
            WhiteBoardService whiteBoardService = getWhiteBoardService();
            if (whiteBoardService != null) {
                WhiteBoardService service = getWhiteBoardService();
                service.getAllWhiteBoardInfo(this::showWhiteBoardSelector);
            }
        });
        mWBToolBar = view.findViewById(R.id.whiteboard_toolbar);
        mWBToolBar.setEditType(mEditType);
        mWBPaintDecorator = view.findViewById(R.id.whiteboard_paint_container);
        mWBPaintDecorator.setVisibility(View.GONE);
        mWBPaintPanel = view.findViewById(R.id.whiteboard_paint_panel);
        whiteboardCanvasContainer = view.findViewById(R.id.whiteboard_canvas_container);
        mStopSharingView = view.findViewById(R.id.whiteboard_stop_share);
        mWBPagePanel = view.findViewById(R.id.whiteboard_page_panel);
        mWBPagePanel.getPagePre().setOnClickListener((v -> {
            if (mWhiteBoard != null) {
                mWhiteBoard.flipPrevPage();
            }
        }));
        mWBPagePanel.getPageNext().setOnClickListener((v -> {
            if (mWhiteBoard != null) {
                mWhiteBoard.flipNextPage();
            }
        }));
        mWBPagePanel.getPageAdd().setOnClickListener((v -> addPage()));
        mWBPagePanel.getPageAddTips().setOnClickListener((v -> addPage()));
        if (mStopSharingView != null) {
            mStopSharingView.setOnClickListener(v -> getUIRoom().stopWhiteBoardSharing());
        }
        mWBPaintDecorator.setOnClickListener(v -> mWBPaintDecorator.setVisibility(View.GONE));
        mWBPaintPanel.setOnEventListener(this);
        mWBToolBar.setEventListener(this);
        view.findViewById(R.id.wh_expand).setOnClickListener(v -> {
            MLog.d(TAG, "go to landscape");
            Activity activity = getActivity();
            if (activity != null) {
                activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            }
        });

        getDataProvider().getSharePermit().observe(getViewLifecycleOwner(), sharePermit -> {
            if (mHasSharePermit == sharePermit) {
                return;
            }
            mHasSharePermit = sharePermit;
            configOperateBars();
        });
        getWhiteBoardService().setWhiteBoardContainer(whiteboardCanvasContainer);
        IUIMeetingDef.RoomShareState shareState = getUIRoom().getDataProvider().getRoomShareState().getValue();
        if (shareState != null &&
                shareState.mShareStatus
                && shareState.mShareType == IMeetingRtmEventHandler.SHARE_WHITEBOARD) {
            getWhiteBoardService().joinRoom();
        }
        getWhiteBoardService().getCurrentBoardName().observe(getViewLifecycleOwner(), wbName -> {
            mWhiteBoardType.setText(wbName);
            mWhiteBoard = getWhiteBoardService().getWhiteBoard();
            showPageInfo();
        });
        getWhiteBoardService().getJoinState().observe(getViewLifecycleOwner(), loginSuccess -> {
            if (loginSuccess) {
                mWhiteBoard = getWhiteBoardService().getWhiteBoard();
                bindToView();
                if (mWhiteBoard != null) {
                    mWhiteBoard.setEditType(mEditType);
                }
            } else {
                mWhiteBoard = null;
                bindToView();
            }
        });
    }

    private void showWhiteBoardSelector(List<BoardInfo> boards) {
        if (mWhiteBoardSelector != null) {
            mWhiteBoardSelector.dismiss();
        }
        LinearLayout list = new LinearLayout(getActivity());
        list.setBackgroundResource(R.drawable.bg_wb_selector_pop);
        list.setOrientation(LinearLayout.VERTICAL);
        list.setMinimumHeight((int) Utilities.dip2Px(50));
        for (BoardInfo info : boards) {
            String boardName = TextUtils.isEmpty(info.getBoardName()) ? getString(R.string.black_whiteboard) : info.getBoardName();
            TextView item = new TextView(getActivity());
            item.setText(boardName);
            item.setGravity(Gravity.START);
            item.setPadding((int) Utilities.dip2Px(10)
                    , (int) Utilities.dip2Px(4)
                    , (int) Utilities.dip2Px(10)
                    , (int) Utilities.dip2Px(4));
            item.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
            item.setTextSize(14);
            item.setMaxLines(1);
            item.setEllipsize(TextUtils.TruncateAt.END);
            item.setOnClickListener(v -> {
                if (mWhiteBoardSelector != null) {
                    mWhiteBoardSelector.dismiss();
                }
                getWhiteBoardService().switchWhiteBoard(info.getBoardId());
            });
            list.addView(item, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT
                    , ViewGroup.LayoutParams.WRAP_CONTENT));
        }
        mWhiteBoardSelector = new PopupWindow(list, (int) Utilities.dip2Px(100), ViewGroup.LayoutParams.WRAP_CONTENT, true);
        mWhiteBoardSelector.showAsDropDown(mWhiteBoardType);
    }

    private void bindToView() {
        configWhiteBoard();
        configOperateBars();
    }

    private void configOperateBars() {
        mWhiteBoardType.setVisibility((mWhiteBoard == null || !mHasSharePermit) ? View.INVISIBLE : View.VISIBLE);

        if (mWhiteBoard == null || !mHasSharePermit) {
            if (mStopSharingView != null) {
                mStopSharingView.setVisibility(View.INVISIBLE);
            }
            mWBPagePanel.setVisibility(View.INVISIBLE);
            mWBToolBar.setVisibility(View.INVISIBLE);
            if (mWhiteBoard != null) {
                mWhiteBoard.setWritable(false);
            }
        } else {
            mWBToolBar.setVisibility(View.VISIBLE);
            if (mWhiteBoard != null) {
                mWhiteBoard.setWritable(true);
            }
            if ((getDataProvider().isHost()
                    || getDataProvider().isLocalSharingWhiteBoard()) && mStopSharingView != null) {
                mStopSharingView.setVisibility(View.VISIBLE);
            }
            mWBPagePanel.setVisibility(View.VISIBLE);
            showPageInfo();
        }
    }


    private void configWhiteBoard() {
        if (mWhiteBoard != null) {
            mWhiteBoard.setEventHandler(mWBEventHandler);
            mWhiteBoard.setWritable(false);
            mWhiteBoard.setEditType(mEditType);
            mWhiteBoard.setPenColor(mWBPaintPanel.getPenColor());
            mWhiteBoard.setPenSize(mWBPaintPanel.getPenWidth());
            mWhiteBoard.setTextColor(mWBPaintPanel.getTextColor());
            mWhiteBoard.setTextFontSize(mWBPaintPanel.getTextSize());
            mWhiteBoard.setShapeColor(mWBPaintPanel.getShapeColor());
            mWhiteBoard.setShapeSize(mWBPaintPanel.getShapeWidth());
        }
    }

    private void addPage() {
        if (mWhiteBoard == null) {
            return;
        }
        Log.d(TAG, "addPage()");
        mWhiteBoard.getCurrentPageIndex(new OnResult<Integer>() {
            @Override
            public void onSuccess(Integer index) {
                //TODO
                ArrayList pages = new ArrayList(1);
                PageInfo newPageInfo = PageInfo.create(String.valueOf(index + 1), null, null);
                pages.add(newPageInfo);
                mWhiteBoard.createPages(pages, index, true);
            }

            @Override
            public void onError(String s) {
                MLog.d(TAG, "addPage onError:" + s);
            }
        });
    }

    private void showPageInfo() {
        if (mWhiteBoard == null) {
            return;
        }
        mWhiteBoard.getPageCount(new OnResult<Integer>() {
            @Override
            public void onSuccess(Integer count) {
                if (count == null) return;
                mWhiteBoard.getCurrentPageIndex(new OnResult<Integer>() {
                    @Override
                    public void onSuccess(Integer index) {
                        if (index != null && mWBPagePanel != null) {
                            mWBPagePanel.getPageInfoView().setText(getResources().getString(R.string.wb_page_info, index + 1, count));
                        }
                    }

                    @Override
                    public void onError(String s) {
                        MLog.d(TAG, "showPageInfo failed:" + s);
                    }
                });
            }

            @Override
            public void onError(String s) {
                MLog.d(TAG, "showPageInfo failed:" + s);
            }
        });
    }


    // IWhiteBoardEventHandler
    private final IWhiteBoardEventHandler mWBEventHandler = new IWhiteBoardEventHandler() {

        @Override
        public void onPageIndexChanged(int currentIndex) {
            mUIHandler.post(() -> showPageInfo());
        }

        @Override
        public void onPageCountChanged(int totalCount) {
            mUIHandler.post(() -> showPageInfo());
        }

        @Override
        public void onCanRedoStateChanged(boolean isCanRedo) {
            super.onCanRedoStateChanged(isCanRedo);
            mWBToolBar.setRedoEnable(isCanRedo);
        }

        @Override
        public void onCanUndoStateChanged(boolean isCanUndo) {
            super.onCanUndoStateChanged(isCanUndo);
            mWBToolBar.setUndoEnable(isCanUndo);
        }
    };

    // OnToolBarEventListener
    @Override
    public void onDoOperate(WBToolBar.Operate operate) {
        if (mWhiteBoard == null) {
            return;
        }
        if (WBToolBar.Operate.UNDO.equals(operate)) {
            mWhiteBoard.undo();
        } else if (WBToolBar.Operate.REDO.equals(operate)) {
            mWhiteBoard.redo();
        } else if (WBToolBar.Operate.CLEAR.equals(operate)) {
            mWhiteBoard.clearPage();
        }
    }

    @Override
    public void onEditTypeSelect(WhiteBoardDefine.EditType editType) {
        if (mEditType.equals(editType)
                && (WBToolBar.isShapeType(editType)
                || mEditType.equals(WhiteBoardDefine.EditType.PEN)
                || mEditType.equals(WhiteBoardDefine.EditType.TEXT))) {
            if (mWBPaintDecorator.getVisibility() == View.VISIBLE) {
                mWBPaintDecorator.setVisibility(View.GONE);
                return;
            }
            if (mEditType.equals(WhiteBoardDefine.EditType.PEN)) {
                mWBPaintPanel.setCurrentType(WBPaintPanel.TYPE_PEN);
                mWBPaintDecorator.setVisibility(View.VISIBLE);
            } else if (mEditType.equals(WhiteBoardDefine.EditType.TEXT)) {
                mWBPaintPanel.setCurrentType(WBPaintPanel.TYPE_TEXT);
                mWBPaintDecorator.setVisibility(View.VISIBLE);
            } else if (WBToolBar.isShapeType(mEditType)) {
                mWBPaintPanel.setCurrentType(WBPaintPanel.TYPE_SHAPE);
                mWBPaintPanel.setCurrentShapeType(editType);
                mWBPaintDecorator.setVisibility(View.VISIBLE);
            }
            return;
        }

        mEditType = editType;
        mWBPaintDecorator.setVisibility(View.GONE);
        if (mWhiteBoard == null) {
            return;
        }
        mWhiteBoard.setEditType(mEditType);
    }

    // OnPanelListener
    @Override
    public void onPenSizeChanged(int size) {
        if (mWhiteBoard == null) {
            return;
        }
        Log.d(TAG, "onPenSizeChanged: " + size + ", editType: " + mEditType);
        switch (mEditType) {
            case PEN:
                mWhiteBoard.setPenSize(size);
                break;
            case TEXT: {
                mWhiteBoard.setTextFontSize(size);
                break;
            }
            default: {
                mWhiteBoard.setShapeSize(size);
                break;
            }
        }
    }

    @Override
    public void onPenColorChanged(int color) {
        if (mWhiteBoard == null) {
            return;
        }
        Log.d(TAG, "onPenColorChanged: " + color + ", editType: " + mEditType);
        switch (mEditType) {
            case PEN:
                mWhiteBoard.setPenColor(color);
                break;
            case TEXT: {
                mWhiteBoard.setTextColor(color);
                break;
            }
            default: {
                mWhiteBoard.setShapeColor(color);
                break;
            }
        }
    }

    @Override
    public void onShapeTypeChanged(WhiteBoardDefine.EditType editType) {
        Log.d(TAG, "onShapeTypeChanged: " + editType);
        mEditType = editType;
        if (mWhiteBoard == null) {
            return;
        }
        mWhiteBoard.setEditType(editType);
        //(todo):delete, wired logic.
        mWBToolBar.setShareType(editType);
    }
}
