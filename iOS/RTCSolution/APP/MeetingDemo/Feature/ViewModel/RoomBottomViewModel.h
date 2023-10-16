//
//  RoomBottomViewModel.h
//  MeetingDemo
//
//  Created by guojian on 2023/1/15.
//

#import <Foundation/Foundation.h>
#import "RoomVideoSession.h"
#import "MeetingControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RoomBottomViewModel : NSObject

- (instancetype)initWithVideoSession:(RoomVideoSession*)session withRoomModel:(MeetingControlRoomModel*)roomModel;
- (void)turnOnMic:(BOOL)on;
- (void)turnOnCamera:(BOOL)on;
- (void)requestSharePermission;
- (void)startRecord;
- (void)stopRecord;

@property(nonatomic, strong)RoomVideoSession *localVideoSession;
@property(nonatomic, strong)MeetingControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
