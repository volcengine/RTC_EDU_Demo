// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduRTSStudentManager.h"
#import "JoinRTSParams.h"

@implementation EduRTSStudentManager

+ (void)getActiveClassWithBlock:(void (^)(NSArray<EduRoomModel *> *list, RTSACKModel *model))block {
    NSDictionary *dic = [JoinRTSParams addTokenToParams:nil];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduGetActiveClass" with:dic block:^(RTSACKModel * _Nonnull ackModel) {
        NSMutableArray *modelLists = [[NSMutableArray alloc] init];
        if (ackModel.result && [ackModel.response isKindOfClass:[NSArray class]]) {
            NSArray *list = (NSArray *)ackModel.response;
            for (int i = 0; i < list.count; i++) {
                EduRoomModel *roomModel = [EduRoomModel yy_modelWithJSON:list[i]];
                [modelLists addObject:roomModel];
            }
        }
        if (block) {
            block([modelLists copy], ackModel);
        }
    }];
}

+ (void)joinClass:(NSString *)roomID roomType:(BOOL)lecture
            block:(void (^)(EduClassModel *classModel))block {
    NSDictionary *dic = @{@"room_id" : roomID ?: @"",
                          @"user_name" : [LocalUserComponent userModel].name};
    dic = [JoinRTSParams addTokenToParams:dic];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduJoinClass" with:dic block:^(RTSACKModel * _Nonnull ackModel) {
        
        EduClassModel *classModel = [[EduClassModel alloc] init];
        if (ackModel.result && [ackModel.response isKindOfClass:[NSDictionary class]]) {
            if (lecture) {
                classModel = [[EduClassModel alloc] initWithDic:ackModel.response];
            }else{
                classModel = [[EduBreakoutClassModel alloc] initWithDic:ackModel.response];
            }
            [PublicParameterComponent share].roomId = classModel.roomModel.roomId;
        }
        classModel.ackModel = ackModel;
        if (block) {
            block(classModel);
        }
        NSLog(@"[%@]-eduJoinClass %@|%@", [self class], ackModel.response, dic);
    }];
    
}

+ (void)leaveClass:(NSString *)roomID block:(void (^)(RTSACKModel *model))block {
    NSDictionary *dic = @{@"room_id" : roomID ?: @""};
    dic = [JoinRTSParams addTokenToParams:dic];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduLeaveClass" with:dic block:^(RTSACKModel * _Nonnull ackModel) {
        if (ackModel.result && [ackModel.response isKindOfClass:[NSDictionary class]]) {
            if (block) {
                block(ackModel);
            }
        }
        NSLog(@"[%@]-eduLeaveClass %@|%@", [self class], ackModel.response, dic);
    }];
}

+ (void)handsUp:(NSString *)roomID block:(void (^)(RTSACKModel *model))block {
    NSDictionary *dic = @{@"room_id" : roomID ?: @""};
    dic = [JoinRTSParams addTokenToParams:dic];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduHandsUp" with:dic block:^(RTSACKModel * _Nonnull ackModel) {
        if (ackModel.result && [ackModel.response isKindOfClass:[NSDictionary class]]) {
            if (block) {
                block(ackModel);
            }
        }
        NSLog(@"[%@]-eduHandsUp %@|%@", [self class], ackModel.response, dic);
    }];
}

+ (void)cancelHandsUp:(NSString *)roomID block:(void (^)(RTSACKModel *model))block {
    NSDictionary *dic = @{@"room_id" : roomID ?: @""};
    dic = [JoinRTSParams addTokenToParams:dic];
    [[EduBreakoutRTCManager shareRtc] emitWithAck:@"eduCancelHandsUp" with:dic block:^(RTSACKModel * _Nonnull ackModel) {
        if (ackModel.result && [ackModel.response isKindOfClass:[NSDictionary class]]) {
            if (block) {
                block(ackModel);
            }
        }
        NSLog(@"[%@]-eduCancelHandsUp %@|%@", [self class], ackModel.response, dic);
    }];
}

#pragma mark - tool

+ (BOOL)ackModelResponseClass:(RTSACKModel *)ackModel {
    if ([ackModel.response isKindOfClass:[NSDictionary class]]) {
        return YES;
    } else {
        return NO;
    }
}

@end
