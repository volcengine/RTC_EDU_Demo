//
//  EduSCRoomScreenView.m
//  quickstart
//
//  Created by on 2021/3/25.
//  
//

#import "EduSCRoomScreenView.h"
#import "EduSCRoomUserView.h"

@interface EduSCRoomScreenView ()

@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *shareAudioLabel;
@property (nonatomic, strong) UIStackView *shareAudioBg;
@property (nonatomic, strong) BaseButton  *shareAudioButton;
@property (nonatomic, strong) BaseButton  *closeShareButton;
@property (nonatomic, strong) BaseButton  *scaleBotton;
@property (nonatomic, strong) BaseButton  *micButton;
@property (nonatomic, strong) EduSCRoomUserView *screenVideoView;

@end


@implementation EduSCRoomScreenView

- (instancetype)init {
    self = [super init];
    if (self) {
        self.backgroundColor = [ThemeManager contentBackgroundColor];
        [self addSubview:self.screenVideoView];
        [self addSubview:self.titleLabel];
        
        [self addSubview:self.shareAudioBg];
        [self.shareAudioBg addArrangedSubview:self.shareAudioLabel];
        [self.shareAudioBg addArrangedSubview:self.shareAudioButton];
        
        [self addSubview:self.closeShareButton];
        [self addSubview:self.scaleBotton];
        [self addSubview:self.micButton];
        [self addConstraints];
        self.isVertical = YES;
    }
    return self;
}

- (void)closeShareButtonAction {
    if (self.clickCloseBlock) {
        self.clickCloseBlock();
    }
}

- (void)shareAudioButtonAction {
    if (self.shareAudioButton.status == ButtonStatusActive) {
        self.shareAudioButton.status = ButtonStatusNone;
    } else {
        self.shareAudioButton.status = ButtonStatusActive;
    }
    
    if (self.clickShareAudioBlock) {
        self.clickShareAudioBlock(self.shareAudioButton.status == ButtonStatusActive);
    }
}

- (void)addConstraints {
    [self.screenVideoView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self);
    }];
    
    [self.closeShareButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(120.f, 40.f));
        make.centerY.equalTo(self).offset(15);
        make.centerX.equalTo(self);
    }];
    
    [self.shareAudioBg mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_equalTo(self.closeShareButton.mas_top).offset(-60);
        make.centerX.equalTo(self);
    }];
    
    [self.shareAudioButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(44.f, 24.f));
    }];
    
    [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_equalTo(self.shareAudioBg.mas_top).offset(-25.f);
        make.centerX.equalTo(self);
    }];
    
    [self.scaleBotton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.bottom.mas_equalTo(self).offset(FIGMA_SCALE(-32));
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
    }];
    
    [self.micButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_equalTo(self).offset(FIGMA_SCALE(-32));
        make.right.mas_equalTo(self.scaleBotton).offset(FIGMA_SCALE(-48));
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
    }];
}

- (void)setSharingVideoSession:(EduSCRoomVideoSession *)sharingVideoSession {
    BOOL showScreenVideo = (sharingVideoSession != nil);
    _sharingVideoSession = sharingVideoSession;
    [self.screenVideoView setScreenSession:sharingVideoSession];
    
    if (self.screenVideoView.hidden != !showScreenVideo) {
        self.screenVideoView.hidden = !showScreenVideo;
        self.scaleBotton.hidden = !showScreenVideo;
        self.micButton.hidden = !showScreenVideo;
        self.titleLabel.hidden = showScreenVideo;
        self.shareAudioLabel.hidden = showScreenVideo;
        self.shareAudioBg.hidden = showScreenVideo;
        self.shareAudioButton.hidden = showScreenVideo;
        self.closeShareButton.hidden = showScreenVideo;
    }
    if (!self.closeShareButton.hidden) {
        self.scaleBotton.hidden = YES;
    }
}

- (void)setEnableSharingAudio:(BOOL)enableSharingAudio {
    self.shareAudioButton.status = enableSharingAudio ? ButtonStatusActive : ButtonStatusNone;
}

- (void)setIsVertical:(BOOL)isVertical {
    _isVertical = isVertical;
    self.micButton.hidden = _isVertical;
    self.micButton.alpha = _isVertical ? 0.0 : 1.0;
    self.scaleBotton.status = _isVertical ? ButtonStatusNone: ButtonStatusActive;
}
#pragma mark - public Action
- (void)updateButtonStatus:(BOOL)isActive {
    self.micButton.status = isActive;
}

- (void)updateIconPosition{
    [self.scaleBotton mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(self).offset(FIGMA_SCALE(-32));
        make.bottom.mas_equalTo(self).offset(FIGMA_SCALE(-32));
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(48), FIGMA_SCALE(48)));
    }];
}
#pragma mark - getter

- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [ThemeManager commomLabelTextColor];
        _titleLabel.font = [UIFont boldSystemFontOfSize:20];
        _titleLabel.text = @"你正在共享屏幕";
    }
    return _titleLabel;
}

- (UILabel *)shareAudioLabel {
    if (!_shareAudioLabel) {
        _shareAudioLabel = [[UILabel alloc] init];
        _shareAudioLabel.textColor = [ThemeManager commomLabelTextColor];
        _shareAudioLabel.font = [UIFont systemFontOfSize:18];
        _shareAudioLabel.text = @"共享设备音频";
    }
    return _shareAudioLabel;
}

- (UIStackView *)shareAudioBg {
    if (!_shareAudioBg) {
        _shareAudioBg = [[UIStackView alloc] init];
        _shareAudioBg.backgroundColor = [UIColor clearColor];
        _shareAudioBg.spacing = 8.f;
    }
    return _shareAudioBg;
}

- (BaseButton *)closeShareButton {
    if (!_closeShareButton) {
        _closeShareButton = [[BaseButton alloc] init];
        
        _closeShareButton.backgroundColor = [ThemeManager destructBgColor];
        _closeShareButton.layer.borderColor = [[UIColor clearColor] CGColor];
        _closeShareButton.layer.masksToBounds = YES;
        _closeShareButton.layer.cornerRadius = 4;
        _closeShareButton.layer.borderWidth = 1;
        _closeShareButton.titleLabel.font = [UIFont systemFontOfSize:18];
        
        [_closeShareButton setTitle:@"停止共享" forState:UIControlStateNormal];
        [_closeShareButton setTitleColor:[ThemeManager destructFgColor] forState:UIControlStateNormal];
        [_closeShareButton addTarget:self action:@selector(closeShareButtonAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeShareButton;
}

- (BaseButton *)shareAudioButton {
    if (!_shareAudioButton) {
        _shareAudioButton = [[BaseButton alloc] init];
        [_shareAudioButton addTarget:self action:@selector(shareAudioButtonAction) forControlEvents:UIControlEventTouchUpInside];
        [_shareAudioButton bingImage:[ThemeManager imageNamed:@"meeting_switch_off"] status:ButtonStatusNone];
        [_shareAudioButton bingImage:[ThemeManager imageNamed:@"meeting_switch_on"] status:ButtonStatusActive];
    }
    return _shareAudioButton;
}

- (EduSCRoomUserView *)screenVideoView {
    if (!_screenVideoView) {
        _screenVideoView = [[EduSCRoomUserView alloc] init];
        _screenVideoView.hidden = YES;
    }
    return _screenVideoView;
}

- (BaseButton *)scaleBotton {
    if (!_scaleBotton) {
        _scaleBotton = [[BaseButton alloc] init];
        [_scaleBotton bingImage:[ThemeManager imageNamed:@"meeting_room_orientation"] status:ButtonStatusNone];
        [_scaleBotton bingImage:[ThemeManager imageNamed:@"meeting_room_orientation_v"] status:ButtonStatusActive];
        WeakSelf
        [_scaleBotton setBtnClickBlock:^(id  _Nonnull sender) {
            if (wself.btnClickBlock) {
                wself.btnClickBlock(wself);
            }
        }];
    }
    return _scaleBotton;
}
- (BaseButton *)micButton {
//    if (!_micButton) {
//        _micButton = [[BaseButton alloc] init];
//        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_room_mic"] status:ButtonStatusNone];
//        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_room_mic_s"]  status:ButtonStatusActive];
//        WeakSelf
//        [_micButton setBtnClickBlock:^(id  _Nonnull sender) {
//            EduSCRoomItemButton *button = (EduSCRoomItemButton *)sender;
////            if ([wself.delegate respondsToSelector:@selector(EduSCRoomBottomView:itemButton:didSelectStatus:)]) {
////                [wself.delegate EduSCRoomBottomView:wself itemButton:button didSelectStatus:RoomBottomItemMic];
////            }
//        }];
//    }
    return nil;
}
@end
