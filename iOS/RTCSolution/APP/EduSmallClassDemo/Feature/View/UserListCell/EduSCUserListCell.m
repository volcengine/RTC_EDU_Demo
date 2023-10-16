#import "EduSCUserListCell.h"
#import "EduSmallClassRTCManager.h"
#import "EduSmallClassRTMManager.h"
#import "EduSCAvatarView.h"
#import <KVOController/KVOController.h>

@interface EduSCUserListCell ()

@property (nonatomic, strong) EduSCAvatarView *EduSCAvatarView;
@property (nonatomic, strong) UILabel *userIDLabel;
@property (nonatomic, strong) BaseButton *enableAudioBtn;
@property (nonatomic, strong) BaseButton *enableVideoBtn;
@property (nonatomic, strong) BaseButton *enableShareBtn;
@property (nonatomic, strong) BaseButton *handBtn;
@property (nonatomic, strong) UIImageView *screenImageView;
@property (nonatomic, strong) UILabel *hostTipView;

@property (nonatomic, strong) UIView *lineView;
@property (nonatomic, strong) UIView *avatarSpeakView;

@property (nonatomic, copy) onUserCtrlBlock block;

@end

@implementation EduSCUserListCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        self.contentView.backgroundColor = [UIColor clearColor];
        
        [self createUIComponent];
    }
    return self;
}

#pragma mark - Publish Action

- (void)setVideoSession:(EduSCRoomVideoSession *)videoSession {
    _videoSession = videoSession;
    
    WeakSelf
    [self.KVOController observe:_videoSession keyPath:FBKVOKeyPath(_videoSession.isEnableAudio) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        wself.enableAudioBtn.status = [change[NSKeyValueChangeNewKey] boolValue] ? ButtonStatusNone : ButtonStatusActive;
    }];
    
    [self.KVOController observe:_videoSession keyPath:FBKVOKeyPath(_videoSession.isEnableVideo) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        wself.enableVideoBtn.status = [change[NSKeyValueChangeNewKey] boolValue] ? ButtonStatusNone : ButtonStatusActive;
    }];
    
    [self.KVOController observe:_videoSession keyPaths:@[FBKVOKeyPath(_videoSession.isSharingScreen),
                                                         FBKVOKeyPath(_videoSession.isSharingWhiteBoard),
                                                         FBKVOKeyPath(_videoSession.hasSharePermission)]
                        options:NSKeyValueObservingOptionNew
                          block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        BOOL accept = [change[NSKeyValueChangeNewKey] boolValue];
        NSLog(@"EduSCUserListCell hasSharePermission changed = %d",accept);
        if (wself.videoSession.hasSharePermission) {
            wself.enableShareBtn.status = wself.videoSession.isSharingScreen || wself.videoSession.isSharingWhiteBoard ? ButtonStatusIng : ButtonStatusNone;
        } else {
            wself.enableShareBtn.status = ButtonStatusActive;
        }
    }];
    
    [self.KVOController observe:_videoSession keyPaths:@[@keypath(_videoSession, isRequestMic),
                                                        @keypath(_videoSession, isRequestShare)] options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        wself.handBtn.hidden = !wself.videoSession.isRequestMic && !wself.videoSession.isRequestShare;
    }];
    
    //name
    if (videoSession.isLoginUser) {
        self.userIDLabel.text = [NSString stringWithFormat:@"%@（我）", videoSession.name];
    } else {
        self.userIDLabel.text = videoSession.name;
    }
    self.EduSCAvatarView.text = videoSession.name;
    
    //camera
    BOOL isOpenVideo = videoSession.isEnableVideo;
    self.enableVideoBtn.status = isOpenVideo ? ButtonStatusNone : ButtonStatusActive;
    
    //mic
    if (videoSession.isEnableAudio) {
        if (videoSession.volume > 0) {
            //ing
            self.enableAudioBtn.status = ButtonStatusIng;
            self.avatarSpeakView.hidden = NO;
        } else {
            //open
            self.enableAudioBtn.status = ButtonStatusNone;
            self.avatarSpeakView.hidden = YES;
        }
    } else {
        //close
        self.enableAudioBtn.status = ButtonStatusActive;
        self.avatarSpeakView.hidden = YES;
    }
    
    if (videoSession.hasSharePermission) {
        self.enableShareBtn.status = ButtonStatusNone;
    } else {
        self.enableShareBtn.status = ButtonStatusActive;
    }
    
    //host
    self.hostTipView.hidden = !videoSession.isHost;
    CGFloat centerOffY = videoSession.isHost ? -12 : 0;
    [self.userIDLabel mas_updateConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self.contentView).offset(centerOffY);
    }];
    
    //screen
    self.screenImageView.hidden = !videoSession.isSharingScreen;
}

- (void)setIsShareHand:(BOOL)isShareHand {
    _isShareHand = isShareHand;
    if (isShareHand) {
        _handBtn.hidden = NO;
    }
    if (!_isShareHand && !_isMicHand) {
        self.handBtn.hidden = YES;
    }
}

- (void)setIsMicHand:(BOOL)isMicHand {
    _isMicHand = isMicHand;
    if (isMicHand) {
        _handBtn.hidden = NO;
    }
    if (!_isShareHand && !_isMicHand) {
        self.handBtn.hidden = YES;
    }
}

- (void)enableVideoBtnAction:(BaseButton *)sender {
    //[self changeButton:sender];
    if (self.block) {
        self.block(self.videoSession, kUserCtrlVideo);
    }
}

- (void)enableAudioBtnAction:(BaseButton *)sender {
    //[self changeButton:sender];
    if (self.block) {
        self.block(self.videoSession, kUserCtrlAudio);
    }
}

- (void)enableShareBtnAction:(BaseButton *)sender {
    if (self.block) {
        self.block(self.videoSession, kUserCtrlShare);
    }
}

- (void)handBtnAction:(BaseButton *)sender {
    if (self.isShareHand) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [EduSmallClassRTMManager grantSharePermission:self.videoSession.uid result:NO];
            self.enableShareBtn.status = ButtonStatusActive;
            self.videoSession.hasSharePermission = NO;
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"同意";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [EduSmallClassRTMManager grantSharePermission:self.videoSession.uid result:YES];
            self.enableShareBtn.status = ButtonStatusNone;
            self.videoSession.hasSharePermission = YES;
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%@正在申请共享权限", self.videoSession.name]
                                                              actions:@[alertCancelModel, alertModel]];
        self.isShareHand = NO;
        if (self.deleteShareBlock) {
            self.deleteShareBlock(self);
        }
    } else if (self.isMicHand) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [EduSmallClassRTMManager grantMicPermission:self.videoSession.uid result:NO];
            self.enableAudioBtn.status = ButtonStatusActive;
            self.videoSession.isEnableAudio = NO;
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"同意";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [EduSmallClassRTMManager grantMicPermission:self.videoSession.uid result:YES];
            self.enableAudioBtn.status = ButtonStatusNone;
            self.videoSession.isEnableAudio = YES;
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%@正在申请发言", self.videoSession.name]
                                                              actions:@[alertCancelModel, alertModel]];
        self.isMicHand = NO;
        if (self.deleteMicBlock) {
            self.deleteMicBlock(self);
        }
    }
}

- (void)changeButton:(BaseButton *)button {
    if (button.status == ButtonStatusActive) {
        button.status = ButtonStatusNone;
    } else {
        button.status = ButtonStatusActive;
    }
}
#pragma mark - Private Action

- (void)createUIComponent {
    [self.contentView addSubview:self.EduSCAvatarView];
    [self.EduSCAvatarView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(40, 40));
        make.left.equalTo(self.contentView).offset(32/2);
        make.centerY.equalTo(self.contentView);
    }];

    [self.contentView addSubview:self.enableShareBtn];
    [self.enableShareBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.equalTo(self.contentView).mas_offset(-20);
        make.centerY.equalTo(self.contentView);
        make.height.width.mas_equalTo(24);
    }];
    
    [self.contentView addSubview:self.enableVideoBtn];
    [self.enableVideoBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.equalTo(self.enableShareBtn.mas_left).mas_offset(-20);
        make.centerY.equalTo(self.contentView);
        make.height.width.mas_equalTo(24);
    }];
    
    [self.contentView addSubview:self.enableAudioBtn];
    [self.enableAudioBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.equalTo(self.enableVideoBtn.mas_left).mas_offset(-20);
        make.centerY.equalTo(self.contentView);
        make.height.width.mas_equalTo(24);
    }];
    
    [self.contentView addSubview:self.handBtn];
    [self.handBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.equalTo(self.enableAudioBtn.mas_left).mas_offset(-20);
        make.centerY.equalTo(self.contentView);
        make.height.width.mas_equalTo(24);
    }];
    
    [self addSubview:self.lineView];
    [self.lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(1);
        make.left.mas_equalTo(32/2);
        make.right.bottom.equalTo(self.contentView);
    }];
    
    [self.contentView addSubview:self.userIDLabel];
    [self.userIDLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.EduSCAvatarView.mas_right).mas_offset(9);
        make.right.lessThanOrEqualTo(self.enableAudioBtn.mas_left).offset(-32);
        make.centerY.equalTo(self.contentView).offset(0);
    }];
    
    [self addSubview:self.screenImageView];
    [self.screenImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.width.height.mas_equalTo(32/2);
        make.left.equalTo(self.userIDLabel.mas_right).offset(8);
        make.centerY.equalTo(self.userIDLabel);
    }];
    
    [self addSubview:self.hostTipView];
    [self.hostTipView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(44, 20));
        make.left.equalTo(self.userIDLabel);
        make.top.equalTo(self.userIDLabel.mas_bottom).offset(4);
    }];
    
    [self addSubview:self.avatarSpeakView];
    [self.avatarSpeakView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.EduSCAvatarView);
    }];
}



#pragma mark - getter

- (BaseButton *)enableAudioBtn {
    if (!_enableAudioBtn) {
        _enableAudioBtn = [[BaseButton alloc] init];
        [_enableAudioBtn addTarget:self action:@selector(enableAudioBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [_enableAudioBtn bingImage:[ThemeManager imageNamed:@"meeting_par_mic"] status:ButtonStatusNone];
        [_enableAudioBtn bingImage:[ThemeManager imageNamed:@"meeting_par_mic_s"] status:ButtonStatusActive];
        [_enableAudioBtn bingImage:[ThemeManager imageNamed:@"meeting_par_mic_i"] status:ButtonStatusIng];
        _enableAudioBtn.userInteractionEnabled = YES;
    }
    return _enableAudioBtn;
}

- (BaseButton *)enableVideoBtn {
    if (!_enableVideoBtn) {
        _enableVideoBtn = [[BaseButton alloc] init];
        [_enableVideoBtn addTarget:self action:@selector(enableVideoBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [_enableVideoBtn bingImage:[ThemeManager imageNamed:@"meeting_par_camera"] status:ButtonStatusNone];
        [_enableVideoBtn bingImage:[ThemeManager imageNamed:@"meeting_par_camera_s"] status:ButtonStatusActive];
        _enableVideoBtn.userInteractionEnabled = YES;
    }
    return _enableVideoBtn;
}
- (BaseButton *)enableShareBtn {
    if (!_enableShareBtn) {
        _enableShareBtn = [[BaseButton alloc] init];
        [_enableShareBtn addTarget:self action:@selector(enableShareBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [_enableShareBtn bingImage:[ThemeManager imageNamed:@"meeting_par_share"] status:ButtonStatusNone];
        [_enableShareBtn bingImage:[ThemeManager imageNamed:@"meeting_par_share_s"] status:ButtonStatusActive];
        _enableShareBtn.userInteractionEnabled = YES;
    }
    return _enableShareBtn;
}

- (BaseButton *)handBtn {
    if (!_handBtn) {
        _handBtn = [[BaseButton alloc] init];
        [_handBtn addTarget:self action:@selector(handBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [_handBtn bingImage:[ThemeManager imageNamed:@"meeting_par_hand"] status:ButtonStatusNone];
        _handBtn.userInteractionEnabled = YES;
        _handBtn.hidden = YES;
    }
    return _handBtn;
}


- (EduSCAvatarView *)EduSCAvatarView {
    if (!_EduSCAvatarView) {
        _EduSCAvatarView = [[EduSCAvatarView alloc] init];
        _EduSCAvatarView.fontSize = 20;
        _EduSCAvatarView.layer.masksToBounds = YES;
        _EduSCAvatarView.layer.cornerRadius = 20;
    }
    return _EduSCAvatarView;
}

- (UIView *)lineView {
    if (!_lineView) {
        _lineView = [[UIView alloc] init];
        _lineView.backgroundColor = [ThemeManager commonLineColor];
    }
    return _lineView;
}

- (UILabel *)userIDLabel {
    if (!_userIDLabel) {
        _userIDLabel = [[UILabel alloc] init];
        _userIDLabel.textColor = [ThemeManager commomLabelTextColor];
        _userIDLabel.font = [UIFont systemFontOfSize:32/2 weight:UIFontWeightRegular];
    }
    return _userIDLabel;
}

- (UILabel *)hostTipView {
    if (!_hostTipView) {
        _hostTipView = [[UILabel alloc] init];
        _hostTipView.textAlignment = NSTextAlignmentCenter;
        _hostTipView.textColor = [ThemeManager hostLabelTextColor];
        _hostTipView.text = @"老师";
        _hostTipView.backgroundColor = [ThemeManager hostLabelBackgroudColor];
        _hostTipView.layer.masksToBounds = YES;
        _hostTipView.layer.cornerRadius = 2;
        _hostTipView.font = [UIFont systemFontOfSize:12];
    }
    return _hostTipView;
}

- (UIImageView *)screenImageView {
    if (!_screenImageView) {
        _screenImageView = [[UIImageView alloc] init];
        _screenImageView.image = [ThemeManager imageNamed:@"meeting_par_screen"];
    }
    return _screenImageView;
}

- (UIView *)avatarSpeakView {
    if (!_avatarSpeakView) {
        _avatarSpeakView = [[UIView alloc] init];
        _avatarSpeakView.layer.masksToBounds = YES;
        _avatarSpeakView.layer.borderWidth = 2;
        _avatarSpeakView.layer.cornerRadius = 20;
        _avatarSpeakView.layer.borderColor = [UIColor colorFromHexString:@"#4080FF"].CGColor;
        _avatarSpeakView.hidden = YES;
    }
    return _avatarSpeakView;
}

- (void)enableUserControl:(BOOL)enable block:(__nullable onUserCtrlBlock) block {
    self.block = block;
    self.enableAudioBtn.userInteractionEnabled = enable;
    self.enableVideoBtn.userInteractionEnabled = enable;
    self.enableShareBtn.userInteractionEnabled = enable;
}

@end
