// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <UIKit/UIKit.h>
#import "EduUserModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduClassStudentListView : UIView
@property (nonatomic, copy) NSString *roomId;
@property (nonatomic, copy) NSArray *studnetArray;
@property (nonatomic, copy) void (^hideButtonClicked)(void);

- (void)addUser:(EduUserModel *)userModel;

- (void)removeUser:(EduUserModel *)userModel;


@end

NS_ASSUME_NONNULL_END
