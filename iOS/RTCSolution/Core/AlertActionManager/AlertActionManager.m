//
//  AlertActionManager.m
//  quickstart

#import "AlertActionManager.h"
#import "DeviceInforTool.h"
#import <UIKit/UIKit.h>

@interface AlertActionManager ()

@property (nonatomic, weak) UIAlertController *alert;
@property (nonatomic, strong) NSTimer *timer;
 
@end

@implementation AlertActionManager

+ (AlertActionManager *)shareAlertActionManager {
    static dispatch_once_t onceToken;
    static AlertActionManager *alertActionManager;
    dispatch_once(&onceToken, ^{
        alertActionManager = [[AlertActionManager alloc] init];
    });
    return alertActionManager;
}

#pragma mark - Publish Action

- (void)showWithMessage:(NSString *)message {
    [self showWithMessage:message actions:nil];
}

- (void)showWithMessage:(NSString *)message actions:(NSArray<AlertActionModel *> *)actions {
    [self showWithMessage:message actions:actions isActionSheet:NO hideDelay:0];
}

- (void)showWithTitle:(NSString *)title message:(NSString *)message actions:(NSArray<AlertActionModel *> *)actions {
    [self showWithTitle:title message:message actions:actions isActionSheet:NO hideDelay:0];
}

- (void)showWithMessage:(NSString *)message actions:(NSArray<AlertActionModel *> *)actions isActionSheet:(BOOL)isActionSheet hideDelay:(NSTimeInterval)delay {
    [self showWithTitle:@"" message:message actions:actions isActionSheet:isActionSheet hideDelay:delay];
}

- (void)showWithTitle:(NSString *)title message:(NSString *)message actions:(NSArray<AlertActionModel *> *)actions isActionSheet:(BOOL)isActionSheet hideDelay:(NSTimeInterval)delay {
    
    if (self.alert) {
        [self dismiss:^{
            [self showWithMessage:message actions:actions isActionSheet:isActionSheet hideDelay:delay];
        }];
        return;
    }
    
    if (message.length <= 0 ) {
        return;
    }
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:message preferredStyle:isActionSheet ?  UIAlertControllerStyleActionSheet : UIAlertControllerStyleAlert];
    for (int i = 0; i < actions.count; i++) {
        AlertActionModel *model = actions[i];
        UIAlertAction *alertAction = [UIAlertAction actionWithTitle:model.title style:model.isCancel ? UIAlertActionStyleCancel : UIAlertActionStyleDefault handler:^(UIAlertAction *_Nonnull action) {
            [self stopTimer];
            if (model.alertModelClickBlock) {
                model.alertModelClickBlock(action);
            }
        }];
        [alert addAction:alertAction];
    }
    __weak __typeof(self) wself = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootVC = [DeviceInforTool topViewController];
        [rootVC presentViewController:alert animated:YES completion:nil];
        wself.alert = alert;
        [wself startTimer:delay];
    });
}

- (void)dismiss:(void (^)(void))completion {
    if (_alert) {
        [self stopTimer];
        UIViewController *alertVC = _alert;
        _alert = nil;
        [alertVC dismissViewControllerAnimated:YES completion:^{
            if (completion) {
                completion();
            }
        }];
    } else {
        if (completion) {
            completion();
        }
    }
}

- (void)dismiss {
    if (_alert) {
        [self stopTimer];
        [_alert dismissViewControllerAnimated:YES completion:^{

        }];
    }
}

- (void)startTimer:(NSTimeInterval)interval {
    [self stopTimer];
    if (interval <= 0) {
        return;
    }
    self.timer = [NSTimer timerWithTimeInterval:interval target:self selector:@selector(dismiss) userInfo:nil repeats:NO];
    [[NSRunLoop mainRunLoop] addTimer:self.timer forMode:NSRunLoopCommonModes];
}

- (void)stopTimer {
    if (self.timer) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

@end
