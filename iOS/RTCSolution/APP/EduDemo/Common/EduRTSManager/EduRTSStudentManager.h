// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <Foundation/Foundation.h>
#import "EduClassModel.h"
#import "EduBreakoutClassModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduRTSStudentManager : EduRTSManager

/*
 * View active classroom
 * @param block Callback
 */
+ (void)getActiveClassWithBlock:(void (^)(NSArray<EduRoomModel *> *list, RTSACKModel *model))block;

/*
 * Students join the class
 * @param roomID Room ID
 * @param block Callback
 */
+ (void)joinClass:(NSString *)roomID roomType:(BOOL)lecture
            block:(void (^)(EduClassModel *classModel))block;

/*
 * Students leave class
 * @param roomID Room ID
 * @param block Callback
 */
+ (void)leaveClass:(NSString *)roomID block:(void (^)(RTSACKModel *model))block;

/*
 * Student raise hand
 * @param roomID Room ID
 * @param block Callback
 */
+ (void)handsUp:(NSString *)roomID block:(void (^)(RTSACKModel *model))block;

/*
 * Student cancels hand raising
 * @param roomID Room ID
 * @param block Callback
 */
+ (void)cancelHandsUp:(NSString *)roomID block:(void (^)(RTSACKModel *model))block;

@end

NS_ASSUME_NONNULL_END
