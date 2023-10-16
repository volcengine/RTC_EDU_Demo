//
//  EduBCRoomViewModel.h
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/11.
//

#import <Foundation/Foundation.h>
#import "EduBCRoomVideoSession.h"
#import "EduBigClassControlRoomModel.h"
#import "EduBigClassRTMManager.h"
#import "EduBigClassRTCManager.h"
#import "EduBCRoomParamInfoModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^jumpUserListCallback)(BOOL result);
typedef void (^shareChangedCallback)(NSString *uid, int shareType);

@interface EduBCRoomViewModel : NSObject

- (instancetype)initWithLocalVideoSession:(EduBCRoomVideoSession *)videoSession withRoomModel:(EduBigClassControlRoomModel *)roomModel withUsers:(NSArray<EduBCRoomVideoSession *> *)userLists;

- (void)reloadUserList;
- (void)joinRoom;
- (void)endRoom;
- (void)leaveRoom;
- (void)roomResync:(void (^)(RTMACKModel *model))block;
- (void)updateRtcVideoParams;
- (void)stopRecord;
- (int)setEnableSpeakerphone:(BOOL)enableSpeaker;
- (void)switchCamera;
- (void)startShare:(int)share_type;
- (void)endShare;
- (void)turnOnMic:(BOOL)on;


@property(nonatomic, assign)BOOL isJoined;
@property(nonatomic, assign)BOOL needHangUp;
@property(nonatomic, assign)BOOL timeOut;
@property(nonatomic, strong)EduBCRoomVideoSession *localVideoSession;
@property (nonatomic, weak)EduBCRoomVideoSession *focusedVideoSession;
@property (nonatomic, weak)EduBCRoomVideoSession *activeSpeaker;
@property(nonatomic, strong)EduBigClassControlRoomModel *roomModel;
@property(nonatomic, strong)EduBCRoomParamInfoModel *roomParamInfo;
@property(nonatomic, strong)jumpUserListCallback jumpUserListCallbackBlock;
@property(nonatomic, strong)shareChangedCallback shareChangedCallbackBlock;



@end

NS_ASSUME_NONNULL_END
