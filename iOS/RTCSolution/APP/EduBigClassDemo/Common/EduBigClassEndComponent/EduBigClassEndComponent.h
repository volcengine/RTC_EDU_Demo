//
//  EduBigClassEndComponent.h
//  SceneRTCDemo
//
//  Created by on 2021/3/10.
//

#import <Foundation/Foundation.h>
#import "EduBigClassEndView.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBigClassEndComponent : NSObject

@property (nonatomic, copy) void (^clickButtonBlock)(EduBigClassButtonStatus status);

- (void)showAt:(UIView *)view withStatus:(EduBigClassEndStatus)status;

@end

NS_ASSUME_NONNULL_END
