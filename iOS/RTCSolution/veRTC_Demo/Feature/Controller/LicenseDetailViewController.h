//
//  LicenseDetailViewController.h
//  veRTC_Demo
//
//  Created by bytedance on 2023/9/14.
//  Copyright © 2021 bytedance. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, LicenseDetailType) {
    LicenseDetailTypeTeleServices,// 电信业务
    LicenseDetailTypeNetworkCulture // 网络文化
};


@interface LicenseDetailViewController : UIViewController

@property (nonatomic, assign) LicenseDetailType detailType;

@end

NS_ASSUME_NONNULL_END
