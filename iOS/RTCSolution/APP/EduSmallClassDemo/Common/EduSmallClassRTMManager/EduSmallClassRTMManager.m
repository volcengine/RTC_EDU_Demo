//
//  EduSmallClassRTMManager.m
//  SceneRTCDemo
//
//  Created by on 2021/3/16.
//

#import "EduSmallClassRTMManager.h"
#import "EduSmallClassRTCManager.h"
#import "JoinRTSParams.h"
#import "Core.h"

@implementation EduSmallClassRTMManager

#pragma mark - Get EduSmallClass data

+ (void)joinEduSmallClass:(EduSCRoomVideoSession *)loginModel block:(nonnull void (^)(int result, EduSmallClassControlRoomModel *, NSArray<EduSCRoomVideoSession *> *))block {
    NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
    [dic setValue:loginModel.appid forKey:@"app_id"];
    [dic setValue:loginModel.uid forKey:@"user_id"];
    
    [dic setValue:loginModel.name forKey:@"user_name"];
    [dic setValue:loginModel.roomId forKey:@"room_id"];
    
    [dic setValue:[NSNumber numberWithInt:loginModel.isEnableAudio ? 1 : 0] forKey:@"mic"];
    [dic setValue:[NSNumber numberWithInt:loginModel.isEnableVideo ? 1 : 0] forKey:@"camera"];
    
    [dic setValue:[NSNumber numberWithInt:loginModel.isHost ? 1 : 0] forKey:@"user_role"];
    [dic setValue:[NSNumber numberWithInt:loginModel.isSlient ? 1 : 0] forKey:@"is_silence"];
    
    NSDictionary *dicData = [JoinRTSParams addTokenToParams:[dic copy]];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusJoinRoom"
                                         with:dicData
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        NSMutableArray *userLists = [[NSMutableArray alloc] init];
        
        if ([ackModel.response isKindOfClass:[NSDictionary class]]) {
            NSArray *lists = ackModel.response[@"user_list"];
            if ([lists isKindOfClass:[NSArray class]]) {
                for (int i = 0; i < lists.count; i++) {
                    EduSmallClassControlUserModel *EduSmallClassUserModel = [EduSmallClassControlUserModel yy_modelWithJSON:lists[i]];
                    EduSCRoomVideoSession *videoSession = [EduSCRoomVideoSession constructWithEduSmallClassControlUserModel:EduSmallClassUserModel];
                    [userLists addObject:videoSession];
                }
                
                BaseUserModel *localUser = [LocalUserComponent userModel];
                localUser.name = loginModel.name;
                [LocalUserComponent updateLocalUserModel:localUser];
            }
        }
        
        EduSmallClassControlRoomModel *roomModel = [EduSmallClassControlRoomModel yy_modelWithJSON:ackModel.response[@"room"]];
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

+ (void)leaveEduSmallClass {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusLeaveRoom"
                                         with:dic
                                        block:nil];
}

+ (void)endEduSmallClass {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusFinishRoom" with:dic block:nil];
}


+ (void)turnOnOffMic:(BOOL)on {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
    dic = [mutableDictionary copy];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateSelfMic"
                                         with:dic
                                        block:nil];
}

+ (void)turnOnOffCam:(BOOL)on {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
    dic = [mutableDictionary copy];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateSelfCamera"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
    }];
}

+ (void)getEduSmallClassUserList:(void (^)(NSArray<EduSCRoomVideoSession *> *userLists, RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusGetUserList"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        NSMutableArray *modelLsts = [[NSMutableArray alloc] init];
        NSArray *data = (NSArray *)ackModel.response[@"user_list"];
        if (data && [data isKindOfClass:[NSArray class]]) {
            for (int i = 0; i < data.count; i++) {
                EduSmallClassControlUserModel *controlUserModel = [EduSmallClassControlUserModel yy_modelWithJSON:data[i]];
                EduSCRoomVideoSession *userModel = [EduSCRoomVideoSession constructWithEduSmallClassControlUserModel:controlUserModel];
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

+ (void)getHistoryVideoRecord:(BOOL)isHolder block:(void (^)(NSArray<EduSmallClassControlRecordModel *> *recordLists, RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusGetHistoryVideoRecord"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        NSMutableArray *modelLsts = [[NSMutableArray alloc] init];
        NSArray *data = (NSArray *)ackModel.response;
        if (data && [data isKindOfClass:[NSArray class]]) {
            for (int i = 0; i < data.count; i++) {
                EduSmallClassControlRecordModel *model = [EduSmallClassControlRecordModel yy_modelWithJSON:data[i]];
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

+ (void)deleteVideoRecord:(NSString *)vid block:(void (^)(RTMACKModel *model))block {
    NSDictionary *dic = @{@"vid" : vid};
    dic = [JoinRTSParams addTokenToParams:dic];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusDeleteVideoRecord"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(ackModel);
            }
        });
    }];
}

+ (void)resync:(void (^)(RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusResync"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(ackModel);
            }
        });
    }];
}


#pragma mark - Control EduSmallClass status

+ (void)forceTurnOnOffShareOfUser:(NSString *)userId status:(BOOL)on block:(void (^)(BOOL result, RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    if (NOEmptyStr(userId)) {
        NSMutableDictionary *mutableDictionary = [dic mutableCopy];
        [mutableDictionary setValue:userId forKey:@"operate_user_id"];
        [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
        dic = [mutableDictionary copy];
    }
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateOtherSharePermission"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(NO, ackModel);
            }
        });
    }];
}

+ (void)forceTurnOnOffMicOfUser:(NSString *)userId status:(BOOL)on block:(void (^)(BOOL result, RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    if (NOEmptyStr(userId)) {
        NSMutableDictionary *mutableDictionary = [dic mutableCopy];
        [mutableDictionary setValue:userId forKey:@"operate_user_id"];
        [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
        dic = [mutableDictionary copy];
    }
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateOtherMic"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(NO, ackModel);
            }
        });
    }];
}

+ (void)forceTurnOnOffMicOfAllUsers:(BOOL)on canOperateBySelf:(BOOL)can block:(void (^)(RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:[NSNumber numberWithInt:can ? 1 : 0] forKey:@"operate_self_mic_permission"];
    [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
    dic = [mutableDictionary copy];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateAllMic"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(ackModel);
            }
        });
    }];
}

+ (void)forceTurnOnOffCamOfUser:(NSString *)userId status:(BOOL)on block:(void (^)(BOOL result, RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    if (NOEmptyStr(userId)) {
        NSMutableDictionary *mutableDictionary = [dic mutableCopy];
        [mutableDictionary setValue:userId forKey:@"operate_user_id"];
        [mutableDictionary setValue:[NSNumber numberWithInt:on ? 1 : 0] forKey:@"operate"];
        dic = [mutableDictionary copy];
    }
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateOtherCamera"
                                         with:dic
                                        block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(NO, ackModel);
            }
        });
    }];
}

+ (void)applyForMicPermission:(NSString *)userId block:(void (^)(BOOL result))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    if (NOEmptyStr(userId)) {
        NSMutableDictionary *mutableDictionary = [dic mutableCopy];
        [mutableDictionary setValue:userId forKey:@"user_id"];
        [mutableDictionary setValue:@(1) forKey:@"operate"];
        dic = [mutableDictionary copy];
    }

    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateSelfMicApply"
                                         with:dic
                                        block:^(RTMACKModel *_Nonnull ackModel) {
                                          if (block) {
                                              block(NO);
                                          }
                                        }];
}

+ (void)applyForCamPermission:(NSString *)userId block:(void (^)(BOOL result))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    if (NOEmptyStr(userId)) {
        NSMutableDictionary *mutableDictionary = [dic mutableCopy];
        [mutableDictionary setValue:userId forKey:@"user_id"];
        dic = [mutableDictionary copy];
    }
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateSelfCameraApply" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
        if (block) {
            block(NO);
        }
    }];
}

+ (void)applyForSharePermission:(NSString *)userId block:(void (^)(BOOL result))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    if (NOEmptyStr(userId)) {
        NSMutableDictionary *mutableDictionary = [dic mutableCopy];
        [mutableDictionary setValue:userId forKey:@"user_id"];
        dic = [mutableDictionary copy];
    }
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusSharePermissionApply" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
        if (block) {
            block(NO);
        }
    }];
}

+ (void)requestForRecord {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusStartRecordApply" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
    }];
}

+ (void)startShare:(int)share_type {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:[NSNumber numberWithInt:share_type] forKey:@"share_type"];
    dic = [mutableDictionary copy];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusStartShare" with:dic block:nil];
}

+ (void)endShare {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusFinishShare" with:dic block:nil];
}

+ (void)startRecord {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusStartRecord" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
    }];
}

+ (void)stopRecord {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusStopRecord" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
    }];
}

#pragma mark - Notification message

+ (void)onUserMicStatusChanged:(void (^)(NSString *uid, BOOL result))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateSelfMic" block:^(RTMNoticeModel * _Nonnull noticeModel) {
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
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateSelfCamera" block:^(RTMNoticeModel * _Nonnull noticeModel) {
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

+ (void)onUserJoinEduSmallClass:(void (^)(EduSmallClassControlUserModel *model))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnJoinRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        EduSmallClassControlUserModel *model = [EduSmallClassControlUserModel yy_modelWithJSON:noticeModel.data[@"user"]];
        if (block) {
            block(model);
        }
    }];
}

+ (void)onUserLeaveEduSmallClass:(void (^)(EduSmallClassControlUserModel *uid))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnLeaveRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        EduSmallClassControlUserModel *model = [EduSmallClassControlUserModel yy_modelWithJSON:noticeModel.data[@"user"]];
        if (block) {
            block(model);
        }
    }];
}

+ (void)onUserStartShare:(void (^)(NSString *uid, NSString * name, int share_type, BOOL result))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnStartShare" block:^(RTMNoticeModel * _Nonnull noticeModel) {
    
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
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnFinishShare" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
        }
        if (block) {
            block(uid, NO);
        }
    }];
}

+ (void)onEduSmallClassEnd:(void (^)(int reason))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnFinishRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        int reason = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            reason = [noticeModel.data[@"reason"] intValue];
        }
        
        if (block) {
            block(reason);
        }
    }];
}

+ (void)onForceTurnOnOffMicOfAllUsers:(void (^)(BOOL on, BOOL can))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateAllMic" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                BOOL on = NO, can = NO;
                
                if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
                    on = [noticeModel.data[@"operate"] intValue];
                    can = [noticeModel.data[@"operate_self_mic_permission"] intValue];
                }
                
                block(on, can);
            }
        });
    }];
}

+ (void)onReceiveTurnOnOffMicInvite:(void (^)(NSString *uid, BOOL status))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateOtherMic" block:^(RTMNoticeModel * _Nonnull noticeModel) {
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
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateOtherCamera" block:^(RTMNoticeModel * _Nonnull noticeModel) {
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
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnStartRecord" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        if (block) {
            block(YES);
        }
    }];
}

+ (void)onRecordFinished:(void (^)(BOOL result))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnStopRecord" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        if (block) {
            block(NO);
        }
    }];
}

+ (void)onReceiveMicPermissionApply:(void (^)(NSString *uid, NSString *name))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateSelfMicApply" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        NSString *name = @"";
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            name = noticeModel.data[@"user_name"];
        }
        
        if (block) {
            block(uid, name);
        }
    }];
}

+ (void)grantMicPermission:(NSString *)userId result:(BOOL)granted {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:userId forKey:@"apply_user_id"];
    [mutableDictionary setValue:[NSNumber numberWithInt:granted ? 1 : 0] forKey:@"permit"];
    dic = [mutableDictionary copy];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateSelfMicPermit" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
    }];
}

+ (void)onMicPermissionAccepted:(void (^)(BOOL accepted))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateSelfMicPermit" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        int permit = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            permit = [noticeModel.data[@"permit"] intValue];
        }
        
        if (block) {
            block(!!permit);
        }
    }];
}

+ (void)onReceiveCamPermissionApply:(void (^)(NSString *uid, NSString *name))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateSelfCameraApply" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        NSString *name = @"";
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            name = noticeModel.data[@"user_name"];
        }
        
        if (block) {
            block(uid, name);
        }
    }];
}

+ (void)grantCamPermission:(NSString *)userId result:(BOOL)granted {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:userId forKey:@"apply_user_id"];
    [mutableDictionary setValue:[NSNumber numberWithInt:granted ? 1 : 0] forKey:@"permit"];
    dic = [mutableDictionary copy];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusOperateSelfCameraPermit" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
    }];
}

+ (void)onCamPermissionAccepted:(void (^)(BOOL accepted))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateSelfCameraPermit" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        int permit = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            permit = [noticeModel.data[@"permit"] intValue];
        }
        
        if (block) {
            block(!!permit);
        }
    }];
}

+ (void)onReceiveSharePermissionApply:(void (^)(NSString *uid, NSString *name))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnSharePermissionApply" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        NSString *name = @"";
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            name = noticeModel.data[@"user_name"];
        }
        
        if (block) {
            block(uid, name);
        }
    }];
}

+ (void)grantSharePermission:(NSString *)userId result:(BOOL)granted {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:userId forKey:@"apply_user_id"];
    [mutableDictionary setValue:[NSNumber numberWithInt:granted ? 1 : 0] forKey:@"permit"];
    dic = [mutableDictionary copy];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusSharePermissionPermit" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
    }];
}

+ (void)onSharePermissionAccepted:(void (^)(BOOL accepted))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnSharePermissionPermit" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        int permit = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            permit = [noticeModel.data[@"permit"] intValue];
        }
        
        if (block) {
            block(!!permit);
        }
    }];
}

+ (void)onOperateOtherSharePermission:(void (^)(BOOL accepted, NSString *uid))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnOperateOtherSharePermission" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *operate_user_id = @"";
        int operate = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            operate_user_id = noticeModel.data[@"operate_user_id"];
            operate = [noticeModel.data[@"operate"] intValue];
        }
        
        if (block) {
            block(operate,operate_user_id);
        }
    }];
}

+ (void)onReceiveRecordRequest:(void (^)(NSString *uid, NSString *name))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnStartRecordApply" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        NSString *name = @"";
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            name = noticeModel.data[@"user_name"];
        }
        
        if (block) {
            block(uid, name);
        }
    }];
}

+ (void)onRecordRequestAccepted:(void (^)(BOOL accepted))block {
    [[EduSmallClassRTCManager shareRtc] onSceneListener:@"edusOnStartRecordPermit" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        int permit = 0;
        
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            permit = [noticeModel.data[@"permit"] intValue];
        }
        
        if (block) {
            block(!!permit);
        }
    }];
}

+ (void)acceptRecordRequest:(NSString *)userId result:(BOOL)accepted result:(void (^)(BOOL success))block{
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    NSMutableDictionary *mutableDictionary = [dic mutableCopy];
    [mutableDictionary setValue:userId forKey:@"apply_user_id"];
    [mutableDictionary setValue:[NSNumber numberWithInt:accepted ? 1 : 0] forKey:@"permit"];
    dic = [mutableDictionary copy];
    
    [[EduSmallClassRTCManager shareRtc] emitWithAck:@"edusStartRecordPermit" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
        if (ackModel.code == 200) {
            if (block) {
                block(YES);
            }
        }else {
            if (block) {
                block(YES);
            }
        }
    }];
}

@end
