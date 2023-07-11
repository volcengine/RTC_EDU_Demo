// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <UIKit/UIKit.h>
#import "EduUserModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduClassStudentView : UIView

@property (nonatomic, strong) EduUserModel *model;

// 上台中
// Go to the podium
@property (nonatomic, assign) BOOL isPodium;

// 集体发言中
// Group speech
@property (nonatomic, assign) BOOL isCollectiveSpeech;

@end

NS_ASSUME_NONNULL_END
