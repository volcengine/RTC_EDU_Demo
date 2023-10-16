//
//  EduSCRoomBottomViewModel.m
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/15.
//

#import "EduSCRoomBottomViewModel.h"
#import "EduSCPermitManager.h"

@interface EduSCRoomBottomViewModel ()
@end

@implementation EduSCRoomBottomViewModel

- (instancetype)initWithVideoSession:(EduSCRoomVideoSession*)session withRoomModel:(nonnull EduSmallClassControlRoomModel *)roomModel {
    self = [super init];
    if (self) {
        self.localVideoSession = session;
        self.roomModel = roomModel;
    }
    
    return self;
}
- (void)turnOnMic:(BOOL)on {
    if (on && !self.localVideoSession.isHost && !self.localVideoSession.hasOperatePermission) {
        [EduSCPermitManager enableMicRequestWithUid:self.localVideoSession.uid block:nil];
    } else {
        [EduSCPermitManager enableMic:on];
    }
}

- (void)turnOnCamera:(BOOL)on {
    [EduSCPermitManager enableCamera:on];
}

- (void)requestSharePermission {
    [EduSCPermitManager startShareRequestWithUid:self.localVideoSession.uid block:nil];
}

- (void)startRecord {
    if (self.localVideoSession.isHost) {
        [EduSCPermitManager startRecord:nil];
    } else {
        [EduSCPermitManager startRecordRequest];
    }
}

- (void)stopRecord {
    if (self.localVideoSession.isHost) {
        [EduSCPermitManager stopRecord:nil];
    }else {
        [EduSCPermitManager showNoPermmitionStopRecord];
    }
}

@end
