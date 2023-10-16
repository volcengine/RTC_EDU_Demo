//
//  EduSmallClassEndView.h
//  SceneRTCDemo
//
//  Created by on 2021/3/10.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

//UI
typedef NS_ENUM(NSInteger, ButtonColorType) {
    ButtonColorTypeNone,
    ButtonColorTypeRemind,
    ButtonColorTypeDisable,
};

//form
typedef NS_ENUM(NSInteger, EduSmallClassEndStatus) {
    EduSmallClassEndStatusNone,
    EduSmallClassEndStatusHost,
};

//button status
typedef NS_ENUM(NSInteger, EduSmallClassButtonStatus) {
    EduSmallClassButtonStatusEnd,
    EduSmallClassButtonStatusLeave,
    EduSmallClassButtonStatusCancel,
};

@interface EduSmallClassEndView : UIView

@property (nonatomic, copy) void (^clickButtonBlock)(EduSmallClassButtonStatus status);

@property (nonatomic, assign) EduSmallClassEndStatus EduSmallClassEndStatus;

@end

NS_ASSUME_NONNULL_END
