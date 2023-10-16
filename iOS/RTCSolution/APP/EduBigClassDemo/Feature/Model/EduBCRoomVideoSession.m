//
//  EduBCRoomVideoSession.m
//  quickstart
//
//  Created by on 2021/4/2.
//  
//

#import "EduBCRoomVideoSession.h"
#import "EduBigClassRTCManager.h"

@implementation EduBCRoomVideoSession

- (instancetype)initWithUid:(NSString *)uid {
    self = [super init];
    if (self) {
        self.uid = uid;
        self.hasSharePermission = NO;
        self.hasOperatePermission = YES;
        self.linkMicStatus = LinkMicModeNone;
    }
    return self;
}

- (UIView *)videoView {
    if (!_videoView) {
        _videoView = [[UIView alloc] init];
    }
    
    ByteRTCVideoCanvas *canvas = [[ByteRTCVideoCanvas alloc] init];
    canvas.renderMode = ByteRTCRenderModeHidden;
    canvas.view.backgroundColor = [UIColor clearColor];
    canvas.view = _videoView;
    
    if (self.isLoginUser) {
        //Local Video
        [[EduBigClassRTCManager shareRtc] setupLocalVideo:canvas uid:self.uid];
    } else {
        //Remote Video
        [[EduBigClassRTCManager shareRtc] setupRemoteVideo:canvas uid:self.uid];
    }
    return _videoView;
}

- (UIView *)screenView {
    if (!_screenView) {
        _screenView = [[UIView alloc] init];
    }
    
    if (self.isLoginUser) {
    } else {
        [[EduBigClassRTCManager shareRtc] setupRemoteScreen:_screenView uid:self.uid];
    }
    return _screenView;
}

+ (EduBCRoomVideoSession *)constructWithEduBigClassControlUserModel:(EduBigClassControlUserModel *)model {
    EduBCRoomVideoSession *session = [[EduBCRoomVideoSession alloc] initWithUid:model.user_id];
    session.name = model.user_name;
    session.roomId = model.room_id;
    session.isSharingScreen = (model.share_type == kShareTypeScreen) && model.share_status;
    session.isSharingWhiteBoard = (model.share_type == kShareTypeWhiteBoard) && model.share_status;
    session.isLoginUser = NO;
    session.isHost = !!model.user_role;
    session.userUniform = model.user_name;
    session.hasSharePermission = model.share_permission;
    session.isEnableAudio = model.mic;
    session.isEnableVideo = model.camera;
    return session;
}

- (BOOL)isLoginUser {
    if ([self.uid isEqualToString:[LocalUserComponent userModel].uid]) {
        return YES;
    } else {
        return NO;
    }
}

- (void)setIsEnableVideo:(BOOL)isEnableVideo {
    if (_isEnableVideo != isEnableVideo) {
        _isEnableVideo = isEnableVideo;
        _isUpdated = YES;
    }
}

- (void)setIsSharingScreen:(BOOL)isSharingScreen {
    if (_isSharingScreen != isSharingScreen) {
        _isSharingScreen = isSharingScreen;
        _isUpdated = YES;
    }
}

- (void)setIsSharingWhiteBoard:(BOOL)isSharingWhiteBoard {
    if (_isSharingWhiteBoard != isSharingWhiteBoard) {
        _isSharingWhiteBoard = isSharingWhiteBoard;
        _isUpdated = YES;
    }
}

- (void)setIsVisible:(BOOL)isVisible {
    if (_isVisible != isVisible) {
        _isVisible = isVisible;
        _isUpdated = YES;
    }
}

- (BOOL)isEqualToSession:(EduBCRoomVideoSession *)session {
    return [self isEqual:session];
}

@end
