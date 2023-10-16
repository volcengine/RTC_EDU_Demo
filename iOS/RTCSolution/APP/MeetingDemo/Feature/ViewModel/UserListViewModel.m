//
//  UserListViewModel.m
//  MeetingDemo
//
//  Created by guojian on 2023/1/29.
//

#import "UserListViewModel.h"

@implementation UserListViewModel

- (instancetype)initWithLocalVideoSeesion:(RoomVideoSession *)local userList:(NSMutableArray<RoomVideoSession *> *)userList {
    self = [super init];
    if (self) {
        self.localVideoSession = local;
        self.videoSessions = userList;
    }
    return self;
}

@end
