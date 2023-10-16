//
//  EduSCUserListViewModel.m
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/29.
//

#import "EduSCUserListViewModel.h"

@implementation EduSCUserListViewModel

- (instancetype)initWithLocalVideoSeesion:(EduSCRoomVideoSession *)local userList:(NSMutableArray<EduSCRoomVideoSession *> *)userList {
    self = [super init];
    if (self) {
        self.localVideoSession = local;
        self.videoSessions = userList;
    }
    return self;
}

@end
