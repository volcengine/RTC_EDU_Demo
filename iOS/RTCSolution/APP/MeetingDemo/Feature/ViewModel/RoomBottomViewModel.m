//
//  RoomBottomViewModel.m
//  MeetingDemo
//
//  Created by guojian on 2023/1/15.
//

#import "RoomBottomViewModel.h"
#import "PermitManager.h"

@interface RoomBottomViewModel ()
@end

@implementation RoomBottomViewModel

- (instancetype)initWithVideoSession:(RoomVideoSession*)session withRoomModel:(nonnull MeetingControlRoomModel *)roomModel {
    self = [super init];
    if (self) {
        self.localVideoSession = session;
        self.roomModel = roomModel;
    }
    
    return self;
}
- (void)turnOnMic:(BOOL)on {
    if (on && !self.localVideoSession.isHost && !self.localVideoSession.hasOperatePermission) {
        [PermitManager enableMicRequestWithUid:self.localVideoSession.uid block:nil];
    } else {
        [PermitManager enableMic:on];
    }
}

- (void)turnOnCamera:(BOOL)on {
    [PermitManager enableCamera:on];
}

- (void)requestSharePermission {
    [PermitManager startShareRequestWithUid:self.localVideoSession.uid block:nil];
}

- (void)startRecord {
    if (self.localVideoSession.isHost) {
        [PermitManager startRecord:nil];
    } else {
        [PermitManager startRecordRequest];
    }
}

- (void)stopRecord {
    if (self.localVideoSession.isHost) {
        [PermitManager stopRecord:nil];
    }else {
        [PermitManager showNoPermmitionStopRecord];
    }
}

@end
