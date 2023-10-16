//
//  NavViewModel.m
//  MeetingDemo
//
//  Created by guojian on 2023/1/31.
//

#import "NavViewModel.h"

@interface NavViewModel ()

@end

@implementation NavViewModel
- (instancetype)initWithVideoSession:(RoomVideoSession*)session withRoomModel:(nonnull MeetingControlRoomModel *)roomModel {
    self = [super init];
    if (self) {
        self.localVideoSession = session;
        self.roomModel = roomModel;
    }
    return self;
}



@end
