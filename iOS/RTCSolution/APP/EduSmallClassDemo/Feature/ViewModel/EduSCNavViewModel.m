//
//  EduSCNavViewModel.m
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/31.
//

#import "EduSCNavViewModel.h"

@interface EduSCNavViewModel ()

@end

@implementation EduSCNavViewModel
- (instancetype)initWithVideoSession:(EduSCRoomVideoSession*)session withRoomModel:(nonnull EduSmallClassControlRoomModel *)roomModel {
    self = [super init];
    if (self) {
        self.localVideoSession = session;
        self.roomModel = roomModel;
    }
    return self;
}



@end
