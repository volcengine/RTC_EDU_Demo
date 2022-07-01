//
//  EduDemo.m
//  EduDemo-EduDemo
//
//  Created by ByteDance on 2022/6/7.
//

#import "EduDemo.h"
#import "EduRTCManager.h"
#import <Core/NetworkReachabilityManager.h>
#import "EduClassListViewController.h"
#import "EduDemoConstants.h"

@implementation EduDemo

- (void)pushDemoViewControllerBlock:(void (^)(BOOL result))block {
    
    [EduRTCManager shareRtc].networkDelegate = [NetworkReachabilityManager sharedManager];
    [[EduRTCManager shareRtc] connect:@"edu"
                           loginToken:[LocalUserComponents userModel].loginToken
                        volcAccountID:AccountID
                             vodSpace:VodSpace
                                block:^(BOOL result) {
        if (result) {
            EduClassListViewController *next = [[EduClassListViewController alloc] init];
            UIViewController *topVC = [DeviceInforTool topViewController];
            [topVC.navigationController pushViewController:next animated:YES];
        } else {
            [[ToastComponents shareToastComponents] showWithMessage:@"连接失败"];
        }
        if (block) {
            block(result);
        }
    }];
}

@end
