#import "SystemAuthority.h"
#import "EduSCSettingsService.h"

#import "EduSmallClassLoginViewController.h"
#import "EduSCUnderlinedButtonBar.h"

#import "EduSmallClassRTCManager.h"
#import "EduSCRoomViewController.h"
#import "EduSCFeedbackView.h"
#import "EduSCRoomVideoSession.h"
#import "EduSmallClassRTMManager.h"

#define TEXTFIELD_MAX_LENGTH 18

@interface EduSmallClassLoginViewController () <UITextFieldDelegate>
@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) BaseButton *enableAudioBtn;
@property (nonatomic, strong) BaseButton *enableVideoBtn;
@property (nonatomic, strong) UIButton *enterRoomBtn;
@property (nonatomic, strong) BaseButton *navLeftButton;
@property (nonatomic, strong) UITextField *roomIdTextField;
@property (nonatomic, strong) UITextField *userIdTextField;
@property (nonatomic, strong) UILabel *verLabel;
@property (nonatomic, strong) UIImageView *emptImageView;
@property (nonatomic, strong) UIView *videoView;
@property (nonatomic, strong) UIView *maskView;
@property (nonatomic, strong) EduSCUnderlinedButtonBar* buttonBar;
@property (nonatomic, strong) BaseButton *createEduSmallClassBtn;
@property (nonatomic, strong) BaseButton *joinEduSmallClassBtn;
@property (nonatomic, strong) UIView *infoView;
@property (nonatomic, weak) EduSCFeedbackView *EduSCFeedbackView;
@property (nonatomic, strong) UILabel *titleLabel;

@property (nonatomic, strong) UITapGestureRecognizer *tap;
@property (nonatomic, copy) NSString *currentAppid;

@end

@implementation EduSmallClassLoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [ThemeManager contentBackgroundColor];
    [self initUIComponent];
    [self authorizationStatusMicAndCamera];
    
    NSString *sdkVer = [EduSmallClassRTCManager getSdkVersion];
    NSString *appVer = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    self.verLabel.text = [NSString stringWithFormat:@"App版本 v%@ / SDK版本 v%@", appVer, sdkVer];
    self.userIdTextField.text = [LocalUserComponent userModel].name;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardDidShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyBoardDidHide:) name:UIKeyboardWillHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] postNotificationName:NotificationJoinOrExit object:nil];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:NO];
    [UIApplication sharedApplication].statusBarStyle = ThemeManager.statusBarStyle;
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    [[EduSmallClassRTCManager shareRtc] updateRtcVideoParams];
    [[EduSmallClassRTCManager shareRtc] startPreview:self.videoView];
}

#pragma mark - 通知

- (void)applicationBecomeActive {
}

- (void)keyBoardDidShow:(NSNotification *)notifiction {
    CGRect keyboardRect = [[notifiction.userInfo objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];
    CGFloat btm = CGRectGetMaxY(self.enterRoomBtn.frame);
    CGFloat offset = CGRectGetMinY(keyboardRect) - btm - 22.f;
    if (offset < 0) {
        [UIView animateWithDuration:0.25 animations:^{
            [self.buttonBar mas_updateConstraints:^(MASConstraintMaker *make) {
                make.top.equalTo(self.view.mas_top).offset(self.view.height*5/16 + offset);
            }];
        }];
    }
    [self.view layoutIfNeeded];
}

- (void)keyBoardDidHide:(NSNotification *)notifiction {
    [UIView animateWithDuration:0.25 animations:^{
        [self.buttonBar mas_updateConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.view.mas_top).offset(self.view.height*5/16);
        }];
    }];
    [self.view layoutIfNeeded];
}

#pragma mark - Action Method

- (void)tapGestureAction:(id)sender {
    [self.roomIdTextField resignFirstResponder];
    [self.userIdTextField resignFirstResponder];
}

- (void)onClickEnterRoom:(UIButton *)sender {
    if (self.roomIdTextField.text.length <= 0 || self.userIdTextField.text.length <= 0) {
        if (self.roomIdTextField.text.length > 0) {
            [[ToastComponent shareToastComponent] showWithMessage:@"请输入昵称"];
        } else if (self.userIdTextField.text.length > 0) {
            [[ToastComponent shareToastComponent] showWithMessage:@"请输入房间ID"];
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:@"请输入房间ID"];
        }
        return;
    }
    if (self.roomIdTextField.text.length > 18 || self.userIdTextField.text.length > 18) {
        return;
    }
    BOOL checkRoomId = ![LocalUserComponent isMatchRoomID:self.roomIdTextField.text];
    if (checkRoomId) {
        return;
    }
    
    BOOL checkUserName = ![LocalUserComponent isMatchUserName:self.userIdTextField.text];
    if (checkUserName) {
        return;
    }
    
    __block EduSCRoomVideoSession *eduSCRoomVideoSession = [[EduSCRoomVideoSession alloc] initWithUid:[LocalUserComponent userModel].uid];
    eduSCRoomVideoSession.name = self.userIdTextField.text;
    eduSCRoomVideoSession.appid = self.currentAppid;
    eduSCRoomVideoSession.roomId = self.roomIdTextField.text;
    eduSCRoomVideoSession.isLoginUser = YES;
    eduSCRoomVideoSession.isEnableAudio = self.enableAudioBtn.status == ButtonStatusNone;
    eduSCRoomVideoSession.isEnableVideo = self.enableVideoBtn.status == ButtonStatusNone;
    eduSCRoomVideoSession.isHost = [self.buttonBar getSelectedButton] == self.createEduSmallClassBtn;
    eduSCRoomVideoSession.isSharingScreen = NO;
    eduSCRoomVideoSession.isSharingWhiteBoard = NO;
    
    [PublicParameterComponent share].roomId = eduSCRoomVideoSession.roomId;
    
    [[ToastComponent shareToastComponent] showLoading];
    __weak __typeof(self) wself = self;
    [EduSmallClassRTMManager joinEduSmallClass:eduSCRoomVideoSession block:^(int result, EduSmallClassControlRoomModel *roomModel, NSArray<EduSCRoomVideoSession *> *userLists) {
        if (result == 200) {
            [wself jumpToRoomVC:eduSCRoomVideoSession roomModel:roomModel userLists:userLists];
        } else {
            AlertActionModel *alertModel = [[AlertActionModel alloc] init];
            alertModel.title = @"确定";
            NSString *errMsg = @"";
            switch (result) {
                case 400:
                    errMsg = @"输入参数有误";
                    break;
                case 401:
                    errMsg = @"房间人数超过限制(1000)";
                    break;
                case 403:
                    errMsg = @"该房间已有其他老师";
                    break;
                case 410:
                    errMsg = @"没有操作权限，比如开启麦克风、开始共享时没有权限";
                    break;
                case 440:
                    errMsg = @"短信验证码过期";
                    break;
                case 441:
                    errMsg = @"短信验证码错误";
                    break;
                case 450:
                    errMsg = @"login_token 过期";
                    break;
                case 451:
                    errMsg = @"login_token 为空";
                    break;
                case 452:
                    errMsg = @"login_token与用户不匹配";
                    break;
                default:
                    errMsg = [NSString stringWithFormat:@"进房失败，错误码:%d", result];
                    break;
            }
            
            [[AlertActionManager shareAlertActionManager] showWithMessage:errMsg actions:@[alertModel]];
        }
        [[ToastComponent shareToastComponent] dismiss];
    }];
}

- (void)jumpToRoomVC:(EduSCRoomVideoSession *)localSession roomModel:(EduSmallClassControlRoomModel *)roomModel userLists:(NSArray<EduSCRoomVideoSession *> *)userLists {
    EduSCRoomViewController *roomVC = [[EduSCRoomViewController alloc] initWithLocalVideoSession:localSession withRoomModel:roomModel andUsers:userLists];
    UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:roomVC];
    navController.modalPresentationStyle = UIModalPresentationFullScreen;
    [self presentViewController:navController animated:YES completion:nil];
    __weak __typeof(self) wself = self;
    roomVC.closeRoomBlock = ^(BOOL isEnableAudio, BOOL isEnableVideo) {
        [wself closeRoomAction:isEnableAudio isEnableVideo:isEnableVideo];
    };
}

- (void)onClickEnableAudio:(BaseButton *)sender {
    if (sender.status != ButtonStatusIllegal) {
        sender.status = (sender.status == ButtonStatusActive) ? ButtonStatusNone : ButtonStatusActive;
    } else {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"确定";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            if ([action.title isEqualToString:@"确定"]) {
                [SystemAuthority autoJumpWithAuthorizationStatusWithType:AuthorizationTypeAudio];
            }
        };
        [[AlertActionManager shareAlertActionManager] showWithMessage:@"麦克风权限已关闭，请至设备设置页开启" actions:@[alertCancelModel, alertModel]];
    }
}

- (void)onClickEnableVideo:(BaseButton *)sender {
    if (sender.status != ButtonStatusIllegal) {
        sender.status = (sender.status == ButtonStatusActive) ? ButtonStatusNone : ButtonStatusActive;
        BOOL isEnableVideo = (sender.status == ButtonStatusActive) ? NO : YES;
        self.videoView.hidden = !isEnableVideo;
        self.emptImageView.hidden = isEnableVideo;
        [[EduSmallClassRTCManager shareRtc] resetPreview:isEnableVideo ? self.videoView : nil];
        [[EduSmallClassRTCManager shareRtc] enableLocalVideo:isEnableVideo];
    } else {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"确定";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            if ([action.title isEqualToString:@"确定"]) {
                [SystemAuthority autoJumpWithAuthorizationStatusWithType:AuthorizationTypeCamera];
            }
        };
        [[AlertActionManager shareAlertActionManager] showWithMessage:@"摄像头权限已关闭，请至设备设置页开启" actions:@[alertCancelModel, alertModel]];
    }
}

- (void)navBackAction:(BaseButton *)sender {
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - UITextField delegate

- (void)roomNumTextFieldChange:(UITextField *)textField {
    [self updateTextFieldChange:textField];
}

- (void)updateTextFieldChange:(UITextField *)textField {
    NSInteger tagNum = (self.roomIdTextField == textField) ? 3001 : 3002;
    UILabel *label = [self.view viewWithTag:tagNum];
    
    NSString *message = @"";
    BOOL isExceedMaximLength = NO;
    if (textField.text.length > TEXTFIELD_MAX_LENGTH) {
        isExceedMaximLength = YES;
    }
    
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(dismissErrorLabel:) object:textField];
    BOOL isIllegal = NO;
    if (self.userIdTextField == textField) {
        isIllegal = ![LocalUserComponent isMatchUserName:textField.text];;
    }
    if (self.roomIdTextField == textField) {
        isIllegal = ![LocalUserComponent isMatchRoomID:textField.text];
    }
    if (isIllegal) {
        message = @"请输入数字、英文字母或符号@_-";
        if (self.userIdTextField == textField) {
            message = @"请输入中文、数字、英文字母或符号@_-";
        }
        [self updateEnterRoomButtonColor:NO];
    } else if (isExceedMaximLength) {
        [self performSelector:@selector(dismissErrorLabel:) withObject:textField afterDelay:2];
        if (self.userIdTextField == textField) {
            message = @"昵称长度不能超过18位";
        } else {
            message = @"房间ID长度不能超过18位";
        }
        textField.text = [textField.text substringWithRange:NSMakeRange(0, 18)];
    } else {
        BOOL isEnterEnable = self.roomIdTextField.text.length > 0 && self.userIdTextField.text.length > 0 && self.roomIdTextField.text.length <= 18 && self.userIdTextField.text.length <= 18;
        [self updateEnterRoomButtonColor:isEnterEnable];
        message = @"";
    }
    label.text = message;
}

- (void)dismissErrorLabel:(UITextField *)textField {
    NSInteger tagNum = (self.roomIdTextField == textField) ? 3001 : 3002;
    UILabel *label = [self.view viewWithTag:tagNum];
    label.text = @"";
}

#pragma mark - Private Action

- (void)updateButtonColor:(UIButton *)button {
    [button setImageEdgeInsets:UIEdgeInsetsMake(11, 11, 11, 11)];
    button.imageView.contentMode = UIViewContentModeScaleAspectFit;
    button.backgroundColor = [UIColor colorWithWhite:1 alpha:0.1];
    button.layer.masksToBounds = YES;
    button.layer.cornerRadius = 44/2;
}

- (void)updateEnterRoomButtonColor:(BOOL)isEnable {
    if (!isEnable) {
        self.enterRoomBtn.userInteractionEnabled = NO;
        self.enterRoomBtn.backgroundColor = [UIColor colorFromRGBHexString:@"#165DFF" andAlpha:0.5 * 255];
        [self.enterRoomBtn setTitleColor:[UIColor colorFromRGBHexString:@"#ffffff" andAlpha:0.5 * 255] forState:UIControlStateNormal];
    } else {
        self.enterRoomBtn.userInteractionEnabled = YES;
        self.enterRoomBtn.backgroundColor = [UIColor colorFromHexString:@"#165DFF"];
        [self.enterRoomBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    }
}

- (void)addLineView:(UIView *)view {
    UIView *lineView = [[UIView alloc] init];
    lineView.backgroundColor = [UIColor colorFromHexString:@"#4E5969"];
    [self.view addSubview:lineView];
    [lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(630/2, 1));
        make.centerX.equalTo(self.view);
        make.top.mas_equalTo(view.mas_bottom).offset(0);
    }];
}

- (void)addErrorLabel:(UIView *)view tag:(NSInteger)tag {
    UILabel *label = [[UILabel alloc] init];
    label.tag = tag;
    label.text = @"";
    label.textColor = [UIColor colorFromHexString:@"#F53F3F"];
    [self.view addSubview:label];
    [label mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(view);
        make.top.mas_equalTo(view.mas_bottom).offset(4);
    }];
}

- (void)initUIComponent {
    [self.view addSubview:self.videoView];
    [self.videoView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.view);
    }];
    
    [self.view addSubview:self.maskView];
    [self.maskView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.view);
    }];
    [self.maskView addGestureRecognizer:self.tap];
    
    
    
    [self.view addSubview:self.navLeftButton];
    [self.navLeftButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(24, 24));
        make.top.mas_equalTo(48);
        make.left.mas_equalTo(16);
    }];
    
    [self.view addSubview:self.titleLabel];
    [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(100.f, 20.f));
        make.centerY.equalTo(self.navLeftButton.mas_centerY).offset(0);
        make.centerX.equalTo(self.view.mas_centerX).offset(0);
    }];
    
    [self.view addSubview:self.infoView];
    [self.infoView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(CGRectGetWidth(self.view.frame), 32.f));
        make.top.equalTo(self.view.mas_top).offset([DeviceInforTool getStatusBarHight] + 44);
        make.left.equalTo(self.view.mas_left);
    }];
    
    CGFloat editorW = 320;
    CGFloat editorH = 44;
    
    [self.view addSubview:self.buttonBar];
    [self.view addSubview:self.roomIdTextField];
    [self.view addSubview:self.userIdTextField];
    
    [self.buttonBar mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.roomIdTextField);
        make.top.equalTo(self.view.mas_top).offset(self.view.height*3/8);
    }];
    
    [self.roomIdTextField mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(editorW, editorH));
        make.centerX.equalTo(self.view);
        make.top.equalTo(self.buttonBar.mas_bottom).offset(24);
    }];
    
    [self.userIdTextField mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(editorW, editorH));
        make.centerX.equalTo(self.view);
        make.top.equalTo(self.roomIdTextField.mas_bottom).offset(24);
    }];
    
    [self addLineView:self.userIdTextField];
    [self addLineView:self.roomIdTextField];
    
    [self addErrorLabel:self.roomIdTextField tag:3001];
    [self addErrorLabel:self.userIdTextField tag:3002];
    
    [self.view addSubview:self.enterRoomBtn];
    [self.enterRoomBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(editorW, 100/2));
        make.centerX.equalTo(self.view);
        make.top.equalTo(self.userIdTextField.mas_bottom).offset(44);
    }];
    
    [self.view addSubview:self.enableAudioBtn];
    [self.enableAudioBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(44, 44));
        make.left.mas_equalTo(123/2);
        make.bottom.mas_equalTo(-120/2 - [DeviceInforTool getVirtualHomeHeight]);
    }];
    
    [self.view addSubview:self.enableVideoBtn];
    [self.enableVideoBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(44, 44));
        make.right.mas_equalTo(-123/2);
        make.bottom.mas_equalTo(-120/2 - [DeviceInforTool getVirtualHomeHeight]);
    }];
    
    [self.view addSubview:self.verLabel];
    [self.verLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.equalTo(self.view);
        make.bottom.equalTo(self.view).offset(-([DeviceInforTool getVirtualHomeHeight] + 20));
    }];
}

- (void)closeRoomAction:(BOOL)isEnableAudio isEnableVideo:(BOOL)isEnableVideo {
    /*if (!self.EduSCFeedbackView) {
        __block EduSCFeedbackView *EduSCFeedbackView = [[EduSCFeedbackView alloc] init];
        self.EduSCFeedbackView = EduSCFeedbackView;
        [EduSCFeedbackView show];
        EduSCFeedbackView.clickCancelBlock = ^{
            EduSCFeedbackView = nil;
        };
    }*/
    [self.videoView setHidden:!isEnableVideo];
    self.emptImageView.hidden = isEnableVideo;
    self.enableVideoBtn.status = isEnableVideo ? ButtonStatusNone : ButtonStatusActive;
    self.enableAudioBtn.status = !isEnableAudio ? ButtonStatusActive : ButtonStatusNone;
    [self authorizationStatusMicAndCamera];
}

- (void)onButtonBarClicked:(id)sender {
    [self.buttonBar moveUnderLineTo:sender];
}

- (void)authorizationStatusMicAndCamera {
    [SystemAuthority authorizationStatusWithType:AuthorizationTypeAudio block:^(BOOL isAuthorize) {
        if (!isAuthorize) {
            self.enableAudioBtn.status = ButtonStatusIllegal;
        }
    }];
    
    [SystemAuthority authorizationStatusWithType:AuthorizationTypeCamera block:^(BOOL isAuthorize) {
        if (!isAuthorize) {
            self.emptImageView.hidden = NO;
            self.enableVideoBtn.status = ButtonStatusIllegal;
        }
    }];
}

#pragma mark - getter

- (UITextField *)roomIdTextField {
    if (!_roomIdTextField) {
        _roomIdTextField = [[UITextField alloc] init];
        _roomIdTextField.delegate = self;
        [_roomIdTextField setBackgroundColor:[UIColor clearColor]];
        [_roomIdTextField setTextColor:[UIColor whiteColor]];
        _roomIdTextField.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        [_roomIdTextField addTarget:self action:@selector(roomNumTextFieldChange:) forControlEvents:UIControlEventEditingChanged];
        NSAttributedString *attrString = [[NSAttributedString alloc] initWithString:@"请输入房间ID"
                                                                         attributes:
                                                                             @{NSForegroundColorAttributeName : [ThemeManager buttonDescLabelTextColor]}];
        _roomIdTextField.attributedPlaceholder = attrString;
    }
    return _roomIdTextField;
}

- (UITextField *)userIdTextField {
    if (!_userIdTextField) {
        _userIdTextField = [[UITextField alloc] init];
        _userIdTextField.delegate = self;
        [_userIdTextField setBackgroundColor:[UIColor clearColor]];
        [_userIdTextField setTextColor:[UIColor whiteColor]];
        _userIdTextField.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        [_userIdTextField addTarget:self action:@selector(roomNumTextFieldChange:) forControlEvents:UIControlEventEditingChanged];
        NSAttributedString *attrString = [[NSAttributedString alloc] initWithString:@"请输入昵称"
                                                                         attributes:
                                                                             @{NSForegroundColorAttributeName : [ThemeManager buttonDescLabelTextColor]}];
        _userIdTextField.attributedPlaceholder = attrString;
    }
    return _userIdTextField;
}

- (BaseButton *)enableAudioBtn {
    if (!_enableAudioBtn) {
        _enableAudioBtn = [[BaseButton alloc] init];
        [_enableAudioBtn bingImage:[ThemeManager imageNamed:@"meeting_login_audio"] status:ButtonStatusNone];
        [_enableAudioBtn bingImage:[ThemeManager imageNamed:@"meeting_login_audio_s"] status:ButtonStatusActive];
        [_enableAudioBtn bingImage:[ThemeManager imageNamed:@"meeting_login_audio_s"] status:ButtonStatusIllegal];
        [_enableAudioBtn addTarget:self action:@selector(onClickEnableAudio:) forControlEvents:UIControlEventTouchUpInside];
        [self updateButtonColor:_enableAudioBtn];
    }
    return _enableAudioBtn;
}

- (BaseButton *)enableVideoBtn {
    if (!_enableVideoBtn) {
        _enableVideoBtn = [[BaseButton alloc] init];
        [_enableVideoBtn bingImage:[ThemeManager imageNamed:@"meeting_login_video"] status:ButtonStatusNone];
        [_enableVideoBtn bingImage:[ThemeManager imageNamed:@"meeting_login_video_s"] status:ButtonStatusActive];
        [_enableVideoBtn bingImage:[ThemeManager imageNamed:@"meeting_login_video_s"] status:ButtonStatusIllegal];
        [_enableVideoBtn addTarget:self action:@selector(onClickEnableVideo:) forControlEvents:UIControlEventTouchUpInside];
        [self updateButtonColor:_enableVideoBtn];
    }
    return _enableVideoBtn;
}

- (UIButton *)enterRoomBtn {
    if (!_enterRoomBtn) {
        _enterRoomBtn = [[UIButton alloc] init];
        _enterRoomBtn.backgroundColor = [UIColor colorFromHexString:@"#165DFF"];
        
        _enterRoomBtn.layer.borderColor = [[UIColor clearColor] CGColor];
        _enterRoomBtn.layer.masksToBounds = YES;
        _enterRoomBtn.layer.cornerRadius = 50/2;
        _enterRoomBtn.layer.borderWidth = 1;
        _enterRoomBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        
        [_enterRoomBtn setTitle:@"进入房间" forState:UIControlStateNormal];
        [_enterRoomBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [_enterRoomBtn addTarget:self action:@selector(onClickEnterRoom:) forControlEvents:UIControlEventTouchUpInside];
        [self updateEnterRoomButtonColor:NO];
    }
    return _enterRoomBtn;
}

- (UIView *)videoView {
    if (!_videoView) {
        _videoView = [[UIView alloc] init];
    }
    return _videoView;
}

- (UIImageView *)logoImageView {
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
        _logoImageView.image = [ThemeManager imageNamed:@"logo_icon"];
        _logoImageView.contentMode = UIViewContentModeScaleAspectFit;
    }
    return _logoImageView;
}

- (UITapGestureRecognizer *)tap {
    if (!_tap) {
        _tap = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                       action:@selector(tapGestureAction:)];
    }
    return _tap;
}

- (UIView *)maskView {
    if (!_maskView) {
        _maskView = [[UIView alloc] init];
        _maskView.backgroundColor = [UIColor colorFromRGBHexString:@"#101319" andAlpha:0.5 * 255];
        _maskView.userInteractionEnabled = YES;
    }
    return _maskView;
}

- (UIImageView *)emptImageView {
    if (!_emptImageView) {
        _emptImageView = [[UIImageView alloc] init];
        _emptImageView.image = [ThemeManager imageNamed:@"meeting_login_empt"];
        _emptImageView.hidden = YES;
    }
    return _emptImageView;
}

- (UILabel *)verLabel {
    if (!_verLabel) {
        _verLabel = [[UILabel alloc] init];
        _verLabel.textColor = [ThemeManager buttonDescLabelTextColor];
        _verLabel.font = [UIFont systemFontOfSize:12 weight:UIFontWeightRegular];
    }
    return _verLabel;
}

- (BaseButton *)navLeftButton {
    if (!_navLeftButton) {
        _navLeftButton = [[BaseButton alloc] init];
        [_navLeftButton setImage:[ThemeManager imageNamed:@"meeting_nav_left"] forState:UIControlStateNormal];
        _navLeftButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        [_navLeftButton addTarget:self action:@selector(navBackAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _navLeftButton;
}

- (BaseButton *)createEduSmallClassBtn {
    if (!_createEduSmallClassBtn) {
        _createEduSmallClassBtn = [[BaseButton alloc] init];
        [_createEduSmallClassBtn setTitle:@"我是老师" forState:UIControlStateNormal];
        [_createEduSmallClassBtn sizeToFit];
        
        [_createEduSmallClassBtn addTarget:self action:@selector(onButtonBarClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _createEduSmallClassBtn;
}

- (BaseButton *)joinEduSmallClassBtn {
    if (!_joinEduSmallClassBtn) {
        _joinEduSmallClassBtn = [[BaseButton alloc] init];
        [_joinEduSmallClassBtn setTitle:@"我是学生" forState:UIControlStateNormal];
        [_joinEduSmallClassBtn sizeToFit];
        
        [_joinEduSmallClassBtn addTarget:self action:@selector(onButtonBarClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _joinEduSmallClassBtn;
}

- (EduSCUnderlinedButtonBar *)buttonBar {
    if (!_buttonBar) {
        CGFloat width = CGRectGetWidth(self.createEduSmallClassBtn.frame) + CGRectGetWidth(self.joinEduSmallClassBtn.frame) + 44;
        _buttonBar = [[EduSCUnderlinedButtonBar alloc] initWithButtons:@[self.createEduSmallClassBtn, self.joinEduSmallClassBtn] width:width height:45 underlineColor:[UIColor whiteColor] underlineTrackColor:[UIColor clearColor] underlineHeight:5 underlineMargin:45 backgroundColor:[UIColor clearColor] animated:YES];
    }
    return _buttonBar;
}

- (UIView *)infoView {
    if (!_infoView) {
        _infoView = [[UIView alloc] init];
        _infoView.backgroundColor = [UIColor colorWithWhite:1.0f alpha:0.05f];
        
        UILabel *label = [[UILabel alloc] init];
        label.text = @"本产品仅用于功能体验，单次课堂时长不超过30分钟";
        label.textColor = [UIColor whiteColor];
        label.backgroundColor = [UIColor clearColor];
        label.font = [label.font fontWithSize:14.f];
        [label sizeToFit];
        
        UIImageView *iv = [[UIImageView alloc] init];
        [iv setImage:[ThemeManager imageNamed:@"meeting_info"]];
        
        [_infoView addSubview:label];
        [label mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerX.equalTo(self.infoView).offset(11);
            make.centerY.equalTo(self.infoView);
        }];
        
        [_infoView addSubview:iv];
        [iv mas_makeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(22, 22));
            make.right.equalTo(label.mas_left).offset(-8.f);
            make.centerY.equalTo(self.infoView);
        }];
        
    }
    return _infoView;
}

- (UILabel *)titleLabel {
    if(!_titleLabel) {
        _titleLabel = [[UILabel alloc]init];
        _titleLabel.textAlignment = NSTextAlignmentCenter;
        _titleLabel.textColor = [UIColor whiteColor];
        _titleLabel.text = @"小班课";
    }
    return _titleLabel;
}

- (void)dealloc {
    [[EduSmallClassRTCManager shareRtc] disconnect];
    [[NSNotificationCenter defaultCenter] postNotificationName:NotificationJoinOrExit object:nil];
    [PublicParameterComponent clear];
}

@end
