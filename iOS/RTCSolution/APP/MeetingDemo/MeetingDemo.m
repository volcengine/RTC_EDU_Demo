//
//  MeetingDemo.m
//  AFNetworking
//
//  Created by on 2022/4/21.
//

#import <Core/NetworkReachabilityManager.h>
#import "MeetingDemo.h"
#import "JoinRTSParams.h"
#import "MeetingLoginViewController.h"
#import "MeetingRTCManager.h"
#import "MeetingDemoConstants.h"
#import <Core/BuildConfig.h>

@implementation MeetingDemo

- (void)pushDemoViewControllerBlock:(void (^)(BOOL result))block {
    [super pushDemoViewControllerBlock:block];
    [MeetingRTCManager shareRtc].networkDelegate = [NetworkReachabilityManager sharedManager];
    JoinRTSInputModel *inputModel = [[JoinRTSInputModel alloc] init];
    inputModel.loginToken = [LocalUserComponent userModel].loginToken;
    inputModel.appId = APPID;
    inputModel.appKey = APPKey;
    inputModel.volcAccountKey = AccessKeyID;
    inputModel.volcSecretKey = SecretAccessKey;
    inputModel.volcAccountID = AccountID;
    inputModel.tosBucket = VodSpace;
    inputModel.scenesName = @"meeting";

    [ThemeManager sharedThemeManager].sence = @"Meeting";
    __weak __typeof(self) wself = self;
    [JoinRTSParams getJoinRTSParams:inputModel
                             block:^(JoinRTSParamsModel * _Nonnull model) {
        [wself joinRTS:model block:block];
    }];
    
    
}

- (void)joinRTS:(JoinRTSParamsModel * _Nonnull)model
          block:(void (^)(BOOL result))block{
    if (!model) {
        [[ToastComponent shareToastComponent] showWithMessage:@"连接失败"];
        if (block) {
            block(NO);
        }
        return;
    }
    // Connect RTS
    [[MeetingRTCManager shareRtc] connect:model.app_id
                                 RTSToken:model.rts_token
                                serverUrl:model.server_url
                                serverSig:model.server_signature
                                      bid:model.bid
                                    block:^(BOOL result) {
        if (result) {
            MeetingLoginViewController *next = [[MeetingLoginViewController alloc] init];
            UIViewController *topVC = [DeviceInforTool topViewController];
            [topVC.navigationController pushViewController:next animated:YES];
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:@"连接失败"];
        }
        if (block) {
            block(result);
        }
    }];
}

@end
