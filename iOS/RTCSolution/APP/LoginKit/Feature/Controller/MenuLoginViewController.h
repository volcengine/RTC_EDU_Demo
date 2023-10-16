// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface MenuLoginViewController : UIViewController
@property (nonatomic, copy) void(^loginFinishBlock)(BOOL success, NSString * _Nullable desc);

@end

NS_ASSUME_NONNULL_END
