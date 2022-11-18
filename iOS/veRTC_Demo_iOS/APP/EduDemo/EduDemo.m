//
//  EduDemo.m
//  EduDemo-EduDemo
//
//  Created by on 2022/6/7.
//

#import "EduDemo.h"
#import "EduBreakoutRTCManager.h"
#import "JoinRTSParams.h"
#import <Core/NetworkReachabilityManager.h>
#import "EduClassListViewController.h"
#import "EduDemoConstants.h"

@implementation EduDemo

- (void)pushDemoViewControllerBlock:(void (^)(BOOL result))block {
    [super pushDemoViewControllerBlock:block];
    
    JoinRTSInputModel *inputModel = [[JoinRTSInputModel alloc] init];
    inputModel.scenesName = @"edu";
    inputModel.loginToken = [LocalUserComponent userModel].loginToken;
    inputModel.volcAccountID = AccountID;
    inputModel.vodSpace = VodSpace;
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
    [[EduBreakoutRTCManager shareRtc] connect:model.appId
                             RTSToken:model.RTSToken
                            serverUrl:model.serverUrl serverSig:model.serverSignature
                                  bid:model.bid
                                block:^(BOOL result) {
        if (result) {
            EduClassListViewController *next = [[EduClassListViewController alloc] init];
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
