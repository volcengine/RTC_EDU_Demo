#import "AlertActionManager.h"
#import "EduBreakoutRTCManager.h"
#import "EduBreakoutRTCManager.h"

@interface EduBreakoutRTCManager () <ByteRTCVideoDelegate,ByteRTCRoomDelegate>

@property (nonatomic, strong) ByteRTCVideo *rtcKit;
@property (nonatomic, assign) BOOL currentVideoCapture;
@property (nonatomic, strong) ByteRTCRoom *hostRoom;
@property (nonatomic, strong) ByteRTCRoom *groupRoom;

@end

@implementation EduBreakoutRTCManager

+ (EduBreakoutRTCManager *_Nullable)shareRtc {
    static EduBreakoutRTCManager *eduBreakoutRTCManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      eduBreakoutRTCManager = [[EduBreakoutRTCManager alloc] init];
    });
    return eduBreakoutRTCManager;
}

#pragma mark - Publish Action

- (void)createEngine:(NSString *)appID {
    //创建ByteRTCEninekit,需要申请AppId和Token
    //To create ByteRTCEninekit, you need to apply for AppId and Token
    self.rtcKit = [ByteRTCVideo createRTCVideo:appID delegate:self parameters:@{}];
    
    [self.rtcKit setBusinessId:[EduBreakoutRTCManager shareRtc].businessId];
    
    ByteRTCVideoEncoderConfig *solution = [[ByteRTCVideoEncoderConfig alloc] init];
    solution.width = 320;
    solution.height = 240;
    solution.frameRate = 15;
    solution.maxBitrate = 350;
    int errorCode = [self.rtcKit SetMaxVideoEncoderConfig:solution];
    
    if (errorCode == 0) {
        NSLog(@"set config success");
    }
}

- (void)joinHostRoomWithToken:(NSString *)token roomID:(NSString *)roomID uid:(NSString *)uid {
    ByteRTCUserInfo *userInfo = [[ByteRTCUserInfo alloc] init];
    userInfo.userId = uid;

    self.hostRoom = [self.rtcKit createRTCRoom:roomID];
    self.hostRoom.delegate = self;
    
    ByteRTCRoomConfig *config = [[ByteRTCRoomConfig alloc]init];
    config.profile = ByteRTCRoomProfileLiveBroadcasting;
    config.isAutoSubscribeAudio = YES;
    config.isAutoSubscribeVideo = YES;
    
    [self.hostRoom joinRoomByToken:token userInfo:userInfo roomConfig:config];
    [self.hostRoom setUserVisibility:YES];
}

- (void)joinGroupRoomWithToken:(NSString *)token roomID:(NSString *)roomID uid:(NSString *)uid {
    //Set local video mirroring
    [self.rtcKit setLocalVideoMirrorType:ByteRTCMirrorTypeRenderAndEncoder];

    self.groupRoom = [self.rtcKit createRTCRoom:roomID];
    self.groupRoom.delegate = self;
    ByteRTCUserInfo *userInfo = [[ByteRTCUserInfo alloc] init];
    userInfo.userId = uid;
    
    ByteRTCRoomConfig *config = [[ByteRTCRoomConfig alloc]init];
    config.profile = ByteRTCRoomProfileLiveBroadcasting;
    config.isAutoSubscribeAudio = YES;
    config.isAutoSubscribeVideo = YES;
    [self.groupRoom joinRoomByToken:token userInfo:userInfo roomConfig:config];

    [self.rtcKit startVideoCapture];
    self.currentVideoCapture = YES;

    [self.rtcKit stopAudioCapture];
    [self.groupRoom unpublishStream:ByteRTCMediaStreamTypeAudio];

    [self.groupRoom setUserVisibility:YES];
    [self.groupRoom publishStream:ByteRTCMediaStreamTypeVideo];
}

- (void)openGroupSpeech:(BOOL)open {
    if (open) {
        [self.groupRoom unpublishStream:ByteRTCMediaStreamTypeBoth];
        [self.groupRoom setUserVisibility:NO];
        [self.rtcKit stopVideoCapture];
        self.currentVideoCapture = NO;
        [self.rtcKit startAudioCapture];

        [self.hostRoom setUserVisibility:YES];
        [self.hostRoom publishStream:ByteRTCMediaStreamTypeAudio];
    } else {
        [self.hostRoom setUserVisibility:NO];
        [self.hostRoom unpublishStream:ByteRTCMediaStreamTypeBoth];

        [self.rtcKit startVideoCapture];
        self.currentVideoCapture = YES;
        [self.rtcKit stopAudioCapture];

        [self.groupRoom setUserVisibility:YES];
        [self.groupRoom publishStream:ByteRTCMediaStreamTypeVideo];
    }
}

- (void)openVideoInteract:(BOOL)open {
    if (open) {
        [self.groupRoom setUserVisibility:NO];
        [self.groupRoom unpublishStream:ByteRTCMediaStreamTypeBoth];

        [self.rtcKit startAudioCapture];

        [self.hostRoom setUserVisibility:YES];
        [self.hostRoom publishStream:ByteRTCMediaStreamTypeBoth];
    } else {
        [self.hostRoom setUserVisibility:NO];
        [self.hostRoom unpublishStream:ByteRTCMediaStreamTypeBoth];

        [self.rtcKit stopAudioCapture];

        [self.groupRoom setUserVisibility:YES];
        [self.groupRoom publishStream:ByteRTCMediaStreamTypeBoth];
    }
}

- (void)setHostRoomRemoteVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        videoCanvas.roomId = self.hostRoom.getRoomId;
        [self.rtcKit setRemoteVideoCanvas:videoCanvas.uid withIndex:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (void)setGroupRoomRemoteVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        videoCanvas.roomId = self.groupRoom.getRoomId;
        [self.rtcKit setRemoteVideoCanvas:videoCanvas.uid withIndex:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (void)setupLocalVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view && self.rtcKit) {
        [self.rtcKit setLocalVideoCanvas:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (NSString *_Nullable)getSdkVersion {
    return [ByteRTCVideo getSdkVersion];
}

- (BOOL)currentCameraState {
    return _currentVideoCapture;
}

#pragma mark - rtc method

- (void)enableLocalAudio:(BOOL)enable {
    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    if (enable) {
        [self.rtcKit startAudioCapture];
    } else {
        [self.rtcKit stopAudioCapture];
    }
}

- (void)enableLocalVideo:(BOOL)isEnableVideo {
    if (isEnableVideo) {
        [self.rtcKit startVideoCapture];
    } else {
        [self.rtcKit stopVideoCapture];
    }
}

- (void)leaveChannel {
    //Leave the channel
    [self.groupRoom leaveRoom];
    [self.groupRoom destroy];

    [self.hostRoom leaveRoom];
    [self.hostRoom destroy];
}

- (void)destroy {
    [ByteRTCVideo destroyRTCVideo];
}


#pragma mark - Tool

- (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString {
   if (jsonString == nil) {
       return nil;
   }

   NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
   NSError *err;
   NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                       options:NSJSONReadingMutableContainers
                                                         error:&err];
   if(err) {
       NSLog(@"json解析失败：%@",err);
       return nil;
   }
   return dic;
}

@end
