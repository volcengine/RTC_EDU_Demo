//
//  MeetingEndComponent.h
//  SceneRTCDemo
//
//  Created by on 2021/3/10.
//

#import <Foundation/Foundation.h>
#import "MeetingEndView.h"

NS_ASSUME_NONNULL_BEGIN

@interface MeetingEndComponent : NSObject

@property (nonatomic, copy) void (^clickButtonBlock)(MeetingButtonStatus status);

- (void)showAt:(UIView *)view withStatus:(MeetingEndStatus)status;

@end

NS_ASSUME_NONNULL_END
