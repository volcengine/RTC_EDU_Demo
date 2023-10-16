//
//  EduBCUserListViewModel.m
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/29.
//

#import "EduBCUserListViewModel.h"

@implementation EduBCUserListViewModel

- (instancetype)initWithLocalVideoSeesion:(EduBCRoomVideoSession *)local userList:(NSMutableArray<EduBCRoomVideoSession *> *)userList {
    self = [super init];
    if (self) {
        self.localVideoSession = local;
        self.videoSessions = userList;
    }
    return self;
}

@end
