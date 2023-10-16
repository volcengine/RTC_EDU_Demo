//
//  EduBCRoomBottomViewModel.m
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/15.
//

#import "EduBCRoomBottomViewModel.h"
#import "EduBCPermitManager.h"

@interface EduBCRoomBottomViewModel ()
@end

@implementation EduBCRoomBottomViewModel

- (instancetype)initWithVideoSession:(EduBCRoomVideoSession*)session withRoomModel:(nonnull EduBigClassControlRoomModel *)roomModel {
    self = [super init];
    if (self) {
        self.localVideoSession = session;
        self.roomModel = roomModel;
    }
    
    return self;
}
- (void)turnOnMic:(BOOL)on {
    if (on && !self.localVideoSession.isHost && !self.localVideoSession.hasOperatePermission) {
        [EduBCPermitManager enableMicRequestWithUid:self.localVideoSession.uid block:nil];
    } else {
        [EduBCPermitManager enableMic:on];
    }
}

- (void)turnOnCamera:(BOOL)on {
    [EduBCPermitManager enableCamera:on];
}

- (void)requestSharePermission {
    [EduBCPermitManager startShareRequestWithUid:self.localVideoSession.uid block:nil];
}

- (void)startRecord {
    if (self.localVideoSession.isHost) {
        [EduBCPermitManager startRecord:nil];
    } else {
        [EduBCPermitManager startRecordRequest];
    }
}

- (void)stopRecord {
    [EduBCPermitManager stopRecord:nil];
}

@end
