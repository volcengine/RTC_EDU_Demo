//
//  EduSCRoomViewModel.m
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/11.
//

#import "EduSCRoomViewModel.h"
#import "EduSCRoomViewModel+Sort.h"
#import "EduSCPermitManager.h"

@interface EduSCRoomViewModel()<EduSmallClassRTCManagerDelegate>
@property(nonatomic, strong)NSMutableArray<EduSCRoomVideoSession *> *userList;
@end

@implementation EduSCRoomViewModel
- (instancetype)initWithLocalVideoSession:(EduSCRoomVideoSession *)videoSession withRoomModel:(EduSmallClassControlRoomModel *)roomModel withUsers:(NSArray<EduSCRoomVideoSession *> *)userLists {
    self = [super init];
    if (self) {
        self.localVideoSession = videoSession;
        self.roomModel = roomModel;
        self.userList = [NSMutableArray new];
        [self.userList addObjectsFromArray:userLists];
        self.localVideoSession.isEnableAudio = self.localVideoSession.isEnableAudio && self.roomModel.room_mic_status;
        [EduSmallClassRTCManager shareRtc].delegate = self;
    }
    return self;
}

- (void)joinRoom {
    [[EduSmallClassRTCManager shareRtc] joinChannelWithSession:self.localVideoSession token:self.roomModel.token];
    @weakify(self);
    [EduSmallClassRTCManager shareRtc].rtcJoinRoomBlock = ^(NSString * _Nonnull roomId, NSInteger errorCode, NSInteger joinType) {
        @strongify(self);
        self.isJoined = errorCode == 0;
        if (joinType != 0 && errorCode == 0) {
            [self roomResync:^(BOOL result, RTMStatusCode code) {
                if (result) {
                    [self reloadUserList];
                } else if (code == RTMStatusCodeUserIsInactive ||
                           code == RTMStatusCodeRoomDisbanded ||
                           code == RTMStatusCodeUserNotFound) {
                    self.needHangUp = YES;
                } else {
                    
                }
            }];
        }
    };
    [self addSocketListener];
    [self startSort:^(NSMutableArray * _Nonnull userLists) {
    }];
}

- (void)endRoom {
    [EduSmallClassRTMManager endEduSmallClass];
    [[EduSmallClassRTCManager shareRtc] leaveChannel];
}

- (void)leaveRoom {
    [EduSmallClassRTMManager leaveEduSmallClass];
    [[EduSmallClassRTCManager shareRtc] leaveChannel];
}

- (void)roomResync:(void (^)(BOOL, RTMStatusCode))block {
    [EduSmallClassRTMManager resync:^(RTMACKModel * _Nonnull model) {
        block(model.result, model.code);
    }];
}

- (void)updateRtcVideoParams {
    [[EduSmallClassRTCManager shareRtc] updateRtcVideoParams];
}

//- (void)startShare:(int)type {
//    [EduSmallClassRTMManager startShare:type];
//}
//
//- (void)endShare {
//    [EduSmallClassRTMManager endShare];
//}

- (void)stopRecord {
    [EduSmallClassRTMManager stopRecord];
}

- (int)setEnableSpeakerphone:(BOOL)enableSpeaker {
    return [[EduSmallClassRTCManager shareRtc] setEnableSpeakerphone:enableSpeaker];
}

- (void)switchCamera {
    [[EduSmallClassRTCManager shareRtc] switchCamera];
}

- (void)startShare:(int)share_type {
    [EduSmallClassRTMManager startShare:share_type];
}

- (void)endShare {
    [EduSmallClassRTMManager endShare];
}

#pragma mark - RTC API
- (void)reloadUserList {
    @weakify(self);
    [EduSmallClassRTMManager getEduSmallClassUserList:^(NSArray<EduSCRoomVideoSession *> * _Nonnull userLists, RTMACKModel * _Nonnull model) {
        @strongify(self);
        if (model.result) {
            [self.userList removeAllObjects];
            [self.userList addObjectsFromArray:userLists];
            for (EduSCRoomVideoSession *user in self.userList) {
                [self observeUserVisiable:user];
                if ([user.uid isEqualToString:self.localVideoSession.uid]) {
                    user.isLoginUser = YES;
                    self.localVideoSession.hasOperatePermission = user.hasOperatePermission;
                    self.localVideoSession.hasSharePermission = user.hasSharePermission;
                    self.localVideoSession.isEnableVideo = user.isEnableVideo;
                    self.localVideoSession.isEnableAudio = user.isEnableAudio;
                }
            }
            if (self.roomModel.room_mic_status == 0) {
                self.localVideoSession.hasOperatePermission = NO;
            }
       } else {
           
       }
    }];
}

#pragma mark - Setter / Getter

#pragma mark - Logic
- (void)observeUserVisiable:(EduSCRoomVideoSession*)user {
    [self.KVOControllerNonRetaining observe:user
                                    keyPath:@keypath(user, isVisible)
                                    options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionInitial
                                      block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        EduSCRoomVideoSession *session = object;
        if (session.isLoginUser) {
            return;
        }
        
        if (session.isSharingScreen) {
            [[EduSmallClassRTCManager shareRtc] subscribeScreenStream:session.uid];
        } else {
            [[EduSmallClassRTCManager shareRtc] unsubscribeScreen:session.uid];
        }
        
        if (session.isVisible) {
            [[EduSmallClassRTCManager shareRtc] subscribeStream:session.uid video:YES];
        } else {
            [[EduSmallClassRTCManager shareRtc] unsubscribe:session.uid];
        }
    }];
}

- (void)addUser:(EduSCRoomVideoSession *)roomUserModel {
    if (roomUserModel.uid == nil) {
        NSLog(@"Empty User");
    }
    //重复数据删除
    //Deduplication
    NSInteger index = -1;
    for (int i = 0; i < self.userList.count; i++) {
        EduSCRoomVideoSession *userModel = self.userList[i];
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
    
    [self observeUserVisiable:roomUserModel];
}

- (void)removeUser:(NSString *)uid {
    EduSCRoomVideoSession *deleteModel = nil;
    for (EduSCRoomVideoSession *roomUserModel in self.userList) {
        if ([roomUserModel.uid isEqualToString:uid]) {
            deleteModel = roomUserModel;
            break;
        }
    }
    if (deleteModel) {
        [self.userList removeObject:deleteModel];
    }
}

- (void)updateUserView:(NSString *)uid enableMic:(BOOL)isEnable {
    if (IsEmptyStr(uid)) {
        //mute all user
        for (EduSCRoomVideoSession *userModel in self.userList) {
            if (![userModel.uid isEqualToString:self.roomModel.host_user_id]) {
                userModel.isEnableAudio = isEnable;
            }
        }
    } else {
        //mute user
        for (EduSCRoomVideoSession *userModel in self.userList) {
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
    for (EduSCRoomVideoSession *userModel in self.userList) {
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
    BOOL isShareScreenStop = self.localVideoSession.isSharingScreen;
    for (EduSCRoomVideoSession *userSession in self.userList) {
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

#pragma mark - EduSmallClassRTCManagerDelegate

- (void)rtcManager:(EduSmallClassRTCManager * _Nonnull)rtcManager didStreamAdded:(NSString * _Nullable)uid {
    for (EduSCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublished = YES;
        }
    }
}

- (void)rtcManager:(EduSmallClassRTCManager *_Nonnull)rtcManager didStreamRemoved:(NSString * _Nullable)uid {
    for (EduSCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublished = NO;
        }
    }
}

- (void)rtcManager:(EduSmallClassRTCManager * _Nonnull)rtcManager didScreenStreamAdded:(NSString *_Nullable)uid {
    for (EduSCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublishedScreen = YES;
        }
    }
}

- (void)rtcManager:(EduSmallClassRTCManager *_Nonnull)rtcManager didScreenStreamRemoved:(NSString *)uid {
    for (EduSCRoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublishedScreen = NO;
        }
    }
}

- (void)EduSmallClassRTCManager:(EduSmallClassRTCManager *)EduSmallClassRTCManager changeParamInfo:(EduSCRoomParamInfoModel *)model {
    self.roomParamInfo = model;
}

- (void)rtcManager:(EduSmallClassRTCManager *)rtcManager reportAllAudioVolume:(NSDictionary<NSString *, NSNumber *> *)volumeInfo {
    for (EduSCRoomVideoSession *userModel in self.userList) {
        NSNumber *volumeNumber = [volumeInfo objectForKey:userModel.uid];
        if (volumeNumber) {
            userModel.volume = [volumeNumber integerValue];
        } else {
            userModel.volume = 0;
        }
    }
}

#pragma mark - EduSmallClassRTMManager Callback
- (void)addSocketListener {
    WeakSelf;
    // User Join
    [EduSmallClassRTMManager onUserJoinEduSmallClass:^(EduSmallClassControlUserModel * _Nonnull model) {
        if (wself) {
            EduSCRoomVideoSession *roomUserModel = [EduSCRoomVideoSession constructWithEduSmallClassControlUserModel:model];
            if (![roomUserModel.uid isEqualToString:wself.localVideoSession.uid]) {
                [wself addUser:roomUserModel];
            }
        }
    }];

    // User Leave
    [EduSmallClassRTMManager onUserLeaveEduSmallClass:^(EduSmallClassControlUserModel * _Nonnull model) {
        if (wself) {
            [wself removeUser:model.user_id];
        }
    }];

    // Mic status change
    [EduSmallClassRTMManager onUserMicStatusChanged:^(NSString * _Nonnull uid, BOOL result) {
        if (wself) {
            [wself updateUserView:uid enableMic:result];
        }
    }];
    
    // Camera status change
    [EduSmallClassRTMManager onUserCamStatusChanged:^(NSString * _Nonnull uid, BOOL result) {
        if (wself) {
            [wself updateUserView:uid enableCamera:result];
        }
    }];
    
    // Mute all user microphone
    [EduSmallClassRTMManager onForceTurnOnOffMicOfAllUsers:^(BOOL on, BOOL can) {
        if (wself) {
            [wself updateUserView:nil enableMic:on];
        }
        
        if (!on && wself && !wself.localVideoSession.isHost) {
            wself.localVideoSession.hasOperatePermission = can;
            wself.localVideoSession.isEnableAudio = on;
            
            [EduSCPermitManager recieveOperateAllMic];
        }
    }];

    // Microphone change notice
    [EduSmallClassRTMManager onReceiveTurnOnOffMicInvite:^(NSString * _Nonnull uid, BOOL unmute) {
        if (wself) {
            if (!self.localVideoSession.isHost && [uid isEqualToString:wself.localVideoSession.uid]) {
                [EduSCPermitManager recieveMicInvite:unmute curMicUnmute:wself.localVideoSession.isEnableAudio];
            }
        }
    }];
    
    // camera change notice
    [EduSmallClassRTMManager onReceiveTurnOnOffCamInvite:^(NSString * _Nonnull uid, BOOL unmute) {
        if (wself) {
            if (!self.localVideoSession.isHost && [uid isEqualToString:wself.localVideoSession.uid]) {
                [EduSCPermitManager recieveCameraInvite:unmute curMicUnmute:self.localVideoSession.isEnableVideo];
            }
        }
    }];
    
    // start record
    [EduSmallClassRTMManager onRecordStarted:^(BOOL result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (wself) {
                wself.roomModel.record_status = YES;
                [EduSCPermitManager recieveRecordStatus:YES];
            }
        });
    }];
    
    // stop record
    [EduSmallClassRTMManager onRecordFinished:^(BOOL result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (wself) {
                wself.roomModel.record_status = NO;
                [EduSCPermitManager recieveRecordStatus:NO];
            }
        });
    }];

    // start share
    [EduSmallClassRTMManager onUserStartShare:^(NSString * _Nonnull uid, NSString * _Nonnull name, int share_type, BOOL result) {
        if (wself) {
            wself.roomModel.share_user_id = result ? uid : @"";
            wself.roomModel.share_type = share_type;
            [EduSCPermitManager recieveShareStatus:result name:name type:share_type];
            [wself updateUserView:uid enableShare:result shareType:share_type];
            wself.shareChangedCallbackBlock(uid, share_type);
        }
    }];
    
    // stop share
    [EduSmallClassRTMManager onUserStopShare:^(NSString * _Nonnull uid, BOOL result) {
        wself.roomModel.share_user_id = @"";
        [EduSCPermitManager recieveShareStatus:result name:nil type:-1];
        [wself updateUserView:uid enableShare:result shareType:-1];
        wself.shareChangedCallbackBlock(@"", -1);
    }];
    
    [EduSmallClassRTMManager onSharePermissionAccepted:^(BOOL accepted) {
        if (wself) {
            if (!wself.localVideoSession.isHost) {
                wself.localVideoSession.hasSharePermission = accepted;
                [EduSCPermitManager recieveShareAccept:accepted];
            }
        }
    }];
    
    [EduSmallClassRTMManager onOperateOtherSharePermission:^(BOOL accepted,NSString *uid) {
        if (wself) {
            if ([uid isEqualToString:self.localVideoSession.uid]) {
                wself.localVideoSession.hasSharePermission = accepted;
                [EduSCPermitManager recieveShareUpdate:accepted];
            }
            for (EduSCRoomVideoSession *userModel in self.userList) {
                if ([uid isEqualToString:userModel.uid]) {
                    userModel.hasSharePermission = accepted;
                }
            }
        }
    }];

    // EduSmallClass end
    [EduSmallClassRTMManager onEduSmallClassEnd:^(int reason) {
        if (wself) {
            if (reason == 0) {
                wself.needHangUp = YES;
            } else {
                wself.timeOut = YES;
            }
        }
    }];
    
    // receive mic permission apply
    [EduSmallClassRTMManager onReceiveMicPermissionApply:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            int applyCount = 0;
            EduSCRoomVideoSession *applyUserModel = nil;
            for (EduSCRoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    userModel.isRequestMic = YES;
                    applyUserModel = userModel;
                }
                
                if (userModel.isRequestMic) {
                    applyCount += 1;
                }
            }
            
            if (applyCount > 1) {
                [EduSCPermitManager recieveMicRequestWithCount:applyCount block:^(BOOL result) {
                    if (result) {
                        // 跳转用户列表
                    }
                }];
            } else {
                [EduSCPermitManager recieveMicRequest:uid name:name block:^(BOOL result) {
                    applyUserModel.isRequestMic = NO;
                }];
            }
        }
    }];
    
    // receive camera permission apply
    [EduSmallClassRTMManager onReceiveCamPermissionApply:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            
            EduSCRoomVideoSession *applyUserModel = nil;
            for (EduSCRoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    applyUserModel = userModel;
                }
            }
            [EduSCPermitManager recieveCameraRequest:uid name:name block:nil];
        }
    }];
    
    // receive share permission apply
    [EduSmallClassRTMManager onReceiveSharePermissionApply:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            int applyCount = 0;
            EduSCRoomVideoSession *applyUserModel = nil;
            for (EduSCRoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    userModel.isRequestShare = YES;
                    applyUserModel = userModel;
                }
                
                if (userModel.isRequestShare) {
                    applyCount += 1;
                }
            }
            
            if (applyCount > 1) {
                [EduSCPermitManager recieveShareRequestWithCount:applyCount block:^(BOOL result) {
                    if (result) {
                        // 跳转用户列表
                    }
                }];
            } else {
                [EduSCPermitManager recieveShareRequest:uid name:name block:^(BOOL result) {
                    applyUserModel.isRequestShare = NO;
                }];
            }
        }
    }];
    
    // receive record permission apply
    [EduSmallClassRTMManager onReceiveRecordRequest:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            
            EduSCRoomVideoSession *applyUserModel = nil;
            for (EduSCRoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    applyUserModel = userModel;
                }
            }
            [EduSCPermitManager recieveRecordRequest:uid name:name block:nil];
        }
    }];
    
    // receive record permission response
    [EduSmallClassRTMManager onRecordRequestAccepted:^(BOOL accepted) {
        if (wself) {
            [EduSCPermitManager recieveRecordAccept:accepted];
        }
    }];
    
    [EduSmallClassRTMManager onMicPermissionAccepted:^(BOOL accepted) {
        if (wself) {
            wself.localVideoSession.hasOperatePermission = accepted;
            [EduSCPermitManager recieveMicAccept:accepted];
        }
    }];
    
    [EduSmallClassRTMManager onCamPermissionAccepted:^(BOOL accepted) {
        if (wself) {
            self.localVideoSession.hasOperatePermission = accepted;
            [EduSCPermitManager recieveCameraAccept:accepted];
        }
    }];
}


@end
