//
//  EduClassViewController.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/7/28.
//  Copyright © 2021 . All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EduRoomModel.h"
#import "EduClassTitleView.h"
#import "EduClassScreenView.h"
#import "EduClassLiveView.h"
#import "EduEndCompoments.h"
#import "EduClassChatView.h"
#import "EduClassStudentListView.h"
#import "EduClassGroupSpeechView.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduLectureHallViewController : UIViewController

@property (nonatomic, strong) EduRoomModel *roomModel;

- (void)onClassBegin:(NSInteger) timestamp;

- (void)leaveClass;

- (void)changeGroupSpeech:(BOOL)open;

- (void)changeVideoInteract:(BOOL)open;

- (void)changeTeacherMicStatus:(BOOL)open;

- (void)changeTeacherCameraStatus:(BOOL)open;

- (void)changeTeacherRoomStatus:(BOOL)join userName:(NSString *)userName;

- (void)changeStudentMic:(BOOL)open uid:(NSString *)uid name:(NSString *)userName;

- (void)approveMic:(BOOL)isOn;
@end

NS_ASSUME_NONNULL_END
