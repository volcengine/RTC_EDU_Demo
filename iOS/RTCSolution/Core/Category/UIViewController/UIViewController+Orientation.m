//
//  UIViewController+Orientation.m
//  quickstart
//
//  Created by on 2021/3/24.
//  
//

#import "UIViewController+Orientation.h"

@implementation UIViewController (Orientation)

- (void)addOrientationNotice {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
                                                 name:UIApplicationDidChangeStatusBarOrientationNotification
                                                   object:nil];
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
}

- (void)setAllowAutoRotate:(ScreenOrientation)screenOrientation {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"SetAllowAutoRotateNotification" object:@(screenOrientation)];
    if (@available(iOS 16.0, *)) {
        [self setNeedsUpdateOfSupportedInterfaceOrientations];
    }
    // 更新 AppDelegate -supportedInterfaceOrientationsForWindow 代理信息
}

- (void)onDeviceOrientationDidChange {
    BOOL isLandscape = NO;
    UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];
    switch (interfaceOrientation) {
        
        case UIInterfaceOrientationUnknown:
            break;
        
        case UIInterfaceOrientationPortrait:
            break;
        
        case UIInterfaceOrientationPortraitUpsideDown:
            break;
        
        case UIInterfaceOrientationLandscapeLeft:
            isLandscape = YES;
            break;
        
        case UIInterfaceOrientationLandscapeRight:
            isLandscape = YES;
            break;
    
        default:
            break;
    }
    [self orientationDidChange:isLandscape];
}

- (void)orientationDidChange:(BOOL)isLandscape {
    //在 UIViewController 重写
    //Rewrite in UIViewController
}

- (void)setDeviceInterfaceOrientation:(UIDeviceOrientation)orientation {
    if ([[UIDevice currentDevice] respondsToSelector:@selector(setOrientation:)]) {
        NSNumber *orientationUnknown = @(0);
        [[UIDevice currentDevice] setValue:orientationUnknown forKey:@"orientation"];
        [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger:orientation] forKey:@"orientation"];
    }
    
    if (@available(iOS 16.0, *)) {
        if (orientation == UIDeviceOrientationPortrait) {
            [self setAllowAutoRotate:ScreenOrientationPortrait];
        } else {
            [self setAllowAutoRotate:ScreenOrientationLandscape];
        }
        [self setNeedsUpdateOfSupportedInterfaceOrientations];
        NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
        UIWindowScene *scene = [array firstObject];
        UIWindowSceneGeometryPreferencesIOS *geometryPreferencesIOS = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:orientation];
        [scene requestGeometryUpdateWithPreferences:geometryPreferencesIOS errorHandler:^(NSError * _Nonnull error) {
            NSLog(@"强制%@错误:%@", orientation != UIDeviceOrientationPortrait ? @"横屏" : @"竖屏", error);
        }];
    }
}

@end
