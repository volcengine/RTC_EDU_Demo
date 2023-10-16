//
//  EduBigClassRTMManager.m
//  SceneRTCDemo
//
//  Created by on 2021/3/16.
//

#import "EduBigClassRTMManager.h"
#import "EduBigClassRTCManager.h"
#import "JoinRTSParams.h"
#import "Core.h"

@implementation EduBigClassRTMManager

#pragma mark - Get EduBigClass data

+ (void)joinEduBigClass:(EduBCRoomVideoSession *)loginModel block:(nonnull void (^)(int result, EduBigClassControlRoomModel *, NSArray<EduBCRoomVideoSession *> *))block {
    NSDictionary *dicData = [JoinRTSParams addTokenToParams:nil];
    
    NSMutableDictionary *dic = [dicData mutableCopy];
    
    [dic setValue:loginModel.name forKey:@"user_name"];
    
    [dic setValue:[NSNumber numberWithInt:loginModel.isEnableAudio ? 1 : 0] forKey:@"mic"];
    [dic setValue:[NSNumber numberWithInt:loginModel.isEnableVideo ? 1 : 0] forKey:@"camera"];
    
    [dic setValue:[NSNumber numberWithInt:loginModel.isHost ? 1 : 0] forKey:@"user_role"];
    [dic setValue:[NSNumber numberWithInt:loginModel.isSlient ? 1 : 0] forKey:@"is_silence"];
    dicData = [dic copy];

    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubJoinRoom"
                                         with:dicData
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        
        NSMutableArray *linkLists = [[NSMutableArray alloc] init];
        if ([ackModel.response isKindOfClass:[NSDictionary class]]) {
            NSArray *lists = ackModel.response[@"linkmic_user_list"];
            if ([lists isKindOfClass:[NSArray class]]) {
                for (int i = 0; i < lists.count; i++) {
                    NSDictionary *dic = lists[i];
                    NSString *uid = dic[@"user_id"];
                    if(uid){
                        [linkLists addObject:uid];
                    }
                }
            }
        }
        
        NSMutableArray *userLists = [[NSMutableArray alloc] init];
        
        if ([ackModel.response isKindOfClass:[NSDictionary class]]) {
            NSArray *lists = ackModel.response[@"user_list"];
            if ([lists isKindOfClass:[NSArray class]]) {
                for (int i = 0; i < lists.count; i++) {
                    EduBigClassControlUserModel *EduBigClassUserModel = [EduBigClassControlUserModel yy_modelWithJSON:lists[i]];
                    EduBCRoomVideoSession *videoSession = [EduBCRoomVideoSession constructWithEduBigClassControlUserModel:EduBigClassUserModel];
                    //确保localVideoSession和list中的session是同一个对象
                   
                    if ([linkLists containsObject:videoSession.uid]) {
                        videoSession.linkMicStatus = LinkMicModeDone;
                    }
                    
                    if (!videoSession.isLoginUser) {
                        [userLists addObject:videoSession];
                    }
                }
                
                BaseUserModel *localUser = [LocalUserComponent userModel];
                localUser.name = loginModel.name;
                [LocalUserComponent updateLocalUserModel:localUser];
            }
        }
        
        EduBigClassControlRoomModel *roomModel = [EduBigClassControlRoomModel yy_modelWithJSON:ackModel.response[@"room"]];
        roomModel.token = ackModel.response[@"token"];
        roomModel.wb_token = ackModel.response[@"wb_token"];
        roomModel.wb_user_id = ackModel.response[@"wb_user_id"];
        roomModel.wb_room_id = ackModel.response[@"wb_room_id"];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block((int)ackModel.code, roomModel, [userLists copy]);
            }
        });
    }];
}

+ (void)leaveEduBigClass {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubLeaveRoom"
                                         with:dic
                                        block:nil];
}


+ (void)turnOnOffMic:(BOOL)on {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
    dic = [mutableDictionary copy];
    
    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubOperateSelfMic"
                                         with:dic
                                        block:nil];
}

+ (void)turnOnOffCam:(BOOL)on {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
    dic = [mutableDictionary copy];
    
    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubOperateSelfCamera"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
    }];
    dispatch_after(DISPATCH_TIME_NOW + (3 * NSEC_PER_SEC), dispatch_get_main_queue(),^{

    });
}

+ (void)getEduBigClassUserList:(void (^)(NSArray<EduBCRoomVideoSession *> *userLists, RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubGetUserList"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        NSMutableArray *modelLsts = [[NSMutableArray alloc] init];
        NSArray *data = (NSArray *)ackModel.response[@"user_list"];
        if (data && [data isKindOfClass:[NSArray class]]) {
            for (int i = 0; i < data.count; i++) {
                EduBigClassControlUserModel *controlUserModel = [EduBigClassControlUserModel yy_modelWithJSON:data[i]];
                EduBCRoomVideoSession *userModel = [EduBCRoomVideoSession constructWithEduBigClassControlUserModel:controlUserModel];
                [modelLsts addObject:userModel];
            }
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block([modelLsts copy], ackModel);
            }
        });
    }];

}

+ (void)getHistoryVideoRecord:(BOOL)isHolder block:(void (^)(NSArray<EduBigClassControlRecordModel *> *recordLists, RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubGetRecordList"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        NSMutableArray *modelLsts = [[NSMutableArray alloc] init];
        NSArray *data = (NSArray *)ackModel.response;
        if (data && [data isKindOfClass:[NSArray class]]) {
            for (int i = 0; i < data.count; i++) {
                EduBigClassControlRecordModel *model = [EduBigClassControlRecordModel yy_modelWithJSON:data[i]];
                if (isHolder == model.video_holder) {
                    [modelLsts addObject:model];
                }
            }
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block([modelLsts copy], ackModel);
            }
        });
    }];
}


+ (void)resync:(void (^)(RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubResync"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(ackModel);
            }
        });
    }];
}


#pragma mark - Control EduBigClass status
+ (void)applyForLinkMic {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];

    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubLinkmicApply" with:dic block:^(RTMACKModel * _Nonnull ackModel) {

    }];
}

+ (void)cancelApplyForLinkMic {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];

    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubLinkmicApplyCancel" with:dic block:^(RTMACKModel * _Nonnull ackModel) {

    }];
}

+ (void)leaveForLinkMic {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];

    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubLinkmicLeave" with:dic block:^(RTMACKModel * _Nonnull ackModel) {

    }];
}

+ (void)applyForSharePermission:(void (^)(BOOL result))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];

    [[EduBigClassRTCManager shareRtc] emitWithAck:@"edubSharePermissionApply" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
        if (block) {
            block(NO);
        }
    }];
}



#pragma mark - Notification message

+ (void)onUserMicStatusChanged:(void (^)(NSString *uid, BOOL result))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnOperateSelfMic" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        BOOL status = NO;
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            status = [noticeModel.data[@"operate"] intValue];
        }
        if (block) {
            block(uid, status);
        }
    }];
}

+ (void)onUserCamStatusChanged:(void (^)(NSString *uid, BOOL result))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnOperateSelfCamera" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        BOOL status = NO;
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            status = [noticeModel.data[@"operate"] intValue];
        }
        if (block) {
            block(uid, status);
        }
    }];
}

+ (void)onUserJoinEduBigClass:(void (^)(EduBigClassControlUserModel *model))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnJoinRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        EduBigClassControlUserModel *model = [EduBigClassControlUserModel yy_modelWithJSON:noticeModel.data[@"user"]];
        if (block) {
            block(model);
        }
    }];
}

+ (void)onUserLeaveEduBigClass:(void (^)(EduBigClassControlUserModel *uid))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnLeaveRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        EduBigClassControlUserModel *model = [EduBigClassControlUserModel yy_modelWithJSON:noticeModel.data[@"user"]];
        if (block) {
            block(model);
        }
    }];
}

+ (void)onUserStartShare:(void (^)(NSString *uid, NSString * _Nonnull name, int share_type, BOOL result))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnStartShare" block:^(RTMNoticeModel * _Nonnull noticeModel) {
    
        NSString *uid = @"";
        NSString *name = @"";
        int type = -1;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            name = noticeModel.data[@"user_name"];
            type = [noticeModel.data[@"share_type"] intValue];
        }
        
        if (block) {
            block(uid, name, type, YES);
        }
    }];
}

+ (void)onUserStopShare:(void (^)(NSString *uid, BOOL result))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnFinishShare" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
        }
        if (block) {
            block(uid, NO);
        }
    }];
}

+ (void)onEduBigClassEnd:(void (^)(int reason))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnFinishRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        int reason = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            reason = [noticeModel.data[@"reason"] intValue];
        }
        
        if (block) {
            block(reason);
        }
    }];
}

+ (void)onReceiveTurnOnOffMicInvite:(void (^)(NSString *uid, BOOL status))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnOperateOtherMic" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        BOOL status = NO;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"operate_user_id"];
            status = [noticeModel.data[@"operate"] intValue];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(uid, status);
            }
        });
    }];
}

+ (void)onReceiveTurnOnOffCamInvite:(void (^)(NSString *uid, BOOL status))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnOperateOtherCamera" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        BOOL status = NO;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"operate_user_id"];
            status = [noticeModel.data[@"operate"] intValue];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(uid, status);
            }
        });
    }];
}

+ (void)onRecordStarted:(void (^)(BOOL result))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnStartRecord" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        if (block) {
            block(YES);
        }
    }];
}

+ (void)onRecordFinished:(void (^)(BOOL result))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnStopRecord" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        if (block) {
            block(NO);
        }
    }];
}

+ (void)onOperateOtherSharePermission:(void (^)(BOOL accepted,NSString *uid))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnSharePermissionPermit" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *user_id = @"";
        int permit = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            user_id = noticeModel.data[@"user_id"];
            permit = [noticeModel.data[@"permit"] intValue];
        }
        
        if (block) {
            block(permit,user_id);
        }
    }];
}

+ (void)onLinkmicApplyUserListChange:(void (^)(NSInteger applyUserCount))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnLinkmicApplyUserListChange" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSInteger userCount = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userCount = [noticeModel.data[@"apply_user_count"] longValue];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(userCount);
            }
        });
    }];
}

+ (void)onLinkmicJoin:(void (^)(NSString *uid))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnLinkmicJoin" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userId = @"";
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]] && [noticeModel.data[@"user"] isKindOfClass:NSDictionary.class]) {
            userId = [noticeModel.data[@"user"] objectForKey:@"user_id"];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(userId);
            }
        });
    }];
}

+ (void)onLinkmicLeave:(void (^)(NSString *uid))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnLinkmicLeave" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userId = @"";
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]] && [noticeModel.data[@"user"] isKindOfClass:NSDictionary.class]) {
            userId = [noticeModel.data[@"user"] objectForKey:@"user_id"];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(userId);
            }
        });
    }];
}

+ (void)onLinkmicPermit:(void (^)(BOOL accepted))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnLinkmicPermit" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        BOOL status = NO;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            status = [noticeModel.data[@"permit"] intValue];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(status);
            }
        });
    }];
}

+ (void)onLinkmicKick:(void (^)(NSString *roomId, NSString *uid))block {
    [[EduBigClassRTCManager shareRtc] onSceneListener:@"edubOnLinkmicKick" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomId = @"";
        NSString *userId = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomId = [noticeModel.data[@"room_id"] stringValue];
            userId = [noticeModel.data[@"kick_user_id"] stringValue];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(roomId, userId);
            }
        });
    }];
}

@end
