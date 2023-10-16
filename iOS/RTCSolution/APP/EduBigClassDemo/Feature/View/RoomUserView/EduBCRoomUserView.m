//
//  EduBCRoomUserView.m
//
//  Created by on 2022/11/11.
//

#import "EduBCRoomUserView.h"
#import "EduBCAvatarView.h"
#import "EduBCUserNameTagView.h"
#import "UserOperateView.h"

@interface EduBCRoomUserView ()

@property (nonatomic, strong) EduBCAvatarView *EduBCAvatarView;
@property (nonatomic, strong) EduBCUserNameTagView *nameView;
@property (nonatomic, strong) UIView *videoCanvas;
@property (nonatomic, strong) EduBCRoomVideoSession *videoSession;
@property (nonatomic, strong) UserOperateView *operateView;

@end

@implementation EduBCRoomUserView

- (instancetype)init {
    self = [super init];
    if (self) {
        self.backgroundColor = [ThemeManager cellBackgroundColor];
        self.layer.borderColor = [[ThemeManager activeSpeakerBorderColor] CGColor];
        self.layer.masksToBounds = YES;
        self.layer.cornerRadius = 4.f;
        
        [self addSubview:self.EduBCAvatarView];
        [self.EduBCAvatarView mas_makeConstraints:^(MASConstraintMaker *make) {
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
        
        [self addSubview:self.operateView];
        [self.operateView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
        
        UITapGestureRecognizer *tag = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(switchOperateViewHidden)];
        [self addGestureRecognizer:tag];
    }
    return self;
}

- (void)setVideoSession:(EduBCRoomVideoSession *)session {
    _videoSession = session;
    
    self.EduBCAvatarView.text = session.name;
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
    self.operateView.videoSession = session;
    if (session.isLoginUser && self.videoSession.showOperationView) {
        self.operateView.hidden = NO;
    } else {
        self.operateView.hidden = YES;
    }
}

- (void)setScreenSession:(EduBCRoomVideoSession *)session {
    _videoSession = session;
    
    self.EduBCAvatarView.text = session.name;
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
    
    [self.EduBCAvatarView setFontSize:fontSize];
    [self.EduBCAvatarView mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(width, width));
        make.center.equalTo(self);
    }];
}

- (void)switchOperateViewHidden {
    self.videoSession.showOperationView = !self.videoSession.showOperationView;
}

#pragma mark - getter
- (EduBCAvatarView *)EduBCAvatarView {
    if (!_EduBCAvatarView) {
        _EduBCAvatarView = [[EduBCAvatarView alloc] init];
        _EduBCAvatarView.layer.masksToBounds = YES;
    }
    return _EduBCAvatarView;
}

- (EduBCUserNameTagView *)nameView {
    if (!_nameView) {
        _nameView = [[EduBCUserNameTagView alloc] init];
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

- (UserOperateView *) operateView{
    if (!_operateView) {
        _operateView = [[UserOperateView alloc] init];
        _operateView.backgroundColor = [UIColor colorWithWhite:0.1 alpha:0.1];
        _operateView.hidden = YES;
    }
    return _operateView;
}

@end
