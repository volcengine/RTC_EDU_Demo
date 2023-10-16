//
//  MenuLoginHome.m
//  veLogin-veLogin
//
//  Created by on 2022/7/29.
//

#import "MenuLoginHome.h"
#import "NetworkingManager.h"
#import "MenuLoginViewController.h"

@interface MenuLoginHome ()

@property (nonatomic, assign) BOOL isFirst;

@end

@implementation MenuLoginHome

+ (instancetype)shared {
    static MenuLoginHome *model = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        model = [[MenuLoginHome alloc] init];
    });
    return model;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.isFirst = YES;
    }
    return self;
}

#pragma mark - Publish Action

+ (void)popLoginVC:(BOOL)animation completion:(void (^)(BOOL result, NSString *desc))completion {
    if (!IsEmptyStr([LocalUserComponent userModel].loginToken)) {
        [MenuLoginHome startVender];
        if (completion) {
            completion(YES, nil);
        }
    } else {
        [MenuLoginHome showLoginVC:animation block:completion];
    }
}

+ (void)logout:(void (^)(BOOL result))block {
    BaseUserModel *userModel = [LocalUserComponent userModel];
    userModel.name = @"Null";
    [NetworkingManager changeUserName:userModel.name
                           loginToken:[LocalUserComponent userModel].loginToken
                                block:^(NetworkingResponse * _Nonnull response) {
        if (block) {
            block(response.result);
        }
    }];
}

#pragma mark - Private Action

+ (void)showLoginVC:(BOOL)isAnimation block:(void (^)(BOOL result, NSString *desc))block {
    MenuLoginViewController *loginVC = [[MenuLoginViewController alloc] init];
    loginVC.modalPresentationStyle = UIModalPresentationFullScreen;
    loginVC.loginFinishBlock = ^(BOOL success, NSString * _Nullable desc) {
        if (block) {
            block(success, desc);
        }
    };
    
    UIViewController *topVC = [[UINavigationController alloc] initWithRootViewController:loginVC];
    [[UIApplication sharedApplication].keyWindow setRootViewController:topVC];
    
}

+ (void)startVender {
    if (![MenuLoginHome shared].isFirst) {
        return;
    }
    [MenuLoginHome shared].isFirst = NO;
    
    // 开启网络监听
    [[NetworkReachabilityManager sharedManager] startMonitoring];
}

@end
