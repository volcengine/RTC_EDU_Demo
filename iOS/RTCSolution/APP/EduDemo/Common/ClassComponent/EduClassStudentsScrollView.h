// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduClassStudentsScrollView : UIView

@property (nonatomic, copy) NSArray *studnetArray;

// 学生上讲台
// Student goes to the podium
- (void)joinPodium:(EduUserModel *)userModel;

// 学生下讲台
// Student gets off the podium
- (void)leavePodium:(EduUserModel *)userModel;

// 所有学生下讲台
// Student gets off the podium all user
- (void)leavePodiumAllUserModel;

// 学生进入集体发言
// Students enter collective speech
- (void)joinCollectiveSpeech:(BOOL)isJoin;

@end

NS_ASSUME_NONNULL_END
