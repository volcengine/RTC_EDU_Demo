//
//  EduBigClassEndView.h
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
typedef NS_ENUM(NSInteger, EduBigClassEndStatus) {
    EduBigClassEndStatusNone,
    EduBigClassEndStatusHost,
};

//button status
typedef NS_ENUM(NSInteger, EduBigClassButtonStatus) {
    EduBigClassButtonStatusEnd,
    EduBigClassButtonStatusLeave,
    EduBigClassButtonStatusCancel,
};

@interface EduBigClassEndView : UIView

@property (nonatomic, copy) void (^clickButtonBlock)(EduBigClassButtonStatus status);

@property (nonatomic, assign) EduBigClassEndStatus EduBigClassEndStatus;

@end

NS_ASSUME_NONNULL_END
