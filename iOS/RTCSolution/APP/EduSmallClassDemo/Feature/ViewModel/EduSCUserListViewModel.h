//
//  EduSCUserListViewModel.h
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/29.
//

#import <Foundation/Foundation.h>
#import "EduSCRoomVideoSession.h"
#import "EduSCUserListViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCUserListViewModel : NSObject

- (instancetype)initWithLocalVideoSeesion:(EduSCRoomVideoSession*)local userList:(NSMutableArray<EduSCRoomVideoSession *>*)userList;

@property (nonatomic, strong) EduSCRoomVideoSession *localVideoSession;
@property (nonatomic, strong) NSMutableArray<EduSCRoomVideoSession *> *videoSessions;
@end

NS_ASSUME_NONNULL_END
