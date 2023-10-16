//
//  EduBCNavViewModel.m
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/31.
//

#import "EduBCNavViewModel.h"

@interface EduBCNavViewModel ()

@end

@implementation EduBCNavViewModel
- (instancetype)initWithVideoSession:(EduBCRoomVideoSession*)session withRoomModel:(nonnull EduBigClassControlRoomModel *)roomModel {
    self = [super init];
    if (self) {
        self.localVideoSession = session;
        self.roomModel = roomModel;
    }
    return self;
}



@end
