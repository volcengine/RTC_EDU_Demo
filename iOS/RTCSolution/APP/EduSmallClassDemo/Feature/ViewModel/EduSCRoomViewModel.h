//
//  EduSCRoomViewModel.h
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/11.
//

#import <Foundation/Foundation.h>
#import "EduSCRoomVideoSession.h"
#import "EduSmallClassControlRoomModel.h"
#import "EduSmallClassRTMManager.h"
#import "EduSmallClassRTCManager.h"
#import "EduSCRoomParamInfoModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^jumpUserListCallback)(BOOL result);
typedef void (^shareChangedCallback)(NSString *uid, int shareType);

@interface EduSCRoomViewModel : NSObject

- (instancetype)initWithLocalVideoSession:(EduSCRoomVideoSession *)videoSession withRoomModel:(EduSmallClassControlRoomModel *)roomModel withUsers:(NSArray<EduSCRoomVideoSession *> *)userLists;

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
@property(nonatomic, strong)EduSCRoomVideoSession *localVideoSession;
@property (nonatomic, weak)EduSCRoomVideoSession *focusedVideoSession;
@property (nonatomic, weak)EduSCRoomVideoSession *activeSpeaker;
@property(nonatomic, strong)EduSmallClassControlRoomModel *roomModel;
@property(nonatomic, strong)EduSCRoomParamInfoModel *roomParamInfo;
@property(nonatomic, strong)jumpUserListCallback jumpUserListCallbackBlock;
@property(nonatomic, strong)shareChangedCallback shareChangedCallbackBlock;



@end

NS_ASSUME_NONNULL_END
