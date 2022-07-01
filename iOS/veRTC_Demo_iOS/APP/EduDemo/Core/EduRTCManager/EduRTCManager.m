#import "EduRTCManager.h"
#import "AlertActionManager.h"

@interface EduRTCManager () <ByteRTCEngineDelegate>
@property (nonatomic, strong) ByteRTCEngineKit *rtcKit;


@end

@implementation EduRTCManager

+ (EduRTCManager *_Nullable)shareRtc {
    static EduRTCManager *eduRTCManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        eduRTCManager = [[EduRTCManager alloc] init];
    });
    return eduRTCManager;
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
    int errorCode = [self.rtcKit setVideoEncoderConfig:@[solution]];
    if (errorCode == 0) {
        NSLog(@"set config success");
    }
}

- (void)joinChannelWithToken:(NSString *)token roomID:(NSString *)roomID uid:(NSString *)uid {
    //设置用户角色
    //Set user role
    [self.rtcKit setUserRole:ByteRTCUserRoleTypeBroadcaster];
    
    //加入房间，开始连麦,需要申请AppId和Token
    //Join the room, start connecting the microphone, you need to apply for AppId and Token
    ByteRTCUserInfo *userInfo = [[ByteRTCUserInfo alloc] init];
    userInfo.userId = uid;
    
    [self.rtcKit joinRoomByKey:token
                        roomId:roomID
                   roomProfile:ByteRTCRoomProfileLiveBroadcasting
                      userInfo:userInfo];
    
    //设置本地视频镜像
    //Set local video mirroring
    [self.rtcKit setLocalVideoMirrorMode:ByteRTCMirrorModeOn];

    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    [self enableLocalAudio:NO];
    [self muteLocalAudio:YES];
    //开启/关闭 本地视频采集
    //Turn on/off local video capture
    [self.rtcKit stopVideoCapture];
}

- (void)setupLocalVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        [self.rtcKit setLocalVideoCanvas:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (void)setupRemoteVideo:(ByteRTCVideoCanvas *)videoCanvas {
    if (videoCanvas.view) {
        [self.rtcKit setRemoteVideoCanvas:videoCanvas.uid withIndex:ByteRTCStreamIndexMain withCanvas:videoCanvas];
    }
}

- (NSString *_Nullable)getSdkVersion {
    return [ByteRTCEngineKit getSdkVersion];
}

// 收到加入房间结果
- (void)rtcEngine:(ByteRTCEngineKit *)engine onRoomStateChanged:(NSString *)roomId withUid:(NSString *)uid state:(NSInteger)state extraInfo:(NSString *)extraInfo {
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

- (void)muteLocalAudio:(BOOL)mute {
    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    [self.rtcKit muteLocalAudio:mute];
}

- (void)leaveChannel {
    //离开频道
    //Leave the channel
    [self.rtcKit leaveRoom:^(ByteRTCRoomStats * _Nonnull stat) {
        //do something
        NSLog(@"dealloc == leaveChannel");
    }];
}

- (void)enableAudioInteract:(BOOL)enable{
    if (enable) {
        [self.rtcKit setUserRole:ByteRTCUserRoleTypeBroadcaster];
        [self enableLocalAudio:YES];
        [self muteLocalAudio:NO];
    } else {
        [self.rtcKit setUserRole:ByteRTCUserRoleTypeSilentAudience];
        [self enableLocalAudio:NO];
        [self muteLocalAudio:YES];
    }
}

- (void)enableVideoInteract:(BOOL)enable{
    if (enable) {
        [self.rtcKit setUserRole:ByteRTCUserRoleTypeBroadcaster];
        [self.rtcKit startVideoCapture];
        [self.rtcKit muteLocalVideo:NO];
    }else{
        [self.rtcKit setUserRole:ByteRTCUserRoleTypeSilentAudience];
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
