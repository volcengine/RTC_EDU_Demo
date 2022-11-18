//
//  EduRTMManager.m
//  EduDemo
//
//  Created by on 2022/6/7.
//

#import "EduRTMManager.h"
#import "EduBreakoutRTCManager.h"
#import "JoinRTSParams.h"

@implementation EduRTMManager

#pragma mark - reconnect
+ (void)reconnectWithBlock:(void (^)(RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduReconnect" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (block) {
                block(ackModel);
            }
        });
    }];
    
}

#pragma mark - Get edu data

+ (void)getHistoryRoomListWithBlock:(void (^)(NSArray<EduRoomModel *> *list ,RTMACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduGetHistoryRoomList" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
        NSMutableArray *modelLists = [[NSMutableArray alloc] init];
        if (ackModel.result && [ackModel.response isKindOfClass:[NSArray class]]) {
            NSArray *list = (NSArray *)ackModel.response;
            for (int i = 0; i < list.count; i++) {
                NSDictionary *dic = list[i];
                EduRoomModel *roomModel = [EduRoomModel yy_modelWithJSON:dic];
                if (roomModel) {
                    [modelLists addObject:roomModel];
                }
            }
        }
        if (block) {
            block(modelLists.copy, ackModel);
        }
    }];
}

+ (void)getHistoryRecordList:(NSString *)roomID block:(void (^)(NSArray *list ,RTMACKModel *model))block {
    NSDictionary *dic = @{@"room_id" : roomID ?: @""};
    dic = [JoinRTSParams addTokenToParams:dic];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduGetHistoryRecordList" with:dic block:^(RTMACKModel * _Nonnull ackModel) {
        NSMutableArray *modelLists = [[NSMutableArray alloc] init];
        NSArray *list = (NSArray *)ackModel.response;
        for (int i = 0; i < list.count; i++) {
            NSDictionary *dic = list[i];
            EduRecordModel *recordModel = [EduRecordModel yy_modelWithJSON:dic];
            if (recordModel) {
                [modelLists addObject:recordModel];
            }
        }
        if (block) {
            block(modelLists, ackModel);
        }
        NSLog(@"[%@]-getHistoryRecordList %@", [modelLists copy], ackModel.response);
    }];
}


#pragma mark - Broadcast Notification Message

+ (void)onBeginClassWithBlock:(void (^)(NSInteger timestamp))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onBeginClass" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSInteger timestamp = 0;
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            timestamp = [noticeModel.timestamp integerValue];
        }
        if (block) {
            block(timestamp);
        }
        NSLog(@"[%@]-onBeginClass %@", [self class], noticeModel.data);
        
    }];
}

+ (void)onEndClassWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onEndClass" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onEndClass %@", [self class], noticeModel.data);
    }];
    
}

+ (void)onOpenGroupSpeechWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onOpenGroupSpeech" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onOpenGroupSpeech %@", [self class], noticeModel.data);
    }];
}

+ (void)onCloseGroupSpeechWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onCloseGroupSpeech" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onCloseGroupSpeech %@", [self class], noticeModel.data);
    }];
}

+ (void)onOpenVideoInteractWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onOpenVideoInteract" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onOpenVideoInteract %@", [self class], noticeModel.data);
    }];
   
}

+ (void)onCloseVideoInteractWithBlock:(void (^)(NSString *roomID))block {
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onCloseVideoInteract" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onCloseVideoInteract %@", [self class], noticeModel.data);
    }];
    
}

+ (void)onTeacherMicOnWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onTeacherMicOn" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onTeacherMicOn %@", [self class], noticeModel.data);
    }];
}

+ (void)onTeacherMicOffWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onTeacherMicOff" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onTeacherMicOff %@", [self class], noticeModel.data);
    }];
}

+ (void)onTeacherCameraOnWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onTeacherCameraOn" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]-onTeacherCameraOn %@", [self class], noticeModel.data);
    }];
}

+ (void)onTeacherCameraOffWithBlock:(void (^)(NSString *roomID))block {
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onTeacherCameraOff" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID);
        }
        NSLog(@"[%@]- onTeacherCameraOff%@", [self class], noticeModel.data);
    }];
}

+ (void)onTeacherJoinRoomWithBlock:(void (^)(NSString *userName))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onTeacherJoinRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userName = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userName = noticeModel.data[@"user_name"];
        }
        if (block) {
            block(userName);
        }
        NSLog(@"[%@]- onTeacherJoinRoom%@", [self class], noticeModel.data);
    }];
}

+ (void)onTeacherLeaveRoomWithBlock:(void (^)(NSString *roomID))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onTeacherLeaveRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userName = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userName = noticeModel.data[@"user_name"];
        }
        if (block) {
            block(userName);
        }
        NSLog(@"[%@]- onTeacherLeaveRoom%@", [self class], noticeModel.data);
    }];
}

+ (void)onStudentJoinGroupRoomWithBlock:(void (^)(NSString *uid,NSString *userName))block{
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onStudentJoinGroupRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userName = @"";
        NSString *uid = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userName = noticeModel.data[@"user_name"];
            uid = noticeModel.data[@"user_id"];
        }
        if (block) {
            block(uid,userName);
        }
        NSLog(@"[%@]- onStudentJoinGroupRoom%@", [self class], noticeModel.data);
    }];
}

+ (void)onStudentLeaveGroupRoomWithBlock:(void (^)(NSString *uid,NSString *userName))block{
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onStudentLeaveGroupRoom" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userName = @"";
        NSString *uid = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userName = noticeModel.data[@"user_name"];
            uid = noticeModel.data[@"user_id"];
        }
        if (block) {
            block(uid,userName);
        }
        NSLog(@"[%@]- onStudentLeaveGroupRoom%@", [self class], noticeModel.data);
    }];
}

+ (void)onStuMicOnWithBlock:(void (^)(NSString *roomID, NSString *uid, NSString *userName))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onStuMicOn" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userName = @"";
        NSString *uid = @"";
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userName = noticeModel.data[@"user_name"];
            uid = noticeModel.data[@"user_id"];
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID, uid, userName);
        }
        NSLog(@"[%@]- onStuMicOn%@", [self class], noticeModel.data);
    }];
}

+ (void)onStuMicOffWithBlock:(void (^)(NSString *roomID, NSString *uid))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onStuMicOff" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *uid = @"";
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            uid = noticeModel.data[@"user_id"];
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID, uid);
        }
        NSLog(@"[%@]- onStuMicOff%@", [self class], noticeModel.data);
    }];
}

#pragma mark - Single Notification Message

+ (void)onApproveMicWithBlock:(void (^)(NSString *roomID, NSString *uid, NSString *token))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onApproveMic" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userID = @"";
        NSString *roomID = @"";
        NSString *token = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userID = noticeModel.data[@"user_id"];
            roomID = noticeModel.data[@"room_id"];
            token = noticeModel.data[@"token"];
        }
        if (block) {
            block(roomID, userID, token);
        }
        NSLog(@"[%@]- onApproveMic%@", [self class], noticeModel.data);
    }];
}

+ (void)onCloseMicWithBlock:(void (^)(NSString *roomID, NSString *uid))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onCloseMic" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *userID = @"";
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            userID = noticeModel.data[@"user_id"];
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(roomID, userID);
        }
        NSLog(@"[%@]- onCloseMic%@", [self class], noticeModel.data);
    }];
}

+ (void)onLogInElsewhereWithBlock:(void (^)(BOOL result))block {
    
    [[[self getEduManagerClass] shareRtc] onSceneListener:@"onLogInElsewhere" block:^(RTMNoticeModel * _Nonnull noticeModel) {
        NSString *roomID = @"";
        if (noticeModel.data && [noticeModel.data isKindOfClass:[NSDictionary class]]) {
            roomID = noticeModel.data[@"room_id"];
        }
        if (block) {
            block(YES);
        }
        NSLog(@"[%@]- onLogInElsewhere%@", [self class], noticeModel.data);
    }];
}

#pragma mark - tool

+ (Class)getEduManagerClass {
    Class class = NSClassFromString(@"EduBreakoutRTCManager");
    
    return class;
    
}

@end
