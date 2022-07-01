//
//  EduRoomEndView.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/5/18.
//  Copyright © 2021 . All rights reserved.
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
