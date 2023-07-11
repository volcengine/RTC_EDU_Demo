// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <Foundation/Foundation.h>
#import "EduRoomEndView.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduEndComponent : NSObject

@property (nonatomic, copy) void (^clickButtonBlock)(EduButtonStatus status);

- (void)showWithStatus:(EduEndStatus)status;

@end

NS_ASSUME_NONNULL_END
