//
//  EduRTMManager.h
//  EduDemo
//
//  Created by on 2022/6/7.
//

#import <Foundation/Foundation.h>
#import "EduRecordModel.h"
#import "EduRoomModel.h"
#import "EduUserModel.h"
#import "RTMACKModel.h"

NS_ASSUME_NONNULL_BEGIN

static const CGFloat DefaultTimeout = 3;

@interface EduRTMManager : NSObject

+ (void)reconnectWithBlock:(void (^)(RTMACKModel *model))block;

#pragma mark - Get histtory data

/*
 * View History Class Room
 * @param block Callback
 */
+ (void)getHistoryRoomListWithBlock:(void (^)(NSArray<EduRoomModel *> *list ,RTMACKModel *model))block;

/*
 * View History Class Record
 * @param block Callback
 */
+ (void)getHistoryRecordList:(NSString *)roomID block:(void (^)(NSArray *list ,RTMACKModel *model))block;

#pragma mark - Broadcast Notification Message

/*
 * Start of class notification
 * @param block Callback
 */
+ (void)onBeginClassWithBlock:(void (^)(NSInteger timestamp))block;

/*
 * End of class notification
 * @param block Callback
 */
+ (void)onEndClassWithBlock:(void (^)(NSString *roomID))block;

/*
 * Turn on notification of group speeches notification
 * @param block Callback
 */
+ (void)onOpenGroupSpeechWithBlock:(void (^)(NSString *roomID))block;

/*
 * Turn off notice of group speaking notification
 * @param block Callback
 */
+ (void)onCloseGroupSpeechWithBlock:(void (^)(NSString *roomID))block;

/*
 * Turn on video interaction notification
 * @param block Callback
 */
+ (void)onOpenVideoInteractWithBlock:(void (^)(NSString *roomID))block;

/*
 * Turn off video interaction notifications
 * @param block Callback
 */
+ (void)onCloseVideoInteractWithBlock:(void (^)(NSString *roomID))block;

/*
 * The teacher turns on the microphone notification
 * @param block Callback
 */
+ (void)onTeacherMicOnWithBlock:(void (^)(NSString *roomID))block;

/*
 * The teacher turns off the microphone notification
 * @param block Callback
 */
+ (void)onTeacherMicOffWithBlock:(void (^)(NSString *roomID))block;

/*
 * The teacher turns on the camera to notify
 * @param block Callback
 */
+ (void)onTeacherCameraOnWithBlock:(void (^)(NSString *roomID))block;

/*
 * The teacher turns off the camera notification
 * @param block Callback
 */
+ (void)onTeacherCameraOffWithBlock:(void (^)(NSString *roomID))block;

/*
 * Teacher enters the room notice
 * @param block Callback
 */
+ (void)onTeacherJoinRoomWithBlock:(void (^)(NSString *userName))block;

/*
 * Teacher leaving the room notice
 * @param block Callback
 */
+ (void)onTeacherLeaveRoomWithBlock:(void (^)(NSString *userName))block;
/*
 * Student enter the room notice
 * @param block Callback
 */
+ (void)onStudentJoinGroupRoomWithBlock:(void (^)(NSString *uid,NSString *userName))block;
/*
 * Student leaving the room notice
 * @param block Callback
 */
+ (void)onStudentLeaveGroupRoomWithBlock:(void (^)(NSString *uid,NSString *userName))block;

/*
 * Notification of the success of students on the wheat
 * @param block Callback
 */
+ (void)onStuMicOnWithBlock:(void (^)(NSString *roomID, NSString *uid, NSString *userName))block;

/*
 * Notification of successful downloading of students
 * @param block Callback
 */
+ (void)onStuMicOffWithBlock:(void (^)(NSString *roomID, NSString *uid))block;

#pragma mark - Single Notification Message

/*
 * Notification of Approval of Students' Maid Service
 * @param block Callback
 */
+ (void)onApproveMicWithBlock:(void (^)(NSString *roomID, NSString *uid, NSString *token))block;

/*
 * Mandatory student dismissal notice
 * @param block Callback
 */
+ (void)onCloseMicWithBlock:(void (^)(NSString *roomID, NSString *uid))block;

/*
 * login in elsewhere
 * @param block Callback
 */
+ (void)onLogInElsewhereWithBlock:(void (^)(BOOL result))block;

@end

NS_ASSUME_NONNULL_END
