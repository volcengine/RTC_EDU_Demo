//
//  RoomNavView.m
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import "RoomNavView.h"
#import "GCDTimer.h"

@interface RoomNavView ()
@property (nonatomic, strong) NavViewModel *viewModel;
@property (nonatomic, strong) RoomItemButton *switchCameraBtn;
@property (nonatomic, strong) RoomItemButton *switchSpeakerBtn;
@property (nonatomic, strong) RoomItemButton *hangeupButton;

@property (nonatomic, strong) UIView *contentView;
@property (nonatomic, strong) UILabel *roomIdLabel;
@property (nonatomic, strong) UIImageView *recordIcon;
@property (nonatomic, strong) UILabel *recordLabel;
@property (nonatomic, strong) UIView *lineView;
@property (nonatomic, strong) UILabel *timeLabel;

@property (nonatomic, strong) GCDTimer *timer;
@property (nonatomic, assign) NSInteger secondValue;
@property (nonatomic, assign) BOOL isRecording;

@end

@implementation RoomNavView

- (instancetype)initWithViewModel:(NavViewModel *)model {
    self = [super init];
    if (self) {
        self.viewModel = model;
        self.backgroundColor = [ThemeManager backgroundColor];
        [self addSubviewAndConstraints];
        self.isRecording = model.roomModel.record_status;
        [self checkRoomidLabelText];
        
        @weakify(self); 
        [self.KVOController observe:self.viewModel.roomModel keyPath:@keypath(self.viewModel.roomModel, record_status) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            [self setIsRecording:self.viewModel.roomModel.record_status];
        }];
        
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, isEnableVideo) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            BOOL enable = [change[NSKeyValueChangeNewKey] boolValue];
            
            NSLog(@"RoomNav isEnableVideo = %d",enable);
            
            self.switchCameraBtn.hidden = !enable;
        }];
        
        __weak __typeof(self) wself = self;
        self.secondValue = (model.roomModel.base_time - model.roomModel.start_time) / 1000;
        [self.timer startTimerWithSpace:1 block:^(BOOL result) {
            [wself timerMethod];
        }];
        
    }
    return self;
}

- (void)hangeupButtonAction:(RoomItemButton *)sender {
    if ([self.delegate respondsToSelector:@selector(roomNavView:itemButton:didSelectStatus:)]) {
        [self.delegate roomNavView:self itemButton:sender didSelectStatus:RoomNavItemHangeup];
    }
}

- (void)switchCameraBtn:(RoomItemButton *)sender {
    if ([self.delegate respondsToSelector:@selector(roomNavView:itemButton:didSelectStatus:)]) {
        [self.delegate roomNavView:self itemButton:sender didSelectStatus:RoomNavItemSwitchCamera];
    }
}

- (void)switchSpeakerBtn:(RoomItemButton *)sender {
    if ([self.delegate respondsToSelector:@selector(roomNavView:itemButton:didSelectStatus:)]) {
        [self.delegate roomNavView:self itemButton:sender didSelectStatus:RoomNavItemSwitchSpeaker];
    }
}

#pragma mark - Publish Action

- (void)setMeetingTime:(NSInteger)meetingTime {
    self.secondValue = meetingTime;
    [self.timer resume];
}

- (void)setIsRecording:(BOOL)isRecording {
    self.recordIcon.hidden = !isRecording;
    self.recordLabel.hidden = !isRecording;
    self.lineView.hidden = !isRecording;
    
    [self.timeLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
        if (isRecording) {
            make.left.equalTo(self.lineView.mas_right).offset(8);
            make.centerY.equalTo(self.recordLabel);
        } else {
            make.centerX.equalTo(self.contentView);
            make.top.mas_equalTo(self.roomIdLabel.mas_bottom);
        }
    }];
}

- (void)changeSwitchCameraBtnStatus:(BOOL)isOpen {
    self.switchCameraBtn.alpha = isOpen ? 1 : 0;
    self.switchCameraBtn.userInteractionEnabled = isOpen;
}
#pragma mark - Private Action
- (void)checkRoomidLabelText {
    NSString *roomIDStr = self.viewModel.localVideoSession.roomId;
    if (self.viewModel.localVideoSession.roomId.length > 9) {
        NSString *aboveStr = [roomIDStr substringToIndex:3];
        NSString *afterStr = [roomIDStr substringWithRange:NSMakeRange(roomIDStr.length - 3, 3)];
        roomIDStr = [NSString stringWithFormat:@"%@...%@", aboveStr, afterStr];
    }
    self.roomIdLabel.text = [NSString stringWithFormat:@"房间ID：%@", roomIDStr];
}

- (void)timerMethod {
    NSInteger restTime = MaxMeetingLimitedTimeInSecs - self.secondValue;
    NSInteger minute = restTime / 60;
    NSInteger second = restTime - (minute * 60);
    NSString *minuteStr = (minute < 10) ? [NSString stringWithFormat:@"0%ld", minute] : [NSString stringWithFormat:@"%ld", (long)minute];
    NSString *secondStr = (second < 10) ? [NSString stringWithFormat:@"0%ld", second] : [NSString stringWithFormat:@"%ld", (long)second];
    self.timeLabel.text = [NSString stringWithFormat:@"剩余时间：%@:%@", minuteStr, secondStr];
    self.secondValue++;
    if (restTime < 0) {
        [self.timer suspend];
    } else {
        [self.delegate timeChange:self.secondValue];
    }
}

- (void)addSubviewAndConstraints {
    [self addSubview:self.switchSpeakerBtn];
    [self.switchSpeakerBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self).mas_offset(16.f);
        make.centerY.equalTo(self).mas_offset([DeviceInforTool getStatusBarHight]/2);
        make.height.width.mas_equalTo(24);
    }];
    
    [self addSubview:self.switchCameraBtn];
    [self.switchCameraBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.switchSpeakerBtn.mas_right).mas_offset(16.f);
        make.centerY.equalTo(self).mas_offset([DeviceInforTool getStatusBarHight]/2);
        make.height.width.mas_equalTo(24);
    }];

    [self addSubview:self.hangeupButton];
    [self.hangeupButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.equalTo(self).mas_offset(-16.f);
        make.centerY.equalTo(self).mas_offset([DeviceInforTool getStatusBarHight]/2);
        make.height.width.mas_equalTo(24.f);
    }];
    
    [self.contentView addSubview:self.recordIcon];
    [self.contentView addSubview:self.recordLabel];
    [self.contentView addSubview:self.lineView];
    [self.contentView addSubview:self.roomIdLabel];
    [self.contentView addSubview:self.timeLabel];
    [self addSubview:self.contentView];
    [self.contentView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(54.f);
        make.centerX.equalTo(self);
        make.centerY.equalTo(self.hangeupButton);
    }];
    
    [self.roomIdLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.equalTo(self.contentView);
        make.top.mas_equalTo(self.contentView.mas_top);
        make.height.mas_equalTo(28.f);
    }];
    
    [self.lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(1, 12));
        make.centerX.equalTo(self.contentView);
        make.centerY.equalTo(self.recordLabel);
    }];
    
    [self.recordLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(22);
        make.right.mas_equalTo(self.lineView.mas_left).offset(-8.f);
        make.top.mas_equalTo(self.roomIdLabel.mas_bottom);
    }];
    
    [self.recordIcon mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(16, 16));
        make.right.equalTo(self.recordLabel.mas_left).offset(-2.f);
        make.centerY.equalTo(self.recordLabel);
    }];
    
    [self.timeLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.lineView.mas_right).offset(8);
        make.centerY.equalTo(self.recordLabel);
    }];
}

- (void)roomIdLabelLongPressAction:(UILongPressGestureRecognizer *)pan {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = self.viewModel.localVideoSession.roomId;
    
    [[ToastComponent shareToastComponent] showWithMessage:@"房间号已复制"];
}

#pragma mark - getter

- (UIView *)contentView {
    if (!_contentView) {
        _contentView = [[UIView alloc] init];
    }
    return _contentView;
}

- (UIImageView *)recordIcon {
    if (!_recordIcon) {
        _recordIcon = [[UIImageView alloc] initWithImage:[ThemeManager imageNamed:@"meeting_room_record_s"]];
    }
    return _recordIcon;
}

- (UILabel *)recordLabel {
    if (!_recordLabel) {
        _recordLabel = [[UILabel alloc] init];
        _recordLabel.textColor = [ThemeManager commomDescLabelTextColor];
        _recordLabel.font = [UIFont systemFontOfSize:12.f];
        _recordLabel.text = @"录制中";
        _recordLabel.backgroundColor = [UIColor clearColor];
    }
    return _recordLabel;
}

- (UILabel *)timeLabel {
    if (!_timeLabel) {
        _timeLabel = [[UILabel alloc] init];
        _timeLabel.textColor = [ThemeManager commomDescLabelTextColor];
        _timeLabel.font = [UIFont systemFontOfSize:12.f];
        _timeLabel.text = @"";
        _timeLabel.backgroundColor = [UIColor clearColor];
    }
    return _timeLabel;
}

- (UILabel *)roomIdLabel {
    if (!_roomIdLabel) {
        _roomIdLabel = [[UILabel alloc] init];
        _roomIdLabel.textColor = [ThemeManager commomLabelTextColor];
        _roomIdLabel.font = [UIFont systemFontOfSize:16.f];
        
        _roomIdLabel.userInteractionEnabled = YES;
        UILongPressGestureRecognizer *longTouch = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(roomIdLabelLongPressAction:)];
        longTouch.minimumPressDuration = 1;
        [_roomIdLabel addGestureRecognizer:longTouch];
    }
    return _roomIdLabel;
}

- (UIView *)lineView {
    if (!_lineView) {
        _lineView = [[UIView alloc] init];
        _lineView.backgroundColor = [UIColor colorFromHexString:@"#4E5969"];
    }
    return _lineView;
}

- (BaseButton *)switchCameraBtn {
    if (!_switchCameraBtn) {
        _switchCameraBtn = [[RoomItemButton alloc] init];
        [_switchCameraBtn setImage:[ThemeManager imageNamed:@"meeting_room_camera"] forState:UIControlStateNormal];
        [_switchCameraBtn addTarget:self action:@selector(switchCameraBtn:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _switchCameraBtn;
}

- (BaseButton *)switchSpeakerBtn {
    if (!_switchSpeakerBtn) {
        _switchSpeakerBtn = [[RoomItemButton alloc] init];
        
        [_switchSpeakerBtn bingImage:[ThemeManager imageNamed:@"meeting_room_audio"] status:ButtonStatusNone];
        [_switchSpeakerBtn bingImage:[ThemeManager imageNamed:@"meeting_room_audio_s"] status:ButtonStatusActive];
        [_switchSpeakerBtn bingImage:[ThemeManager imageNamed:@"meeting_room_audio_s"] status:ButtonStatusIllegal];
         
        [_switchSpeakerBtn addTarget:self action:@selector(switchSpeakerBtn:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _switchSpeakerBtn;
}

- (BaseButton *)hangeupButton {
    if (!_hangeupButton) {
        _hangeupButton = [[RoomItemButton alloc] init];
        [_hangeupButton setImage:[ThemeManager imageNamed:@"meeting_room_hangeup"] forState:UIControlStateNormal];
        [_hangeupButton addTarget:self action:@selector(hangeupButtonAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _hangeupButton;
}

- (GCDTimer *)timer {
    if (!_timer) {
        _timer = [[GCDTimer alloc] init];
    }
    return _timer;
}

@end
