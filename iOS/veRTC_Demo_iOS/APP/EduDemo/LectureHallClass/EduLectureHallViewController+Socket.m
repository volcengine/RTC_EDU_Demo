//
//  LectureHallStudentRoomViewController+Socket.m
//  veRTC_Demo
//
//  Created by bytedance on 2021/7/30.
//

#import "EduLectureHallViewController+Socket.h"
#import "EduRTMManager.h"

@implementation EduLectureHallViewController (Socket)


- (void)addSocketListener {
    __weak __typeof(self) wself = self;
    [EduRTMManager onBeginClassWithBlock:^(NSInteger timestamp) {
        if (wself) {
            [wself onClassBegin:timestamp];
        }
    }];

    [EduRTMManager onEndClassWithBlock:^(NSString * _Nonnull roomID) {
        if (wself) {
            [wself leaveClass];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                AlertActionModel *alertModel = [[AlertActionModel alloc] init];
                alertModel.title = @"确定";
                [[AlertActionManager shareAlertActionManager] showWithMessage:@"课堂已结束" actions:@[alertModel]];
            });
        }
    }];
    
    [EduRTMManager onOpenGroupSpeechWithBlock:^(NSString * _Nonnull roomID) {
        if (wself) {
            [wself changeGroupSpeech:YES];
        }
    }];
        
    [EduRTMManager onCloseGroupSpeechWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeGroupSpeech:NO];
        }
    }];

    [EduRTMManager onOpenVideoInteractWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeVideoInteract:YES];
        }
    }];

    [EduRTMManager onCloseVideoInteractWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeVideoInteract:NO];
        }
    }];

    [EduRTMManager onTeacherMicOnWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherMicStatus:YES];
        }
    }];

    [EduRTMManager onTeacherMicOffWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherMicStatus:NO];
        }
    }];

    [EduRTMManager onTeacherCameraOnWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherCameraStatus:YES];
        }
    }];

    [EduRTMManager onTeacherCameraOffWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherCameraStatus:NO];
        }
    }];

    [EduRTMManager onTeacherJoinRoomWithBlock:^(NSString *_Nonnull userName){
        if (wself) {
            [wself changeTeacherRoomStatus:YES userName:userName];
        }
    }];

    [EduRTMManager onTeacherLeaveRoomWithBlock:^(NSString *_Nonnull userName){
        if (wself) {
            [wself changeTeacherRoomStatus:NO userName:userName];
        }
    }];
    
    [EduRTMManager onStuMicOnWithBlock:^(NSString * _Nonnull roomID, NSString * _Nonnull uid, NSString * _Nonnull userName) {
        if (wself) {
            [wself changeStudentMic:YES uid:uid name:userName];
            if ([uid isEqualToString:[LocalUserComponents userModel].uid]) {
                [wself approveMic:YES];
            }
        }
    }];
    
    [EduRTMManager onStuMicOffWithBlock:^(NSString * _Nonnull roomID, NSString * _Nonnull uid) {
        if (wself) {
            [wself changeStudentMic:NO uid:uid name:@""];
            if ([uid isEqualToString:[LocalUserComponents userModel].uid]) {
                [wself approveMic:NO];
            }
        }
    }];
    
    [EduRTMManager onLogInElsewhereWithBlock:^(BOOL result) {
        if (wself) {
            [wself leaveClass];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                AlertActionModel *alertModel = [[AlertActionModel alloc] init];
                alertModel.title = @"确定";
                [[AlertActionManager shareAlertActionManager] showWithMessage:@"用户在另一台设备加入" actions:@[alertModel]];        
            });
        }
    }];
}

@end
