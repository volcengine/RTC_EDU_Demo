//
//  EduBCUserListViewModel.h
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/29.
//

#import <Foundation/Foundation.h>
#import "EduBCRoomVideoSession.h"
#import "EduBCUserListViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCUserListViewModel : NSObject

- (instancetype)initWithLocalVideoSeesion:(EduBCRoomVideoSession*)local userList:(NSMutableArray<EduBCRoomVideoSession *>*)userList;

@property (nonatomic, strong) EduBCRoomVideoSession *localVideoSession;
@property (nonatomic, strong) NSMutableArray<EduBCRoomVideoSession *> *videoSessions;
@end

NS_ASSUME_NONNULL_END
