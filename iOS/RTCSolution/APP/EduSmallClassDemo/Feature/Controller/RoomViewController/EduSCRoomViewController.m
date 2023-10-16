#import "EduSCRoomViewController.h"
#import "EduSCUserListViewController.h"

#import "UIViewController+Orientation.h"

#import "EduSCSettingViewController.h"
#import "EduSCSettingsService.h"
#import "SystemAuthority.h"

#import "EduSCRoomSpeakerView.h"
#import "EduSCRoomParamInfoView.h"
#import "EduSCRoomWhiteBoardView.h"

#import "EduSmallClassEndComponent.h"
#import "EduSmallClassScreenComponent.h"
#import "PublicParameterComponent.h"
#import "EduSmallClassWhiteBoardComponent.h"

#import "NetworkingTool.h"
#import "EduSCRoomViewModel+Sort.h"
#import "EduSCNavViewModel.h"
#import "EduSCWhiteBoardViewModel.h"

@interface EduSCRoomViewController () <UINavigationControllerDelegate, EduSCRoomNavViewDelegate,EduSmallClassWhiteBoardDelegate>

@property (nonatomic, strong) EduSCRoomParamInfoView *paramInfoView;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIView *whiteBoardContainerView;

@property (nonatomic, strong) EduSmallClassEndComponent *endComponent;
@property (nonatomic, strong) EduSmallClassScreenComponent *screenComponent;
@property (nonatomic, strong) EduSmallClassWhiteBoardComponent *whiteBoardComponent;
@property (nonatomic, strong) EduSCUserListViewController *userListViewControllr;

@property (nonatomic, assign) NSInteger recordSecond;
@property (nonatomic, assign) BOOL isLandscape;
@property (nonatomic, assign) RoomViewMode viewMode;
@property (nonatomic, assign) BOOL isFullScreenMode;
@property (nonatomic, assign) BOOL isSharingAudio;
@property (nonatomic, assign) BOOL isHangUp;

@end

@implementation EduSCRoomViewController

#pragma mark - VC
- (instancetype)initWithLocalVideoSession:(EduSCRoomVideoSession *)videoSession withRoomModel:(EduSmallClassControlRoomModel *)roomModel andUsers:(NSArray<EduSCRoomVideoSession *> *)userLists {
    self = [super init];
    if (self) {
        self.recordSecond = 0;
        [UIApplication sharedApplication].idleTimerDisabled = YES;
        self.EduSCRoomViewModel = [[EduSCRoomViewModel alloc] initWithLocalVideoSession:videoSession withRoomModel:roomModel withUsers:userLists];
        @weakify(self);
        [self.EduSCRoomViewModel setJumpUserListCallbackBlock:^(BOOL result) {
            @strongify(self);
            [self joinUserControllor:YES];
        }];
        [self.EduSCRoomViewModel setShareChangedCallbackBlock:^(NSString * _Nonnull uid, int shareType) {
            @strongify(self);
            [self checkShare];
        }];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(exitRoom) name:@"exitRoom" object:nil];
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.isHangUp = NO;
    
    [self addOrientationNotice];
    [self createUIComponent];
    
    self.isLandscape = NO;

    [self.EduSCRoomViewModel reloadUserList];
    [self.EduSCRoomViewModel joinRoom];
    
    @weakify(self);
    [self.KVOController observe:self.EduSCRoomViewModel keyPath:@keypath(self.EduSCRoomViewModel, needHangUp) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        [self hangUp:YES end:YES];
    }];
    
    [self.KVOController observe:self.EduSCRoomViewModel keyPath:@keypath(self.EduSCRoomViewModel, timeOut) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        [[ToastComponent shareToastComponent] showWithMessage:@"体验时间已结束"];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self hangUp:NO end:YES];
        });
    }];
    
    [self.KVOController observe:self.EduSCRoomViewModel.localVideoSession keyPath:@keypath(self.EduSCRoomViewModel.localVideoSession, hasSharePermission) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        BOOL hasSharePermission = [change[NSKeyValueChangeNewKey] boolValue];

        if (hasSharePermission == NO) {
            [self stopScreenShare];
        }
        
    }];
    
    [self.KVOController observe:self.EduSCRoomViewModel keyPath:@keypath(self.EduSCRoomViewModel, sortUserLists) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        NSArray *list = change[NSKeyValueChangeNewKey];
        [self checkUserList:list];
        [self.speakerView bindVideoSessions:list];
        [self collectionViewBindData:list];
        [self.bottomView updateUserCount:list.count];
        
        EduSCUserListViewModel *viewModel = [[EduSCUserListViewModel alloc] initWithLocalVideoSeesion:self.EduSCRoomViewModel.localVideoSession userList:self.EduSCRoomViewModel.sortUserLists];
        self.userListViewControllr.viewModel = viewModel;
    }];
    
    [self.EduSCRoomViewModel updateSortListsPromptly];
    [self checkShare];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self updateScreenOrientation];
    [self.navigationController setNavigationBarHidden:YES animated:NO];
    [self.EduSCRoomViewModel updateRtcVideoParams];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    [self setAllowAutoRotate:ScreenOrientationPortrait];
}

#pragma mark - private
- (void)checkShare {
    NSString *uid = self.EduSCRoomViewModel.roomModel.share_user_id;
    int shareType = self.EduSCRoomViewModel.roomModel.share_type;
    if (IsEmptyStr(uid)) {
        [self leavWhiteBoardRoom];
        [self.screenComponent stopScreenCapture];
    } else if (shareType == kShareTypeWhiteBoard) {
        [self.screenComponent stopScreenCapture];

        [self.view setNeedsDisplay];
        [self.view layoutIfNeeded];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self joinWhiteBoardRoom];
        });

    } else if (shareType == kShareTypeScreen) {
        [self leavWhiteBoardRoom];
        if (![uid isEqualToString:self.EduSCRoomViewModel.localVideoSession.uid]) {
            self.screenView.sharingVideoSession = [self getVideoSessionByUid:uid inList:self.EduSCRoomViewModel.sortUserLists];
        } else {
            self.screenView.sharingVideoSession = nil;
        }
    }
}

- (EduSCRoomVideoSession *)getVideoSessionByUid:(NSString *)uid inList:(NSArray<EduSCRoomVideoSession *> *)userLists {
    for (EduSCRoomVideoSession *session in userLists) {
        if ([session.uid isEqualToString:uid]) {
            return session;
        }
    }
    return nil;
}

- (void)orientationDidChange:(BOOL)isLandscape {
    self.bottomView.hidden = isLandscape;
    self.navView.hidden = isLandscape;
    self.isLandscape = isLandscape;
    [self collectionViewUpdateConstraints];
    [self collectionViewBindData:self.EduSCRoomViewModel.sortUserLists];
    
    [self updateWhiteBoardContainerView:isLandscape];
}

- (void)updateWhiteBoardContainerView:(BOOL)isLandscape {
    if(_whiteBoardContainerView == nil) {
        return;
    }
    
    if (isLandscape) {
        [self.whiteBoardContainerView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.bottom.left.top.equalTo(self.bgView);
            make.right.equalTo(self.collectionView.mas_left);
        }];
    } else {
        [self.whiteBoardContainerView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.collectionView.mas_bottom);
            make.left.right.equalTo(self.bgView);
            make.bottom.equalTo(self.bottomView.mas_top);
        }];
    }

    self.whiteBoardComponent.isLandscape = isLandscape;
}

- (void)setViewMode:(RoomViewMode)viewMode {
    if (_viewMode != viewMode) {
        _viewMode = viewMode;
        switch (_viewMode) {
            case RoomViewModeSpeaker:
                self.speakerView.hidden = NO;
                self.collectionView.hidden = YES;
                self.screenView.hidden = YES;
                [self setAllowAutoRotate:ScreenOrientationPortrait];
                break;
            case RoomViewModeGallery:
                self.collectionView.hidden = NO;
                self.speakerView.hidden = YES;
                self.screenView.hidden = YES;
                [self setAllowAutoRotate:ScreenOrientationLandscapeAndPortrait];
                break;
                
            case RoomViewModeThumbnail:
                self.collectionView.hidden = NO;
                self.screenView.hidden = NO;
                self.speakerView.hidden = YES;
                [self setAllowAutoRotate:ScreenOrientationLandscapeAndPortrait];
                break;
                
            case RoomViewModeWhiteBoard:
                self.collectionView.hidden = NO;
                self.speakerView.hidden = YES;
                self.screenView.hidden = YES;
                [self setAllowAutoRotate:ScreenOrientationLandscapeAndPortrait];
                break;
            default:
                break;
        }
        
        self.collectionView.needFold = !(self.viewMode == RoomViewModeGallery || self.viewMode == RoomViewModeWhiteBoard);
        [self collectionViewUpdateConstraints];
    }
}

- (void)checkUserList:(NSMutableArray<EduSCRoomVideoSession *> *)userList {
    RoomViewMode mode;
    if (self.EduSCRoomViewModel.roomModel.share_user_id.length > 0) {
        if (self.EduSCRoomViewModel.roomModel.share_type == kShareTypeWhiteBoard) {
            mode = RoomViewModeWhiteBoard;
        } else {
            mode = RoomViewModeThumbnail;
        }
    } else if (userList.count <= 2) {
        mode = RoomViewModeSpeaker;
    } else {
        mode = RoomViewModeGallery;
    }
    
    if (self.viewMode != mode) {
        self.viewMode = mode;
    }
}

- (void)collectionViewUpdateConstraints {
    [self.collectionView mas_remakeConstraints:^(MASConstraintMaker *make) {
        if (self.viewMode == RoomViewModeGallery) {
            if (self.isLandscape) {
                make.edges.equalTo(self.view);
            } else {
                make.top.equalTo(self.navView.mas_bottom);
                make.left.right.equalTo(self.bgView);
                make.bottom.equalTo(self.bottomView.mas_top);
            }
        } else if (self.viewMode == RoomViewModeThumbnail || self.viewMode == RoomViewModeWhiteBoard) {
            if (self.isLandscape) {
                if (!self.collectionView.isHiddenSideView) {
                    make.top.right.bottom.equalTo(self.bgView);
                    make.left.equalTo(self.bgView.mas_right).offset(-180);
                } else {
                    make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(12), FIGMA_SCALE(30)));
                    make.left.equalTo(self.bgView.mas_right).offset(-12);
                    make.centerY.equalTo(self.bgView);
                }
            } else {
                CGSize frameSize = self.bgView.frame.size;
                if (self.collectionView.isFold) {
                    make.top.equalTo(self.navView.mas_bottom);
                    make.left.right.equalTo(self.bgView);
                    // maybe frame size is not updated immediately
                    if (self.viewMode == RoomViewModeWhiteBoard) {
                        make.height.mas_equalTo(MIN(frameSize.width, frameSize.height)*3/8);
                    } else {
                        make.height.mas_equalTo(FIGMA_SCALE(36));
                    }
                } else {
                    make.top.equalTo(self.navView.mas_bottom);
                    make.left.right.equalTo(self.bgView);
                    // maybe frame size is not updated immediately
                    make.height.mas_equalTo(MIN(frameSize.width, frameSize.height)*3/8);
                }
            }
        }
    }];
}

- (void)collectionViewBindData:(NSMutableArray<EduSCRoomVideoSession *> *)userList {
    if (self.collectionView.hidden) {
        return;
    }
    
    CGPoint layout = CGPointZero;
    if (self.viewMode == RoomViewModeGallery) {
        if (userList.count <= 4) {
            layout = CGPointMake(2, 2);
        } else {
            layout = self.isLandscape ? CGPointMake(3, 2) : CGPointMake(2, 3);
        }
    } else if (self.viewMode == RoomViewModeThumbnail) {
        layout = self.isLandscape ? CGPointMake(3, 1) : CGPointMake(2, 1);
    } else if (self.viewMode == RoomViewModeWhiteBoard) {
        layout = self.isLandscape ? CGPointMake(3, 1) : CGPointMake(2, 1);
    }
    if (!CGPointEqualToPoint(CGPointZero, layout)) {
        [self.collectionView updateGridLayout:layout forceSet:YES];
    }
    
    if (self.isLandscape && (self.viewMode == RoomViewModeThumbnail || self.viewMode == RoomViewModeWhiteBoard)) {
        self.collectionView.scrollDirection = UICollectionViewScrollDirectionVertical;
    } else {
        self.collectionView.scrollDirection = UICollectionViewScrollDirectionHorizontal;
    }
    
    [self.collectionView bindVideoSessions:userList];
    
    for (NSInteger i = 0; i < userList.count; i++) {
        userList[i].isVisible = [self.collectionView isItemVisible:i];
    }
}

- (void)updateScreenOrientation {
    switch (self.viewMode) {
        case RoomViewModeGallery:
        case RoomViewModeThumbnail:
        case RoomViewModeWhiteBoard:
            [self setAllowAutoRotate:ScreenOrientationLandscapeAndPortrait];
            break;
        default:
            [self setAllowAutoRotate:ScreenOrientationPortrait];
            break;
    }
}

- (void)setAllowAutoRotate:(ScreenOrientation)screenOrientation {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"SetAllowAutoRotateNotification" object:@(screenOrientation)];
    if (@available(iOS 16.0, *)) {
        if (!_isFullScreenMode) {
//            [self setNeedsUpdateOfSupportedInterfaceOrientations];
        }
    }
}

- (void)updateSideViewHiddenStatus {
    if (!self.isLandscape) {
        return;
    }
    if (self.collectionView.isHiddenSideView) {
        [self.collectionView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.right.bottom.equalTo(self.bgView);
            make.left.equalTo(self.bgView.mas_right).offset(-180);
        }];
    } else {
        [self.collectionView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(12), FIGMA_SCALE(30)));
            make.left.equalTo(self.bgView.mas_right).offset(-12);
            make.centerY.equalTo(self.bgView);
        }];
    }
    self.collectionView.isHiddenSideView = !self.collectionView.isHiddenSideView;
}

- (void)restoreScreenOrientation {
    if (self.isLandscape) {
        [self setDeviceInterfaceOrientation:UIDeviceOrientationPortrait];
    }
}

#pragma mark - Publish Action

- (void)hangUp:(BOOL)isManual end:(BOOL)isEndEduSmallClass {
    [self restoreScreenOrientation];
    self.isHangUp = YES;
    [self.EduSCRoomViewModel stopSort];
    
    //User screen or whiteboard sharing
    if ([self.EduSCRoomViewModel.roomModel.share_user_id isEqualToString:self.EduSCRoomViewModel.localVideoSession.uid] && self.whiteBoardComponent.isSharing == NO) {
        [self stopScreenShare];
    }
    //User whiteboard sharing
    [self.whiteBoardComponent destroy];
    //socket api end/leave EduSmallClass
    if (isEndEduSmallClass) {
        [self.EduSCRoomViewModel endRoom];
    } else {
        [self.EduSCRoomViewModel leaveRoom];
    }
    
    [self dismissViewControllerAnimated:YES completion:nil];
    if (isManual && self.closeRoomBlock) {
        BOOL isEnableAudio = ([self.bottomView getStatusOfItem:RoomBottomItemMic] == ButtonStatusActive) ? NO : YES;
        BOOL isEnableVideo = ([self.bottomView getStatusOfItem:RoomBottomItemCamera] == ButtonStatusActive) ? NO : YES;
        self.closeRoomBlock(isEnableAudio, isEnableVideo);
    }
}

- (void)joinUserControllor:(BOOL)hand {
    BOOL inUserList = NO;
    for (UIViewController *vc in self.navigationController.viewControllers) {
        if (self.userListViewControllr == vc) {
            inUserList = YES;
            break;
        }
    }
    if (!inUserList) {
        EduSCUserListViewModel *viewModel = [[EduSCUserListViewModel alloc] initWithLocalVideoSeesion:self.EduSCRoomViewModel.localVideoSession userList:self.EduSCRoomViewModel.sortUserLists];
        EduSCUserListViewController *eduSCUserListViewController = [[EduSCUserListViewController alloc] initWithViewModel:viewModel];
        self.userListViewControllr = eduSCUserListViewController;
        [self.navigationController pushViewController:eduSCUserListViewController animated:YES];
    }
}

#pragma mark - EduSCRoomNavViewDelegate
- (void)EduSCRoomNavView:(EduSCRoomNavView *)EduSCRoomNavView itemButton:(EduSCRoomItemButton *)itemButton didSelectStatus:(RoomNavItem)status {
    if (status == RoomNavItemHangeup) {
        [self showEndView:EduSCRoomNavView];
    } else if (status == RoomNavItemSwitchCamera) {
        if (self.EduSCRoomViewModel.localVideoSession.isEnableVideo) {
            [self.EduSCRoomViewModel switchCamera];
        }
    } else if (status == RoomNavItemSwitchSpeaker) {
        BOOL micEarpiece = (itemButton.status == ButtonStatusActive);
        int ret = [self.EduSCRoomViewModel setEnableSpeakerphone:micEarpiece];
        if (!ret) {
            if (micEarpiece) {
                itemButton.status = ButtonStatusNone;
            } else {
                itemButton.status = ButtonStatusActive;
            }
        } else {
                [[ToastComponent shareToastComponent] showWithMessage:@"使用外接设备中，切换失败"];
        }
    }
}

- (void)timeChange:(NSInteger)time {
    if (self.recordSecond == 0 && self.EduSCRoomViewModel.roomModel.record_status == YES) {
        self.recordSecond = time;
    } else if (self.EduSCRoomViewModel.roomModel.record_status == NO) {
        self.recordSecond = 0;
    } else if (time - self.recordSecond >= MaxEduSmallClassRecordLimitedTimeInSecs) {
        self.recordSecond = 0;
        if (self.EduSCRoomViewModel.localVideoSession.isHost) {
            [self.EduSCRoomViewModel stopRecord];
        }
        NSInteger recordMax = MaxEduSmallClassRecordLimitedTimeInSecs / 60;
        [[ToastComponent shareToastComponent] showWithMessage:[NSString stringWithFormat: @"%ld分钟录制时长已到，已为你停止录制",recordMax]];
    }
}

#pragma mark - Private Action
- (void)startScreenShare {
    self.isSharingAudio = NO;
    self.screenView.enableSharingAudio = self.isSharingAudio;
    [self.screenComponent start:ByteRTCScreenMediaTypeVideoOnly withBlock:^{
    }];
}

- (void)stopScreenShare {
    if (self.screenComponent.isSharing) {
        [self.screenComponent stop];
    }
}

- (void)joinWhiteBoardRoom {
    self.whiteBoardContainerView.hidden = NO;
    
    NSString *roomId = self.EduSCRoomViewModel.roomModel.wb_room_id;
    NSString *uid = self.EduSCRoomViewModel.roomModel.wb_user_id;
    NSString *token = self.EduSCRoomViewModel.roomModel.wb_token;
    
    [self.whiteBoardComponent joinRoom:roomId userId:uid
                              token:token];
}

- (void)leavWhiteBoardRoom {
    [self.whiteBoardComponent leavRoom];
    self.whiteBoardContainerView.hidden = YES;
}

- (void)createUIComponent {
    self.bgView = [[UIView alloc] init];
    self.bgView.backgroundColor = [ThemeManager contentBackgroundColor];
    [self.view addSubview:self.bgView];
    [self.view addSubview:self.navView];
    [self.view addSubview:self.speakerView];
    [self.view addSubview:self.screenView];
    [self.view addSubview:self.whiteBoardContainerView];
    [self.view addSubview:self.collectionView];
    [self.view addSubview:self.paramInfoView];
    [self.view addSubview:self.bottomView];
        
    @weakify(self);
    [self.KVOController observe:self.collectionView keyPath:@keypath(self.collectionView, isFold) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        [self collectionViewUpdateConstraints];
        [self collectionViewBindData:self.EduSCRoomViewModel.sortUserLists];
    }];
    
    [self.KVOController observe:self.collectionView keyPath:@keypath(self.collectionView, needFold) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        [self collectionViewUpdateConstraints];
        [self collectionViewBindData:self.EduSCRoomViewModel.sortUserLists];
    }];
    
    [self.collectionView setSideBtnClickBlock:^(id _Nonnull sender) {
        @strongify(self);
        [self updateSideViewHiddenStatus];
    }];
    
    [self.bgView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.view);
    }];
    
    [self.navView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.left.right.equalTo(self.bgView);
        make.height.mas_equalTo(44 + [DeviceInforTool getStatusBarHight]);
    }];

    [self.collectionView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.navView.mas_bottom);
        make.left.right.equalTo(self.bgView);
        make.bottom.equalTo(self.bottomView.mas_top);
    }];
    
    [self.speakerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.navView.mas_bottom);
        make.left.right.equalTo(self.bgView);
        make.bottom.equalTo(self.bottomView.mas_top);
    }];
    
    [self.screenView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.collectionView.mas_bottom);
        make.left.right.equalTo(self.bgView);
        make.bottom.equalTo(self.bottomView.mas_top);
    }];
    
    [self.bottomView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.equalTo(self.bgView);
        make.bottom.equalTo(self.bgView);
        make.height.mas_equalTo(128/2 + [DeviceInforTool getVirtualHomeHeight]);
    }];
    
    [self.whiteBoardContainerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.collectionView.mas_bottom);
        make.left.right.equalTo(self.bgView);
        make.bottom.equalTo(self.bottomView.mas_top);
    }];

    [self.paramInfoView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.bgView);
        make.bottom.equalTo(self.bottomView.mas_top);
        make.width.mas_equalTo(150.f);
        make.height.mas_equalTo(16 * 16 + 10 + 10);
    }];
    
    self.paramInfoView.hidden = ![EduSCSettingsService getOpenParam];
}

- (void)showEndView:(UIView *)anchorView {
    if (self.EduSCRoomViewModel.sortUserLists.count == 1) {
        [self hangUp:YES end:self.EduSCRoomViewModel.localVideoSession.isHost];
    } else {
        [self.endComponent showAt:anchorView withStatus:self.EduSCRoomViewModel.localVideoSession.isHost ? EduSmallClassEndStatusHost : EduSmallClassEndStatusNone];
        __weak __typeof(self) wself = self;
        self.endComponent.clickButtonBlock = ^(EduSmallClassButtonStatus status) {
            if (status == EduSmallClassButtonStatusEnd ||
                status == EduSmallClassButtonStatusLeave) {
                [wself hangUp:YES end:(status == EduSmallClassButtonStatusEnd)];
            } else if (status == EduSmallClassButtonStatusCancel) {
                //cancel
            }
            wself.endComponent = nil;
        };
    }
}

- (void)exitRoom {
    [self hangUp:YES end:NO];
}

#pragma mark - MeetingWhiteBoardDelegate

- (void)whiteBoardComponentOnClickedQuitButton {
    [self.EduSCRoomViewModel endShare];
    [self leavWhiteBoardRoom];
    self.isFullScreenMode = NO;
}

- (void)whiteBoardComponentOnClickedScaleButton {
    if (self.isLandscape) {
        [self setDeviceInterfaceOrientation:UIDeviceOrientationPortrait];
        self.isFullScreenMode = NO;
    } else {
        [self setDeviceInterfaceOrientation:UIDeviceOrientationLandscapeLeft];
        self.isFullScreenMode = YES;
    }
}

#pragma mark - getter

- (EduSCRoomBottomView *)bottomView {
    if (!_bottomView) {
        EduSCRoomBottomViewModel *viewModel = [[EduSCRoomBottomViewModel alloc] initWithVideoSession:self.EduSCRoomViewModel.localVideoSession withRoomModel:self.EduSCRoomViewModel.roomModel];
        _bottomView = [[EduSCRoomBottomView alloc] initWithViewModel:viewModel];
        @weakify(self);
        [_bottomView setUserListClickBlock:^(EduSCRoomBottomView * _Nonnull sender) {
            @strongify(self);
            [self joinUserControllor:NO];
        }];
        [_bottomView setScreenShareClickBlock:^(EduSCRoomBottomView * _Nonnull sender) {
            @strongify(self);
            [self startScreenShare];
        }];
        [_bottomView setWhiteboardShareClickBlock:^(EduSCRoomBottomView * _Nonnull sender) {
            @strongify(self);
            [self.EduSCRoomViewModel startShare:kShareTypeWhiteBoard];
        }];
    }
    return _bottomView;
}

- (EduSCRoomNavView *)navView {
    if (!_navView) {
        EduSCNavViewModel *viewModel = [[EduSCNavViewModel alloc] initWithVideoSession:self.EduSCRoomViewModel.localVideoSession withRoomModel:self.EduSCRoomViewModel.roomModel];
        _navView = [[EduSCRoomNavView alloc] initWithViewModel:viewModel];
        [self.navView changeSwitchCameraBtnStatus:self.EduSCRoomViewModel.localVideoSession.isEnableVideo];
        _navView.delegate = self;
    }
    return _navView;
}

- (EduSCRoomParamInfoView *)paramInfoView {
    if (!_paramInfoView) {
        _paramInfoView = [[EduSCRoomParamInfoView alloc] init];
        _paramInfoView.backgroundColor = [UIColor clearColor];
        _paramInfoView.hidden = YES;
    }
    return _paramInfoView;
}

- (EduSCRoomCollectionView *)collectionView {
    if (!_collectionView) {
        _collectionView = [[EduSCRoomCollectionView alloc] initWithFrame:self.bgView.frame];
        _collectionView.hidden = YES;
    }
    return _collectionView;
}

- (EduSCRoomSpeakerView *)speakerView {
    if (!_speakerView) {
        _speakerView = [[EduSCRoomSpeakerView alloc] init];
        _speakerView.hidden = YES;
    }
    return _speakerView;
}

- (EduSCRoomScreenView *)screenView {
    WeakSelf
    
    if (!_screenView) {
        _screenView = [[EduSCRoomScreenView alloc] init];
        _screenView.hidden = YES;
        _screenView.clickCloseBlock = ^{
            [wself stopScreenShare];
        };
        
        [_screenView setBtnClickBlock:^(id  _Nonnull sender) {
            if (sender == wself.screenView) {
                if (wself.isLandscape) {
                    [wself setDeviceInterfaceOrientation:UIDeviceOrientationPortrait];
                    wself.isFullScreenMode = NO;
                } else {
                    [wself setDeviceInterfaceOrientation:UIDeviceOrientationLandscapeLeft];
                    wself.isFullScreenMode = YES;
                }
            }
        }];
        
        _screenView.clickShareAudioBlock = ^(BOOL state) {
            wself.isSharingAudio = !wself.isSharingAudio;
            if (wself.isSharingAudio) {
                [wself.screenComponent update:ByteRTCScreenMediaTypeVideoAndAudio];
            } else {
                [wself.screenComponent update:ByteRTCScreenMediaTypeVideoOnly];
            }
        };
    }
    return _screenView;
}

- (EduSmallClassEndComponent *)endComponent {
    if (!_endComponent) {
        _endComponent = [[EduSmallClassEndComponent alloc] init];
    }
    return _endComponent;
}

- (EduSmallClassScreenComponent *)screenComponent {
    if (!_screenComponent) {
        _screenComponent = [[EduSmallClassScreenComponent alloc] init];
    }
    return _screenComponent;
}

- (EduSmallClassWhiteBoardComponent *)whiteBoardComponent {
    if (!_whiteBoardComponent) {
        EduSCWhiteBoardViewModel *viewModel = [[EduSCWhiteBoardViewModel alloc] initWithVideoSession:self.EduSCRoomViewModel.localVideoSession withRoomModel:self.EduSCRoomViewModel.roomModel];
        
        EduSCRoomWhiteBoardView *whiteBoardView = [[EduSCRoomWhiteBoardView alloc] initWithViewModel:viewModel];
        
        _whiteBoardComponent = [[EduSmallClassWhiteBoardComponent alloc] initWithwhiteBoardView:whiteBoardView superView:self.whiteBoardContainerView];
        
        _whiteBoardComponent.isLandscape = self.isLandscape;
        _whiteBoardComponent.delegate = self;
    }
    return _whiteBoardComponent;
}

- (void)dealloc {
    [UIApplication sharedApplication].idleTimerDisabled = NO;
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"exitRoom" object:nil];
}

- (UIView *)whiteBoardContainerView {
    if(!_whiteBoardContainerView) {
        _whiteBoardContainerView = [[UIView alloc] init];
        _whiteBoardContainerView.hidden = YES;
    }
    return _whiteBoardContainerView;
}

#pragma mark - setter
- (void)setIsLandscape:(BOOL)isLandscape {
    _isLandscape = isLandscape;
    if (isLandscape) {
        [self updateSideViewHiddenStatus];
        
        [self.screenView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.bgView);
            make.left.equalTo(self.bgView);
            make.bottom.equalTo(self.bgView);
            make.right.equalTo(self.collectionView.mas_left);
        }];
    } else {
        [self.screenView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.collectionView.mas_bottom);
            make.left.right.equalTo(self.bgView);
            make.bottom.equalTo(self.bottomView.mas_top);
        }];
        
        [self.screenView updateIconPosition];
    }
    self.screenView.isVertical = !isLandscape;
}
@end
