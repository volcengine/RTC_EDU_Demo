//
//  EduSmallClassScreenComponent.m
//  quickstart
//
//  Created by on 2021/4/6.
//  
//

#import "EduSmallClassScreenComponent.h"
#import "EduSCSettingsService.h"
#import "EduSmallClassRTMManager.h"
#import "EduSmallClassRTCManager.h"

@interface EduSmallClassScreenComponent ()

@property (nonatomic, copy) void (^startBlock)(void);

@end

@implementation EduSmallClassScreenComponent

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
    screenShareParam.width = [EduSCSettingsService getScreenResolution].width;
    screenShareParam.height = [EduSCSettingsService getScreenResolution].height;
    screenShareParam.bitrate = [EduSCSettingsService getScreenKBitRate];
    screenShareParam.frameRate = [EduSCSettingsService getScreenFrameRate];
    
    NSString *extension = ExtensionName;
    NSString *groupId = APPGroupId;
    [[EduSmallClassRTCManager shareRtc] startScreenSharingWithParam:screenShareParam mediaType:mediaType preferredExtension:extension groupId:groupId];
}

- (void)update:(ByteRTCScreenMediaType)mediaType {
    [[EduSmallClassRTCManager shareRtc] updateScreenSharingType:mediaType];
}

- (void)stop {
    [self stopScreenCapture];
    [EduSmallClassRTMManager endShare];
}

-(void)stopScreenCapture {
    if (_isSharing) {
        _isSharing = NO;
        [[EduSmallClassRTCManager shareRtc] stopScreenSharing];
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
        [EduSmallClassRTMManager startShare:kShareTypeScreen];
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
