package com.volcengine.vertcdemo.ui.widget;

import android.content.Context;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.ss.video.byteboard.constant.WhiteBoardDefine;
import com.volcengine.vertcdemo.meeting.R;

public class WBPaintPanel extends ConstraintLayout {

    public WBPaintPanel(@NonNull Context context) {
        super(context);
        init(context);
    }

    public WBPaintPanel(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public WBPaintPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public WBPaintPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context);
    }

    private void init(@NonNull Context context) {
        inflate(context, R.layout.wb_paint_panel, this);
        initShapeArea();
        initPenSize();
        initPenColor();
    }

    private final int[] penSizes = {40, 70, 100};
    private final int[] textSizes = {300, 500, 700};
    private final int[] penColors = {0xFF000000, 0xFF505050, 0xFFD8D8D8, 0xFFFFFFFF, 0xFFF04142, 0xFFEB28BD, 0xFF8F2BFF, 0xFF1A74FF, 0xFF00ABAB, 0xFF70B500, 0xFFFFBA12, 0xFFFF7528};

    private final TextView tvPenSize[] = new TextView[penSizes.length];
    private final ImageView ivColors[] = new ImageView[penColors.length];

    private int textSizeIndex = 0;
    private int textColorIndex = 4;
    private int penWidthIndex = 1;
    private int penColorIndex = 4;
    private int shapeWidthIndex = 1;
    private int shapeColorIndex = 4;

    private TextView shareConfigTitle;
    private ImageView shareConfigRect;
    private ImageView shareConfigCircle;
    private ImageView shareConfigLine;
    private ImageView shareConfigArrow;

    public int getTextSize() {
        return textSizes[textSizeIndex];
    }

    public int getTextColor() {
        return penColors[textColorIndex];
    }

    public int getPenWidth() {
        return penSizes[penWidthIndex];
    }

    public int getPenColor() {
        return penColors[penColorIndex];
    }

    public int getShapeWidth() {
        return penSizes[shapeWidthIndex];
    }

    public int getShapeColor() {
        return penColors[shapeColorIndex];
    }

    private void initPenColor() {
        ivColors[0] = findViewById(R.id.color_000000);
        ivColors[1] = findViewById(R.id.color_505050);
        ivColors[2] = findViewById(R.id.color_D8D8D8);
        ivColors[3] = findViewById(R.id.color_FFFFFF);
        ivColors[4] = findViewById(R.id.color_F04142);
        ivColors[5] = findViewById(R.id.color_EB28BD);
        ivColors[6] = findViewById(R.id.color_8F2BFF);
        ivColors[7] = findViewById(R.id.color_1A74FF);
        ivColors[8] = findViewById(R.id.color_00ABAB);
        ivColors[9] = findViewById(R.id.color_70B500);
        ivColors[10] = findViewById(R.id.color_FFBA12);
        ivColors[11] = findViewById(R.id.color_FF7528);
        for (ImageView ivColor : ivColors) {
            ivColor.setOnClickListener(v -> {
                selectColor((ImageView) v);
            });
        }
    }

    private void selectColor(ImageView v) {
        int index = -1;
        for (int i = 0; i < ivColors.length; i++) {
            if (ivColors[i] == v) {
                v.setBackground(null);
                v.setBackgroundResource(R.drawable.wb_bg_item_pen_color_selected);
                index = i;
            } else {
                ivColors[i].setBackground(null);
                ivColors[i].setBackgroundResource(R.drawable.wb_bg_item_pen_color);
            }
        }
        if (index >= 0) {
            switch (currentType) {
                case TYPE_PEN:
                    penColorIndex = index;
                    break;
                case TYPE_SHAPE:
                    shapeColorIndex = index;
                    break;
                case TYPE_TEXT:
                    textColorIndex = index;
                    break;
            }
            onPanelListener.onPenColorChanged(penColors[index]);
        }
    }

    private void initShapeArea() {
        shareConfigTitle = findViewById(R.id.tv_shape_title);
        shareConfigRect = findViewById(R.id.iv_shape_rect);
        shareConfigRect.setOnClickListener(v -> changeShapeType(WhiteBoardDefine.EditType.SHAPE_RECT));
        shareConfigCircle = findViewById(R.id.iv_shape_circle);
        shareConfigCircle.setOnClickListener(v -> changeShapeType(WhiteBoardDefine.EditType.SHAPE_CIRCLE));
        shareConfigLine = findViewById(R.id.iv_shape_line);
        shareConfigLine.setOnClickListener(v -> changeShapeType(WhiteBoardDefine.EditType.SHAPE_LINE));
        shareConfigArrow = findViewById(R.id.iv_shape_arrow);
        shareConfigArrow.setOnClickListener(v -> changeShapeType(WhiteBoardDefine.EditType.SHAPE_ARROW));
    }

    private void initPenSize() {
        tvPenSize[0] = findViewById(R.id.tv_pen_size_little);
        tvPenSize[1] = findViewById(R.id.tv_pen_size_middle);
        tvPenSize[2] = findViewById(R.id.tv_pen_size_large);
        for (TextView tv : tvPenSize) {
            tv.setOnClickListener(v -> {
                selectPenSize((TextView) v);
            });
        }
    }

    private void selectPenSize(TextView v) {
        int index = -1;
        for (int i = 0; i < tvPenSize.length; i++) {
            if (tvPenSize[i] == v) {
                v.setBackgroundResource(R.drawable.wb_bg_item_pen_size_selected);
                index = i;
            } else {
                tvPenSize[i].setBackgroundResource(R.drawable.wb_bg_item_pen_size);
            }
        }
        if (index >= 0) {
            switch (currentType) {
                case TYPE_PEN:
                    penWidthIndex = index;
                    break;
                case TYPE_SHAPE:
                    shapeWidthIndex = index;
                    break;
                case TYPE_TEXT:
                    textSizeIndex = index;
                    break;
            }
            int[] sizes = currentType == TYPE_TEXT ? textSizes : penSizes;
            onPanelListener.onPenSizeChanged(sizes[index]);
        }
    }

    private OnPanelListener onPanelListener;

    public void setOnEventListener(OnPanelListener onPanelListener) {
        this.onPanelListener = onPanelListener;
    }

    public static final int TYPE_PEN = 0;
    public static final int TYPE_TEXT = 1;
    public static final int TYPE_SHAPE = 2;
    public int currentType = TYPE_PEN;

    public void setCurrentType(int currentType) {
        this.currentType = currentType;
        switch (currentType) {
            case TYPE_PEN:
                visibleShapeConfig(View.GONE);
                ((TextView) findViewById(R.id.tv_paint_size_title)).setText(R.string.wb_pen_size);
                ((TextView) findViewById(R.id.tv_paint_color_title)).setText(R.string.wb_pen_color);
                selectColor(ivColors[penColorIndex]);
                selectPenSize(tvPenSize[penWidthIndex]);
                break;
            case TYPE_TEXT:
                visibleShapeConfig(View.GONE);
                ((TextView) findViewById(R.id.tv_paint_size_title)).setText(R.string.wb_text_size);
                ((TextView) findViewById(R.id.tv_paint_color_title)).setText(R.string.wb_text_color);
                selectColor(ivColors[textColorIndex]);
                selectPenSize(tvPenSize[textSizeIndex]);
                break;
            case TYPE_SHAPE:
                ((TextView) findViewById(R.id.tv_paint_size_title)).setText(R.string.wb_shape_size);
                ((TextView) findViewById(R.id.tv_paint_color_title)).setText(R.string.wb_shape_color);
                selectColor(ivColors[shapeColorIndex]);
                selectPenSize(tvPenSize[shapeWidthIndex]);
                break;
        }
    }

    private void changeShapeType(WhiteBoardDefine.EditType editType) {
        onPanelListener.onShapeTypeChanged(editType);
        changeShapeTypeIcon(editType);
    }

    private void visibleShapeConfig(int visible) {
        shareConfigTitle.setVisibility(visible);
        shareConfigRect.setVisibility(visible);
        shareConfigCircle.setVisibility(visible);
        shareConfigLine.setVisibility(visible);
        shareConfigArrow.setVisibility(visible);
    }

    public void setCurrentShapeType(WhiteBoardDefine.EditType editType) {
        visibleShapeConfig(View.VISIBLE);
        changeShapeTypeIcon(editType);
    }

    private void changeShapeTypeIcon(WhiteBoardDefine.EditType editType) {
        shareConfigRect.setSelected(WhiteBoardDefine.EditType.SHAPE_RECT.equals(editType));
        shareConfigCircle.setSelected(WhiteBoardDefine.EditType.SHAPE_CIRCLE.equals(editType));
        shareConfigLine.setSelected(WhiteBoardDefine.EditType.SHAPE_LINE.equals(editType));
        shareConfigLine.setSelected(WhiteBoardDefine.EditType.SHAPE_LINE.equals(editType));
        shareConfigArrow.setSelected(WhiteBoardDefine.EditType.SHAPE_ARROW.equals(editType));
    }

    public interface OnPanelListener {

        void onPenSizeChanged(int size);

        void onPenColorChanged(int color);

        void onShapeTypeChanged(WhiteBoardDefine.EditType editType);
    }
}
