//
//  EduBCWhiteBoardViewModel.m
//  EduBigClassDemo
//
//  Created by ByteDance on 2023/4/28.
//

#import "EduBCWhiteBoardViewModel.h"
#import "EduBigClassRTMManager.h"

@implementation EduBCWhiteBoardViewModel
- (instancetype)initWithVideoSession:(EduBCRoomVideoSession*)session withRoomModel:(nonnull EduBigClassControlRoomModel *)roomModel {
    self = [super init];
    if (self) {
        self.localVideoSession = session;
        self.roomModel = roomModel;
    }
    
    return self;
}

@end
