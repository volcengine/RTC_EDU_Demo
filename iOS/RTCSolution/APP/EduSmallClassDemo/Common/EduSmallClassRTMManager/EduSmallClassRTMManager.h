//
//  EduSmallClassRTMManager.h
//  SceneRTCDemo
//
//  Created by on 2021/3/16.
//

#import <Foundation/Foundation.h>
#import "EduSmallClassControlUserModel.h"
#import "EduSmallClassControlRoomModel.h"
#import "EduSmallClassControlRecordModel.h"
#import "EduSCRoomVideoSession.h"
#import "BaseRTCManager.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSmallClassRTMManager : BaseRTCManager

#pragma mark - Get EduSmallClass data

/*
 * Join the EduSmallClass
 * @param loginModel Login user data
 * @param userLists user lists data
 * @param block Callback
 */
+ (void)joinEduSmallClass:(EduSCRoomVideoSession *)session block:(void (^)(int resultCode, EduSmallClassControlRoomModel *roomModel, NSArray<EduSCRoomVideoSession *> *userLists))block;

/*
 * Leave EduSmallClass
 */
+ (void)leaveEduSmallClass;

/*
 * End EduSmallClass
 */
+ (void)endEduSmallClass;

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
+ (void)getEduSmallClassUserList:(void (^)(NSArray<EduSCRoomVideoSession *> *userLists, RTMACKModel *model))block;

/*
 * Get historical video download address
 * @param isHolder Holder Video
 * @param block Callback
 */
+ (void)getHistoryVideoRecord:(BOOL)isHolder block:(void (^)(NSArray<EduSmallClassControlRecordModel *> *recordLists, RTMACKModel *model))block;

/*
 * Delete historical video download address
 * @param vid Video vid
 * @param block Callback
 */
+ (void)deleteVideoRecord:(NSString *)vid block:(void (^)(RTMACKModel *model))block;

/*
 * Reconnect
 * @param block Callback
 */
+ (void)resync:(void (^)(RTMACKModel *model))block;

#pragma mark - Control EduSmallClass status
/*
 * Mute single user's share
 * @param userId Users who want to mute, do not pass means to mute all users
 * @param block Callback
 */
+ (void)forceTurnOnOffShareOfUser:(NSString *)userId status:(BOOL)on block:(void (^)(BOOL result, RTMACKModel *model))block;

/*
 * Mute single user's mic
 * @param userId Users who want to mute, do not pass means to mute all users
 * @param block Callback
 */
+ (void)forceTurnOnOffMicOfUser:(NSString *)userId status:(BOOL)on block:(void (^)(BOOL result, RTMACKModel *model))block;

/*
 * Mute all users
 * @param block Callback
 */
+ (void)forceTurnOnOffMicOfAllUsers:(BOOL)on canOperateBySelf:(BOOL)can block:(void (^)(RTMACKModel *model))block;

/*
 * Mute single user's cam
 * @param userId Users who want to mute, do not pass means to mute all users
 * @param block Callback
 */
+ (void)forceTurnOnOffCamOfUser:(NSString *)userId status:(BOOL)on block:(void (^)(BOOL result, RTMACKModel *model))block;

/*
 * Request to turn on my microphone
 * @param userId ID of the user who requested to turn on the microphone
 * @param block Callback
 */
+ (void)applyForMicPermission:(NSString *)userId block:(void (^)(BOOL result))block;

/*
 * send mic permission result
 * @param userId ID of the user who requested to turn on the microphone
 * @param block Callback
 */
+ (void)grantMicPermission:(NSString *)userId result:(BOOL)granted;

/*
 * Request to turn on my camera
 * @param userId ID of the user who requested to turn on the microphone
 * @param block Callback
 */
+ (void)applyForCamPermission:(NSString *)userId block:(void (^)(BOOL result))block;

/*
 * send cam permission result
 * @param userId ID of the user who requested to turn on the microphone
 * @param block Callback
 */
+ (void)grantCamPermission:(NSString *)userId result:(BOOL)granted;

/*
 * Request to start share
 * @param userId ID of the user who requested to start share
 * @param block Callback
 */
+ (void)applyForSharePermission:(NSString *)userId block:(void (^)(BOOL result))block;

/*
 * send cam permission result
 * @param userId ID of the user who requested to turn on the microphone
 * @param block Callback
 */
+ (void)grantSharePermission:(NSString *)userId result:(BOOL)granted;

/*
 * Request to start record
 * @param userId ID of the user who requested to start record
 * @param block Callback
 */
+ (void)requestForRecord;

/*
 * send record permission result
 * @param userId ID of the user who requested to turn on the microphone
 * @param block Callback
 */
+ (void)acceptRecordRequest:(NSString *)userId result:(BOOL)accepted result:(void (^)(BOOL success))block;
/*
 * Start Share Screen
 */
+ (void)startShare:(int)share_type;

/*
 * End Share Screen
 */
+ (void)endShare;

/*
 * Start Record
 */
+ (void)startRecord;

/*
 * Stop Record
 */
+ (void)stopRecord;


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
 * Request to turn on microphone notification
 * @param block Callback
 */
+ (void)onReceiveMicPermissionApply:(void (^)(NSString *uid, NSString *name))block;

/*
 * Request to turn on camera notification
 * @param block Callback
 */
+ (void)onReceiveCamPermissionApply:(void (^)(NSString *uid, NSString *name))block;

/*
 * Request to start share
 * @param block Callback
 */
+ (void)onReceiveSharePermissionApply:(void (^)(NSString *uid, NSString *name))block;

/*
 * on receive response for cam request
 * @param block Callback
 */
+ (void)onCamPermissionAccepted:(void (^)(BOOL accepted))block;

/*
 * on receive response for mic request
 * @param block Callback
 */
+ (void)onMicPermissionAccepted:(void (^)(BOOL accepted))block;

/*
 * on receive response for share request
 * @param block Callback
 */
+ (void)onSharePermissionAccepted:(void (^)(BOOL accepted))block;

+ (void)onOperateOtherSharePermission:(void (^)(BOOL accepted, NSString *uid))block;
/*
 * on receive response for self operate
 * @param block Callback
 */
+ (void)onSelfOperatePermissionAccepted:(void (^)(BOOL accepted))block;

/*
 * Request to start record
 * @param block Callback
 */
+ (void)onReceiveRecordRequest:(void (^)(NSString *uid, NSString *name))block;

/*
 * on receive response for record request
 * @param block Callback
 */
+ (void)onRecordRequestAccepted:(void (^)(BOOL accepted))block;

/*
 * User join notification
 * @param block Callback
 */
+ (void)onUserJoinEduSmallClass:(void (^)(EduSmallClassControlUserModel *model))block;

/*
 * Mute notifications for all users
 * @param block Callback
 */
+ (void)onForceTurnOnOffMicOfAllUsers:(void (^)(BOOL on, BOOL can))block;

/*
 * User leave notification
 * @param block Callback
 */
+ (void)onUserLeaveEduSmallClass:(void (^)(EduSmallClassControlUserModel *model))block;

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

/*
 * EduSmallClass recording notice
 * @param block Callback
 */
+ (void)onRecordStarted:(void (^)(BOOL result))block;

/*
 * Conference recording completion notice // Phase 2 will be developed
 * @param block Callback
 */
+ (void)onRecordFinished:(void (^)(BOOL result))block;

/*
 * Notice of the end of the EduSmallClass
 * @param block Callback
 */
+ (void)onEduSmallClassEnd:(void (^)(int reason))block;


/*
 * Notice of the end of the EduSmallClass
 * @param block Callback
 */
+ (void)eduOnLinkmicJoin:(void (^)(BOOL reslut)) block;

/*
 * Notice of the end of the EduSmallClass
 * @param block Callback
 */
+ (void)eduOnLinkmicLeave:(void (^)(BOOL reslut)) block;

@end

NS_ASSUME_NONNULL_END
