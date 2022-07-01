//
//  EduUserModel.m
//  veRTC_Demo
//
//  Created by bytedance on 2021/5/28.
//  Copyright © 2021 . All rights reserved.
//

#import "EduBreakoutRTCManager.h"
#import "EduRTCManager.h"
#import "EduUserModel.h"

@implementation EduUserModel

- (void)dealloc {
    NSLog(@"%@,%s", self.name, __func__);
}

- (instancetype)initWithUid:(NSString *)uid {
    self = [super init];
    if (self) {
        self.uid = uid;
    }
    return self;
}

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"appId" : @"app_id",
             @"roomId" : @"room_id",
             @"userRole" : @"user_role",
             @"userStatus" : @"user_status",
             @"createTime" : @"create_time",
             @"updateTime" : @"update_time",
             @"joinTime" : @"join_time",
             @"leaveTime" : @"leave_time",
             @"isMicOn" : @"is_mic_on",
             @"isCameraOn" : @"is_camera_on",
             @"isHandsUp" : @"is_hands_up",
             @"groupSpeechJoinRtc" : @"group_speech_join_rtc",
             @"rtcToken" : @"rtc_roken",
             @"uid" : @"user_id",
             @"name" : @"user_name"};
}

- (UIView *)streamView {
    if (!_streamView) {
        _streamView = [[UIView alloc] init];
        _streamView.hidden = YES;
    }

    self.canvas.view = _streamView;

    switch (_roomType) {
        case EduUserRoomTypeLeature: {
            if (self.isSelf) {
                //Local Video
                [[EduRTCManager shareRtc] setupLocalVideo:_canvas];
            } else {
                //Remote Video
                [[EduRTCManager shareRtc] setupRemoteVideo:_canvas];
            }
        } break;
        case EduUserRoomTypeBreakoutHost: {
            if (self.isSelf) {
                //Local Video
                [[EduBreakoutRTCManager shareRtc] setupLocalVideo:_canvas];
            } else {
                //Remote Video
                [[EduBreakoutRTCManager shareRtc] setHostRoomRemoteVideo:_canvas];
            }
        } break;

        case EduUserRoomTypeBreakoutGroup: {
            if (self.isSelf) {
                //Local Video
                [[EduBreakoutRTCManager shareRtc] setupLocalVideo:_canvas];
            } else {
                //Remote Video
                [[EduBreakoutRTCManager shareRtc] setGroupRoomRemoteVideo:_canvas];
            }
        } break;
    }

    return _streamView;
}

- (ByteRTCVideoCanvas *)canvas {
    if (_canvas == nil) {
        _canvas = [[ByteRTCVideoCanvas alloc] init];
        _canvas.renderMode = ByteRTCRenderModeHidden;
        _canvas.view = self.streamView;
    }
    _canvas.uid = self.uid;
    return _canvas;
}

- (BOOL)isSelf {
    if ([self.uid isEqualToString:[LocalUserComponents userModel].uid]) {
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)isVideoStream {
    if ([self.uid isEqualToString:[LocalUserComponents userModel].uid]) {
        return YES;
    } else {
        return _isVideoStream;
    }
}

@end
