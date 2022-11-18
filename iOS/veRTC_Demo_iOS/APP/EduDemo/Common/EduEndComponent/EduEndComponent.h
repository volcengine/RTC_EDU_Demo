//
//  EduEndComponent.h
//  veRTC_Demo
//
//  Created by on 2021/5/19.
//  
//

#import <Foundation/Foundation.h>
#import "EduRoomEndView.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduEndComponent : NSObject

@property (nonatomic, copy) void (^clickButtonBlock)(EduButtonStatus status);

- (void)showWithStatus:(EduEndStatus)status;

@end

NS_ASSUME_NONNULL_END
