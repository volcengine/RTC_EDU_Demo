//
//  WhiteBoardViewModel.h
//  MeetingDemo
//
//  Created by ByteDance on 2023/4/28.
//

#import <Foundation/Foundation.h>
#import "RoomVideoSession.h"
#import "MeetingControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface WhiteBoardViewModel : NSObject
- (instancetype)initWithVideoSession:(RoomVideoSession*)session withRoomModel:(MeetingControlRoomModel*)roomModel;
- (void)turnOnMic:(BOOL)on;

@property(nonatomic, strong)RoomVideoSession *localVideoSession;
@property(nonatomic, strong)MeetingControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
