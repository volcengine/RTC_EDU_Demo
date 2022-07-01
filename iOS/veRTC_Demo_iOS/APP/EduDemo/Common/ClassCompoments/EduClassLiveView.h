//
//  EduClassLiveView.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/7/29.
//  Copyright © 2021 . All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EduUserModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduClassLiveView : UIView
@property (nonatomic, copy) NSString *name;
@property (nonatomic, assign) BOOL audioClosed;
@property (nonatomic, assign) BOOL videoClosed;
@property (nonatomic, assign) BOOL isMicOn;

@property (nonatomic, strong) EduUserModel *userModel;

- (void)startPreview:(EduUserModel *)userModel;
@end

NS_ASSUME_NONNULL_END
