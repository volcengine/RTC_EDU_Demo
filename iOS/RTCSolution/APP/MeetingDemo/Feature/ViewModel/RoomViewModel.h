//
//  RoomViewModel.h
//  MeetingDemo
//
//  Created by guojian on 2023/1/11.
//

#import <Foundation/Foundation.h>
#import "RoomVideoSession.h"
#import "MeetingControlRoomModel.h"
#import "MeetingRTMManager.h"
#import "MeetingRTCManager.h"
#import "RoomParamInfoModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^jumpUserListCallback)(BOOL result);
typedef void (^shareChangedCallback)(NSString *uid, int shareType);

@interface RoomViewModel : NSObject

- (instancetype)initWithLocalVideoSession:(RoomVideoSession *)videoSession withRoomModel:(MeetingControlRoomModel *)roomModel withUsers:(NSArray<RoomVideoSession *> *)userLists;

- (void)reloadUserList;
- (void)joinRoom;
- (void)endRoom;
- (void)leaveRoom;
- (void)roomResync:(void (^)(BOOL result, RTMStatusCode code))block;
- (void)updateRtcVideoParams;
- (void)stopRecord;
- (int)setEnableSpeakerphone:(BOOL)enableSpeaker;
- (void)switchCamera;
- (void)startShare:(int)share_type;
- (void)endShare;


@property(nonatomic, assign)BOOL isJoined;
@property(nonatomic, assign)BOOL needHangUp;
@property(nonatomic, assign)BOOL timeOut;
@property(nonatomic, strong)RoomVideoSession *localVideoSession;
@property (nonatomic, weak)RoomVideoSession *focusedVideoSession;
@property (nonatomic, weak)RoomVideoSession *activeSpeaker;
@property(nonatomic, strong)MeetingControlRoomModel *roomModel;
@property(nonatomic, strong)RoomParamInfoModel *roomParamInfo;
@property(nonatomic, strong)jumpUserListCallback jumpUserListCallbackBlock;
@property(nonatomic, strong)shareChangedCallback shareChangedCallbackBlock;



@end

NS_ASSUME_NONNULL_END
