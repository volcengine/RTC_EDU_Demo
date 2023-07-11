// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduBreakoutClassViewController+Socket.h"
#import "EduRTSManager.h"

@implementation EduBreakoutClassViewController (Socket)
- (void)addSocketListener {
    __weak __typeof(self) wself = self;
    [EduRTSManager onBeginClassWithBlock:^(NSInteger timestamp) {
        if (wself) {
            [wself onClassBegin:timestamp];
        }
    }];

    [EduRTSManager onEndClassWithBlock:^(NSString * _Nonnull roomID) {
        if (wself) {
            [wself leaveClass];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                AlertActionModel *alertModel = [[AlertActionModel alloc] init];
                alertModel.title = @"确定";
                [[AlertActionManager shareAlertActionManager] showWithMessage:@"课程已结束" actions:@[alertModel]];
            });
        }
    }];
    
    [EduRTSManager onOpenGroupSpeechWithBlock:^(NSString * _Nonnull roomID) {
        if (wself) {
            [wself changeGroupSpeech:YES];
        }
    }];
        
    [EduRTSManager onCloseGroupSpeechWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeGroupSpeech:NO];
        }
    }];

    [EduRTSManager onOpenVideoInteractWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeVideoInteract:YES];
        }
    }];

    [EduRTSManager onCloseVideoInteractWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeVideoInteract:NO];
        }
    }];

    [EduRTSManager onTeacherMicOnWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherMicStatus:YES];
        }
    }];

    [EduRTSManager onTeacherMicOffWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherMicStatus:NO];
        }
    }];

    [EduRTSManager onTeacherCameraOnWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherCameraStatus:YES];
        }
    }];

    [EduRTSManager onTeacherCameraOffWithBlock:^(NSString *_Nonnull roomID){
        if (wself) {
            [wself changeTeacherCameraStatus:NO];
        }
    }];

    [EduRTSManager onTeacherJoinRoomWithBlock:^(NSString *_Nonnull userName){
        if (wself) {
            [wself changeTeacherRoomStatus:YES userName:userName];
        }
    }];

    [EduRTSManager onTeacherLeaveRoomWithBlock:^(NSString *_Nonnull userName){
        if (wself) {
            [wself changeTeacherRoomStatus:NO userName:userName];
        }
    }];
    
    [EduRTSManager onStudentJoinGroupRoomWithBlock:^(NSString * _Nonnull uid,NSString * _Nonnull usrName) {
        if(wself){
            [wself changeStudentGroupStatusUid:uid name:usrName join:YES];
        }
    }];
    
    [EduRTSManager onStudentLeaveGroupRoomWithBlock:^(NSString * _Nonnull uid,NSString * _Nonnull usrName) {
        if(wself){
            [wself changeStudentGroupStatusUid:uid name:usrName join:NO];
        }
    }];
    
    [EduRTSManager onStuMicOnWithBlock:^(NSString * _Nonnull roomID, NSString * _Nonnull uid, NSString * _Nonnull userName) {
        if (wself) {
            if ([uid isEqualToString:[LocalUserComponent userModel].uid]) {
                [wself approveMic:YES];
            }
            [wself changeStudentMic:YES uid:uid name:userName];
        }
    }];
    
    [EduRTSManager onStuMicOffWithBlock:^(NSString * _Nonnull roomID, NSString * _Nonnull uid) {
        if (wself) {
            [wself changeStudentMic:NO uid:uid name:@""];
            if ([uid isEqualToString:[LocalUserComponent userModel].uid]) {
                [wself approveMic:NO];
            }
        }
    }];
    
    [EduRTSManager onLogInElsewhereWithBlock:^(BOOL result) {
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
