//
//  EduBCRoomWhiteBoardView.m
//
#import "EduBCRoomWhiteBoardView.h"
#import "EduBCMoreSettingPlanViewContainer.h"
#import "DeviceInforTool.h"

#define textFontSizeMin 400
#define textFontSizeMiddle 700
#define textFontSizeMax 1000
#define ShapeSizeMin 100
#define ShapeSizeMiddle 120
#define ShapeSizeMax 140
#define PenSizeMin 50
#define PenSizeMiddle 80
#define PenSizeMax 100
#define iconSize 42

@interface EduBCRoomWhiteBoardView() <EduBCMoreSettingPlanViewContainerDelegate>

@property (nonatomic, strong) EduBCWBToolView *toolView;

@property (nonatomic, assign) NSInteger timing;
@property (nonatomic, strong) ByteWhiteBoard *board;
@property (nonatomic, assign) BOOL isFirstJoinRoom;
@property (nonatomic, strong) EduBCWhiteBoardViewModel *viewModel;

@end

@implementation EduBCRoomWhiteBoardView

- (instancetype)initWithViewModel:(EduBCWhiteBoardViewModel *)viewModel {
    self = [super init];
    if (self) {
        _isFirstJoinRoom = YES;
        self.viewModel = viewModel;
        [self createUIComponents];
        @weakify(self);
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, linkMicStatus) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            LinkMicMode mode = [change[NSKeyValueChangeNewKey] integerValue];
            if (mode == LinkMicModeNone) {
                [self setEnableEdit:NO];
            }
//            else if (mode == LinkMicModeLinking) {
//            } else if (mode == LinkMicModeDone) {
//                [self setEnableEdit:YES];
//            }
        }];
        
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, hasSharePermission) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            BOOL hasSharePermission = [change[NSKeyValueChangeNewKey] integerValue];

            [self setEnableEdit:hasSharePermission];

            NSLog(@"Big class hasSharePermission changed = %d",hasSharePermission);
        }];

        self.backgroundColor = [ThemeManager contentBackgroundColor];
    }
    return self;
}

- (UIView *)boardView {
    if (!_boardView) {
        _boardView = [[UIView alloc] init];
        _boardView.backgroundColor = [UIColor whiteColor];
    }
    return _boardView;
}

- (EduBCTopInfoView *)topInfoView {
    if (!_topInfoView) {
        _topInfoView = [[EduBCTopInfoView alloc] initWithModel:self.viewModel.roomModel];
        WeakSelf
        [_topInfoView setAddPageBlock:^(void) {
            [wself.board getCurrentPageIndex:^(NSInteger index) {
                
                ByteWhiteBoardPageInfo *pageInfo = [[ByteWhiteBoardPageInfo alloc] init];
                pageInfo.pageID = [NSString stringWithFormat:@"page_%ld",index + 1];
                pageInfo.bkInfo = [[ByteWhiteBoardBackgroundInfo alloc] init];
                            
                [wself.board createPages:@[pageInfo] index:index isAutoFlip:YES];
            }];
        }];
        
        [_topInfoView setLeftFillBlock:^(void) {
            [wself.board flipPrevPage];
        }];
        
        [_topInfoView setRightFillBlock:^(void) {
            [wself.board flipNextPage];
        }];
        
    }
    return _topInfoView;
}

- (EduBCWBToolView *)toolView {
    if (!_toolView) {
        _toolView = [[EduBCWBToolView alloc] initWithWhiteBoard:self.board delegate:self];
    }
    return _toolView;
}

#pragma mark - Private Action

- (void)setHidden:(BOOL)hidden {
    [super setHidden:NO];
}

- (void)setEnableEdit:(BOOL)enableEdit {
    _enableEdit = enableEdit;
    
    [self.board setWritable:enableEdit];
    self.topInfoView.enableEdit = enableEdit;
    
    if (enableEdit) {
        [self addSubview:self.toolView];
        self.toolView.hidden = NO;
        [self.toolView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.top.bottom.equalTo(self);
            make.right.equalTo(self).offset(-64);
        }];
    } else {
        self.toolView.hidden = YES;
        [self.toolView removeFromSuperview];
    }
}

- (void)createUIComponents {
    self.backgroundColor = [UIColor whiteColor];
    [self addSubview:self.boardView];
    [self addSubview:self.toolView];
    self.toolView.hidden = YES;
//    self.scaleButton.hidden = YES;    
    [self.toolView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.bottom.equalTo(self);
        make.right.equalTo(self).offset(-64);
    }];
    
    [self.boardView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.equalTo(self.mas_centerX);
        make.top.mas_equalTo(60);
        make.bottom.equalTo(self.mas_bottom).offset(-60);
        make.width.equalTo(self.boardView.mas_height).multipliedBy(4.0/3.0);
    }];
    
}

#pragma mark - Delegate
- (void)onWhiteBoardRoom:(ByteWhiteBoardRoom *)room started:(ByteWhiteBoard *)board {
    self.board = board;
    self.toolView.board = board;
    
    BOOL enableEdit = self.viewModel.localVideoSession.hasSharePermission || self.viewModel.localVideoSession.isHost ? YES : NO;
    self.enableEdit = enableEdit;
    
    if (self.board && self.isFirstJoinRoom) {
        [self.board setEditType:ByteWhiteBoardShapeTypeSelect];
        self.isFirstJoinRoom = NO;
    }
    
    [self onWhiteBoardPageIndexChange];
    
    self.topInfoView.boardRoom = room;
    [self.topInfoView reloadBoardList];
}

- (void)onWhiteBoardStoped:(ByteWhiteBoard *)board {
    
}

- (void)onWhiteBoardError:(NSInteger)code {
    
}

- (void)onWhiteBoardPageIndexChange {
    WeakSelf
    
    __block NSInteger currentIndex = 0;
    __block NSInteger totalCount = 1;

    [self.board getPagesCount:^(NSInteger pageCount) {
        totalCount = pageCount;
        [wself updatePageIndex:currentIndex :totalCount];
    }];
    
    [self.board getCurrentPageIndex:^(NSInteger pageIndex) {
        currentIndex = pageIndex;
        [wself updatePageIndex:currentIndex :totalCount];
    }];
}

- (void)updatePageIndex:(NSInteger)currentIndex :(NSInteger)totalCount {
    [self.topInfoView onWhiteBoardPageIndexChange:currentIndex + 1 total:totalCount];
}

- (void)dataUpdated:(NSDictionary *)dict {
    WBDrawType type = [dict[@"type"] intValue];
    switch (type) {
        case WBDrawTypeTxt: {
            [self.board setEditType:ByteWhiteBoardShapeTypeText];
            NSString * color = dict[@"color"];
            [self.board setTextColor:[UIColor colorFromRGBHexString:color]];
            NSInteger width = [dict[@"width"] intValue] ;
            width = width == 1 ? textFontSizeMin : width == 2 ? textFontSizeMiddle : textFontSizeMax;
            [self.board setTextFontSize:width];
        }
            break;
        case WBDrawTypePen: {
            [self.board setEditType:ByteWhiteBoardShapeTypePen];
            NSString * color = dict[@"color"];
            [self.board setPenColor:[UIColor colorFromRGBHexString:color]];
            NSInteger width = [dict[@"width"] intValue];
            width = width == 1 ? PenSizeMin : width == 2 ? PenSizeMiddle : PenSizeMax;
            [self.board setPenSize:width];
        }
            break;
        case WBDrawTypeShape: {
            WBDrawShapeType shapeType = [dict[@"shape"] intValue];
            ByteWhiteBoardShapeType type;
            switch (shapeType) {
                case WBDrawShapeTypeLine:
                    type = ByteWhiteBoardShapeTypeLine;
                    break;
                case WBDrawShapeTypeCircle:
                    type = ByteWhiteBoardShapeTypeCircle;
                    break;
                case WBDrawShapeTypeShapeRectangle:
                    type = ByteWhiteBoardShapeTypeRect;
                    break;
                case WBDrawShapeTypeArrow:
                    type = ByteWhiteBoardShapeTypeArrow;
                    break;
                default:
                    break;
            }
            [self.board setEditType:type];
            self.toolView.shapeType = type;
            NSString * colorString = dict[@"color"];
            UIColor *color = [UIColor colorFromRGBHexString:colorString];
            [self.board setShapeColor:color];

            NSInteger width = [dict[@"width"] intValue];
            width = width == 1 ? ShapeSizeMin : width == 2 ? ShapeSizeMiddle : ShapeSizeMax;
            [self.board setShapeSize:width];
        }
            break;
        default:
            break;
    }
}


@end

