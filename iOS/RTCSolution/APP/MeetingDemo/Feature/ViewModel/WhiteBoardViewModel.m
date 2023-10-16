//
//  WhiteBoardViewModel.m
//  MeetingDemo
//
//  Created by ByteDance on 2023/4/28.
//

#import "WhiteBoardViewModel.h"
#import "PermitManager.h"

@implementation WhiteBoardViewModel
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
@end
