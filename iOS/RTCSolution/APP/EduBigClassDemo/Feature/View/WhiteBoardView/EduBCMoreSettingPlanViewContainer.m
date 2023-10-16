//
//  EduBCMoreSettingPlanViewContainer.m
//  EduBigClassDemo
//
//  Created by ByteDance on 2022/11/2.
//
#import "BaseButton.h"
#import "EduBCMoreSettingPlanViewContainer.h"
#import <Masonry.h>

#define WB_SLIDER_SMALL_SIZE 8.0
#define WB_SLIDER_BIG_SIZE 16.0
#define WB_SLIDER_BOARDER_SIZE 3.0
#define WB_SLIDER_LINE_SIZE 2.0
#define WB_PEN_MAX_SIZE 4.0
#define WB_PEN_MIN_SIZE 1.0

@interface EduBCWBColorButton : UIButton
@property (nonatomic) BOOL wbColorSelected;
@property (nonatomic, strong) UIImageView *selectedImgView;
@property (nonatomic, copy) WBButtonActionBlock actionBlock;
- (void)addActionBlock:(WBButtonActionBlock)block forControlEvents:(UIControlEvents)controlEvents;
@end

@interface EduBCWBSilder : UIView
@property (nonatomic) CGFloat progress;
@property (nonatomic, strong) UIView *selector;
@property (nonatomic, copy) WBSliderBlock actionBlock;
@end

@interface BCMoreSettingPlanView()
@property (nonatomic, assign) WBDrawType drawType;
@property (nonatomic, strong) NSString * selectedColor;
@property (nonatomic, assign) double selectedWidth;
@property (nonatomic, assign) WBDrawShapeType selectShape;

@property (nonatomic, strong) NSMutableArray *colorBtnArray;
@property (nonatomic, strong) EduBCWBSilder * widthSlider;
@property (nonatomic, strong) UIView * shapeBar;

@property (nonatomic, strong) UIView * backgroundFileInput;

@property (nonatomic, strong) UILabel * wlable;
@property (nonatomic, strong) UILabel * clable;

@property (nonatomic, strong) NSString * shapeColor;
@property (nonatomic, strong) NSString * bkColor;

- (void)willhidden;

@end

@interface BCMoreSettingPlanView ()
@property (nonatomic, strong) NSString * selectedBackgroundImage;
@property (nonatomic, assign) WBBackgroundFillType backgroundFillType;
@property (nonatomic, assign) BOOL isSoloPage;

@property (nonatomic, strong) NSMutableArray<UIButton *> *btnArray;
@end

static inline NSArray<NSString*> * SelectColorItemsHex() {
    return @[
        @"#000000",
        @"#505050",
        @"#D8D8D8",
        @"#E8E8E8",
        @"#F04142",
        @"#EB28BD",
        
        @"#8F2BFF",
        @"#1A74FF",
        @"#00ABAB",
        @"#70B500",
        @"#FFBA12",
        @"#FF7528"
        ];
}


@implementation BCMoreSettingPlanView
- (instancetype)initWithDelegate:(id<EduBCMoreSettingPlanViewContainerDelegate>)delegate type:(WBDrawType)type{
    self = [super init];
    if (self) {
        self.drawType = type;
        self.selectShape = 2;
        self.selectedWidth = 2;
        self.delegate = delegate;
        self.selectedColor = @"#F04142";
        self.bkColor= @"none";
        self.shapeColor = self.selectedColor;
        self.selectedBackgroundImage = @"";
        self.backgroundFillType = WBBackgroundFillTypeFill;
        self.isSoloPage = YES;
        self.colorBtnArray = [NSMutableArray new];
        [self _createUIComponents];
        self.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.9];
        self.layer.borderWidth = 1;
        self.layer.borderColor = [[UIColor colorFromRGBHexString:@"#E2E2E2"] CGColor];
        self.layer.cornerRadius = 5.f;
    }
    return self;
}

- (void)dealloc {
}

- (void)setDefualtSetting:(NSDictionary*)dict {
    if (dict[@"type"]) {
        self.drawType = [dict[@"type"] intValue];
    }
    if (dict[@"shape"]) {
        self.selectShape = [dict[@"shape"] intValue];
    }
    if (dict[@"width"]) {
        self.selectedWidth = [dict[@"width"] intValue];
    }
    if (dict[@"color"]) {
        self.selectedColor = dict[@"color"];
    }
    [self updateUI];
}

- (NSDictionary*)requestSetting {
    return @{@"type" : @(self.drawType) , @"shape":@(self.selectShape),@"width":@(self.selectedWidth),@"color":self.selectedColor,@"file":self.selectedBackgroundImage,@"bkMode":@(self.backgroundFillType),@"bkSolo":@(self.isSoloPage)};
}

- (void)willhidden {
        if (self.drawType == WBDrawTypeBackground) {
//            self.bkColor = self.selectedColor;
            self.bkColor= @"none";
        } else{
            self.shapeColor = self.selectedColor;
        }
}

- (void)updateUI {
    self.widthSlider.hidden = YES;
    [self updateDrawUI];
}

- (void)updateDrawUI {
    int y = 0;
    if (self.drawType == WBDrawTypeShape) {
        y = self.shapeBar.frame.size.height;
        self.shapeBar.hidden = NO;
    }
    else {
        self.shapeBar.hidden = YES;
    }
    self.widthSlider.hidden = NO;
    switch (self.drawType) {
        case WBDrawTypePen:
            self.wlable.text = @"画笔粗细";
            self.clable.text = @"画笔颜色";
            break;
        case WBDrawTypeTxt:
            self.wlable.text = @"字体大小";
            self.clable.text = @"字体颜色";
            break;
        case WBDrawTypeShape:
            self.wlable.text = @"线条粗细";
            self.clable.text = @"线条粗细";
            break;
        default:
            break;
    }
    self.selectedColor = self.shapeColor;
}


- (void)_createUIComponents {
    NSString * title = self.drawType == WBDrawTypeTxt ? @"字体大小" : self.drawType == WBDrawTypePen ? @"画笔粗细" : @"线条粗细";
    UILabel *titleLabel = [UILabel new];
    titleLabel.text = title;
    titleLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
    titleLabel.textColor = [ThemeManager destructFgColor];
    titleLabel.textAlignment = NSTextAlignmentLeft;
    [self addSubview:titleLabel];
    
    self.widthSlider = [EduBCWBSilder new];
    WeakSelf
    [self.widthSlider setActionBlock:^(CGFloat progress) {
        wself.selectedWidth = (int)(progress*(WB_PEN_MAX_SIZE - WB_PEN_MIN_SIZE) + WB_PEN_MIN_SIZE);
        [wself.delegate dataUpdated:[wself requestSetting]];
    }];
    [self addSubview:self.widthSlider];
    
    UILabel *sLabel = [UILabel new];
    sLabel.text = @"小";
    sLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
    sLabel.textColor = [ThemeManager buttonDescLabelTextColor];
    sLabel.textAlignment = NSTextAlignmentLeft;
    [self addSubview:sLabel];
    
    UILabel *mLabel = [UILabel new];
    mLabel.text = @"中";
    mLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
    mLabel.textColor = [ThemeManager buttonDescLabelTextColor];
    mLabel.textAlignment = NSTextAlignmentCenter;
    [self addSubview:mLabel];
    
    UILabel *bLabel = [UILabel new];
    bLabel.text = @"大";
    bLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
    bLabel.textColor = [ThemeManager buttonDescLabelTextColor];
    bLabel.textAlignment = NSTextAlignmentRight;
    [self addSubview:bLabel];
    
    title = self.drawType == WBDrawTypeTxt ? @"字体颜色" : self.drawType == WBDrawTypePen ? @"画笔颜色" : @"线条颜色";
    UILabel *colorLabel = [UILabel new];
    colorLabel.text = title;
    colorLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
    colorLabel.textColor = [ThemeManager destructFgColor];
    colorLabel.textAlignment = NSTextAlignmentLeft;
    [self addSubview:colorLabel];
    
    [self updateUI];
    
    UIStackView *stack1 = [UIStackView new];
    stack1.axis = UILayoutConstraintAxisHorizontal;
    stack1.alignment = UIStackViewAlignmentCenter;
    stack1.distribution = UIStackViewDistributionEqualSpacing;
    [stack1 setUserInteractionEnabled:YES];
    [stack1 setSemanticContentAttribute:UISemanticContentAttributeForceLeftToRight];
    [self addSubview:stack1];
    
    UIStackView *stack2 = [UIStackView new];
    stack2.axis = UILayoutConstraintAxisHorizontal;
    stack2.alignment = UIStackViewAlignmentCenter;
    stack2.distribution = UIStackViewDistributionEqualSpacing;
    [stack2 setUserInteractionEnabled:YES];
    [stack2 setSemanticContentAttribute:UISemanticContentAttributeForceLeftToRight];
    [self addSubview:stack2];

    NSInteger index = 0;
    for (NSString * colorHex in SelectColorItemsHex()) {
        EduBCWBColorButton * button = [EduBCWBColorButton buttonWithType:UIButtonTypeCustom];
        button.backgroundColor = [UIColor colorFromRGBHexString:colorHex];
        [self.colorBtnArray addObject:button];
        [button addActionBlock:^(UIButton *btn) {
            wself.selectedColor = colorHex;
            [wself.delegate dataUpdated:[wself requestSetting]];
            for (int i = 0; i < wself.colorBtnArray.count; i++) {
                EduBCWBColorButton *tmpBtn = wself.colorBtnArray[i];
                if (tmpBtn != btn && [tmpBtn isKindOfClass:[EduBCWBColorButton class]]) {
                    tmpBtn.wbColorSelected = NO;
                }
            }
        } forControlEvents:UIControlEventTouchUpInside];
        button.accessibilityIdentifier = [NSString stringWithFormat:@"wb_toolplan_color_%@",colorHex];
        if (index++ % 2) {
            [stack1 addArrangedSubview:button];
        } else {
            [stack2 addArrangedSubview:button];
        }
    }
    
    if (self.drawType == WBDrawTypeShape) {
        UIStackView *stack3 = [UIStackView new];
        stack3.axis = UILayoutConstraintAxisHorizontal;
        stack3.alignment = UIStackViewAlignmentCenter;
        stack3.distribution = UIStackViewDistributionEqualSpacing;
        [stack3 setUserInteractionEnabled:YES];
        [stack3 setSemanticContentAttribute:UISemanticContentAttributeForceLeftToRight];
        [self addSubview:stack3];
        UILabel *label = [UILabel new];
        label.text = @"形状类型";
        label.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
        label.textColor = [ThemeManager destructFgColor];
        label.textAlignment = NSTextAlignmentLeft;
        [self addSubview:label];
        
        self.btnArray = [NSMutableArray arrayWithCapacity:8];
        for (int i = 1; i < 5; ++i) {
            UIButton *button = [[UIButton alloc] init];
            [button setImage:[ThemeManager imageNamed:[self buttonNormalImageName:i]]  forState:UIControlStateNormal];
            [button setImage:[ThemeManager imageNamed:[self buttonSelectedImageName:i]]  forState:UIControlStateSelected];
            button.imageView.contentMode = UIViewContentModeScaleAspectFit;
            button.layer.masksToBounds = YES;
            [button addTarget:self action:@selector(_clickShapeSelectBtn:) forControlEvents:UIControlEventTouchUpInside];
            [stack3 addArrangedSubview:button];
            [self.btnArray addObject:button];
        }
        self.btnArray[0].selected = YES;
        [label mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self).mas_offset(15);
            make.right.left.equalTo(self).mas_offset(5);
            make.height.mas_equalTo(FIGMA_SCALE(28));
        }];
        [stack3 mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(label).mas_offset(20);
            make.left.equalTo(self).mas_offset(5);
            make.right.equalTo(self).mas_offset(-48);
            make.height.mas_equalTo(FIGMA_SCALE(64));
        }];
        [titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(stack3).mas_offset(40);
            make.right.left.equalTo(self).mas_offset(5);
            make.height.mas_equalTo(FIGMA_SCALE(28));
        }];
    } else {
        [titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self).mas_offset(15);
            make.right.left.equalTo(self).mas_offset(5);
            make.height.mas_equalTo(FIGMA_SCALE(28));
        }];
    }
    
    
    [self.widthSlider mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self).mas_offset(5);
        make.right.equalTo(self).mas_offset(-5);
        make.top.mas_equalTo(titleLabel.mas_bottom).offset(5);
        make.height.mas_equalTo(WB_SLIDER_BIG_SIZE + 6);
    }];
    
    [sLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self).mas_offset(5);
        make.right.equalTo(self).mas_offset(-5);
        make.height.mas_equalTo(FIGMA_SCALE(28));
        make.top.mas_equalTo(self.widthSlider.mas_bottom).offset(5);
    }];
    
    [mLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self).mas_offset(5);
        make.right.equalTo(self).mas_offset(-5);
        make.height.mas_equalTo(FIGMA_SCALE(28));
        make.top.mas_equalTo(self.widthSlider.mas_bottom).offset(5);
    }];
    
    [bLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self).mas_offset(5);
        make.right.equalTo(self).mas_offset(-5);
        make.height.mas_equalTo(FIGMA_SCALE(28));
        make.top.mas_equalTo(self.widthSlider.mas_bottom).offset(5);
    }];
    
    [colorLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(bLabel.mas_bottom).mas_offset(50);
        make.right.left.equalTo(self).mas_offset(5);
        make.height.mas_equalTo(FIGMA_SCALE(28));
        make.bottom.mas_equalTo(stack1.mas_top).mas_offset(-10);
    }];
    
    [stack2 mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self).mas_offset(15);
        make.right.equalTo(self).mas_offset(-15);
        make.bottom.equalTo(self).mas_offset(-5);
        make.height.mas_equalTo(FIGMA_SCALE(50));
    }];
    
    [stack1 mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self).mas_offset(15);
        make.right.equalTo(self).mas_offset(-15);
        make.bottom.equalTo(stack2.mas_top).mas_offset(-5);
        make.height.mas_equalTo(FIGMA_SCALE(50));
    }];
}

- (NSString *)buttonNormalImageName:(int)index{
    switch (index) {
        case 1:
            return @"meeting_shape_rectangle_disable";
            break;
        case 2:
            return @"meeting_shape_circle_disable";
            break;
        case 3:
            return @"meeting_shape_line_disable";
            break;
        case 4:
            return @"meeting_shape_arrow_disable";
            break;
        default:
            break;
    }
    return @"";
}

- (NSString *)buttonSelectedImageName:(int)index{
    switch (index) {
        case 1:
            return @"meeting_shape_rectangle_enable";
            break;
        case 2:
            return @"meeting_shape_circle_enable";
            break;
        case 3:
            return @"meeting_shape_line_enable";
            break;
        case 4:
            return @"meeting_shape_arrow_enable";
            break;
        default:
            break;
    }
    return nil;
}

-(void)_clickShapeSelectBtn:(id)sender {
    [self cancelShapeSelectBtn];
    if (sender == self.btnArray[0]) {
        self.btnArray[0].selected = YES;
        self.selectShape = WBDrawShapeTypeShapeRectangle;
    } else if (sender == self.btnArray[1]){
        self.btnArray[1].selected = YES;
        self.selectShape = WBDrawShapeTypeCircle;
    } else if (sender == self.btnArray[2]){
        self.btnArray[2].selected = YES;
        self.selectShape = WBDrawShapeTypeLine;
    } else {
        self.btnArray[3].selected = YES;
        self.selectShape = WBDrawShapeTypeArrow;
    }
    [self.delegate dataUpdated:[self requestSetting]];
}
-(void)cancelShapeSelectBtn {
    for (int i = 0; i < self.btnArray.count; ++i) {
        self.btnArray[i].selected = NO;
    }
}
@end

@implementation EduBCWBColorButton

- (UIImageView *)selectedImgView {
    if (_selectedImgView == nil) {
        _selectedImgView = [[UIImageView alloc] initWithImage:[ThemeManager imageNamed:@"meeting_room_wb_color_selected"]];
        [self addSubview:_selectedImgView];
        [_selectedImgView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(self);
            make.size.mas_equalTo(CGSizeMake(self.width / 2, self.height / 2));
        }];
        _selectedImgView.hidden = YES;
        self.layer.borderWidth = 1;
        self.layer.borderColor = [UIColor whiteColor].CGColor;
        self.layer.cornerRadius = 2;
        self.layer.masksToBounds = YES;
    }
    return _selectedImgView;
}

- (void)setWbColorSelected:(BOOL)wbColorSelected {
    if (wbColorSelected != _wbColorSelected) {
        _wbColorSelected = wbColorSelected;
        self.selectedImgView.hidden = !wbColorSelected;
        self.layer.borderWidth = _wbColorSelected ? 1 : 0;
    }
}

- (void)addActionBlock:(WBButtonActionBlock)block forControlEvents:(UIControlEvents)controlEvents {
    self.actionBlock = block;
    [self addTarget:self
             action:@selector(_blockButtonClicked:)
   forControlEvents:controlEvents];
}

- (void)_blockButtonClicked:(id)sender {
    if (self.actionBlock) {
        self.wbColorSelected = YES;
        self.actionBlock(sender);
    }
}
@end

@implementation EduBCWBSilder
- (instancetype)init {
    self = [super init];
    if (self) {
        self.userInteractionEnabled = YES;
        UIColor *blueColor = [UIColor colorFromRGBHexString:@"#4080FF"];
        UIView *sView = [UIView new];
        sView.backgroundColor = [UIColor whiteColor];
        sView.layer.borderColor = blueColor.CGColor;
        sView.layer.borderWidth = WB_SLIDER_BOARDER_SIZE;
        sView.layer.cornerRadius = WB_SLIDER_SMALL_SIZE / 2.0;
        sView.layer.masksToBounds = YES;
        
        UIView *bView = [UIView new];
        bView.backgroundColor = [UIColor whiteColor];
        bView.layer.borderColor = blueColor.CGColor;
        bView.layer.borderWidth = WB_SLIDER_BOARDER_SIZE;
        bView.layer.cornerRadius = WB_SLIDER_BIG_SIZE / 2.0;
        bView.layer.masksToBounds = YES;
        
        self.selector = [UIView new];
        self.selector.backgroundColor = [UIColor whiteColor];
        self.selector.layer.borderColor = blueColor.CGColor;
        self.selector.layer.borderWidth = WB_SLIDER_BOARDER_SIZE;
        self.selector.layer.cornerRadius = WB_SLIDER_SMALL_SIZE / 4.0;
        self.selector.layer.masksToBounds = YES;
        
        UIView *lView = [UIView new];
        lView.backgroundColor = blueColor;
        
        [self addSubview:lView];
        [self addSubview:sView];
        [self addSubview:bView];
        [self addSubview:self.selector];
        
        [lView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.right.equalTo(self);
            make.centerY.equalTo(self);
            make.height.mas_equalTo(WB_SLIDER_LINE_SIZE);
        }];
        
        [sView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.centerY.equalTo(self);
            make.height.width.mas_equalTo(WB_SLIDER_SMALL_SIZE);
        }];
        
        [bView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.right.centerY.equalTo(self);
            make.height.width.mas_equalTo(WB_SLIDER_BIG_SIZE);
        }];
        
        [self.selector mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerX.centerY.equalTo(self);
            make.height.width.mas_equalTo(WB_SLIDER_BIG_SIZE / 2.0);
        }];
    }
    return self;
}

- (void)setProgress:(CGFloat)progress {
    _progress = progress;
    CGFloat sSize = WB_SLIDER_SMALL_SIZE + (WB_SLIDER_BIG_SIZE - WB_SLIDER_SMALL_SIZE) * _progress;
    self.selector.layer.cornerRadius = sSize / 2.0;
    [self.selector mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(_progress * (self.width - WB_SLIDER_BIG_SIZE));
        make.centerY.mas_equalTo(self);
        make.width.height.mas_equalTo(sSize);
    }];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    CGPoint pt = [touches.anyObject locationInView:self];
    CGFloat progress = pt.x / self.width;
    if (progress > 1) {
        progress = 1.0;
    } else if (progress < 0) {
        progress = 0.0;
    }
    self.progress = progress;
    NSLog(@"---->>%f", self.progress);
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    if (self.actionBlock) {
        self.actionBlock(self.progress);
    }
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    if (self.actionBlock) {
        self.actionBlock(self.progress);
    }
}

@end

@interface EduBCWBToolView ()
@property(strong, nonatomic) NSMutableArray<UIButton *> *buttons;
@property(strong, nonatomic) NSMutableArray<BCMoreSettingPlanView *> *settingViews;
@property(strong, nonatomic) UIStackView *stackView;

@property(assign, nonatomic) BOOL isHiddenButton;
@end

@implementation EduBCWBToolView : UIView

- (instancetype)initWithWhiteBoard:(ByteWhiteBoard *)wb delegate:(id<EduBCMoreSettingPlanViewContainerDelegate>)delegate {
    self = [super init];
    if (self) {
        self.isHiddenButton = NO;
        self.board = wb;
        self.delegate = delegate;
        self.userInteractionEnabled = YES;
        self.shapeType = ByteWhiteBoardShapeTypeRect;
        
        self.stackView = [UIStackView new];
        self.stackView.axis = UILayoutConstraintAxisHorizontal;
        self.stackView.alignment = UIStackViewAlignmentCenter;
        self.stackView.distribution = UIStackViewDistributionFillEqually;
        [self.stackView setUserInteractionEnabled:YES];
        [self.stackView setSemanticContentAttribute:UISemanticContentAttributeForceLeftToRight];
        self.stackView.backgroundColor = [ThemeManager buttonBackgroundColor];
        self.stackView.layer.cornerRadius = 15.0;
        self.stackView.clipsToBounds = YES;
        self.stackView.layer.masksToBounds = YES;
        [self addSubview:self.stackView];
        [self.stackView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self).mas_offset(16);
            make.right.mas_equalTo(self).mas_offset(-16);
            make.height.mas_equalTo(40);
            make.bottom.mas_equalTo(self.mas_bottom).mas_offset(-10);
        }];
        
        self.buttons = [NSMutableArray arrayWithCapacity:8];
        for (int i = 0; i < 9; ++i) {
            UIButton *button = [[UIButton alloc] init];
            [button setImage:[ThemeManager imageNamed:[self buttonNormalImageName:i]]  forState:UIControlStateNormal];
            [button setImage:[ThemeManager imageNamed:[self buttonSelectedImageName:i]]  forState:UIControlStateSelected];
            
            button.imageView.contentMode = UIViewContentModeScaleAspectFit;
            button.layer.masksToBounds = YES;
            [button addTarget:self action:@selector(_clickToolBarBtn:) forControlEvents:UIControlEventTouchUpInside];
            [self.buttons addObject:button];
            [self.stackView addArrangedSubview:button];
        }
    
        self.settingViews = [NSMutableArray arrayWithCapacity:8];
        for (int i = 1; i < 4; ++i) {
            BCMoreSettingPlanView *settingView;
            if (i == 1) {
                settingView = [[BCMoreSettingPlanView alloc] initWithDelegate:self.delegate type:WBDrawTypePen];
                settingView.delegate = self.delegate;
                NSDictionary *dic = @{@"type" : @(WBDrawTypePen) };
                [settingView setDefualtSetting:dic];
            } else if (i == 2) {
                settingView = [[BCMoreSettingPlanView alloc] initWithDelegate:self.delegate type:WBDrawTypeTxt];
                settingView.delegate = self.delegate;
                NSDictionary *dic = @{@"type" : @(WBDrawTypeTxt) };
                [settingView setDefualtSetting:dic];
            } else if (i == 3) {
                settingView = [[BCMoreSettingPlanView alloc] initWithDelegate:self.delegate type:WBDrawTypeShape];
                settingView.delegate = self.delegate;
                NSDictionary *dic = @{@"type" : @(WBDrawTypeShape) };
                [settingView setDefualtSetting:dic];
            }
            settingView.hidden = YES;
            settingView.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.9];
            [self.settingViews addObject:settingView];
            [self.superview addSubview:settingView];
            
            [self setBtnSelected:1];
        }
    }
    return self;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    for (UIView *view in self.settingViews) {
        if (!view.hidden && CGRectContainsPoint(view.frame, point)) {
            return [view hitTest:[self convertPoint:point toView:view] withEvent:event];
        }
    }
    
    [self hiddenSettingView];
    if (CGRectContainsPoint(self.stackView.frame, point)) {
        UIView *tmp = [self.stackView hitTest:[self convertPoint:point toView:self.stackView] withEvent:event];
        return tmp;
    }
    
    return nil;
}

- (NSString *)buttonNormalImageName:(int)index{
    switch (index) {
        case 0:
            return @"meeting_room_vector_disable";
            break;
        case 1:
            return @"meeting_room_pen_disable";
            break;
        case 2:
            return @"meeting_room_txt_disable";
            break;
        case 3:
            return @"meeting_room_rectangle_disable";
            break;
        case 4:
            return @"meeting_room_earse_disable";
            break;
        case 5:
            return @"meeting_room_undo_enable";
            break;
        case 6:
            return @"meeting_room_redo_enable";
            break;
        case 7:
            return @"meeting_room_clear_enable";
            break;
        case 8:
            return @"meeting_room_more_disable";
            break;
        default:
            break;
    }
    return @"";
}

- (NSString *)buttonSelectedImageName:(int)index{
    switch (index) {
        case 0:
            return @"meeting_room_vector_enable";
            break;
        case 1:
            return @"meeting_room_pen_enable";
            break;
        case 2:
            return @"meeting_room_txt_enable";
            break;
        case 3:
            return @"meeting_room_rectangle_enable";
            break;
        case 4:
            return @"meeting_room_earse_enable";
            break;
        case 8:
            return @"meeting_room_more_enable";
            break;
        default:
            break;
    }
    return nil;
}

- (void)setIsHiddenButton:(BOOL)isHiddenButton {
    if (_isHiddenButton == isHiddenButton) {
        return;
    }
    
    _isHiddenButton = isHiddenButton;
    if (_isHiddenButton) {
        self.stackView.backgroundColor = [UIColor clearColor];
    } else {
        self.stackView.backgroundColor = [ThemeManager buttonBackgroundColor];
    }
    for (int i = 0; i < self.buttons.count - 1; i++) {
        self.buttons[i].hidden = _isHiddenButton;
    }
    
    if (_isHiddenButton) {
        [self.stackView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.right.mas_equalTo(self).mas_offset(-16);
            make.height.width.mas_equalTo(40);
            make.bottom.mas_equalTo(self.mas_bottom).mas_offset(-10);
        }];
    } else {
        [self.stackView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self).mas_offset(16);
            make.right.mas_equalTo(self).mas_offset(-16);
            make.height.mas_equalTo(40);
            make.bottom.mas_equalTo(self.mas_bottom).mas_offset(-10);
        }];
    }
}

- (void)setBtnSelected:(NSInteger)index {
    for (int i = 0; i < self.buttons.count; ++i) {
        self.buttons[i].selected = i == index;
    }
}

-(void)_clickToolBarBtn:(UIButton *)sender {
    if (![self.buttons containsObject:sender]) {
        return;
    }
    int index = 0;
    for (index = 0; index < self.buttons.count; ++index) {
        if (sender == self.buttons[index]) {
            break;
        }
    }
    
    switch (index) {
        case 0:
            [self setBtnSelected:0];
            [self hiddenSettingView];
            [self.board setEditType:ByteWhiteBoardShapeTypeSelect];
            break;
        case 1:
            [self setBtnSelected:1];
            [self.board setEditType:ByteWhiteBoardShapeTypePen];
            if (sender.selected) {
                [self showSettingView:0];
            }
            break;
        case 2:
            [self setBtnSelected:2];
            [self.board setEditType:ByteWhiteBoardShapeTypeText];
            if (sender.selected) {
                [self showSettingView:1];
            }
            break;
        case 3:
            [self setBtnSelected:3];
            if (sender.selected) {
                BCMoreSettingPlanView *plan = [self.settingViews lastObject];
                [plan.delegate dataUpdated:[plan requestSetting]];
                [self showSettingView:2];
            }
            break;
        case 4:
            [self setBtnSelected:4];
            [self hiddenSettingView];
            [self.board setEditType:ByteWhiteBoardShapeTypeErase];
            break;
        case 5:
            [self hiddenSettingView];
            [self.board undo];
            break;
        case 6:
            [self hiddenSettingView];
            [self.board redo];
            break;
        case 7:
            [self hiddenSettingView];
            [self.board clearPage];
            break;
        case 8:
            [self hiddenSettingView];
            self.isHiddenButton = !self.isHiddenButton;
            sender.selected = self.isHiddenButton;
//            if (self.isHiddenButton == YES) {
//                self.isHiddenButton = NO;
//                [self hiddenButton:self.isHiddenButton];
//            } else {
//                self.isHiddenButton = YES;
//                [self hiddenButton:self.isHiddenButton];
//            }
            //关闭这个视图
            break;
        default:
            break;
    }
}

-(void)hiddenSettingView {
    for (int i = 0; i < self.settingViews.count; ++i) {
        self.settingViews[i].hidden = YES;
    }
}

- (void)showSettingView:(NSInteger)index {
    self.settingViews[index].hidden = NO;
    [self.superview addSubview:self.settingViews[index]];
    [self.settingViews[index] mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(50 + index * 30);
        make.width.mas_equalTo(250);
        make.bottom.mas_equalTo(self.stackView.mas_top).offset(-10);
    }];
}

-(void)hiddenButton:(BOOL)hidden {
    for (UIButton *btn in self.buttons) {
        btn.hidden = hidden;
    }
    self.buttons[self.buttons.count - 1].hidden = NO;
}
@end

