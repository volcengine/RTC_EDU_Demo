#import "SettingsService.h"
#import "EduSCUserListViewController.h"
#import "EduSCPermitManager.h"

@interface EduSCUserListViewController () <UITableViewDelegate, UITableViewDataSource, UIScrollViewDelegate>

@property (nonatomic, strong) UITableView *settingsTableView;
@property (nonatomic, strong) BaseButton *muteAllButton;

@end

@implementation EduSCUserListViewController

- (instancetype)initWithViewModel:(EduSCUserListViewModel *)viewModel {
    self = [super init];
    if (self) {
        self.viewModel = viewModel;
    }
    return self;
}

- (void)setViewModel:(EduSCUserListViewModel *)viewModel {
    _viewModel = viewModel;
    
    [self.settingsTableView reloadData];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    self.view.backgroundColor = [ThemeManager backgroundColor];
    
    [self.view addSubview:self.muteAllButton];
    [self.muteAllButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.width.mas_equalTo(343);
        make.height.mas_equalTo(44);
        make.centerX.equalTo(self.view);
        make.bottom.equalTo(self.view).offset(-[DeviceInforTool getVirtualHomeHeight] - 32/2);
    }];
    
    [self.view addSubview:self.settingsTableView];
    [self.settingsTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.equalTo(self.view);
        make.top.equalTo(self.navView.mas_bottom);
        if (self.viewModel.localVideoSession.isHost) {
            make.bottom.equalTo(self.muteAllButton.mas_top).offset(-32/2);
        } else {
            make.bottom.equalTo(self.view);
        }
    }];
    
    self.muteAllButton.hidden = !self.viewModel.localVideoSession.isHost;
}

#pragma mark - Action Method

- (void)muteAllButtonAction {
    [EduSCPermitManager muteAllUser];
}

#pragma mark - UITableViewDelegate

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    EduSCUserListCell *cell = [tableView dequeueReusableCellWithIdentifier:@"EduSCUserListCellID" forIndexPath:indexPath];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.videoSession = [self.viewModel.videoSessions objectAtIndex:indexPath.row];
    cell.isShareHand = cell.videoSession.isRequestShare;
    cell.isMicHand = cell.videoSession.isRequestMic;
    __weak __typeof(cell) weakCell = cell;
    [cell setDeleteShareBlock:^(id  _Nonnull sender) {
        weakCell.videoSession.isRequestShare = NO;
    }];
    [cell setDeleteMicBlock:^(id  _Nonnull sender) {
        weakCell.videoSession.isRequestMic = NO;
    }];
    WeakSelf
    if (self.viewModel.localVideoSession.isHost && [cell.videoSession.uid isEqualToString:self.viewModel.localVideoSession.uid]) {
        [cell enableUserControl:self.viewModel.localVideoSession.isHost block:^(EduSCRoomVideoSession *session, int ctrl) {
            if (ctrl == kUserCtrlAudio) {
                BOOL isOpenAudio = session.isEnableAudio;
                [EduSCPermitManager enableMic:!isOpenAudio];
            } else if (ctrl == kUserCtrlVideo) {
                BOOL isOpenVideo = session.isEnableVideo;
                [EduSCPermitManager enableCamera:!isOpenVideo];
            }
        }];
    } else if (self.viewModel.localVideoSession.isHost || ![cell.videoSession.uid isEqualToString:self.viewModel.localVideoSession.uid]) {
        [cell enableUserControl:self.viewModel.localVideoSession.isHost block:^(EduSCRoomVideoSession *session, int ctrl) {
            if (ctrl == kUserCtrlAudio) {
                [wself muteUserOrAskMic:session];
            } else if (ctrl == kUserCtrlVideo) {
                [wself muteUserOrAskCam:session];
            } else if (ctrl == kUserCtrlShare) {
                [wself muteUserOrAskShare:session];
            }
        }];
    } else {
        [cell enableUserControl:YES block:^(EduSCRoomVideoSession *session, int ctrl) {
            if (ctrl == kUserCtrlAudio) {
                BOOL isOpenAudio = !session.isEnableAudio;
               
                if (isOpenAudio && !wself.viewModel.localVideoSession.hasOperatePermission) {
                    [EduSCPermitManager enableMicRequestWithUid:wself.viewModel.localVideoSession.uid block:nil];
                } else {
                    [EduSCPermitManager enableMic:isOpenAudio];
                }
                
            } else if (ctrl == kUserCtrlVideo) {
                BOOL isOpenVideo = session.isEnableVideo;
                [EduSCPermitManager enableCamera:!isOpenVideo];
            } else if (ctrl == kUserCtrlShare) {
                [wself muteUserOrAskShare:session];
            }
        }];
    }
    
    return cell;
}

#pragma mark - UITableViewDataSource

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.viewModel.videoSessions.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 127/2;
}

#pragma mark - Private Action
- (void)muteUserOrAskMic:(EduSCRoomVideoSession *)videoSession {
    BOOL isOpenAudio = videoSession.isEnableAudio;
    [EduSCPermitManager forceTurnOnOffMicOfUser:!isOpenAudio uid:videoSession.uid];
}

- (void)muteUserOrAskCam:(EduSCRoomVideoSession *)videoSession {
    BOOL isOpenVideo = videoSession.isEnableVideo;
    [EduSCPermitManager forceTurnOnOffCamOfUser:!isOpenVideo uid:videoSession.uid];
}

- (void)muteUserOrAskShare:(EduSCRoomVideoSession *)videoSession {
    BOOL isOpenShare = videoSession.hasSharePermission;
    if (self.viewModel.localVideoSession.isHost) {
        [EduSCPermitManager forceTurnOnOffShareOfUser:!isOpenShare uid:videoSession.uid];
    } else {
        if (isOpenShare) {
            [[ToastComponent shareToastComponent] showWithMessage:@"有共享权限"];
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:@"无共享权限"];
        }
    }
}

#pragma mark - getter

- (UITableView *)settingsTableView {
    if (!_settingsTableView) {
        _settingsTableView = [[UITableView alloc] init];
        _settingsTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _settingsTableView.delegate = self;
        _settingsTableView.dataSource = self;
        [_settingsTableView registerClass:[EduSCUserListCell class] forCellReuseIdentifier:@"EduSCUserListCellID"];
        _settingsTableView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _settingsTableView;
}

- (BaseButton *)muteAllButton {
    if (!_muteAllButton) {
        _muteAllButton = [[BaseButton alloc] init];
        [_muteAllButton addTarget:self action:@selector(muteAllButtonAction) forControlEvents:UIControlEventTouchUpInside];
        [_muteAllButton bingImage:[ThemeManager imageNamed:@"meeting_par_muteall"] status:ButtonStatusNone];
        _muteAllButton.backgroundColor = [ThemeManager buttonBackgroundColor];
        _muteAllButton.layer.masksToBounds = YES;
        _muteAllButton.layer.cornerRadius = 22;
        _muteAllButton.layer.borderColor = [ThemeManager buttonBorderColor].CGColor;
        _muteAllButton.layer.borderWidth = 1;
        _muteAllButton.imageEdgeInsets = UIEdgeInsetsMake(10, 0, 10, 0);
        _muteAllButton.imageView.contentMode = UIViewContentModeScaleAspectFit;
        _muteAllButton.hidden = YES;
    }
    return _muteAllButton;
}

@end
