package com.volcengine.vertcdemo.ui.widget;

import android.content.Context;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.ss.video.byteboard.constant.WhiteBoardDefine;
import com.volcengine.vertcdemo.meeting.R;

public class WBToolBar extends LinearLayout {

    private ImageView mEditTypeSelectIv;
    private ImageView mEditTypePenIv;
    private ImageView mEditTypeTextIv;
    private ImageView mEditTypeShapeIv;
    private ImageView mEditTypeEraseIv;
    private ImageView mEditTypeUndoIv;
    private ImageView mEditTypeRedoIv;
    private ImageView mEditClearIv;
    private ImageView mEditDividerIV;
    private ImageView mEditCollapseTv;

    private boolean isCollapsed = false;

    public WBToolBar(@NonNull Context context) {
        super(context);
        init(context);
    }

    public WBToolBar(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public WBToolBar(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public WBToolBar(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context);
    }

    private void init(@NonNull Context context) {
        inflate(context, R.layout.wb_board_toolbar, this);

        mEditTypeSelectIv = findViewById(R.id.wb_ic_edit_type_select);
        mEditTypePenIv = findViewById(R.id.wb_ic_edit_type_pen);
        mEditTypeTextIv = findViewById(R.id.wb_ic_edit_type_text);
        mEditTypeShapeIv = findViewById(R.id.wb_ic_edit_type_shape);
        mEditTypeEraseIv = findViewById(R.id.wb_ic_edit_type_erase);
        mEditTypeUndoIv = findViewById(R.id.wb_ic_edit_type_undo);
        mEditTypeRedoIv = findViewById(R.id.wb_ic_edit_type_redo);
        mEditClearIv = findViewById(R.id.wb_ic_edit_clear);
        mEditDividerIV = findViewById(R.id.wb_ic_edit_divider);
        mEditCollapseTv = findViewById(R.id.wb_ic_edit_collapse);

        mEditTypeSelectIv.setOnClickListener(v -> clickSelect());
        mEditTypePenIv.setOnClickListener(v -> clickPen());
        mEditTypeTextIv.setOnClickListener(v -> clickText());
        mEditTypeShapeIv.setOnClickListener(v -> clickShape());
        mEditTypeEraseIv.setOnClickListener(v -> clickErase());
        mEditTypeUndoIv.setOnClickListener(v -> clickUndo());
        mEditTypeRedoIv.setOnClickListener(v -> clickRedo());
        mEditClearIv.setOnClickListener(v -> clickClear());
        mEditCollapseTv.setOnClickListener(v -> clickCollapse());
    }

    public void setEditType(WhiteBoardDefine.EditType type) {
        mEditTypeSelectIv.setSelected(WhiteBoardDefine.EditType.SELECT.equals(type));
        mEditTypePenIv.setSelected(WhiteBoardDefine.EditType.PEN.equals(type));
        mEditTypeTextIv.setSelected(WhiteBoardDefine.EditType.TEXT.equals(type));
        mEditTypeShapeIv.setSelected(isShapeType(type));
        mEditTypeEraseIv.setSelected(WhiteBoardDefine.EditType.ERASER.equals(type));
    }

    private WhiteBoardDefine.EditType mShapeType = WhiteBoardDefine.EditType.SHAPE_RECT;

    public void setShareType(WhiteBoardDefine.EditType type) {
        mShapeType = type;
    }

    public static boolean isShapeType(WhiteBoardDefine.EditType type) {
        return WhiteBoardDefine.EditType.SHAPE_RECT.equals(type)
                || WhiteBoardDefine.EditType.SHAPE_CIRCLE.equals(type)
                || WhiteBoardDefine.EditType.SHAPE_LINE.equals(type)
                || WhiteBoardDefine.EditType.SHAPE_ARROW.equals(type);
    }

    private void changeEditType(WhiteBoardDefine.EditType type) {
        setEditType(type);
        if (eventListener != null) {
            eventListener.onEditTypeSelect(type);
        }
    }

    private void clickSelect() {
        changeEditType(WhiteBoardDefine.EditType.SELECT);
    }

    private void clickPen() {
        changeEditType(WhiteBoardDefine.EditType.PEN);
    }

    private void clickErase() {
        changeEditType(WhiteBoardDefine.EditType.ERASER);
    }

    private void clickText() {
        changeEditType(WhiteBoardDefine.EditType.TEXT);
    }

    private void clickShape() {
        changeEditType(mShapeType);
    }

    private void clickUndo() {
        if (eventListener != null) {
            eventListener.onDoOperate(Operate.UNDO);
        }
    }

    private void clickRedo() {
        if (eventListener != null) {
            eventListener.onDoOperate(Operate.REDO);
        }
    }

    private void clickClear() {
        if (eventListener != null) {
            eventListener.onDoOperate(Operate.CLEAR);
        }
    }

    private void clickCollapse() {
        isCollapsed = !isCollapsed;
        mEditCollapseTv.setSelected(isCollapsed);
        if (isCollapsed) {
            mEditTypeSelectIv.setVisibility(View.GONE);
            mEditTypePenIv.setVisibility(View.GONE);
            mEditTypeTextIv.setVisibility(View.GONE);
            mEditTypeShapeIv.setVisibility(View.GONE);
            mEditTypeEraseIv.setVisibility(View.GONE);
            mEditTypeUndoIv.setVisibility(View.GONE);
            mEditTypeRedoIv.setVisibility(View.GONE);
            mEditClearIv.setVisibility(View.GONE);
            mEditDividerIV.setVisibility(View.GONE);
        } else {
            mEditTypeSelectIv.setVisibility(View.VISIBLE);
            mEditTypePenIv.setVisibility(View.VISIBLE);
            mEditTypeTextIv.setVisibility(View.VISIBLE);
            mEditTypeShapeIv.setVisibility(View.VISIBLE);
            mEditTypeEraseIv.setVisibility(View.VISIBLE);
            mEditTypeUndoIv.setVisibility(View.VISIBLE);
            mEditTypeRedoIv.setVisibility(View.VISIBLE);
            mEditClearIv.setVisibility(View.VISIBLE);
            mEditDividerIV.setVisibility(View.VISIBLE);
        }
    }

    private OnToolBarEventListener eventListener;

    public void setEventListener(OnToolBarEventListener eventListener) {
        this.eventListener = eventListener;
    }

    public void setRedoEnable(boolean isCanRedo) {
        mEditTypeRedoIv.post(() -> {
            mEditTypeRedoIv.setEnabled(isCanRedo);
        });
    }

    public void setUndoEnable(boolean isCanUndo) {
        mEditTypeUndoIv.post(() -> {
            mEditTypeUndoIv.setEnabled(isCanUndo);
        });
    }

    public interface OnToolBarEventListener {
        void onDoOperate(Operate operate);

        void onEditTypeSelect(WhiteBoardDefine.EditType editType);
    }

    public enum Operate {
        CLEAR, UNDO, REDO,
    }
}
