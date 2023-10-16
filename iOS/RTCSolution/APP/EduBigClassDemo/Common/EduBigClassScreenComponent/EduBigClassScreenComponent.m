//
//  EduBigClassScreenComponent.m
//  quickstart
//
//  Created by on 2021/4/6.
//  
//

#import "EduBigClassScreenComponent.h"
#import "EduBCSettingsService.h"
#import "EduBigClassRTMManager.h"
#import "EduBigClassRTCManager.h"

@interface EduBigClassScreenComponent ()

@property (nonatomic, copy) void (^startBlock)(void);

@end

@implementation EduBigClassScreenComponent

- (instancetype)init
{
    self = [super init];
    if (self) {
        _isSharing = NO;
        _isTurnOffCamera = NO;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(extensionDidQuit) name:@"kNotificationByteOnExtensionQuit" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(extensionDidStartup) name:@"kNotificationByteOnExtensionStartup" object:nil];
    }
    return self;
}

#pragma mark - Publish Action

- (void)start:(ByteRTCScreenMediaType)mediaType withBlock:(void (^)(void))block {
    self.startBlock = block;
    ByteRTCScreenCaptureParam *screenShareParam = [[ByteRTCScreenCaptureParam alloc] init];
    screenShareParam.width = [EduBCSettingsService getScreenResolution].width;
    screenShareParam.height = [EduBCSettingsService getScreenResolution].height;
    screenShareParam.bitrate = [EduBCSettingsService getScreenKBitRate];
    screenShareParam.frameRate = [EduBCSettingsService getScreenFrameRate];
    
    NSString *extension = ExtensionName;
    NSString *groupId = APPGroupId;
    [[EduBigClassRTCManager shareRtc] startScreenSharingWithParam:screenShareParam mediaType:mediaType preferredExtension:extension groupId:groupId];
}

- (void)update:(ByteRTCScreenMediaType)mediaType {
    [[EduBigClassRTCManager shareRtc] updateScreenSharingType:mediaType];
}

- (void)stop {
    [self stopScreenCapture];
   // [EduBigClassRTMManager endShare];
}

-(void)stopScreenCapture {
    if (_isSharing) {
        _isSharing = NO;
        [[EduBigClassRTCManager shareRtc] stopScreenSharing];
    }
}

#pragma mark - NSNotificationCenter

- (void)extensionDidQuit {
    if (_isSharing) {
        [self stop];
    }
}

- (void)extensionDidStartup {
    _isSharing = YES;
    dispatch_async(dispatch_get_main_queue(), ^{
        //[EduBigClassRTMManager startShare:kShareTypeScreen];
        if (self.startBlock) {
            self.startBlock();
        }
    });
}

#pragma mark - Private Action

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
