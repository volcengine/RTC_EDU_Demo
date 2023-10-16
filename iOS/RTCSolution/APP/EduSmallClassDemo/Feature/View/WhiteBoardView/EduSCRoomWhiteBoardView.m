//
//  EduSCRoomWhiteBoardView.m
//
#import "EduSCRoomWhiteBoardView.h"
#import "EduSCMoreSettingPlanViewContainer.h"

#define textFontSizeMin 400
#define textFontSizeMiddle 700
#define textFontSizeMax 1000
#define ShapeSizeMin 100
#define ShapeSizeMiddle 120
#define ShapeSizeMax 140
#define PenSizeMin 50
#define PenSizeMiddle 80
#define PenSizeMax 100

@interface EduSCRoomWhiteBoardView() <EduSCMoreSettingPlanViewContainerDelegate,UITableViewDelegate,UITableViewDataSource>

@property (nonatomic, strong) EduSCToolView *toolView;
@property (nonatomic, strong) UIButton *leftFillBotton;
@property (nonatomic, strong) UIButton *rightFillBotton;
@property (nonatomic, strong) UIButton *addPageBotton;
@property (nonatomic, strong) BaseButton *scaleBotton;
@property (nonatomic, strong) BaseButton *micButton;
@property (nonatomic, strong) UIButton *quitButton;
@property (nonatomic, strong) UILabel *pageLabel;
@property (nonatomic, strong) BaseButton *addPageButton;

@property (nonatomic, strong) ByteWhiteBoard *board;
@property (nonatomic, assign) BOOL isFirstJoinRoom;
@property (nonatomic, strong) EduSCWhiteBoardViewModel *viewModel;

@property (nonatomic, strong) UILabel *emptyLabel;
@property (nonatomic, strong) BaseButton *pullBoxButton;
@property (nonatomic, strong) UITableView *boardListView;
@property (nonatomic, strong) NSArray *boardInfoArray;
@property (nonatomic, strong) ByteWhiteBoardRoom *boardRoom;

@end

@implementation EduSCRoomWhiteBoardView

- (instancetype)initWithViewModel:(EduSCWhiteBoardViewModel *)viewModel {
    self = [super init];
    if (self) {
        [self createUIComponents];
        _isFirstJoinRoom = YES;
        self.viewModel = viewModel;
        @weakify(self);
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, isEnableAudio) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            self.micButton.status = [change[NSKeyValueChangeNewKey] boolValue] ? ButtonStatusNone : ButtonStatusActive;
        }];
        
        self.micButton.status = self.viewModel.localVideoSession.isEnableAudio ? ButtonStatusNone : ButtonStatusActive;
        
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, hasSharePermission) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            BOOL hasSharePermission = [change[NSKeyValueChangeNewKey] integerValue];

            [self setEnableEdit:hasSharePermission];

            NSLog(@"Small class hasSharePermission changed = %d",hasSharePermission);
        }];
        
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, volume) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            NSInteger volume = [change[NSKeyValueChangeNewKey] integerValue];
            
//            NSLog(@"sc volume changed = %ld",(long)volume);

            if (self.viewModel.localVideoSession.isEnableAudio) {
                if (volume) {
                    self.micButton.status = ButtonStatusIng;
                } else {
                    self.micButton.status = ButtonStatusNone;
                }
            }
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

- (EduSCToolView *)toolView {
    if (!_toolView) {
        _toolView = [[EduSCToolView alloc] initWithWhiteBoard:self.board delegate:self];
    }
    return _toolView;
}

- (UIButton *)quitButton {
    if (_quitButton == nil) {
        _quitButton = [[UIButton alloc] init];
        [_quitButton addTarget:self action:@selector(clickQuitBtn:) forControlEvents:UIControlEventTouchUpInside];
        [_quitButton setTitle:@"退出白板" forState:UIControlStateNormal];
        _quitButton.titleLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
        _quitButton.layer.cornerRadius = 2;
        _quitButton.layer.masksToBounds = YES;
        _quitButton.layer.borderColor = [ThemeManager buttonBorderColor].CGColor;
        [_quitButton setBackgroundColor:[ThemeManager buttonBackgroundColor]];
        [_quitButton setTitleColor:[ThemeManager titleLabelTextColor] forState:UIControlStateNormal];
    }
    
    return _quitButton;
}

- (UILabel *)pageLabel {
    if (_pageLabel == nil) {
        _pageLabel = [[UILabel alloc] init];
        _pageLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(26)];
        _pageLabel.textAlignment = NSTextAlignmentCenter;
        _pageLabel.textColor = [ThemeManager titleLabelTextColor];
        _pageLabel.text = @"1/1";
    }
    
    return _pageLabel;
}

- (BaseButton *)addPageButton {
    
    if (_addPageButton == nil) {
        _addPageButton = [[BaseButton alloc] init];
        [_addPageButton setTitle:@"添加画板" forState:UIControlStateNormal];
        [_addPageButton setTitleColor:[ThemeManager titleLabelTextColor] forState:UIControlStateNormal];
        
        _addPageButton.titleLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(26)];
        _addPageButton.contentEdgeInsets = UIEdgeInsetsMake(0, -10, 0, -10);
        _addPageButton.titleLabel.textAlignment = NSTextAlignmentLeft;
        [_addPageButton addTarget:self action:@selector(clickToolBarBtn:) forControlEvents:UIControlEventTouchUpInside];
    }
    
    return _addPageButton;
}

- (UIButton *)createToolButton:(NSString *)imagePath {
    UIButton *btn = [[UIButton alloc] init];
    btn.imageView.contentMode = UIViewContentModeScaleAspectFit;
    btn.layer.masksToBounds = YES;
    [btn setImage:[ThemeManager imageNamed:imagePath] forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(clickToolBarBtn:) forControlEvents:UIControlEventTouchUpInside];
    return btn;
}

- (BaseButton *)scaleBotton {
    if (!_scaleBotton) {
        _scaleBotton = [[BaseButton alloc] init];
        [_scaleBotton bingImage:[ThemeManager imageNamed:@"meeting_room_orientation"] status:ButtonStatusNone];
        [_scaleBotton bingImage:[ThemeManager imageNamed:@"meeting_room_orientation_v"] status:ButtonStatusActive];
        WeakSelf
        [_scaleBotton setBtnClickBlock:^(id  _Nonnull sender) {
            wself.scaleBtnClickedBlock(wself);
            if (wself.scaleBotton.status == ButtonStatusNone) {
                wself.scaleBotton.status = ButtonStatusActive;
            } else {
                wself.scaleBotton.status = ButtonStatusNone;
            }
        }];
    }
    return _scaleBotton;
}
- (BaseButton *)micButton {
    if (!_micButton) {
        _micButton = [[BaseButton alloc] init];
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_room_mic"] status:ButtonStatusNone];
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_room_mic_s"]  status:ButtonStatusActive];
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_landsacpe_mic"]  status:ButtonStatusIng];
        WeakSelf
        [_micButton setBtnClickBlock:^(id  _Nonnull sender) {
            [wself.viewModel turnOnMic:wself.micButton.status == ButtonStatusActive];
        }];
    }
    return _micButton;
}

#pragma mark - Private Action
- (void)setIsLandscape:(BOOL)isLandscape {
    if (isLandscape == _isLandscape) {
        return;
    }
    _isLandscape = isLandscape;
    self.micButton.hidden = !_isLandscape;
    if (!self.isLandscape && self.enableEdit) {
        self.quitButton.hidden = NO;
    }else {
        self.quitButton.hidden = YES;
    }

    if (_isLandscape) {
        [self.addPageButton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.mas_top).mas_offset(FIGMA_SCALE(40));
            make.right.equalTo(self.mas_right).offset(-20);
            make.width.mas_equalTo(64);
            make.height.mas_equalTo(FIGMA_SCALE(30));
        }];
        
        [self.addPageBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.right.mas_equalTo(self.addPageButton.mas_left).mas_offset(FIGMA_SCALE(-10));
            make.centerY.equalTo(self.addPageButton);
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(22), FIGMA_SCALE(22)));
        }];
        
        [self.rightFillBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.addPageButton);
            make.right.equalTo(self.addPageBotton.mas_left).mas_offset(FIGMA_SCALE(-60));
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(24), FIGMA_SCALE(14)));
        }];
        
        [self.leftFillBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.addPageButton);
            make.right.mas_equalTo(self.rightFillBotton.mas_left).offset(FIGMA_SCALE(-124));
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(24), FIGMA_SCALE(14)));
        }];
        
        [self.pageLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.addPageButton);
            make.left.equalTo(self.leftFillBotton.mas_right);
            make.right.equalTo(self.rightFillBotton.mas_left);
            make.height.mas_equalTo(FIGMA_SCALE(30));
        }];
        
        [self.scaleBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.leftFillBotton);
            make.left.mas_equalTo(self).offset(FIGMA_SCALE(32));
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
        }];
        
        [self.micButton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.bottom.equalTo(self).mas_offset(FIGMA_SCALE(-32));
            make.right.equalTo(self).offset(FIGMA_SCALE(-32));
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
        }];
        
        if ([self.subviews containsObject:self.toolView]) {
            [self.toolView mas_remakeConstraints:^(MASConstraintMaker *make) {
                make.top.left.bottom.equalTo(self);
                make.right.equalTo(self.micButton.mas_left).mas_offset(FIGMA_SCALE(-30));
            }];
        }
        
        [self.boardView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerX.equalTo(self.mas_centerX);
            make.top.equalTo(self.scaleBotton.mas_bottom).mas_offset(10);
            make.bottom.equalTo(self.mas_bottom).mas_offset(-60);
            make.width.equalTo(self.boardView.mas_height).multipliedBy(4.0/3.0);
        }];
        
        [self.emptyLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.equalTo(self.scaleBotton.mas_right).offset(10);
            make.centerY.equalTo(self.addPageButton);
            make.size.mas_equalTo(CGSizeMake(75, 20));
        }];
        
        [self.pullBoxButton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.equalTo(self.emptyLabel.mas_right).offset(5);
            make.centerY.equalTo(self.emptyLabel);
            make.size.mas_equalTo(CGSizeMake(18, 10));
        }];
        
        [self.boardListView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.equalTo(self.emptyLabel);
            make.top.equalTo(self.emptyLabel.mas_bottom).offset(5);
            make.right.equalTo(self.pullBoxButton);
            make.height.mas_equalTo(30);
        }];

    } else {
        if ([self.subviews containsObject:self.toolView]) {
            [self.toolView mas_remakeConstraints:^(MASConstraintMaker *make) {
                make.edges.equalTo(self);
            }];
        }
        [self.leftFillBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self).offset(FIGMA_SCALE(49));
            make.bottom.equalTo(self).mas_offset(-90);
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(24), FIGMA_SCALE(14)));
        }];
        
        [self.rightFillBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.leftFillBotton);
            make.left.equalTo(self.leftFillBotton.mas_right).mas_offset(FIGMA_SCALE(124));
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(24), FIGMA_SCALE(14)));
        }];
        
        [self.pageLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.leftFillBotton);
            make.left.equalTo(self.leftFillBotton.mas_right);
            make.right.equalTo(self.rightFillBotton.mas_left);
            make.height.mas_equalTo(FIGMA_SCALE(30));
        }];
        
        [self.addPageBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self.rightFillBotton.mas_right).mas_offset(FIGMA_SCALE(61));
            make.centerY.equalTo(self.leftFillBotton);
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(22), FIGMA_SCALE(22)));
        }];
        
        [self.addPageButton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.leftFillBotton);
            make.left.equalTo(self.addPageBotton.mas_right).offset(5);
            make.width.mas_equalTo(64);
            make.height.mas_equalTo(FIGMA_SCALE(30));
        }];
        
        [self.scaleBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.leftFillBotton);
            make.right.mas_equalTo(self).offset(FIGMA_SCALE(-32));
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
        }];
        
        [self.micButton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self.leftFillBotton);
            make.right.equalTo(self.scaleBotton.mas_left).offset(FIGMA_SCALE(-32));
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
        }];
        
        [self.boardView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerX.equalTo(self.mas_centerX);
            make.centerY.equalTo(self.mas_centerY);
            make.width.equalTo(self);
            make.height.equalTo(self.mas_width).multipliedBy(3.0/4.0);
        }];
        
        [self.emptyLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(16);
            make.centerY.equalTo(self.quitButton);
            make.size.mas_equalTo(CGSizeMake(75, 20));
        }];
        
        [self.pullBoxButton mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.equalTo(self.emptyLabel.mas_right).offset(5);
            make.centerY.equalTo(self.emptyLabel);
            make.size.mas_equalTo(CGSizeMake(18, 10));
        }];
        
        [self.boardListView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.equalTo(self.emptyLabel);
            make.top.equalTo(self.emptyLabel.mas_bottom).offset(5);
            make.right.equalTo(self.pullBoxButton);
            make.height.mas_equalTo(30);
        }];

    }
}

#pragma mark - Private Action
- (void)createUIComponents {
    self.backgroundColor = [UIColor whiteColor];

    [self addSubview:self.boardView];
    [self addSubview:self.toolView];
    [self addSubview:self.quitButton];
    [self addSubview:self.pageLabel];
    [self addSubview:self.addPageButton];
    
    self.leftFillBotton = [self createToolButton:@"meeting_room_left_enable"];
    self.rightFillBotton = [self createToolButton:@"meeting_room_right_enable"];
    self.addPageBotton = [self createToolButton:@"meeting_room_add_enable"];
    [self addSubview:self.leftFillBotton];
    [self addSubview:self.rightFillBotton];
    [self addSubview:self.addPageBotton];
    [self addSubview:self.scaleBotton];
    [self addSubview:self.micButton];
    
    [self addSubview:self.emptyLabel];
    [self addSubview:self.pullBoxButton];
    [self addSubview:self.boardListView];
    
    self.micButton.hidden = YES;
    self.toolView.hidden = YES;
    self.emptyLabel.hidden = YES;
    self.pullBoxButton.hidden = YES;
    self.boardListView.hidden = YES;

    
    [self.quitButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(144), FIGMA_SCALE(56)));
        make.bottom.equalTo(self.boardView.mas_top).offset(-10);
        make.right.mas_equalTo(self).offset(FIGMA_SCALE(-32));
    }];
    
    [self.toolView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self);
    }];
    
    [self.leftFillBotton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self).offset(FIGMA_SCALE(49));
        make.top.equalTo(self.boardView.mas_bottom).mas_offset(10);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(24), FIGMA_SCALE(14)));
    }];
    
    [self.rightFillBotton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self.leftFillBotton);
        make.left.equalTo(self.leftFillBotton.mas_right).mas_offset(FIGMA_SCALE(124));
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(24), FIGMA_SCALE(14)));
    }];
    
    [self.pageLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self.leftFillBotton);
        make.left.equalTo(self.leftFillBotton.mas_right);
        make.right.equalTo(self.rightFillBotton.mas_left);
        make.height.mas_equalTo(FIGMA_SCALE(30));
    }];
    
    [self.addPageBotton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.rightFillBotton.mas_right).mas_offset(FIGMA_SCALE(61));
        make.centerY.equalTo(self.leftFillBotton);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(22), FIGMA_SCALE(22)));
    }];
    
    [self.addPageButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self.leftFillBotton);
        make.left.equalTo(self.addPageBotton.mas_right).offset(5);
        make.width.mas_equalTo(64);
        make.height.mas_equalTo(FIGMA_SCALE(30));
    }];
    
    [self.scaleBotton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self.leftFillBotton);
        make.right.mas_equalTo(self).offset(FIGMA_SCALE(-32));
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
    }];
    
    [self.micButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self.leftFillBotton);
        make.right.equalTo(self.scaleBotton.mas_left).offset(FIGMA_SCALE(-32));
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
    }];
    
    [self.boardView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.equalTo(self.mas_centerX);
        make.centerY.equalTo(self.mas_centerY);
        make.width.equalTo(self);
        make.height.equalTo(self.mas_width).multipliedBy(3.0/4.0);
    }];
    
    [self.emptyLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(16);
        make.centerY.equalTo(self.quitButton);
        make.size.mas_equalTo(CGSizeMake(75, 20));
    }];
    
    [self.pullBoxButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.emptyLabel.mas_right).offset(5);
        make.centerY.equalTo(self.emptyLabel);
        make.size.mas_equalTo(CGSizeMake(18, 10));
    }];
    
    [self.boardListView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.emptyLabel);
        make.top.equalTo(self.emptyLabel.mas_bottom).offset(5);
        make.right.equalTo(self.pullBoxButton);
        make.height.mas_equalTo(30);
    }];
}

#pragma mark - Delegate

- (void)onWhiteBoardRoom:(ByteWhiteBoardRoom *)room started:(ByteWhiteBoard *)board {
    self.board = board;
    self.toolView.board = board;
    self.boardRoom = room;
    
    BOOL enableEdit = self.viewModel.localVideoSession.hasSharePermission || self.viewModel.localVideoSession.isHost ? YES : NO;
    self.enableEdit = enableEdit;
    
    if (self.board && self.isFirstJoinRoom) {
        [self.board setEditType:ByteWhiteBoardShapeTypeSelect];
        self.isFirstJoinRoom = NO;
    }
    
    [self onWhiteBoardPageIndexChange];
    
    [self reloadBoardList];
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
    dispatch_async(dispatch_get_main_queue(), ^{
        self.pageLabel.text = [NSString stringWithFormat:@"%ld/%ld",currentIndex + 1,totalCount];
    });
}

- (void)setEnableEdit:(BOOL)enableEdit {
    _enableEdit = enableEdit;

    [self.board setWritable:enableEdit];

    self.toolView.hidden = !enableEdit;
    self.toolView.userInteractionEnabled = enableEdit;
    if (enableEdit) {
        [self addSubview:self.toolView];
        if (_isLandscape) {
            [self.toolView mas_remakeConstraints:^(MASConstraintMaker *make) {
                make.top.left.bottom.equalTo(self);
                make.right.equalTo(self.micButton.mas_left).mas_offset(FIGMA_SCALE(-30));
            }];
        }else {
            [self.toolView mas_remakeConstraints:^(MASConstraintMaker *make) {
                make.edges.equalTo(self);
            }];
        }
    } else {
        [self.toolView removeFromSuperview];
    }
    
    if (!self.isLandscape && self.enableEdit) {
        self.quitButton.hidden = NO;
    }else {
        self.quitButton.hidden = YES;
    }

    self.quitButton.userInteractionEnabled =  !self.quitButton.hidden;
    
    self.addPageBotton.hidden = !enableEdit;
    self.addPageButton.hidden = !enableEdit;
    self.pageLabel.hidden = !enableEdit;
    self.leftFillBotton.hidden = !enableEdit;
    self.rightFillBotton.hidden = !enableEdit;
        
    self.emptyLabel.hidden = !enableEdit;
    self.pullBoxButton.hidden = !enableEdit;
    self.boardListView.hidden = YES;
}

- (void)reloadBoardList {

    WeakSelf
    [self.boardRoom getCurrentWhiteBoardId:^(NSInteger index) {
        [wself.boardRoom getWhiteBoardInfo:index completionHandler:^(ByteWhiteBoardInfo * _Nonnull boardInfo) {
            
            self.emptyLabel.text = [self boardNamewith:boardInfo];
        }];
    }];

    [self.boardRoom getAllWhiteBoardInfo:^(NSArray * _Nonnull array) {
        wself.boardInfoArray = array;
        [wself.boardListView reloadData];
    }];
}
#pragma mark - delegate
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 36;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    NSInteger numberOfCells = self.boardInfoArray.count;

    if (numberOfCells) {
        [self.boardListView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.equalTo(self.emptyLabel);
            make.top.equalTo(self.emptyLabel.mas_bottom).offset(5);
            make.right.equalTo(self.pullBoxButton);
            make.height.mas_equalTo(36 * numberOfCells);
        }];
    }
    
    return numberOfCells;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    NSString *reusedId = @"cell_boardId";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:reusedId];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:reusedId];
    }
    cell.textLabel.font = [UIFont systemFontOfSize:14];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    ByteWhiteBoardInfo *boardInfo = self.boardInfoArray[indexPath.row];
    
    cell.textLabel.text = [self boardNamewith:boardInfo];

    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    ByteWhiteBoardInfo *boardInfo = self.boardInfoArray[indexPath.row];
    self.emptyLabel.text = [self boardNamewith:boardInfo];
    [self.boardRoom switchWhiteBoard:boardInfo.boardID];
    
    self.boardListView.hidden = YES;
}

- (NSString *)boardNamewith:( ByteWhiteBoardInfo *)boardInfo {
    if (boardInfo.boardName.length) {
        return boardInfo.boardName;
    }
    
    return @"空白白板";
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

- (void)clickToolBarBtn:(id)sender {
    if (sender == self.leftFillBotton) {
        [self.board flipPrevPage];
    } else if (sender == self.rightFillBotton) {
        [self.board flipNextPage];
    } else if (sender == self.addPageBotton || sender == self.addPageButton) {
        WeakSelf
        [self.board getCurrentPageIndex:^(NSInteger index) {
            
            ByteWhiteBoardPageInfo *pageInfo = [[ByteWhiteBoardPageInfo alloc] init];
            pageInfo.pageID = [NSString stringWithFormat:@"page_%ld",index + 1];
            pageInfo.bkInfo = [[ByteWhiteBoardBackgroundInfo alloc] init];
                        
            [wself.board createPages:@[pageInfo] index:index isAutoFlip:YES];
        }];
    }
}

- (void)clickQuitBtn:(id)sender {
    self.quitBtnClickedBlock(self);
}

- (BaseButton *)pullBoxButton {
    if (!_pullBoxButton) {
        _pullBoxButton = [[BaseButton alloc] init];
        [_pullBoxButton setImage:[ThemeManager imageNamed:@"meeting_pull_down"] forState:UIControlStateNormal];
        _pullBoxButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        WeakSelf
        [_pullBoxButton setBtnClickBlock:^(id  _Nonnull sender) {
            wself.boardListView.hidden = !wself.boardListView.hidden;
        }];
    }
    return _pullBoxButton;
}

- (UITableView *)boardListView {
    if (_boardListView == nil) {
        
        _boardListView = [[UITableView alloc] init];
        _boardListView.layer.shadowColor = [UIColor grayColor].CGColor;
        _boardListView.layer.masksToBounds = NO;
        _boardListView.layer.shadowRadius = 3;
        _boardListView.layer.shadowOffset = CGSizeMake(0.0f,0.0f);
        _boardListView.layer.shadowOpacity = 0.9f;
        _boardListView.hidden = YES;
        _boardListView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _boardListView.delegate = self;
        _boardListView.dataSource = self;
        _boardListView.scrollEnabled = NO;
    }
    return _boardListView;
}

- (UILabel *)emptyLabel {
    if (_emptyLabel == nil) {
        _emptyLabel = [[UILabel alloc] init];
        _emptyLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(32)];
        _emptyLabel.textAlignment = NSTextAlignmentLeft;
        _emptyLabel.textColor = [ThemeManager titleLabelTextColor];
        _emptyLabel.textAlignment = NSTextAlignmentCenter;
    }
    
    return _emptyLabel;
}

@end

