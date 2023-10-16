//
//  EduSmallClassEndComponent.h
//  SceneRTCDemo
//
//  Created by on 2021/3/10.
//

#import <Foundation/Foundation.h>
#import "EduSmallClassEndView.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSmallClassEndComponent : NSObject

@property (nonatomic, copy) void (^clickButtonBlock)(EduSmallClassButtonStatus status);

- (void)showAt:(UIView *)view withStatus:(EduSmallClassEndStatus)status;

@end

NS_ASSUME_NONNULL_END
