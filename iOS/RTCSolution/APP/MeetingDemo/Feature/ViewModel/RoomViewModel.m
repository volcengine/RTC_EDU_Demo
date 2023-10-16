//
//  RoomViewModel.m
//  MeetingDemo
//
//  Created by guojian on 2023/1/11.
//

#import "RoomViewModel.h"
#import "RoomViewModel+Sort.h"
#import "PermitManager.h"

@interface RoomViewModel()<MeetingRTCManagerDelegate>
@property(nonatomic, strong)NSMutableArray<RoomVideoSession *> *userList;
@end

@implementation RoomViewModel
- (instancetype)initWithLocalVideoSession:(RoomVideoSession *)videoSession withRoomModel:(MeetingControlRoomModel *)roomModel withUsers:(NSArray<RoomVideoSession *> *)userLists {
    self = [super init];
    if (self) {
        self.localVideoSession = videoSession;
        self.roomModel = roomModel;
        self.userList = [NSMutableArray new];
        [self.userList addObjectsFromArray:userLists];
        self.localVideoSession.isEnableAudio = self.localVideoSession.isEnableAudio && self.roomModel.room_mic_status;
        [MeetingRTCManager shareRtc].delegate = self;
    }
    return self;
}

- (void)joinRoom {
    [[MeetingRTCManager shareRtc] joinChannelWithSession:self.localVideoSession token:self.roomModel.token];
    @weakify(self);
    [MeetingRTCManager shareRtc].rtcJoinRoomBlock = ^(NSString * _Nonnull roomId, NSInteger errorCode, NSInteger joinType) {
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
    [MeetingRTMManager endMeeting];
    [[MeetingRTCManager shareRtc] leaveChannel];
}

- (void)leaveRoom {
    [MeetingRTMManager leaveMeeting];
    [[MeetingRTCManager shareRtc] leaveChannel];
}

- (void)roomResync:(void (^)(BOOL, RTMStatusCode))block {
    [MeetingRTMManager resync:^(RTMACKModel * _Nonnull model) {
        block(model.result, model.code);
    }];
}

- (void)updateRtcVideoParams {
    [[MeetingRTCManager shareRtc] updateRtcVideoParams];
}

- (void)stopRecord {
    [MeetingRTMManager stopRecord];
}

- (int)setEnableSpeakerphone:(BOOL)enableSpeaker {
    return [[MeetingRTCManager shareRtc] setEnableSpeakerphone:enableSpeaker];
}

- (void)switchCamera {
    [[MeetingRTCManager shareRtc] switchCamera];
}

- (void)startShare:(int)share_type {
    [MeetingRTMManager startShare:share_type];
}

- (void)endShare {
    [MeetingRTMManager endShare];
}

#pragma mark - RTC API
- (void)reloadUserList {
    @weakify(self);
    [MeetingRTMManager getMeetingUserList:^(NSArray<RoomVideoSession *> * _Nonnull userLists, RTMACKModel * _Nonnull model) {
        @strongify(self);
        if (model.result) {
            [self.userList removeAllObjects];
            [self.userList addObjectsFromArray:userLists];
            for (RoomVideoSession *user in self.userList) {
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
- (void)observeUserVisiable:(RoomVideoSession*)user {
    [self.KVOControllerNonRetaining observe:user
                                    keyPath:@keypath(user, isVisible)
                                    options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionInitial
                                      block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
        RoomVideoSession *session = object;
        if (session.isLoginUser) {
            return;
        }
        
        if (session.isSharingScreen) {
            [[MeetingRTCManager shareRtc] subscribeScreenStream:session.uid];
        } else {
            [[MeetingRTCManager shareRtc] unsubscribeScreen:session.uid];
        }
        
        if (session.isVisible) {
            [[MeetingRTCManager shareRtc] subscribeStream:session.uid video:YES];
        } else {
            [[MeetingRTCManager shareRtc] unsubscribe:session.uid];
        }
    }];
}

- (void)addUser:(RoomVideoSession *)roomUserModel {
    if (roomUserModel.uid == nil) {
        NSLog(@"Empty User");
    }
    //重复数据删除
    //Deduplication
    NSInteger index = -1;
    for (int i = 0; i < self.userList.count; i++) {
        RoomVideoSession *userModel = self.userList[i];
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
    RoomVideoSession *deleteModel = nil;
    for (RoomVideoSession *roomUserModel in self.userList) {
        if ([roomUserModel.uid isEqualToString:uid]) {
            deleteModel = roomUserModel;
            break;
        }
    }
    if (deleteModel) {
        [self.userList removeObject:deleteModel];
    }
}

- (void)updateHost:(NSString *)uid roomId:(NSString *)roomId {
    for (RoomVideoSession *roomUserModel in self.userList) {
        if ([roomUserModel.uid isEqualToString:uid] &&
            [roomUserModel.roomId isEqualToString:roomId]) {
            
            roomUserModel.isHost = YES;
            roomUserModel.hasSharePermission = YES;
            roomUserModel.hasOperatePermission = YES;
            
            if ([roomUserModel.uid isEqualToString:self.roomModel.host_user_id]) {
                self.roomModel.host_user_id = uid;
                self.roomModel.host_user_name = roomUserModel.name;
            }
            
            if ([self.localVideoSession.uid isEqualToString:uid] &&
                [self.localVideoSession.roomId isEqualToString:roomId]) {
                self.localVideoSession.isHost = YES;
                self.localVideoSession.hasSharePermission = YES;
                self.localVideoSession.hasOperatePermission = YES;
            }
            break;
        }
    }
}

- (void)updateUserView:(NSString *)uid enableMic:(BOOL)isEnable {
    if (IsEmptyStr(uid)) {
        //mute all user
        for (RoomVideoSession *userModel in self.userList) {
            if (![userModel.uid isEqualToString:self.roomModel.host_user_id]) {
                userModel.isEnableAudio = isEnable;
            }
        }
    } else {
        //mute user
        for (RoomVideoSession *userModel in self.userList) {
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
    for (RoomVideoSession *userModel in self.userList) {
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
    for (RoomVideoSession *userSession in self.userList) {
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

#pragma mark - MeetingRTCManagerDelegate

- (void)rtcManager:(MeetingRTCManager * _Nonnull)rtcManager didStreamAdded:(NSString * _Nullable)uid {
    for (RoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublished = YES;
        }
    }
}

- (void)rtcManager:(MeetingRTCManager *_Nonnull)rtcManager didStreamRemoved:(NSString * _Nullable)uid {
    for (RoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublished = NO;
        }
    }
}

- (void)rtcManager:(MeetingRTCManager * _Nonnull)rtcManager didScreenStreamAdded:(NSString *_Nullable)uid {
    for (RoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublishedScreen = YES;
        }
    }
}

- (void)rtcManager:(MeetingRTCManager *_Nonnull)rtcManager didScreenStreamRemoved:(NSString *)uid {
    for (RoomVideoSession *session in self.userList) {
        if ([session.uid isEqualToString:uid]) {
            session.isPublishedScreen = NO;
        }
    }
}

- (void)meetingRTCManager:(MeetingRTCManager *)meetingRTCManager changeParamInfo:(RoomParamInfoModel *)model {
    self.roomParamInfo = model;
}

- (void)rtcManager:(MeetingRTCManager *)rtcManager reportAllAudioVolume:(NSDictionary<NSString *, NSNumber *> *)volumeInfo {
    for (RoomVideoSession *userModel in self.userList) {
        NSNumber *volumeNumber = [volumeInfo objectForKey:userModel.uid];
        if (volumeNumber) {
            userModel.volume = [volumeNumber integerValue];
        } else {
            userModel.volume = 0;
        }
    }
}

#pragma mark - MeetingRTMManager Callback
- (void)addSocketListener {
    WeakSelf;
    // User Join
    [MeetingRTMManager onUserJoinMeeting:^(MeetingControlUserModel * _Nonnull model) {
        if (wself) {
            RoomVideoSession *roomUserModel = [RoomVideoSession constructWithMeetingControlUserModel:model];
            if (![roomUserModel.uid isEqualToString:wself.localVideoSession.uid]) {
                [wself addUser:roomUserModel];
            }
        }
    }];

    // User Leave
    [MeetingRTMManager onUserLeaveMeeting:^(MeetingControlUserModel * _Nonnull model) {
        if (wself) {
            [wself removeUser:model.user_id];
        }
    }];

    // onHostChange
    [MeetingRTMManager onHostChange:^(NSString * _Nonnull uid, NSString * _Nonnull roomId) {
        if (wself) {
            [wself updateHost:uid roomId:roomId];
        }
    }];
    
    
    // Mic status change
    [MeetingRTMManager onUserMicStatusChanged:^(NSString * _Nonnull uid, BOOL result) {
        if (wself) {
            [wself updateUserView:uid enableMic:result];
        }
    }];
    
    // Camera status change
    [MeetingRTMManager onUserCamStatusChanged:^(NSString * _Nonnull uid, BOOL result) {
        if (wself) {
            [wself updateUserView:uid enableCamera:result];
        }
    }];
    
    // Mute all user microphone
    [MeetingRTMManager onForceTurnOnOffMicOfAllUsers:^(BOOL on, BOOL can) {
        if (wself) {
            [wself updateUserView:nil enableMic:on];
        }
        
        if (!on && wself && !wself.localVideoSession.isHost) {
            wself.localVideoSession.hasOperatePermission = can;
            wself.localVideoSession.isEnableAudio = on;
            
            [PermitManager recieveOperateAllMic];
        }
    }];

    // Microphone change notice
    [MeetingRTMManager onReceiveTurnOnOffMicInvite:^(NSString * _Nonnull uid, BOOL unmute) {
        if (wself) {
            if (!self.localVideoSession.isHost && [uid isEqualToString:wself.localVideoSession.uid]) {
                [PermitManager recieveMicInvite:unmute curMicUnmute:wself.localVideoSession.isEnableAudio];
            }
        }
    }];
    
    // camera change notice
    [MeetingRTMManager onReceiveTurnOnOffCamInvite:^(NSString * _Nonnull uid, BOOL unmute) {
        if (wself) {
            if (!self.localVideoSession.isHost && [uid isEqualToString:wself.localVideoSession.uid]) {
                [PermitManager recieveCameraInvite:unmute curMicUnmute:self.localVideoSession.isEnableVideo];
            }
        }
    }];
    
    // start record
    [MeetingRTMManager onRecordStarted:^(BOOL result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (wself) {
                wself.roomModel.record_status = YES;
                [PermitManager recieveRecordStatus:YES];
            }
        });
    }];
    
    // stop record
    [MeetingRTMManager onRecordFinished:^(BOOL result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (wself) {
                wself.roomModel.record_status = NO;
                [PermitManager recieveRecordStatus:NO];
            }
        });
    }];

    // start share
    [MeetingRTMManager onUserStartShare:^(NSString * _Nonnull uid, NSString * _Nonnull name, int share_type, BOOL result) {
        if (wself) {
            wself.roomModel.share_user_id = result ? uid : @"";
            wself.roomModel.share_type = share_type;
            [PermitManager recieveShareStatus:result name:name type:share_type];
            [wself updateUserView:uid enableShare:result shareType:share_type];
            wself.shareChangedCallbackBlock(uid, share_type);
        }
    }];
    
    // stop share
    [MeetingRTMManager onUserStopShare:^(NSString * _Nonnull uid, BOOL result) {
        wself.roomModel.share_user_id = @"";
        [PermitManager recieveShareStatus:result name:nil type:-1];
        [wself updateUserView:uid enableShare:result shareType:-1];
        wself.shareChangedCallbackBlock(@"", -1);
    }];
    
    [MeetingRTMManager onSharePermissionAccepted:^(BOOL accepted) {
        if (wself) {
            if (!wself.localVideoSession.isHost) {
                wself.localVideoSession.hasSharePermission = accepted;
                [PermitManager recieveShareAccept:accepted];
            }
        }
    }];
    
    [MeetingRTMManager onOperateOtherSharePermission:^(BOOL accepted,NSString *uid) {
        if (wself) {
            if ([uid isEqualToString:self.localVideoSession.uid]) {
                wself.localVideoSession.hasSharePermission = accepted;
                [PermitManager recieveShareUpdate:accepted];
            }
            for (RoomVideoSession *userModel in self.userList) {
                if ([uid isEqualToString:userModel.uid]) {
                    userModel.hasSharePermission = accepted;
                }
            }
        }
    }];
    

    // meeting end
    [MeetingRTMManager onMeetingEnd:^(int reason) {
        if (wself) {
            if (reason == 0) {
                wself.needHangUp = YES;
            } else {
                wself.timeOut = YES;
            }
        }
    }];
    
    // receive mic permission apply
    [MeetingRTMManager onReceiveMicPermissionApply:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            int applyCount = 0;
            RoomVideoSession *applyUserModel = nil;
            for (RoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    userModel.isRequestMic = YES;
                    applyUserModel = userModel;
                }
                
                if (userModel.isRequestMic) {
                    applyCount += 1;
                }
            }
            
            if (applyCount > 1) {
                [PermitManager recieveMicRequestWithCount:applyCount block:^(BOOL result) {
                    if (result) {
                        // 跳转用户列表
                    }
                }];
            } else {
                [PermitManager recieveMicRequest:uid name:name block:^(BOOL result) {
                    applyUserModel.isRequestMic = NO;
                }];
            }
        }
    }];
    
    // receive camera permission apply
    [MeetingRTMManager onReceiveCamPermissionApply:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            
            RoomVideoSession *applyUserModel = nil;
            for (RoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    applyUserModel = userModel;
                }
            }
            [PermitManager recieveCameraRequest:uid name:name block:nil];
        }
    }];
    
    // receive share permission apply
    [MeetingRTMManager onReceiveSharePermissionApply:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            int applyCount = 0;
            RoomVideoSession *applyUserModel = nil;
            for (RoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    userModel.isRequestShare = YES;
                    applyUserModel = userModel;
                }
                
                if (userModel.isRequestShare) {
                    applyCount += 1;
                }
            }
            
            if (applyCount > 1) {
                [PermitManager recieveShareRequestWithCount:applyCount block:^(BOOL result) {
                    if (result) {
                        // 跳转用户列表
                    }
                }];
            } else {
                [PermitManager recieveShareRequest:uid name:name block:^(BOOL result) {
                    applyUserModel.isRequestShare = NO;
                }];
            }
        }
    }];
    
    // receive record permission apply
    [MeetingRTMManager onReceiveRecordRequest:^(NSString *uid, NSString *name) {
        if (wself) {
            if (!self.localVideoSession.isHost) {
                return;
            }
            
            RoomVideoSession *applyUserModel = nil;
            for (RoomVideoSession *userModel in self.userList) {
                if (![uid isEqualToString:self.localVideoSession.uid] && [uid isEqualToString:userModel.uid]) {
                    applyUserModel = userModel;
                }
            }
            [PermitManager recieveRecordRequest:uid name:name block:nil];
        }
    }];
    
    // receive record permission response
    [MeetingRTMManager onRecordRequestAccepted:^(BOOL accepted) {
        if (wself) {
            [PermitManager recieveRecordAccept:accepted];
        }
    }];
    
    [MeetingRTMManager onMicPermissionAccepted:^(BOOL accepted) {
        if (wself) {
            wself.localVideoSession.hasOperatePermission = accepted;
            [PermitManager recieveMicAccept:accepted];
        }
    }];
    
    [MeetingRTMManager onCamPermissionAccepted:^(BOOL accepted) {
        if (wself) {
            self.localVideoSession.hasOperatePermission = accepted;
            [PermitManager recieveCameraAccept:accepted];
        }
    }];
}


@end
