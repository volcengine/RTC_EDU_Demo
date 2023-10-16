//
//  WindowManager.m
//  veRTC_Demo
//
//  Created by admin on 2022/10/18.
//

#import "WindowManager.h"

#import "Core.h"
#import "MenuViewController.h"

#import "MenuLoginHome.h"

#import "MeetingLoginViewController.h"

#import "JoinRTSParams.h"
#import "MeetingRTCManager.h"
#import "MeetingDemoConstants.h"
#import "NetworkReachabilityManager.h"


@interface WindowManager ()
@end

@implementation WindowManager

- (void)load {
    // Do any additional setup after loading the view.
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginExpiredNotificate:) name:NotificationLoginExpired object:nil];
    
    [self showVerifyViewIfNecessary];
}

- (void)loginExpiredNotificate:(NSNotification *)sender {
    NSLog(@"%@,%s",[NSThread currentThread],__func__);

    [LocalUserComponent userModel].loginToken = @"";
    [LocalUserComponent updateLocalUserModel:nil];
    
    [DeviceInforTool backToRootViewController];
    
    NSString *key = (NSString *)sender.object;
    if ([key isKindOfClass:[NSString class]] &&
        [key isEqualToString:@"logout"]) {
        [[AlertActionManager shareAlertActionManager] dismiss:^{
            [self showVerifyViewIfNecessary];
        }];
    } else {
        [self showVerifyViewIfNecessary];
    }
}

- (void)showDemoView {
    
    [self showMenuVC:^(BOOL result) {
        if (!result) {
            
        } else {
            [self showMeetingLoginView];
        }
    }];
    
    
}

- (void)showMeetingLoginView {
    MeetingLoginViewController *meetingLoginVC = [[MeetingLoginViewController alloc] init];
    UIViewController *topVC = [[UINavigationController alloc] initWithRootViewController:meetingLoginVC];
    [topVC.navigationController setNavigationBarHidden:YES animated:NO];
    [[UIApplication sharedApplication].keyWindow setRootViewController:topVC];
}

- (void)showVerifyViewIfNecessary {
    [MenuLoginHome popLoginVC:YES completion:^(BOOL result, NSString * _Nonnull desc) {
        if (result) {
            [self showDemoView];
        }
    }];
}

- (void)showMenuVC:(void (^)(BOOL result))block {
    
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
    MenuViewController *menuVC = [storyboard instantiateViewControllerWithIdentifier:@"MenuViewControllerID"];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:menuVC];
    [UIApplication sharedApplication].keyWindow.rootViewController = nav;
    
}

- (void)onRTSParamLoaded:(JoinRTSParamsModel * _Nonnull)model
          block:(void (^)(BOOL result))block{
    if (!model) {
        if (block) {
            block(NO);
        }
    } else {
        [[MeetingRTCManager shareRtc] connect:model.app_id
                                     RTSToken:model.rts_token
                                    serverUrl:model.server_url
                                    serverSig:model.server_signature
                                          bid:model.bid
                                        block:^(BOOL result) {
            if (block) {
                block(result);
            }
        }];
    }
}


@end
