//
//  EduSCWhiteBoardViewModel.m
//  EduSmallClassDemo
//
//  Created by ByteDance on 2023/4/28.
//

#import "EduSCWhiteBoardViewModel.h"
#import "EduSCPermitManager.h"

@implementation EduSCWhiteBoardViewModel
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
@end
