//
//  EduEndCompoments.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/5/19.
//  Copyright © 2021 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "EduRoomEndView.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduEndCompoments : NSObject

@property (nonatomic, copy) void (^clickButtonBlock)(EduButtonStatus status);

- (void)showWithStatus:(EduEndStatus)status;

@end

NS_ASSUME_NONNULL_END
