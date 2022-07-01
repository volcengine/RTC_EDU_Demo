//
//  EduRTMStudentManager.h
//  EduDemo
//
//  Created by ByteDance on 2022/6/7.
//

#import <Foundation/Foundation.h>
#import "EduClassModel.h"
#import "EduBreakoutClassModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduRTMStudentManager : EduRTMManager

/*
 * View active classroom
 * @param block Callback
 */
+ (void)getActiveClassWithBlock:(void (^)(NSArray<EduRoomModel *> *list, RTMACKModel *model))block;

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
+ (void)leaveClass:(NSString *)roomID block:(void (^)(RTMACKModel *model))block;

/*
 * Student raise hand
 * @param roomID Room ID
 * @param block Callback
 */
+ (void)handsUp:(NSString *)roomID block:(void (^)(RTMACKModel *model))block;

/*
 * Student cancels hand raising
 * @param roomID Room ID
 * @param block Callback
 */
+ (void)cancelHandsUp:(NSString *)roomID block:(void (^)(RTMACKModel *model))block;

@end

NS_ASSUME_NONNULL_END
