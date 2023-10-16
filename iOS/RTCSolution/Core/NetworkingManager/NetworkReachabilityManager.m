#import <AFNetworking/AFNetworkReachabilityManager.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import "NetworkReachabilityManager.h"
#import "ToastComponent.h"
#import "DeviceInforTool.h"
#import "MeetingRTMManager.h"
#import "GCDTimer.h"

@interface NetworkReachabilityManager ()

@property (nonatomic, strong) AFNetworkReachabilityManager *reachabilityManager;

@property (nonatomic, assign) NSInteger notNetworkStartTime;

@property (nonatomic, strong) GCDTimer *timer;
@end

@implementation NetworkReachabilityManager

+ (instancetype)sharedManager {
    static NetworkReachabilityManager *_sharedManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedManager = [[self alloc] init];
    });

    return _sharedManager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.reachabilityManager = [AFNetworkReachabilityManager manager];
        __weak typeof(self) weak_self = self;
        [self.reachabilityManager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
            [weak_self onReachabilityStatusChanged:status];
        }];
    }
    return self;
}

- (void)startMonitoring {
    [self.reachabilityManager startMonitoring];
}

- (void)stopMonitoring {
    [self.reachabilityManager stopMonitoring];
}

- (NSString *)getNetType {
    CTTelephonyNetworkInfo *info = [CTTelephonyNetworkInfo new];
    NSString *networkType = @"";
    if ([info respondsToSelector:@selector(currentRadioAccessTechnology)]) {
        NSString *currentStatus = info.currentRadioAccessTechnology;
        NSArray *network2G = @[CTRadioAccessTechnologyGPRS, CTRadioAccessTechnologyEdge, CTRadioAccessTechnologyCDMA1x];
        NSArray *network3G = @[CTRadioAccessTechnologyWCDMA, CTRadioAccessTechnologyHSDPA, CTRadioAccessTechnologyHSUPA, CTRadioAccessTechnologyCDMAEVDORev0, CTRadioAccessTechnologyCDMAEVDORevA, CTRadioAccessTechnologyCDMAEVDORevB, CTRadioAccessTechnologyeHRPD];
        NSArray *network4G = @[CTRadioAccessTechnologyLTE];
        
        if ([network2G containsObject:currentStatus]) {
            networkType = @"2G";
        }else if ([network3G containsObject:currentStatus]) {
            networkType = @"3G";
        }else if ([network4G containsObject:currentStatus]){
            networkType = @"4G";
        }else {
            networkType = @"未知网络";
        }
    }
    return networkType;
}

#pragma mark - Private Action

- (void)onReachabilityStatusChanged:(AFNetworkReachabilityStatus)status {
    [self showSocketIsDisconnect:status == AFNetworkReachabilityStatusNotReachable];
}

- (void)showSocketIsDisconnect:(BOOL)isDisconnect {
    if (isDisconnect) {
        self.notNetworkStartTime = [[NSDate date] timeIntervalSince1970];
        UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
        [[ToastComponent shareToastComponent] showWithMessage:@"网络链接已断开，请检查设置" view:keyWindow keep:YES block:^(BOOL result) {
            
        }];
        
        // 60s后执行第一次
        [self.timer startTimer:60 Space:60 block:^(BOOL result) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"exitRoom" object:nil];
        }];

    } else {
        [self.timer suspend];
        self.timer  = nil;
        
        [[ToastComponent shareToastComponent] dismiss];
    }
}

- (GCDTimer *)timer {
    if (!_timer) {
        _timer = [[GCDTimer alloc] init];
    }
    return _timer;
}

@end

@implementation NetworkReachabilityManager (RTCNetworking)

- (void)networkTypeChangedToType:(ByteRTCNetworkType)type {
    [self showSocketIsDisconnect:type == ByteRTCNetworkTypeDisconnected];
}

- (void)didStartNetworkMonitoring {
    [self stopMonitoring];
}

- (void)didStopNetworkMonitoring {
    [self startMonitoring];
}

@end
