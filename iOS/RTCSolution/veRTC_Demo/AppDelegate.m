#import "AppDelegate.h"
#import "WindowManager.h"

@interface AppDelegate ()
@property (strong, atomic) WindowManager *manager;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
    
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"LaunchScreen" bundle:nil];
    UIViewController *rootVC = [storyboard instantiateViewControllerWithIdentifier:@"SplashViewCotroller"];
    self.window.rootViewController = rootVC;
    [self.window makeKeyWindow];
    
    self.manager = [WindowManager new];
    [self.manager load];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setAllowAutoRotateNotification:) name:@"SetAllowAutoRotateNotification" object:nil];
    return YES;
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {

}

- (void)applicationWillTerminate:(UIApplication *)application {
    
}

#pragma mark - UISceneSession lifecycle

- (void)setAllowAutoRotateNotification:(NSNotification *)sender {
    if ([sender.object isKindOfClass:[NSNumber class]]) {
        NSNumber *number = sender.object;
        self.screenOrientation =  number.integerValue;
    }
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    if (self.screenOrientation == ScreenOrientationLandscapeAndPortrait) {
        // Support Landscape Portrait
        return UIInterfaceOrientationMaskLandscape | UIInterfaceOrientationMaskPortrait;
    } else if (self.screenOrientation == ScreenOrientationLandscape) {
        // Support Landscape
        return UIInterfaceOrientationMaskLandscape;
    } else {
        // Support Portrait
        return UIInterfaceOrientationMaskPortrait;
    }
}

@end
