//
//  EduBreakoutClassViewController.m
//  veRTC_Demo
//
//  Created by on 2021/8/4.
//  
//

#import "EduBreakoutClassViewController+Socket.h"
#import "EduBreakoutClassViewController.h"
#import "EduBreakoutRTCManager.h"
#import "EduClassCpmponents.h"
#import "EduEndComponent.h"
#import "EduRTMStudentManager.h"
#import "UIViewController+Orientation.h"
#import "NetworkingTool.h"

@interface EduBreakoutClassViewController ()
@property (nonatomic, strong) UIView *safeAreaView;
@property (nonatomic, strong) BaseButton *leftButton;

@property (nonatomic, strong) EduClassTitleView *titleView;
@property (nonatomic, strong) EduClassScreenView *screenView;
@property (nonatomic, strong) EduClassLiveView *teacherLiveView;
@property (nonatomic, strong) EduClassLiveView *myLiveView;
@property (nonatomic, strong) EduClassChatView *chatView;
@property (nonatomic, strong) EduClassStudentListView *studentListView;
@property (nonatomic, strong) EduClassStudentsScrollView *groupListView;
@property (nonatomic, strong) EduClassGroupSpeechView *groupSpeechView;
@property (nonatomic, strong) EduEndComponent *exitAlertView;
@property (nonatomic, strong) UIButton *showStudentsButton;
@property (nonatomic, strong) EduUserModel *teacherModel;

@property (nonatomic, strong) UIButton *touchBarButton;
@end

@implementation EduBreakoutClassViewController
- (void)dealloc {
    NSLog(@"%@,%s", [NSThread currentThread], __func__);
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)init {
    self = [super init];
    if (self) {
        [self setAllowAutoRotate:ScreenOrientationLandscape];
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationBecomeActive) name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationEnterBackground) name: UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSUserDefaults standardUserDefaults] setObject:@"EduBreakoutRTCManager" forKey:@"KEduBreakoutRTCManager"];
    [[NSUserDefaults standardUserDefaults]synchronize];
    [self addOrientationNotice];
    [self buildUI];
    [self addSocketListener];
    [self joinClass];
}

- (void)buildUI {
    self.view.backgroundColor = [UIColor colorFromHexString:@"#1D2129"];
    [self.view addSubview:self.safeAreaView];
    [self.safeAreaView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.top.right.equalTo(self.view);
      make.left.mas_equalTo([DeviceInforTool getSafeAreaInsets].left);
      make.bottom.mas_equalTo(-[DeviceInforTool getSafeAreaInsets].bottom);
    }];

    [self.safeAreaView addSubview:self.teacherLiveView];
    [self.teacherLiveView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.top.equalTo(self.safeAreaView).offset(8);
      make.right.equalTo(self.safeAreaView).offset(-8);
      make.height.equalTo(self.safeAreaView.mas_height).multipliedBy(0.3);
      make.width.equalTo(self.safeAreaView.mas_height).multipliedBy(0.4);
    }];

    [self.safeAreaView addSubview:self.myLiveView];
    [self.myLiveView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.left.width.height.equalTo(self.teacherLiveView);
      make.top.equalTo(self.teacherLiveView.mas_bottom).offset(8);
    }];

    [self.safeAreaView addSubview:self.chatView];
    [self.chatView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.left.right.equalTo(self.teacherLiveView);
      make.top.equalTo(self.myLiveView.mas_bottom).offset(8);
      make.bottom.equalTo(self.safeAreaView).offset(-8);
    }];

    [self.safeAreaView addSubview:self.screenView];
    [self.screenView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.top.left.bottom.equalTo(self.safeAreaView);
      make.right.equalTo(self.teacherLiveView.mas_left).offset(-8);
    }];

    [self.safeAreaView addSubview:self.groupListView];
    [self.groupListView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.left.mas_equalTo(8);
      make.bottom.mas_equalTo(-12);
      make.height.mas_equalTo(80);
      make.right.lessThanOrEqualTo(self.screenView.mas_right).offset(-8);
    }];

    [self.safeAreaView addSubview:self.touchBarButton];
    [self.touchBarButton mas_makeConstraints:^(MASConstraintMaker *make) {
      make.top.left.right.equalTo(self.safeAreaView);
      make.height.mas_equalTo(60);
    }];

    [self.safeAreaView addSubview:self.leftButton];
    [self.leftButton mas_makeConstraints:^(MASConstraintMaker *make) {
      make.height.width.mas_equalTo(20);
      make.left.mas_equalTo(16);
      make.top.mas_equalTo(22);
    }];

    [self.safeAreaView addSubview:self.titleView];
    [self.titleView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.left.equalTo(self.leftButton.mas_right).offset(10);
      make.right.equalTo(self.safeAreaView).offset(-10);
      make.centerY.equalTo(self.leftButton);
      make.height.mas_equalTo(60);
    }];

    [self showTitleView:@(YES)];
}

- (void)viewSafeAreaInsetsDidChange {
    [super viewSafeAreaInsetsDidChange];

    [self.safeAreaView mas_updateConstraints:^(MASConstraintMaker *make) {
      make.top.right.equalTo(self.view);
      make.left.mas_equalTo([DeviceInforTool getSafeAreaInsets].left);
      make.bottom.mas_equalTo(-[DeviceInforTool getSafeAreaInsets].bottom);
    }];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    [self setDeviceInterfaceOrientation:UIDeviceOrientationLandscapeLeft];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];

    if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)]) {
        self.navigationController.interactivePopGestureRecognizer.enabled = NO;
    }
}

- (void)viewWillDisappear:(BOOL)animated {
    [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
    [super viewWillDisappear:animated];
    if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)]) {
        self.navigationController.interactivePopGestureRecognizer.enabled = YES;
    }
}

#pragma mark - privateAction

- (void)joinClass {
    [[PublicParameterComponent share] setRoomId:self.roomModel.roomId];
    WeakSelf;
    [EduRTMStudentManager joinClass:self.roomModel.roomId roomType:NO block:^(EduClassModel *classModel) {
        if(classModel.ackModel.result){
            [wself joinClassWith:(EduBreakoutClassModel *)classModel];
        } else {
            [wself leaveClass];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                AlertActionModel *alertModel = [[AlertActionModel alloc] init];
                alertModel.title = @"确定";
                [[AlertActionManager shareAlertActionManager] showWithMessage:classModel.ackModel.message actions:@[alertModel]];
                NSLog(@"join faild error = %@", classModel.ackModel.message);
                
            });
        }
    }];
}

- (void)joinClassWith:(EduBreakoutClassModel *)classModel {
    self.titleView.inClass = classModel.roomModel.status;
    self.titleView.recordTime = classModel.roomModel.beginClassTimeReal;

    self.studentListView.roomId = classModel.roomModel.roomId;

    [[EduBreakoutRTCManager shareRtc] createEngine:classModel.roomModel.appId];
    
    __weak __typeof(self) wself = self;
    [EduBreakoutRTCManager shareRtc].rtcJoinRoomBlock = ^(NSString * _Nonnull roomId, NSInteger errorCode, NSInteger joinType) {
        if (joinType != 0 && errorCode == 0) {
            [wself eduReconnect];
        }
    };
    
    [[EduBreakoutRTCManager shareRtc] joinHostRoomWithToken:classModel.token roomID:self.roomModel.roomId uid:[LocalUserComponent userModel].uid];

    [[EduBreakoutRTCManager shareRtc] joinGroupRoomWithToken:classModel.groupRtcToken roomID:classModel.groupRoomId uid:[LocalUserComponent userModel].uid];

    self.teacherModel = classModel.teacherUserModel;
    self.teacherLiveView.name = classModel.teacherUserModel.name;
    [self changeTeacherMicStatus:classModel.teacherUserModel.isMicOn];
    [self changeTeacherCameraStatus:classModel.teacherUserModel.isCameraOn];

    EduUserModel *myModel;
    NSMutableArray *groupList = classModel.groupUserList.mutableCopy;
    for (EduUserModel *model in classModel.groupUserList) {
        if ([model.uid isEqualToString:[LocalUserComponent userModel].uid]) {
            myModel = model;
            [groupList removeObject:model];
        }
    }

    if (classModel.roomModel.enableInteractive) {
        [self changeVideoInteract:YES];

        if (classModel.selfMicOn) {
            [self approveMic:YES];
        } else {
            [self.myLiveView startPreview:myModel];
            self.myLiveView.name = myModel.name;
        }

        self.studentListView.studnetArray = classModel.micUserList;
    } else {
        if (classModel.roomModel.enableGroupSpeech) {
            [self changeGroupSpeech:YES];
        }

        [self.myLiveView startPreview:myModel];
        self.myLiveView.name = myModel.name;
    }

    [self loadDataWithGetUserList];
}

- (void)loadDataWithGetUserList {
    __weak __typeof(self) wself = self;
    [EduRTMManager getUserListWithblock:^(NSArray * _Nonnull groupUserList,
                                          RTMACKModel * _Nonnull model) {
        NSMutableArray *list = [groupUserList mutableCopy];
        for (EduUserModel *model in list) {
            if ([model.uid isEqualToString:[LocalUserComponent userModel].uid]) {
                [list removeObject:model];
                break;
            }
        }
        wself.groupListView.studnetArray = [list copy];
    }];
}

- (void)touchBarClicked:(UIButton *)button {
    [self showTitleView:@(YES)];
}

- (void)showSpeechView:(BOOL)show {
    if (show == YES) {
        [self.safeAreaView addSubview:self.groupSpeechView];
        [self.groupSpeechView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.top.mas_equalTo(16);
          make.centerX.equalTo(self.screenView);
          make.width.mas_equalTo(230);
          make.height.mas_equalTo(80);
        }];
    } else {
        [self.groupSpeechView removeFromSuperview];
        self.groupSpeechView = nil;
    }
    [self.groupListView joinCollectiveSpeech:show];
    [self.myLiveView joinCollectiveSpeech:show];
}

- (void)showVideoInteractView:(BOOL)show {
    if (show == YES) {
        [self.safeAreaView addSubview:self.showStudentsButton];
        [self.showStudentsButton mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerX.equalTo(self.screenView);
          make.bottom.equalTo(self.groupListView.mas_top).offset(-10);
          make.width.mas_equalTo(152);
          make.height.mas_equalTo(32);
        }];

        [self.safeAreaView addSubview:self.studentListView];
        [self.studentListView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.equalTo(self.groupListView);
          make.bottom.equalTo(self.groupListView.mas_top).offset(-10);
          make.height.mas_equalTo(180);

          make.right.lessThanOrEqualTo(self.screenView.mas_right).offset(-8);
        }];
        self.showStudentsButton.hidden = YES;
    } else {
        BOOL isOnMic = NO;
        for (EduUserModel *onMicUserModel in self.studentListView.studnetArray) {
            if ([onMicUserModel.uid isEqualToString:[LocalUserComponent userModel].uid]) {
                isOnMic = YES;
                break;
            }
        }
        [self.groupListView leavePodiumAllUserModel];
        [self.studentListView removeFromSuperview];
        [self.showStudentsButton removeFromSuperview];
        self.studentListView = nil;
        self.showStudentsButton = nil;
        if (isOnMic) {
            [self approveMic:NO];
        }
    }
}

- (void)showTitleView:(NSNumber *)show {
    if (show.boolValue) {
        self.touchBarButton.userInteractionEnabled = NO;
        self.leftButton.hidden = NO;
        self.titleView.hidden = NO;
        [self performSelector:@selector(showTitleView:) withObject:@(NO) afterDelay:5.0];
    } else {
        self.touchBarButton.userInteractionEnabled = YES;
        self.leftButton.hidden = YES;
        self.titleView.hidden = YES;
    }
}

- (void)navBackAction:(UIButton *)sender {
    EduEndComponent *endComponent = [[EduEndComponent alloc] init];
    [endComponent showWithStatus:EduEndStatusStudent];
    self.exitAlertView = endComponent;

    __weak __typeof(self) wself = self;
    [endComponent setClickButtonBlock:^(EduButtonStatus status) {
      if (status == EduButtonStatusLeave) {
          [wself leaveClass];
      }
    }];
}

- (void)showStudentLists:(UIButton *)button {
    self.studentListView.hidden = NO;
    self.showStudentsButton.hidden = YES;
}

#pragma mark - Reconnect
- (void)eduReconnect {
    
    __weak __typeof(self) wself = self;
    [EduRTMManager reconnectWithBlock:^(RTMACKModel * _Nonnull model) {
        NSString *type = @"";
        if (model.result) {
            type = @"resume";
        } else if (model.code == RTMStatusCodeUserIsInactive ||
                   model.code == RTMStatusCodeRoomDisbanded ||
                   model.code == RTMStatusCodeUserNotFound ||
                   model.code == 500) {
            type = @"exit";
        } else {
            
        }
        if (type.length > 0) {
            NSDictionary *dic = @{@"type" : type ?: @""};
            [wself educontrolChange:dic];
        }
    }];
}

- (void)educontrolChange:(NSDictionary *)dic {
    if ([dic isKindOfClass:[NSDictionary class]]) {
        NSString *type = dic[@"type"];
        if ([type isEqualToString:@"resume"]) {
            [self joinClass];
        } else if ([type isEqualToString:@"exit"]) {
            [self leaveClass];
        } else {
        }
    }
}

#pragma mark - NSNotification

- (void)applicationBecomeActive {
    // APP 恢复活跃状态时，如果是开启相机状态需要恢复相机采集。
    // When the APP returns to the active state, if the camera is turned on, the camera acquisition needs to be resumed.
    if ([[EduBreakoutRTCManager shareRtc] currentCameraState]) {
        [[EduBreakoutRTCManager shareRtc] enableLocalVideo:YES];
    }
}

- (void)applicationEnterBackground {
    [[EduBreakoutRTCManager shareRtc] enableLocalVideo:NO];
}

#pragma mark - Broadcast Notification Action

- (void)onClassBegin:(NSInteger)timestamp {
    self.titleView.inClass = YES;
    self.titleView.recordTime = timestamp;
}

- (void)leaveClass {
    [self setAllowAutoRotate:ScreenOrientationPortrait];
    [EduRTMStudentManager leaveClass:self.roomModel.roomId
                                      block:^(RTMACKModel *_Nonnull model){
                                          
                                      }];

    [[EduBreakoutRTCManager shareRtc] leaveChannel];

    [NSObject cancelPreviousPerformRequestsWithTarget:self];

    [self.navigationController popViewControllerAnimated:YES];
}

- (void)changeGroupSpeech:(BOOL)open {
    [self showSpeechView:open];
    [[EduBreakoutRTCManager shareRtc] openGroupSpeech:open];
}

- (void)changeVideoInteract:(BOOL)open {
    [self showVideoInteractView:open];
}

- (void)changeTeacherMicStatus:(BOOL)open {
    self.teacherLiveView.audioClosed = !open;
}

- (void)changeTeacherCameraStatus:(BOOL)open {
    self.teacherLiveView.videoClosed = !open;
    if (open) {
        [self.teacherLiveView startPreview:self.teacherModel];
    }
}

- (void)changeTeacherRoomStatus:(BOOL)join userName:(NSString *)userName {
    if (join) {
        self.teacherLiveView.name = userName;
    } else {
        self.teacherLiveView.name = @"";
    }
}

- (void)changeStudentGroupStatusUid:(NSString *)uid name:(NSString *)userName join:(BOOL)join {
    if (join) {
        [self addGroupUser:uid name:userName];
    } else {
        [self removeGroupUser:uid];
    }
}

- (void)addGroupUser:(NSString *)uid name:(NSString *)name {
    if ([uid isEqualToString:[LocalUserComponent userModel].uid]) {
        return;
    }
    //lock
    EduUserModel *userModel = [[EduUserModel alloc] initWithUid:uid];
    userModel.roomType = EduUserRoomTypeBreakoutGroup;
    userModel.name = name;

    NSMutableArray *list = [self.groupListView.studnetArray mutableCopy];
    BOOL exsit = NO;

    for (EduUserModel *userModel in list) {
        if ([userModel.uid isEqualToString:uid]) {
            exsit = YES;
            break;
        }
    }
    if (exsit == NO) {
        [list addObject:userModel];
    }

    self.groupListView.studnetArray = [list copy];
}

- (void)removeGroupUser:(NSString *)uid {
    EduUserModel *deleteModel = nil;
    for (int i = 0; i < self.groupListView.studnetArray.count; i++) {
        EduUserModel *model = self.groupListView.studnetArray[i];
        if ([model.uid isEqualToString:uid]) {
            deleteModel = model;
            break;
        }
    }
    if (deleteModel) {
        NSMutableArray *list = [self.groupListView.studnetArray mutableCopy];
        [list removeObject:deleteModel];
        self.groupListView.studnetArray = [list copy];
    }
}

- (void)changeStudentMic:(BOOL)open uid:(NSString *)uid name:(NSString *)userName {
    EduUserModel *userModel = [[EduUserModel alloc] initWithUid:uid];
    userModel.roomType = EduUserRoomTypeBreakoutHost;
    userModel.name = userName;

    if (open) {
        [self.studentListView addUser:userModel];
        self.studentListView.hidden = NO;
        self.showStudentsButton.hidden = YES;
        [self.groupListView joinPodium:userModel];
    } else {
        [self.studentListView removeUser:userModel];
        [self.groupListView leavePodium:userModel];
    }
    
    if ([uid isEqualToString:[LocalUserComponent userModel].uid]) {
        self.myLiveView.isMicOn = open;
    }
}

- (void)approveMic:(BOOL)isOn {
    [[EduBreakoutRTCManager shareRtc] openVideoInteract:isOn];

    if (isOn == NO) {
        EduUserModel *myModel = [[EduUserModel alloc] init];
        myModel.uid = [LocalUserComponent userModel].uid;
        myModel.roomType = EduUserRoomTypeBreakoutGroup;
        [self.myLiveView startPreview:myModel];
        self.myLiveView.name = myModel.name;
        self.myLiveView.isMicOn = isOn;
    }
}

#pragma mark - getter

- (BaseButton *)leftButton {
    if (!_leftButton) {
        _leftButton = [[BaseButton alloc] init];
        [_leftButton setImage:[UIImage imageNamed:@"edu_nav_left" bundleName:HomeBundleName] forState:UIControlStateNormal];
        _leftButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        [_leftButton addTarget:self action:@selector(navBackAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _leftButton;
}

- (EduClassTitleView *)titleView {
    if (_titleView == nil) {
        _titleView = [[EduClassTitleView alloc] init];
        _titleView.classTitle = self.roomModel.roomName;
        _titleView.classID = self.roomModel.roomId;
        _titleView.inClass = self.roomModel.status;
        _titleView.recordTime = self.roomModel.beginClassTimeReal;
    }
    return _titleView;
}

- (EduClassScreenView *)screenView {
    if (_screenView == nil) {
        _screenView = [[EduClassScreenView alloc] init];
        _screenView.backgroundColor = [UIColor clearColor];
        _screenView.userInteractionEnabled = NO;
    }
    return _screenView;
}

- (EduClassLiveView *)teacherLiveView {
    if (_teacherLiveView == nil) {
        _teacherLiveView = [[EduClassLiveView alloc] init];
        _teacherLiveView.audioClosed = NO;
        _teacherLiveView.videoClosed = NO;
    }
    return _teacherLiveView;
}

- (EduClassChatView *)chatView {
    if (_chatView == nil) {
        _chatView = [[EduClassChatView alloc] init];
    }
    return _chatView;
}

- (EduClassGroupSpeechView *)groupSpeechView {
    if (!_groupSpeechView) {
        _groupSpeechView = [[EduClassGroupSpeechView alloc] init];
    }
    return _groupSpeechView;
}

- (EduEndComponent *)exitAlertView {
    if (!_exitAlertView) {
        _exitAlertView = [[EduEndComponent alloc] init];
    }
    return _exitAlertView;
}

- (UIButton *)showStudentsButton {
    if (!_showStudentsButton) {
        _showStudentsButton = [[UIButton alloc] init];
        _showStudentsButton.hidden = YES;
        _showStudentsButton.backgroundColor = [UIColor colorFromRGBAHexString:@"#272E3B"];
        [_showStudentsButton setImage:[UIImage imageNamed:@"edu_class_vector" bundleName:HomeBundleName] forState:UIControlStateNormal];
        [_showStudentsButton addTarget:self action:@selector(showStudentLists:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _showStudentsButton;
}

- (EduClassStudentListView *)studentListView {
    if (!_studentListView) {
        _studentListView = [[EduClassStudentListView alloc] init];
        _studentListView.roomId = self.roomModel.roomId;
        _studentListView.studnetArray = @[];
        WeakSelf;
        [_studentListView setHideButtonClicked:^{
          wself.showStudentsButton.hidden = NO;
        }];
    }
    return _studentListView;
}

- (EduClassLiveView *)myLiveView {
    if (!_myLiveView) {
        _myLiveView = [[EduClassLiveView alloc] init];
    }
    return _myLiveView;
}

- (EduClassStudentsScrollView *)groupListView {
    if (!_groupListView) {
        _groupListView = [[EduClassStudentsScrollView alloc] init];
    }
    return _groupListView;
}

- (UIView *)safeAreaView {
    if (!_safeAreaView) {
        _safeAreaView = [[UIView alloc] init];
    }
    return _safeAreaView;
}

- (UIButton *)touchBarButton {
    if (!_touchBarButton) {
        _touchBarButton = [[UIButton alloc] init];
        [_touchBarButton addTarget:self action:@selector(touchBarClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _touchBarButton;
}
@end
