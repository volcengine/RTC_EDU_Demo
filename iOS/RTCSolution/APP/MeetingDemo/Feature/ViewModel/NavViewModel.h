//
//  NavViewModel.h
//  MeetingDemo
//
//  Created by guojian on 2023/1/31.
//

#import <Foundation/Foundation.h>
#import "RoomVideoSession.h"
#import "MeetingControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface NavViewModel : NSObject

- (instancetype)initWithVideoSession:(RoomVideoSession*)session withRoomModel:(nonnull MeetingControlRoomModel *)roomModel;

@property(nonatomic, strong)RoomVideoSession *localVideoSession;
@property(nonatomic, strong)MeetingControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
