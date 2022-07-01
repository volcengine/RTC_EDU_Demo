//
//  EduBreakoutClassViewController.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/8/4.
//  Copyright © 2021 . All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EduRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBreakoutClassViewController : UIViewController
@property (nonatomic, strong) EduRoomModel *roomModel;

- (void)onClassBegin:(NSInteger) timestamp;

- (void)leaveClass;

- (void)changeGroupSpeech:(BOOL)open;

- (void)changeVideoInteract:(BOOL)open;

- (void)changeTeacherMicStatus:(BOOL)open;

- (void)changeTeacherCameraStatus:(BOOL)open;

- (void)changeTeacherRoomStatus:(BOOL)join userName:(NSString *)userName;

- (void)changeStudentGroupStatusUid:(NSString *)uid name:(NSString *)userName join:(BOOL)join;

- (void)changeStudentMic:(BOOL)open uid:(NSString *)uid name:(NSString *)userName;

- (void)approveMic:(BOOL)isOn;
@end

NS_ASSUME_NONNULL_END
