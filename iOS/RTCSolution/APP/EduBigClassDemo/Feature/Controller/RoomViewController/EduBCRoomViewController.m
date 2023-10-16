#import "EduBCRoomViewController.h"
#import "EduBCUserListViewController.h"

#import "UIViewController+Orientation.h"

#import "EduBCSettingViewController.h"
#import "EduBCSettingsService.h"
#import "SystemAuthority.h"

#import "EduBCRoomSpeakerView.h"
#import "EduBCRoomParamInfoView.h"
#import "EduBCRoomWhiteBoardView.h"

#import "EduBigClassEndComponent.h"
#import "EduBigClassScreenComponent.h"
#import "PublicParameterComponent.h"
#import "EduBigClassWhiteBoardComponent.h"

#import "NetworkingTool.h"
#import "EduBCRoomViewModel+Sort.h"
#import "EduBCNavViewModel.h"
#import "EduBCWhiteBoardViewModel.h"

@interface EduBCRoomViewController () <UINavigationControllerDelegate>

@property (nonatomic, strong) EduBCRoomParamInfoView *paramInfoView;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UIView *whiteBoardContainerView;

@property (nonatomic, strong) EduBigClassEndComponent *endComponent;
@property (nonatomic, strong) EduBigClassScreenComponent *screenComponent;
@property (nonatomic, strong) EduBigClassWhiteBoardComponent *whiteBoardComponent;
@property (nonatomic, strong) EduBCUserListViewController *userListViewControllr;

@property (nonatomic, assign) NSInteger recordSecond;
@property (nonatomic, assign) BOOL isLandscape;
@property (nonatomic, assign) BOOL isFullScreenMode;
@property (nonatomic, assign) BOOL isSharingAudio;
@property (nonatomic, assign) BOOL isHangUp;

@property (nonatomic, strong) BaseButton *micButton;
@end

@implementation EduBCRoomViewController

#pragma mark - VC
- (instancetype)initWithLocalVideoSession:(EduBCRoomVideoSession *)videoSession withRoomModel:(EduBigClassControlRoomModel *)roomModel andUsers:(NSArray<EduBCRoomVideoSession *> *)userLists {
    self = [super init];
    if (self) {
        self.recordSecond = 0;
        [UIApplication sharedApplication].idleTimerDisabled = YES;
        self.eduBCRoomViewModel = [[EduBCRoomViewModel alloc] initWithLocalVideoSession:videoSession withRoomModel:roomModel withUsers:userLists];
        @weakify(self);
        [self.eduBCRoomViewModel setJumpUserListCallbackBlock:^(BOOL result) {
            @strongify(self);
            [self joinUserControllor:YES];
        }];
        [self.eduBCRoomViewModel setShareChangedCallbackBlock:^(NSString * _Nonnull uid, int shareType) {
            @strongify(self);
            [self checkShare];
        }];
        self.isLandscape = NO;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(exitRoom) name:@"exitRoom" object:nil];
        
        [self.KVOController observe:videoSession keyPath:@keypath(videoSession, linkMicStatus) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            LinkMicMode mode = [change[NSKeyValueChangeNewKey] integerValue];
            if (mode == LinkMicModeNone) {
                self.micButton.status = ButtonStatusNone;
            } else if (mode == LinkMicModeLinking) {
                self.micButton.status = ButtonStatusIng;
            } else if (mode == LinkMicModeDone) {
                self.micButton.status = ButtonStatusActive;
            }
        }];
        self.micButton.status = ButtonStatusNone;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.isHangUp = NO;
    [self setDeviceInterfaceOrientation:UIDeviceOrientationLandscapeLeft];
    self.isFullScreenMode = NO;
    
    [self addOrientationNotice];
    [self createUIComponent];
    
    [self.eduBCRoomViewModel joinRoom];
    
    @weakify(self);
    [self.KVOController observe:self.eduBCRoomViewModel keyPath:@keypath(self.eduBCRoomViewModel, needHangUp) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        [self hangUp:YES end:YES];
    }];
    
    [self.KVOController observe:self.eduBCRoomViewModel keyPath:@keypath(self.eduBCRoomViewModel, timeOut) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [[ToastComponent shareToastComponent] showWithMessage:@"体验时间已结束"];
            [self hangUp:NO end:YES];
        });
    }];
    
    [self.KVOController observe:self.eduBCRoomViewModel keyPath:@keypath(self.eduBCRoomViewModel, sortUserLists) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        id list = change[NSKeyValueChangeNewKey];
        [self collectionViewBindData:[self checkUserList:list]];
    }];
    
    [self.eduBCRoomViewModel updateSortListsPromptly];
    [self checkShare];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:NO];
    [self.eduBCRoomViewModel updateRtcVideoParams];
    
    [self setAllowAutoRotate:ScreenOrientationLandscape];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    [self setAllowAutoRotate:ScreenOrientationPortrait];
    
    
}

#pragma mark - private
- (void)checkShare {
    NSString *uid = self.eduBCRoomViewModel.roomModel.share_user_id;
    int shareType = self.eduBCRoomViewModel.roomModel.share_type;
    if (IsEmptyStr(uid)) {
       
        [self.view setNeedsDisplay];
        [self.view layoutIfNeeded];
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self joinWhiteBoardRoom];
        });
        
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
        if (![uid isEqualToString:self.eduBCRoomViewModel.localVideoSession.uid]) {
            self.screenView.hidden = NO;
            self.screenView.sharingVideoSession = [self getVideoSessionByUid:uid inList:self.eduBCRoomViewModel.sortUserLists];
        } else {
            self.screenView.sharingVideoSession = nil;
        }
    }
}

- (EduBCRoomVideoSession *)getVideoSessionByUid:(NSString *)uid inList:(NSArray<EduBCRoomVideoSession *> *)userLists {
    for (EduBCRoomVideoSession *session in userLists) {
        if ([session.uid isEqualToString:uid]) {
            return session;
        }
    }
    return nil;
}

- (void)orientationDidChange:(BOOL)isLandscape {
    self.bottomView.hidden = isLandscape;
    self.isLandscape = isLandscape;
    [self collectionViewBindData:self.eduBCRoomViewModel.sortUserLists];
}

- (NSMutableArray<EduBCRoomVideoSession *> *)checkUserList:(NSMutableArray<EduBCRoomVideoSession *> *)userList {

    NSMutableArray *showUserList = [[NSMutableArray alloc] init];
    for (EduBCRoomVideoSession *session in userList) {
        if (session.isHost) {
            [showUserList addObject:session];
        }else if (session.linkMicStatus == LinkMicModeDone) {
            [showUserList addObject:session];
        }
    }
    return showUserList.mutableCopy;
}

- (void)collectionViewBindData:(NSMutableArray<EduBCRoomVideoSession *> *)userList {
    if (self.collectionView.hidden) {
        return;
    }
    
    CGPoint layout = CGPointMake(3, 1);
    if (!CGPointEqualToPoint(CGPointZero, layout)) {
        [self.collectionView updateGridLayout:layout forceSet:YES];
    }
    
    self.collectionView.scrollDirection = UICollectionViewScrollDirectionVertical;
    
    [self.collectionView bindVideoSessions:userList];
    
    for (NSInteger i = 0; i < userList.count; i++) {
        userList[i].isVisible = [self.collectionView isItemVisible:i];
    }
}

- (void)setAllowAutoRotate:(ScreenOrientation)screenOrientation {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"SetAllowAutoRotateNotification" object:@(screenOrientation)];
    if (@available(iOS 16.0, *)) {
        if (!_isFullScreenMode) {
            [self setNeedsUpdateOfSupportedInterfaceOrientations];
        }
    }
}

- (void)restoreScreenOrientation {
    if (self.isLandscape) {
        [self setDeviceInterfaceOrientation:UIDeviceOrientationPortrait];
    }
}

#pragma mark - Publish Action

- (void)hangUp:(BOOL)isManual end:(BOOL)isEndEduBigClass {
    [self restoreScreenOrientation];
    self.isHangUp = YES;
    [self.eduBCRoomViewModel stopSort];
    
    //User screen or whiteboard sharing
    if ([self.eduBCRoomViewModel.roomModel.share_user_id isEqualToString:self.eduBCRoomViewModel.localVideoSession.uid] && self.whiteBoardComponent.isSharing == NO) {
        [self stopScreenShare];
    }
    //User whiteboard sharing
    [self.whiteBoardComponent destroy];
    //socket api end/leave EduBigClass
    if (isEndEduBigClass) {
        [self.eduBCRoomViewModel endRoom];
    } else {
        [self.eduBCRoomViewModel leaveRoom];
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
        EduBCUserListViewModel *viewModel = [[EduBCUserListViewModel alloc] initWithLocalVideoSeesion:self.eduBCRoomViewModel.localVideoSession userList:self.eduBCRoomViewModel.sortUserLists];
        EduBCUserListViewController *eduBCUserListViewController = [[EduBCUserListViewController alloc] initWithViewModel:viewModel];
        self.userListViewControllr = eduBCUserListViewController;
        [self.navigationController pushViewController:eduBCUserListViewController animated:YES];
    }
}

- (void)timeChange:(NSInteger)time {
    if (self.recordSecond == 0 && self.eduBCRoomViewModel.roomModel.record_status == YES) {
        self.recordSecond = time;
    } else if (self.eduBCRoomViewModel.roomModel.record_status == NO) {
        self.recordSecond = 0;
    } else if (time - self.recordSecond >= MaxEduBigClassRecordLimitedTimeInSecs) {
        self.recordSecond = 0;
        if (self.eduBCRoomViewModel.localVideoSession.isHost) {
            [self.eduBCRoomViewModel stopRecord];
        }
        NSInteger recordMax = MaxEduBigClassRecordLimitedTimeInSecs / 60;
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
    
    NSString *roomId = self.eduBCRoomViewModel.roomModel.wb_room_id;
    NSString *uid = self.eduBCRoomViewModel.roomModel.wb_user_id;
    NSString *token = self.eduBCRoomViewModel.roomModel.wb_token;
    
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
    [self.view addSubview:self.speakerView];
    [self.view addSubview:self.screenView];
    [self.view addSubview:self.whiteBoardContainerView];
    [self.view addSubview:self.collectionView];
    [self.view addSubview:self.paramInfoView];
    [self.view addSubview:self.bottomView];
    [self.view addSubview:self.micButton];

    @weakify(self);
    
    [self.bgView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.view);
    }];

    [self.collectionView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.bottom.right.equalTo(self.bgView);
        make.width.mas_equalTo(180);
    }];
    
    [self.speakerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(55);
        make.left.right.equalTo(self.bgView);
        make.bottom.equalTo(self.bottomView.mas_top);
    }];
    
    [self.screenView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(55);
        make.left.equalTo(self.bgView);
        make.right.equalTo(self.collectionView.mas_left);
        make.bottom.equalTo(self.bgView);
    }];
    
    [self.bottomView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.equalTo(self.bgView);
        make.bottom.equalTo(self.bgView);
        make.height.mas_equalTo(128/2 + [DeviceInforTool getVirtualHomeHeight]);
    }];
    
    [self.whiteBoardContainerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.left.top.equalTo(self.bgView);
        make.right.equalTo(self.collectionView.mas_left);
    }];

    [self.paramInfoView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.bgView);
        make.bottom.equalTo(self.bottomView.mas_top);
        make.width.mas_equalTo(150.f);
        make.height.mas_equalTo(16 * 16 + 10 + 10);
    }];
    
    self.paramInfoView.hidden = ![EduBCSettingsService getOpenParam];
    
    [self.micButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.equalTo(self.collectionView.mas_left);
        make.bottom.equalTo(self.collectionView);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(128), FIGMA_SCALE(128)));
    }];
}

- (void)showEndView:(UIView *)anchorView {
    if (self.eduBCRoomViewModel.sortUserLists.count == 1) {
        [self hangUp:YES end:self.eduBCRoomViewModel.localVideoSession.isHost];
    } else {
        [self.endComponent showAt:anchorView withStatus:self.eduBCRoomViewModel.localVideoSession.isHost ? EduBigClassEndStatusHost : EduBigClassEndStatusNone];
        __weak __typeof(self) wself = self;
        self.endComponent.clickButtonBlock = ^(EduBigClassButtonStatus status) {
            if (status == EduBigClassButtonStatusEnd ||
                status == EduBigClassButtonStatusLeave) {
                [wself hangUp:YES end:(status == EduBigClassButtonStatusEnd)];
            } else if (status == EduBigClassButtonStatusCancel) {
                //cancel
            }
            wself.endComponent = nil;
        };
    }
}

- (void)exitRoom {
    [self setAllowAutoRotate:ScreenOrientationLandscapeAndPortrait];
    [self hangUp:YES end:NO];
}

#pragma mark - getter

- (EduBCRoomBottomView *)bottomView {
    if (!_bottomView) {
        EduBCRoomBottomViewModel *viewModel = [[EduBCRoomBottomViewModel alloc] initWithVideoSession:self.eduBCRoomViewModel.localVideoSession withRoomModel:self.eduBCRoomViewModel.roomModel];
        _bottomView = [[EduBCRoomBottomView alloc] initWithViewModel:viewModel];
        @weakify(self);
        [_bottomView setUserListClickBlock:^(EduBCRoomBottomView * _Nonnull sender) {
            @strongify(self);
            [self joinUserControllor:NO];
        }];
        [_bottomView setScreenShareClickBlock:^(EduBCRoomBottomView * _Nonnull sender) {
            @strongify(self);
            [self startScreenShare];
        }];
        [_bottomView setWhiteboardShareClickBlock:^(EduBCRoomBottomView * _Nonnull sender) {
            @strongify(self);
            [self.eduBCRoomViewModel startShare:kShareTypeWhiteBoard];
        }];
    }
    return _bottomView;
}

- (EduBCRoomParamInfoView *)paramInfoView {
    if (!_paramInfoView) {
        _paramInfoView = [[EduBCRoomParamInfoView alloc] init];
        _paramInfoView.backgroundColor = [UIColor clearColor];
        _paramInfoView.hidden = YES;
    }
    return _paramInfoView;
}

- (EduBCRoomCollectionView *)collectionView {
    if (!_collectionView) {
        _collectionView = [[EduBCRoomCollectionView alloc] initWithFrame:self.bgView.frame];
    }
    return _collectionView;
}

- (EduBCRoomSpeakerView *)speakerView {
    if (!_speakerView) {
        _speakerView = [[EduBCRoomSpeakerView alloc] init];
        _speakerView.hidden = YES;
    }
    return _speakerView;
}

- (EduBCRoomScreenView *)screenView {
    WeakSelf
    
    if (!_screenView) {
        _screenView = [[EduBCRoomScreenView alloc] init];
        _screenView.hidden = YES;
        _screenView.isVertical = NO;
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

- (EduBigClassEndComponent *)endComponent {
    if (!_endComponent) {
        _endComponent = [[EduBigClassEndComponent alloc] init];
    }
    return _endComponent;
}

- (EduBigClassScreenComponent *)screenComponent {
    if (!_screenComponent) {
        _screenComponent = [[EduBigClassScreenComponent alloc] init];
    }
    return _screenComponent;
}

- (EduBigClassWhiteBoardComponent *)whiteBoardComponent {
    if (!_whiteBoardComponent) {
        EduBCWhiteBoardViewModel *viewModel = [[EduBCWhiteBoardViewModel alloc] initWithVideoSession:self.eduBCRoomViewModel.localVideoSession withRoomModel:self.eduBCRoomViewModel.roomModel];
        
        EduBCRoomWhiteBoardView *whiteBoardView = [[EduBCRoomWhiteBoardView alloc] initWithViewModel:viewModel];
        
        _whiteBoardComponent = [[EduBigClassWhiteBoardComponent alloc] initWithwhiteBoardView:whiteBoardView superView:self.whiteBoardContainerView];
        
        _whiteBoardComponent.isLandscape = YES;
    }
    return _whiteBoardComponent;
}

- (void)dealloc {
    [UIApplication sharedApplication].idleTimerDisabled = NO;
    self.eduBCRoomViewModel.needHangUp = YES;
}

- (UIView *)whiteBoardContainerView {
    if(!_whiteBoardContainerView) {
        _whiteBoardContainerView = [[UIView alloc] init];
        _whiteBoardContainerView.hidden = YES;
    }
    return _whiteBoardContainerView;
}

- (BaseButton *)micButton {
    if (!_micButton) {
        _micButton = [[BaseButton alloc] init];
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_par_link_mic"] status:ButtonStatusNone];
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_par_link_mic_i"]  status:ButtonStatusActive];
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_par_link_mic_s"] status:ButtonStatusIng];
        _micButton.imageView.contentMode = UIViewContentModeScaleAspectFit;
        WeakSelf
        [_micButton setBtnClickBlock:^(id  _Nonnull sender) {
            if (wself.micButton.status == ButtonStatusNone) {
                [wself.eduBCRoomViewModel turnOnMic:YES];
            } else if (wself.micButton.status == ButtonStatusIng) {
                [wself.eduBCRoomViewModel turnOnMic:NO];
            } else {
                
            }
            
        }];
    }
    return _micButton;
}
@end
