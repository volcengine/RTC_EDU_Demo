// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <UIKit/UIKit.h>
#import "EduUserModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduClassLiveView : UIView
@property (nonatomic, copy) NSString *name;
@property (nonatomic, assign) BOOL audioClosed;
@property (nonatomic, assign) BOOL videoClosed;
@property (nonatomic, assign) BOOL isMicOn;

@property (nonatomic, strong) EduUserModel *userModel;

- (void)startPreview:(EduUserModel *)userModel;

// 学生进入集体发言
// Students enter collective speech
- (void)joinCollectiveSpeech:(BOOL)isJoin;

@end

NS_ASSUME_NONNULL_END
