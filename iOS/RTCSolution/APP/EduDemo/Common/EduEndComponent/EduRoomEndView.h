// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

//UI
typedef NS_ENUM(NSInteger, EduButtonColorType) {
    EduButtonColorTypeNone,
    EduButtonColorTypeRemind,
};

//form
typedef NS_ENUM(NSInteger, EduEndStatus) {
    EduEndStatusStudent
};

//button status
typedef NS_ENUM(NSInteger, EduButtonStatus) {
    EduButtonStatusEnd,
    EduButtonStatusLeave,
    EduButtonStatusCancel,
};

@interface EduRoomEndView : UIView

@property (nonatomic, copy) void (^clickButtonBlock)(EduButtonStatus status);

@property (nonatomic, assign) EduEndStatus EduEndStatus;

@end

NS_ASSUME_NONNULL_END
