//
//  RoomUserView.m
//
//  Created by on 2022/11/11.
//

#import "RoomUserView.h"
#import "AvatarView.h"
#import "UserNameTagView.h"

@interface RoomUserView ()

@property (nonatomic, strong) AvatarView *avatarView;
@property (nonatomic, strong) UserNameTagView *nameView;
@property (nonatomic, strong) UIView *videoCanvas;
@property (nonatomic, strong) RoomVideoSession *videoSession;

@end

@implementation RoomUserView

- (instancetype)init {
    self = [super init];
    if (self) {
        self.backgroundColor = [ThemeManager cellBackgroundColor];
        self.layer.borderColor = [[ThemeManager activeSpeakerBorderColor] CGColor];
        self.layer.masksToBounds = YES;
        self.layer.cornerRadius = 4.f;
        
        [self addSubview:self.avatarView];
        [self.avatarView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(88, 88));
            make.center.equalTo(self);
        }];
        
        [self addSubview:self.videoCanvas];
        [self.videoCanvas mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
        
        [self addSubview:self.nameView];
        [self.nameView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self.mas_left).offset(2.f);
            make.bottom.mas_equalTo(self.mas_bottom).offset(-2.f);
        }];
    }
    return self;
}

- (void)setVideoSession:(RoomVideoSession *)session {
    _videoSession = session;
    
    self.avatarView.text = session.name;
    self.nameView.title  = session.isLoginUser ? [NSString stringWithFormat:@"%@（我）",session.name] : session.name;
    self.nameView.isHost = session.isHost;
    self.nameView.isShare = session.isSharingScreen || session.isSharingWhiteBoard;
    self.nameView.isBanMic = !session.isEnableAudio;
    if (session.isEnableVideo && session.isVisible) {
        if (![self.videoCanvas.subviews containsObject:session.videoView]) {
            //NSLog(@"addView:%p to canvas:%p of session:%p, uid:%@, self:%p", session.videoView, self.videoCanvas, session, session.uid, self);
            [self.videoCanvas addSubview:session.videoView];
            [session.videoView mas_remakeConstraints:^(MASConstraintMaker *make) {
                make.edges.equalTo(self.videoCanvas);
            }];
        }else {
            [self setNeedsDisplay];
            [self layoutIfNeeded];
        }
        self.videoCanvas.hidden = NO;
    } else {
        self.videoCanvas.hidden = YES;
    }
    
    if (session.isMaxVolume && session.volume > 0) {
        self.layer.borderWidth = 2.5f;
        self.layer.borderColor = [[ThemeManager activeSpeakerBorderColor] CGColor];
    } else {
        if (!session.isEnableVideo) {
            self.layer.borderWidth = 2.5f;
            self.layer.borderColor = [[UIColor whiteColor] CGColor];
        } else {
            self.layer.borderWidth = 0.f;
        }
    }
}

- (void)setScreenSession:(RoomVideoSession *)session {
    _videoSession = session;
    
    self.avatarView.text = session.name;
    self.nameView.title  = session.name;
    self.nameView.isHost = session.isHost;
    self.nameView.isShare = session.isSharingScreen;
    self.nameView.isBanMic = !session.isEnableAudio;
    
    if (session.isSharingScreen/* && session.isVisible*/) {
        [self.videoCanvas addSubview:session.screenView];
        [session.screenView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self.videoCanvas);
        }];
        self.videoCanvas.hidden = NO;
    } else {
        self.videoCanvas.hidden = YES;
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    CGRect  frame = self.frame;
    CGFloat width = MIN(CGRectGetWidth(frame), CGRectGetHeight(frame))*0.5;
    if (width > 200) width = 200;
    
    CGFloat fontSize;
    if (width >= 150) {
        fontSize = 60.f;
    } else if (width >= 100) {
        fontSize = 48.f;
    } else {
        fontSize = 24.f;
    }
    
    [self.avatarView setFontSize:fontSize];
    [self.avatarView mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(width, width));
        make.center.equalTo(self);
    }];
}

#pragma mark - getter
- (AvatarView *)avatarView {
    if (!_avatarView) {
        _avatarView = [[AvatarView alloc] init];
        _avatarView.layer.masksToBounds = YES;
    }
    return _avatarView;
}

- (UserNameTagView *)nameView {
    if (!_nameView) {
        _nameView = [[UserNameTagView alloc] init];
    }
    return _nameView;
}

- (UIView *)videoCanvas {
    if (!_videoCanvas) {
        _videoCanvas = [[UIView alloc] init];
        [_videoCanvas setBackgroundColor:[UIColor clearColor]];
    }
    return _videoCanvas;
}

@end
