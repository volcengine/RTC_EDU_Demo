//
//  UserListViewModel.h
//  MeetingDemo
//
//  Created by guojian on 2023/1/29.
//

#import <Foundation/Foundation.h>
#import "RoomVideoSession.h"
#import "UserListViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface UserListViewModel : NSObject

- (instancetype)initWithLocalVideoSeesion:(RoomVideoSession*)local userList:(NSMutableArray<RoomVideoSession *>*)userList;

@property (nonatomic, strong) RoomVideoSession *localVideoSession;
@property (nonatomic, strong) NSMutableArray<RoomVideoSession *> *videoSessions;
@end

NS_ASSUME_NONNULL_END
