//
//  EduBigClassRTMManager.h
//  SceneRTCDemo
//
//  Created by on 2021/3/16.
//

#import <Foundation/Foundation.h>
#import "EduBigClassControlUserModel.h"
#import "EduBigClassControlRoomModel.h"
#import "EduBigClassControlRecordModel.h"
#import "EduBCRoomVideoSession.h"
#import "BaseRTCManager.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBigClassRTMManager : BaseRTCManager

#pragma mark - Get EduBigClass data

/*
 * Reconnect
 * @param block Callback
 */
+ (void)resync:(void (^)(RTMACKModel *model))block;

/*
 * Join the EduBigClass
 * @param loginModel Login user data
 * @param userLists user lists data
 * @param block Callback
 */
+ (void)joinEduBigClass:(EduBCRoomVideoSession *)session block:(void (^)(int resultCode, EduBigClassControlRoomModel *roomModel, NSArray<EduBCRoomVideoSession *> *userLists))block;

/*
 * Leave EduBigClass
 */
+ (void)leaveEduBigClass;

/*
 * Turn On or Off Mic
 */
+ (void)turnOnOffMic:(BOOL)on;

/*
 * Turn On or Off Camera
 */
+ (void)turnOnOffCam:(BOOL)on;

/*
 * Get the participant list/participant status
 * @param userId User ID
 * @param block Callback
 */
+ (void)getEduBigClassUserList:(void (^)(NSArray<EduBCRoomVideoSession *> *userLists, RTMACKModel *model))block;

/*
 * Get historical video download address
 * @param isHolder Holder Video
 * @param block Callback
 */
+ (void)getHistoryVideoRecord:(BOOL)isHolder block:(void (^)(NSArray<EduBigClassControlRecordModel *> *recordLists, RTMACKModel *model))block;


#pragma mark - Control EduBigClass status

/*
 * Request to link microphone
 * @param block Callback
 */
+ (void)applyForLinkMic;

/*
 * Cancel request to link microphone
 * @param block Callback
 */
+ (void)cancelApplyForLinkMic;

/*
 * leave to link microphone
 * @param block Callback
 */
+ (void)leaveForLinkMic;

/*
 * Request to start share
 * @param block Callback
 */
+ (void)applyForSharePermission:(void (^)(BOOL result))block;


#pragma mark - Notification message

/*
 * User microphone on/off notification
 * @param block Callback
 */
+ (void)onUserMicStatusChanged:(void (^)(NSString *uid, BOOL result))block;

/*
 * User camera on/off notification
 * @param block Callback
 */
+ (void)onUserCamStatusChanged:(void (^)(NSString *uid, BOOL result))block;

/*
 * User mic been force changed notification
 * @param block Callback
 */
+ (void)onReceiveTurnOnOffMicInvite:(void (^)(NSString *uid, BOOL status))block;

/*
 * User camera been force changed notification
 * @param block Callback
 */
+ (void)onReceiveTurnOnOffCamInvite:(void (^)(NSString *uid, BOOL status))block;


/*
 * Request to turn on camera notification
 * @param block Callback
 */
+ (void)onReceiveCamPermissionApply:(void (^)(NSString *uid, NSString *name))block;



+ (void)onOperateOtherSharePermission:(void (^)(BOOL accepted,NSString *uid))block;
/*
 * on receive response for self operate
 * @param block Callback
 */
+ (void)onSelfOperatePermissionAccepted:(void (^)(BOOL accepted))block;

/*
 * User join notification
 * @param block Callback
 */
+ (void)onUserJoinEduBigClass:(void (^)(EduBigClassControlUserModel *model))block;


/*
 * User leave notification
 * @param block Callback
 */
+ (void)onUserLeaveEduBigClass:(void (^)(EduBigClassControlUserModel *model))block;

/*
 * Start sharing status change notification
 * @param block Callback
 */
+ (void)onUserStartShare:(void (^)(NSString *uid, NSString * _Nonnull name, int share_type, BOOL result))block;

/*
 * Stop sharing status change notification
 * @param block Callback
 */
+ (void)onUserStopShare:(void (^)(NSString *uid, BOOL result))block;

+ (void)onRecordStarted:(void (^)(BOOL result))block;

/*
 * Conference recording completion notice // Phase 2 will be developed
 * @param block Callback
 */
+ (void)onRecordFinished:(void (^)(BOOL result))block;

/*
 * Notice of the end of the EduBigClass
 * @param block Callback
 */
+ (void)onEduBigClassEnd:(void (^)(int reason))block;

/*
 * Changes in the number of users who apply for LinkMic
 * @param block Callback
 */
+ (void)onLinkmicApplyUserListChange:(void (^)(NSInteger applyUserCount))block;

/*
 * LinkMic user join
 * @param block Callback
 */
+ (void)onLinkmicJoin:(void (^)(NSString *uid))block;

/*
 * LinkMic user join
 * @param block Callback
 */
+ (void)onLinkmicLeave:(void (^)(NSString *uid))block;

/*
 * response for apply LinkMic
 * @param block Callback
 */
+ (void)onLinkmicPermit:(void (^)(BOOL accepted))block;

/*
 * kick LinkMic user
 * @param block Callback
 */
+ (void)onLinkmicKick:(void (^)(NSString *roomId, NSString *uid))block;

@end

NS_ASSUME_NONNULL_END
