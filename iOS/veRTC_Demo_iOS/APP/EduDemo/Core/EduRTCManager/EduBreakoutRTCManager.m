#import "AlertActionManager.h"
#import "EduBreakoutRTCManager.h"

@interface EduBreakoutRTCManager () <ByteRTCEngineDelegate,ByteRTCRoomDelegate>

@property (nonatomic, strong) ByteRTCEngineKit *rtcKit;

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
    self.rtcKit = [[ByteRTCEngineKit alloc] initWithAppId:appID delegate:self parameters:@{}];

    ByteRTCVideoSolution *solution = [[ByteRTCVideoSolution alloc] init];
    solution.videoSize = CGSizeMake(320, 240);
    solution.frameRate = 15;
    solution.maxKbps = 350;
    int errorCode = [self.rtcKit setVideoEncoderConfig:@[ solution ]];
    if (errorCode == 0) {
        NSLog(@"set config success");
    }
}

- (void)joinHostRoomWithToken:(NSString *)token roomID:(NSString *)roomID uid:(NSString *)uid {
    ByteRTCUserInfo *userInfo = [[ByteRTCUserInfo alloc] init];
    userInfo.userId = uid;

    self.hostRoom = [self.rtcKit createRtcRoom:roomID];
    self.hostRoom.delegate = self;
    ByteRTCMultiRoomConfig *config = [[ByteRTCMultiRoomConfig alloc]init];
    config.profile = ByteRTCRoomProfileLiveBroadcasting;
    config.isAutoSubscribeAudio = YES;
    config.isAutoSubscribeVideo = YES;
    [self.hostRoom joinRoomByToken:token userInfo:userInfo roomConfig:config];
    [self.hostRoom setUserVisibility:YES];
    
}

- (void)joinGroupRoomWithToken:(NSString *)token roomID:(NSString *)roomID uid:(NSString *)uid {
    //Set local video mirroring
    [self.rtcKit setLocalVideoMirrorMode:ByteRTCMirrorModeOn];

    self.groupRoom = [self.rtcKit createRtcRoom:roomID];
    self.groupRoom.delegate = self;
    ByteRTCUserInfo *userInfo = [[ByteRTCUserInfo alloc] init];
    userInfo.userId = uid;
    
    ByteRTCMultiRoomConfig *config = [[ByteRTCMultiRoomConfig alloc]init];
    config.profile = ByteRTCRoomProfileLiveBroadcasting;
    config.isAutoSubscribeAudio = YES;
    config.isAutoSubscribeVideo = YES;
    [self.groupRoom joinRoomByToken:token userInfo:userInfo roomConfig:config];

    [self.rtcKit startVideoCapture];
    [self.rtcKit muteLocalVideo:NO];

    [self.rtcKit stopAudioCapture];
    [self.rtcKit muteLocalAudio:YES];

    [self.groupRoom setUserVisibility:YES];

    [self.groupRoom publish];
}

- (void)openGroupSpeech:(BOOL)open {
    if (open) {
        [self.groupRoom unpublish];
        [self.rtcKit stopVideoCapture];
        [self.rtcKit muteLocalVideo:YES];

        [self.rtcKit startAudioCapture];
        [self.rtcKit muteLocalAudio:NO];

        [self.hostRoom setUserVisibility:YES];
        [self.groupRoom setUserVisibility:NO];
        [self.hostRoom publish];
    } else {
        [self.hostRoom unpublish];

        [self.rtcKit startVideoCapture];
        [self.rtcKit muteLocalVideo:NO];
        [self.rtcKit stopAudioCapture];
        [self.rtcKit muteLocalAudio:YES];

        [self.hostRoom setUserVisibility:NO];
        [self.groupRoom setUserVisibility:YES];

        [self.groupRoom publish];
    }
}

- (void)openVideoInteract:(BOOL)open {
    if (open) {
        [self.groupRoom unpublish];
        [self.groupRoom setUserVisibility:NO];

        [self.rtcKit startAudioCapture];
        [self.rtcKit muteLocalAudio:NO];

        [self.hostRoom setUserVisibility:YES];
        [self.hostRoom publish];
    } else {
        [self.hostRoom unpublish];
        [self.hostRoom setUserVisibility:NO];

        [self.rtcKit stopAudioCapture];
        [self.rtcKit muteLocalAudio:YES];
        [self.groupRoom setUserVisibility:YES];
        [self.groupRoom publish];
    }
}

- (void)setHostRoomRemoteVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        [self.hostRoom setRemoteVideoCanvas:videoCanvas.uid withIndex:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (void)setGroupRoomRemoteVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        [self.groupRoom setRemoteVideoCanvas:videoCanvas.uid withIndex:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (void)setLocalVideoCanvas:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        [self.rtcKit setLocalVideoCanvas:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (void)setupLocalVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        [self.rtcKit setLocalVideoCanvas:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (void)setRemoteVideoCanvas:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        [self.rtcKit setRemoteVideoCanvas:videoCanvas.uid withIndex:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (NSString *_Nullable)getSdkVersion {
    return [ByteRTCEngineKit getSdkVersion];
}

#pragma mark - RTCdelegate
- (void)rtcEngine:(ByteRTCEngineKit *_Nonnull)engine
    onRoomStateChanged:(NSString *_Nonnull)roomId
             withUid:(nonnull NSString *)uid
           state:(NSInteger)state
        extraInfo:(NSString *_Nonnull)extraInfo {
    
}

- (void)rtcRoom:(ByteRTCRoom *)rtcRoom onRoomStateChanged:(NSString * _Nonnull)roomId withUid:(nonnull NSString *)uid state:(NSInteger)state extraInfo:(NSString * _Nonnull)extraInfo {
    if ([roomId isEqualToString:[self.hostRoom getRoomId]]) {
        NSDictionary *dic = [self dictionaryWithJsonString:extraInfo];
        NSInteger errorCode = state;
        NSInteger joinType = -1;
        if ([dic isKindOfClass:[NSDictionary class]]) {
            NSString *joinTypeStr = [NSString stringWithFormat:@"%@", dic[@"join_type"]];
            joinType = joinTypeStr.integerValue;
        }
        if (self.rtcJoinRoomBlock) {
            void (^rtcJoinRoomBlock)(NSString *, NSInteger, NSInteger) = self.rtcJoinRoomBlock;
            dispatch_queue_async_safe(dispatch_get_main_queue(), ^{
                rtcJoinRoomBlock(roomId, errorCode, joinType);
            });
        }
    }
}
- (void)rtcRoom:(ByteRTCRoom *_Nonnull)rtcRoom onRoomError:(ByteRTCErrorCode)errorCode {
    
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

- (void)muteLocalAudioStream:(BOOL)isMute {
    [self.rtcKit muteLocalAudio:isMute];
}

- (void)muteLocalAudio:(BOOL)mute {
    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    [self.rtcKit muteLocalAudio:mute];
}

- (void)enableLocalVideo:(BOOL)isEnableVideo {
    if (isEnableVideo) {
        [self.rtcKit startVideoCapture];
    } else {
        [self.rtcKit stopVideoCapture];
    }
}

- (void)muteLocalVideo:(BOOL)isMute {
    [self.rtcKit muteLocalVideo:isMute];
}

- (void)leaveChannel {
    //Leave the channel
    [self.rtcKit leaveRoom];
    
    [self.groupRoom leaveRoom];
    [self.groupRoom destroy];

    [self.hostRoom leaveRoom];
    [self.hostRoom destroy];
}

- (void)enableAudioInteract:(BOOL)enable {
    if (enable) {
        [self.rtcKit setUserVisibility:YES];
        [self enableLocalAudio:YES];
        [self muteLocalAudio:NO];
    } else {
        [self.rtcKit setUserVisibility:NO];
        [self enableLocalAudio:NO];
        [self muteLocalAudio:YES];
    }
}

- (void)enableVideoInteract:(BOOL)enable {
    if (enable) {
        [self.rtcKit setUserVisibility:YES];
        [self.rtcKit startVideoCapture];
        [self.rtcKit muteLocalVideo:NO];
    } else {
        [self.rtcKit setUserVisibility:NO];
        [self.rtcKit stopVideoCapture];
        [self.rtcKit muteLocalVideo:YES];
    }
}

- (void)destroy {
    [ByteRTCEngineKit destroy];
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
