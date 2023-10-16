//
//  EduBCRoomViewModel.m
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/11.
//

#import "EduBCRoomViewModel.h"
#import "EduBCRoomViewModel+Sort.h"
#import "EduBCPermitManager.h"

@interface EduBCRoomViewModel()<EduBigClassRTCManagerDelegate>
@property(nonatomic, strong)NSMutableArray<EduBCRoomVideoSession *> *userList;
@end

@implementation EduBCRoomViewModel
- (instancetype)initWithLocalVideoSession:(EduBCRoomVideoSession *)videoSession withRoomModel:(EduBigClassControlRoomModel *)roomModel withUsers:(NSArray<EduBCRoomVideoSession *> *)userLists {
    self = [super init];
    if (self) {
        self.localVideoSession = videoSession;
        self.roomModel = roomModel;
        self.userList = [NSMutableArray new];
        [self.userList addObjectsFromArray:userLists];
        [self.userList addObject:self.localVideoSession];
        self.localVideoSession.isEnableAudio = self.localVideoSession.isEnableAudio && self.roomModel.room_mic_status;
        [EduBigClassRTCManager shareRtc].delegate = self;
    }
    return self;
}

- (void)joinRoom {
    [[EduBigClassRTCManager shareRtc] joinChannelWithSession:self.localVideoSession token:self.roomModel.token];
    @weakify(self);
    [EduBigClassRTCManager shareRtc].rtcJoinRoomBlock = ^(NSString * _Nonnull roomId, NSInteger errorCode, NSInteger joinType) {
        @strongify(self);
        self.isJoined = errorCode == 0;
        
        [self roomResync:^(RTMACKModel * _Nonnull model) {
            [self reloadUserList:model];
        }];
        
    };
    [self addSocketListener];
    [self startSort:^(NSMutableArray * _Nonnull userLists) {
    }];
}

- (void)endRoom {
    //[EduBigClassRTMManager endEduBigClass];
    [[EduBigClassRTCManager shareRtc] leaveChannel];
}

- (void)leaveRoom {
    [EduBigClassRTMManager leaveEduBigClass];
    [[EduBigClassRTCManager shareRtc] leaveChannel];
}

- (void)roomResync:(void (^)(RTMACKModel *model))block {
    [EduBigClassRTMManager resync:^(RTMACKModel * _Nonnull model) {
        if (block) {
            block(model);
        }
    }];
}

- (void)updateRtcVideoParams {
    [[EduBigClassRTCManager shareRtc] updateRtcVideoParams];
}

//- (void)startShare:(int)type {
//    [EduBigClassRTMManager startShare:type];
//}
//
//- (void)endShare {
//    [EduBigClassRTMManager endShare];
//}

- (void)stopRecord {
    //[EduBigClassRTMManager stopRecord];
}

- (int)setEnableSpeakerphone:(BOOL)enableSpeaker {
    return [[EduBigClassRTCManager shareRtc] setEnableSpeakerphone:enableSpeaker];
}

- (void)switchCamera {
    [[EduBigClassRTCManager shareRtc] switchCamera];
}

- (void)startShare:(int)share_type {
    //[EduBigClassRTMManager startShare:share_type];
}

- (void)endShare {
    //[EduBigClassRTMManager endShare];
}

- (void)turnOnMic:(BOOL)on {
    if (on) {
        if ([self.roomModel.host_user_id isEqualToString:@""]) {
            [[ToastComponent shareToastComponent] showWithMessage:@"当老师在房间内才能申请" delay:0];
        } else if (self.roomModel.linkMicApplyCount >= 20) {
            [[ToastComponent shareToastComponent] showWithMessage:@"连麦申请人数已满员，请稍后再试" delay:0];
        } else if (self.roomModel.linkMicCount >= 8) {
            [[ToastComponent shareToastComponent] showWithMessage:@"连麦人数已满员，请稍后再试" delay:0];
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:@"已申请连麦" delay:0];
            [EduBigClassRTMManager applyForLinkMic];
            self.localVideoSession.linkMicStatus = LinkMicModeLinking;
        }
    } else {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"确定";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [EduBigClassRTMManager cancelApplyForLinkMic];
            self.localVideoSession.linkMicStatus = LinkMicModeNone;
        };
        [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"是否取消连麦申请"]
                                                              actions:@[alertCancelModel, alertModel]];
        
    }
}

#pragma mark - RTC API
- (void)reloadUserList:(RTMACKModel *)ackModel {
    NSInteger code = ackModel.code;
    if (code == RTMStatusCodeUserIsInactive ||
               code == RTMStatusCodeRoomDisbanded ||
               code == RTMStatusCodeUserNotFound) {
        self.needHangUp = YES;
        return;
    }
    
    if (ackModel.result) {
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
                    
                    [userLists addObject:videoSession];

//                    if([linkLists containsObject:EduBigClassUserModel.user_id]) {
//                        EduBigClassUserModel.share_permission = 1;
//                    }
                    if ([linkLists containsObject:videoSession.uid]) {
//                        videoSession.hasSharePermission = 1;
                        videoSession.linkMicStatus = LinkMicModeDone;
                    }
                }
            }
        }

        [self.userList removeAllObjects];
        [self.userList addObjectsFromArray:userLists];
        for (EduBCRoomVideoSession *user in self.userList) {
            [self observeUserVisiable:user];
            if ([user.uid isEqualToString:self.localVideoSession.uid]) {
                user.isLoginUser = YES;
                self.localVideoSession.hasOperatePermission = user.hasOperatePermission;
                self.localVideoSession.hasSharePermission = user.hasSharePermission;
                self.localVideoSession.isEnableVideo = user.isEnableVideo;
                self.localVideoSession.isEnableAudio = user.isEnableAudio;
                [self.userList removeObject:user];
                [self.userList addObject:self.localVideoSession];
                break;
            }
        }
        if (self.roomModel.room_mic_status == 0) {
            self.localVideoSession.hasOperatePermission = NO;
        }
    }
}

#pragma mark - Setter / Getter

#pragma mark - Logic
- (void)observeUserVisiable:(EduBCRoomVideoSession*)user {
    [self.KVOControllerNonRetaining observe:user
                                    keyPath:@keypath(user, isVisible)
                                    options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionInitial
                                      block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        EduBCRoomVideoSession *session = object;
        if (session.isLoginUser) {
            return;
        }
        
        if (session.isSharingScreen) {
            [[EduBigClassRTCManager shareRtc] subscribeScreenStream:session.uid];
        } else {
            [[EduBigClassRTCManager shareRtc] unsubscribeScreen:session.uid];
        }
        
        if (session.isVisible) {
            [[EduBigClassRTCManager shareRtc] subscribeStream:session.uid video:YES];
        } else {
            [[EduBigClassRTCManager shareRtc] unsubscribe:session.uid];
        }
    }];
}

- (void)addUser:(EduBCRoomVideoSession *)roomUserModel {
    if (roomUserModel.uid == nil) {
        NSLog(@"Empty User");
    }
    //重复数据删除
    //Deduplication
    NSInteger index = -1;
    for (int i = 0; i < self.userList.count; i++) {
        EduBCRoomVideoSession *userModel = self.userList[i];
        if ([userModel.uid isEqualToString:roomUserModel.uid]) {
            index = i;
            break;
        }
    }
    
    if (index >= 0) {
        [self.userList replaceObjectAtIndex:index withObject:roomUserModel];
    } else {
        if ([roomUserModel.uid isEqualToString:self.localVideoSession.uid]) {
            [self.userList insertObject:roomUserModel atIndex:0];
        } else {
            [self.userList addObject:roomUserModel];
        }
    }
    
    if (roomUserModel.isHost) {
        self.roomModel.host_user_id = roomUserModel.uid;
        self.roomModel.host_user_name = roomUserModel.name;
    }
    
    [self observeUserVisiable:roomUserModel];
}

- (void)removeUser:(NSString *)uid {
    EduBCRoomVideoSession *deleteModel = nil;
    for (EduBCRoomVideoSession *roomUserModel in self.userList) {
        if ([roomUserModel.uid isEqualToString:uid]) {
            deleteModel = roomUserModel;
            break;
        }
    }
    if (deleteModel) {
        [self.userList removeObject:deleteModel];
    }
    if ([uid isEqualToString:self.roomModel.host_user_id]) {
        self.roomModel.host_user_id = @"";
        self.roomModel.host_user_name = @"";
    }
}

- (void)updateUserView:(NSString *)uid enableMic:(BOOL)isEnable {
    if (IsEmptyStr(uid)) {
        //mute all user
        for (EduBCRoomVideoSession *userModel in self.userList) {
            if (![userModel.uid isEqualToString:self.roomModel.host_user_id]) {
                userModel.isEnableAudio = isEnable;
            }
        }
    } else {
        //mute user
        for (EduBCRoomVideoSession *userModel in self.userList) {
            if ([userModel.uid isEqualToString:uid]) {
                userModel.isEnableAudio = isEnable;
                break;
            }
        }
        if ([self.localVideoSession.uid isEqualToString:uid]) {
            self.localVideoSession.isEnableAudio = isEnable;
        }
    }
}

- (void)updateUserView:(NSString *)uid enableCamera:(BOOL)isEnable {
    for (EduBCRoomVideoSession *userModel in self.userList) {
        if ([userModel.uid isEqualToString:uid]) {
            userModel.isEnableVideo = isEnable;
            break;
        }
    }
    if ([self.localVideoSession.uid isEqualToString:uid]) {
        self.localVideoSession.isEnableVideo = isEnable;
    }
}

- (void)updateUserView:(NSString *)uid enableShare:(BOOL)isShare shareType:(int)shareType {
    for (EduBCRoomVideoSession *userSession in self.userList) {
        if (isShare) {
            if ([userSession.uid isEqualToString:uid]) {
                userSession.isSharingScreen = (shareType == kShareTypeScreen);
                userSession.isSharingWhiteBoard = (shareType == kShareTypeWhiteBoard);
            } else {
                userSession.isSharingScreen = NO;
            }
            self.roomModel.share_user_id = uid;
            self.roomModel.share_type = shareType;
        } else {
            userSession.isSharingScreen = NO;
            userSession.isSharingWhiteBoard = NO;
            self.roomModel.share_user_id = @"";
        }
        
        if ([self.localVideoSession.uid isEqualToString:userSession.uid]) {
            self.localVideoSession.isSharingScreen = userSession.isSharingScreen;
            self.localVideoSession.isSharingWhiteBoard = userSession.isSharingWhiteBoard;
        }
    }
}

#pragma mark - EduBigClassRTCManagerDelegate

- (void)rtcManager:(EduBigClassRTCManager * _Nonnull)rtcManager didStreamAdded:(NSString * _Nullable)uid {
    for (EduBCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublished = YES;
        }
    }
}

- (void)rtcManager:(EduBigClassRTCManager *_Nonnull)rtcManager didStreamRemoved:(NSString * _Nullable)uid {
    for (EduBCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublished = NO;
        }
    }
}

- (void)rtcManager:(EduBigClassRTCManager * _Nonnull)rtcManager didScreenStreamAdded:(NSString *_Nullable)uid {
    for (EduBCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublishedScreen = YES;
        }
    }
}

- (void)rtcManager:(EduBigClassRTCManager *_Nonnull)rtcManager didScreenStreamRemoved:(NSString *)uid {
    for (EduBCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublishedScreen = NO;
        }
    }
}

- (void)EduBigClassRTCManager:(EduBigClassRTCManager *)EduBigClassRTCManager changeParamInfo:(EduBCRoomParamInfoModel *)model {
    self.roomParamInfo = model;
}

- (void)rtcManager:(EduBigClassRTCManager *)rtcManager reportAllAudioVolume:(NSDictionary<NSString *, NSNumber *> *)volumeInfo {
    for (EduBCRoomVideoSession *userModel in self.userList) {
        NSNumber *volumeNumber = [volumeInfo objectForKey:userModel.uid];
        if (volumeNumber) {
            userModel.volume = [volumeNumber integerValue];
        } else {
            userModel.volume = 0;
        }
    }
}

#pragma mark - EduBigClassRTMManager Callback
- (void)addSocketListener {
    WeakSelf;
    // User Join
    [EduBigClassRTMManager onUserJoinEduBigClass:^(EduBigClassControlUserModel * _Nonnull model) {
        if (wself) {
            EduBCRoomVideoSession *roomUserModel = [EduBCRoomVideoSession constructWithEduBigClassControlUserModel:model];
            if (![roomUserModel.uid isEqualToString:wself.localVideoSession.uid]) {
                [wself addUser:roomUserModel];
            }
        }
    }];

    // User Leave
    [EduBigClassRTMManager onUserLeaveEduBigClass:^(EduBigClassControlUserModel * _Nonnull model) {
        if (wself) {
            [wself removeUser:model.user_id];
        }
    }];

    // Mic status change
    [EduBigClassRTMManager onUserMicStatusChanged:^(NSString * _Nonnull uid, BOOL result) {
        if (wself) {
            [wself updateUserView:uid enableMic:result];
        }
    }];
    
    // Camera status change
    [EduBigClassRTMManager onUserCamStatusChanged:^(NSString * _Nonnull uid, BOOL result) {
        if (wself) {
            [wself updateUserView:uid enableCamera:result];
        }
    }];
    
    // Mute all user microphone
//    [EduBigClassRTMManager onForceTurnOnOffMicOfAllUsers:^(BOOL on, BOOL can) {
//        if (!on && wself && !wself.localVideoSession.isHost) {
//            wself.localVideoSession.hasOperatePermission = can;
//            [EduBCPermitManager recieveMicInvite:on curMicUnmute:wself.localVideoSession.isEnableAudio];
//        }
//    }];

    // Microphone change notice
    [EduBigClassRTMManager onReceiveTurnOnOffMicInvite:^(NSString * _Nonnull uid, BOOL unmute) {
        if (wself) {
            if (!self.localVideoSession.isHost && [uid isEqualToString:wself.localVideoSession.uid]) {
                [EduBCPermitManager recieveMicInvite:unmute curMicUnmute:wself.localVideoSession.isEnableAudio];
            }
        }
    }];
    
    // camera change notice
    [EduBigClassRTMManager onReceiveTurnOnOffCamInvite:^(NSString * _Nonnull uid, BOOL unmute) {
        if (wself) {
            if (!self.localVideoSession.isHost && [uid isEqualToString:wself.localVideoSession.uid]) {
                [EduBCPermitManager recieveCameraInvite:unmute curMicUnmute:self.localVideoSession.isEnableVideo];
            }
        }
    }];
    
    // start record
    [EduBigClassRTMManager onRecordStarted:^(BOOL result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (wself) {
                wself.roomModel.record_status = YES;
                [EduBCPermitManager recieveRecordStatus:YES];
            }
        });
    }];
    
    // stop record
    [EduBigClassRTMManager onRecordFinished:^(BOOL result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (wself) {
                wself.roomModel.record_status = NO;
                [EduBCPermitManager recieveRecordStatus:NO];
            }
        });
    }];

    // start share
    [EduBigClassRTMManager onUserStartShare:^(NSString * _Nonnull uid, NSString * _Nonnull name, int share_type, BOOL result) {
        if (wself) {
            wself.roomModel.share_user_id = result ? uid : @"";
            wself.roomModel.share_type = share_type;
            [EduBCPermitManager recieveShareStatus:result name:name type:share_type];
            [wself updateUserView:uid enableShare:result shareType:share_type];
            wself.shareChangedCallbackBlock(uid, share_type);
        }
    }];
    
    // stop share
    [EduBigClassRTMManager onUserStopShare:^(NSString * _Nonnull uid, BOOL result) {
        wself.roomModel.share_user_id = @"";
        [EduBCPermitManager recieveShareStatus:result name:nil type:-1];
        [wself updateUserView:uid enableShare:result shareType:-1];
        wself.shareChangedCallbackBlock(@"", -1);
    }];
    
//    [EduBigClassRTMManager onSharePermissionAccepted:^(BOOL accepted) {
//        if (wself) {
//            if (!wself.localVideoSession.isHost) {
//                wself.localVideoSession.hasSharePermission = accepted;
//                [EduBCPermitManager recieveShareAccept:accepted];
//            }
//        }
//    }];
    
    [EduBigClassRTMManager onOperateOtherSharePermission:^(BOOL accepted,NSString *uid) {
        if (wself) {
            BOOL isLoginUser = [uid isEqualToString:self.localVideoSession.uid];
            if (!wself.localVideoSession.isHost && isLoginUser) {
                wself.localVideoSession.hasSharePermission = accepted;
                [EduBCPermitManager recieveShareUpdate:accepted];
            }
        }
    }];    

    // EduBigClass end
    [EduBigClassRTMManager onEduBigClassEnd:^(int reason) {
        if (wself) {
            if (reason == 0) {
                wself.needHangUp = YES;
            } else {
                wself.timeOut = YES;
            }
        }
    }];
    
    // receive mic permission apply
//    [EduBigClassRTMManager onReceiveMicPermissionApply:^(NSString *uid, NSString *name) {
//        if (wself) {
//            if (!self.localVideoSession.isHost) {
//                return;
//            }
//            int applyCount = 0;
//            EduBCRoomVideoSession *applyUserModel = nil;
//            for (EduBCRoomVideoSession *userModel in self.userList) {
//                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
//                    userModel.isRequestMic = YES;
//                    applyUserModel = userModel;
//                }
//
//                if (userModel.isRequestMic) {
//                    applyCount += 1;
//                }
//            }
//
//            if (applyCount > 1) {
//                [EduBCPermitManager recieveMicRequestWithCount:applyCount block:^(BOOL result) {
//                    if (result) {
//                        // 跳转用户列表
//                    }
//                }];
//            } else {
//                [EduBCPermitManager recieveMicRequest:uid name:name block:^(BOOL result) {
//                    applyUserModel.isRequestMic = NO;
//                }];
//            }
//        }
//    }];
    
    // receive camera permission apply
//    [EduBigClassRTMManager onReceiveCamPermissionApply:^(NSString *uid, NSString *name) {
//        if (wself) {
//            if (!self.localVideoSession.isHost) {
//                return;
//            }
//
//            EduBCRoomVideoSession *applyUserModel = nil;
//            for (EduBCRoomVideoSession *userModel in self.userList) {
//                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
//                    applyUserModel = userModel;
//                }
//            }
//            [EduBCPermitManager recieveCameraRequest:uid name:name block:nil];
//        }
//    }];
    
    // receive share permission apply
//    [EduBigClassRTMManager onReceiveSharePermissionApply:^(NSString *uid, NSString *name) {
//        if (wself) {
//            if (!self.localVideoSession.isHost) {
//                return;
//            }
//            int applyCount = 0;
//            EduBCRoomVideoSession *applyUserModel = nil;
//            for (EduBCRoomVideoSession *userModel in self.userList) {
//                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
//                    userModel.isRequestShare = YES;
//                    applyUserModel = userModel;
//                }
//
//                if (userModel.isRequestShare) {
//                    applyCount += 1;
//                }
//            }
//
//            if (applyCount > 1) {
//                [EduBCPermitManager recieveShareRequestWithCount:applyCount block:^(BOOL result) {
//                    if (result) {
//                        // 跳转用户列表
//                    }
//                }];
//            } else {
//                [EduBCPermitManager recieveShareRequest:uid name:name block:^(BOOL result) {
//                    applyUserModel.isRequestShare = NO;
//                }];
//            }
//        }
//    }];
    
    // receive record permission apply
//    [EduBigClassRTMManager onReceiveRecordRequest:^(NSString *uid, NSString *name) {
//        if (wself) {
//            if (!self.localVideoSession.isHost) {
//                return;
//            }
//
//            EduBCRoomVideoSession *applyUserModel = nil;
//            for (EduBCRoomVideoSession *userModel in self.userList) {
//                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
//                    applyUserModel = userModel;
//                }
//            }
//            [EduBCPermitManager recieveCameraRequest:uid name:name block:nil];
//        }
//    }];
    
    // receive record permission response
//    [EduBigClassRTMManager onRecordRequestAccepted:^(BOOL accepted) {
//        if (wself) {
//            [EduBCPermitManager recieveRecordAccept:accepted];
//        }
//    }];
    
//    [EduBigClassRTMManager onMicPermissionAccepted:^(BOOL accepted) {
//        if (wself) {
//            wself.localVideoSession.hasOperatePermission = accepted;
//            [EduBCPermitManager recieveMicAccept:accepted];
//        }
//    }];
    
//    [EduBigClassRTMManager onCamPermissionAccepted:^(BOOL accepted) {
//        if (wself) {
//            self.localVideoSession.hasOperatePermission = accepted;
//            [EduBCPermitManager recieveCameraAccept:accepted];
//        }
//    }];
    
    //link mic
    [EduBigClassRTMManager onLinkmicPermit:^(BOOL accepted) {
        if (accepted) {
            wself.localVideoSession.linkMicStatus = LinkMicModeDone;
        }else {
            wself.localVideoSession.linkMicStatus = LinkMicModeNone;
        }
    }];
    
    [EduBigClassRTMManager onLinkmicApplyUserListChange:^(NSInteger applyUserCount) {
        wself.roomModel.linkMicApplyCount = applyUserCount;
    }];
    
    [EduBigClassRTMManager onLinkmicJoin:^(NSString *uid) {
        for (EduBCRoomVideoSession *userModel in self.userList) {
            if ([uid isEqualToString:userModel.uid]) {
                BOOL enable = YES;
                [EduBCPermitManager enableCamera:enable];
                [EduBCPermitManager enableMic:enable];
//                userModel.hasSharePermission = NO;
                userModel.hasOperatePermission = enable;
                userModel.isSharingWhiteBoard = enable;
                userModel.linkMicStatus = LinkMicModeDone;
                wself.roomModel.linkMicCount += 1;
            }
        }
        if ([wself.localVideoSession.uid isEqualToString:uid]) {
            BOOL enable = YES;
            [EduBCPermitManager enableCamera:enable];
            [EduBCPermitManager enableMic:enable];
        }
    }];
    
    [EduBigClassRTMManager onLinkmicLeave:^(NSString *uid) {
        for (EduBCRoomVideoSession *userModel in self.userList) {
            if ([uid isEqualToString:userModel.uid]) {
                BOOL enable = NO;
                userModel.hasSharePermission = enable;
                userModel.hasOperatePermission = enable;
                userModel.isSharingWhiteBoard = enable;
                userModel.linkMicStatus = LinkMicModeNone;
                wself.roomModel.linkMicCount -= 1;
            }
        }
        if ([wself.localVideoSession.uid isEqualToString:uid]) {
            BOOL enable = NO;
            [EduBCPermitManager enableCamera:enable];
            [EduBCPermitManager enableMic:enable];
        }
    }];
}


@end
