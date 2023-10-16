//
//  UserOperateView.m
//  EduBigClassDemo
//
//  Created by ByteDance on 2023/6/29.
//

#define iconRectWidth 32

#import "UserOperateView.h"
#import "EduBigClassRTCManager.h"
#import "EduBigClassRTMManager.h"

@interface UserOperateView()

@property (nonatomic, strong) BaseButton *micButton;
@property (nonatomic, strong) BaseButton *cameraButton;
@property (nonatomic, strong) BaseButton *cutLinkButton;


@end

@implementation UserOperateView
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (void)setVideoSession:(EduBCRoomVideoSession *)videoSession {
    if (_videoSession == videoSession) {
        return;
    }
    _videoSession = videoSession;
    
    if (self.videoSession.isEnableVideo) {
        self.cameraButton.status = ButtonStatusNone;
    } else {
        self.cameraButton.status = ButtonStatusActive;
    }
    
    if (self.videoSession.isEnableAudio) {
        self.micButton.status = ButtonStatusNone;
    } else {
        self.micButton.status = ButtonStatusActive;
    }
    
    @weakify(self);
    [self.KVOController observe:self.videoSession keyPath:@keypath(self.videoSession, isEnableVideo) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        if (self.videoSession.isEnableVideo) {
            self.cameraButton.status = ButtonStatusNone;
        } else {
            self.cameraButton.status = ButtonStatusActive;
        }
    }];
    
    [self.KVOController observe:self.videoSession keyPath:@keypath(self.videoSession, isEnableAudio) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        @strongify(self);
        if (self.videoSession.isEnableAudio) {
            self.micButton.status = ButtonStatusNone;
        } else {
            self.micButton.status = ButtonStatusActive;
        }
    }];
}

- (instancetype)init {
    self = [super init];
    if (self) {
        
        [self addSubview:self.micButton];
        [self addSubview:self.cameraButton];
        [self addSubview:self.cutLinkButton];
        
        [self.cameraButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self);
            make.centerX.equalTo(self);
            make.width.height.mas_equalTo(32);
        }];
        
        [self.micButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self);
            make.right.equalTo(self.cameraButton.mas_left).offset(-16);
            make.width.height.mas_equalTo(32);
        }];
        
        [self.cutLinkButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self);
            make.left.equalTo(self.cameraButton.mas_right).offset(16);
            make.width.height.mas_equalTo(32);

        }];
        
    }
    return self;
}

#pragma mark - getter

- (BaseButton *)micButton {
    if (!_micButton) {
        _micButton = [[BaseButton alloc] init];
        _micButton.backgroundColor = [UIColor whiteColor];
        _micButton.layer.cornerRadius = 16;
        _micButton.layer.masksToBounds = YES;
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_room_mic"] status:ButtonStatusNone];
        [_micButton bingImage:[ThemeManager imageNamed:@"meeting_room_mic_s"] status:ButtonStatusActive];
        [_micButton.imageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(_micButton);
            make.width.height.mas_equalTo(16);
        }];
        WeakSelf
        [_micButton setBtnClickBlock:^(id  _Nonnull sender) {
            BOOL enable;
            if (wself.micButton.status == ButtonStatusNone) {
                enable = NO;
            } else {
                enable = YES;
            }
            [[EduBigClassRTCManager shareRtc] enableLocalAudio:enable];
            [EduBigClassRTMManager turnOnOffMic:enable];
        }];
    }
    return _micButton;
}

- (BaseButton *)cameraButton {
    if (!_cameraButton) {
        _cameraButton = [[BaseButton alloc] init];
        _cameraButton.backgroundColor = [UIColor whiteColor];
        _cameraButton.layer.cornerRadius = 16;
        _cameraButton.layer.masksToBounds = YES;
        [_cameraButton bingImage:[ThemeManager imageNamed:@"meeting_room_video"] status:ButtonStatusNone];
        [_cameraButton bingImage:[ThemeManager imageNamed:@"meeting_room_video_s"] status:ButtonStatusActive];
        [_cameraButton.imageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(_cameraButton);
            make.width.height.mas_equalTo(16);
        }];
        WeakSelf
        [_cameraButton setBtnClickBlock:^(id  _Nonnull sender) {
            BOOL enable;
            if (wself.cameraButton.status == ButtonStatusNone) {
                enable = NO;
            } else {
                enable = YES;
            }
            [[EduBigClassRTCManager shareRtc] enableLocalVideo:enable];
            [EduBigClassRTMManager turnOnOffCam:enable];
        }];
    }
    return _cameraButton;
}

- (BaseButton *)cutLinkButton {
    if (!_cutLinkButton) {
        _cutLinkButton = [[BaseButton alloc] init];
        _cutLinkButton.backgroundColor = [UIColor whiteColor];
        _cutLinkButton.layer.cornerRadius = 16;
        _cutLinkButton.layer.masksToBounds = YES;
        [_cutLinkButton bingImage:[ThemeManager imageNamed:@"meeting_par_cut_link"] status:ButtonStatusNone];
        [_cutLinkButton.imageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(_cutLinkButton);
            make.width.height.mas_equalTo(16);
        }];
        [_cutLinkButton setBtnClickBlock:^(id  _Nonnull sender) {
            [EduBigClassRTMManager leaveForLinkMic];
        }];
    }
    return _cutLinkButton;
}

@end
