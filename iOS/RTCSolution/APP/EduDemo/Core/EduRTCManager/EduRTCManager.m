// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduRTCManager.h"

@interface EduRTCManager () <ByteRTCVideoDelegate>
// RTC / RTS 房间
@property (nonatomic, strong, nullable) ByteRTCRoom *rtcRoom;

@property (nonatomic, assign) BOOL currentVideoCapture;

@end

@implementation EduRTCManager

#pragma mark - Publish Action

- (void)configeRTCEngine {
    [super configeRTCEngine];
    ByteRTCVideoEncoderConfig *solution =[[ByteRTCVideoEncoderConfig alloc] init];
    solution.width = 320;
    solution.height = 240;
    solution.frameRate = 15;
    solution.maxBitrate = 350;
    int errorCode = [self.rtcEngineKit setMaxVideoEncoderConfig:solution];
    if (errorCode == 0) {
        NSLog(@"set config success");
    }
}

- (void)joinChannelWithToken:(NSString *)token roomID:(NSString *)roomID uid:(NSString *)uid {
    self.rtcRoom = [self.rtcEngineKit createRTCRoom:roomID];
    self.rtcRoom.delegate = self;
    
    //加入房间，开始连麦,需要申请AppId和Token
    //Join the room, start connecting the microphone, you need to apply for AppId and Token
    ByteRTCUserInfo *userInfo = [[ByteRTCUserInfo alloc] init];
    userInfo.userId = uid;
    
    ByteRTCRoomConfig *config = [[ByteRTCRoomConfig alloc] init];
    config.profile = ByteRTCRoomProfileLiveBroadcasting;
    config.isAutoPublish = YES;
    config.isAutoSubscribeAudio = YES;
    config.isAutoSubscribeVideo = YES;
    
    [self.rtcRoom joinRoom:token userInfo:userInfo roomConfig:config];
    
    //设置本地视频镜像
    //Set local video mirroring
    [self.rtcEngineKit setLocalVideoMirrorType:ByteRTCMirrorTypeRenderAndEncoder];

    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    [self enableLectureLocalAudio:NO];
    [self muteLocalAudio:YES];
    //开启/关闭 本地视频采集
    //Turn on/off local video capture
    [self.rtcEngineKit stopVideoCapture];
    self.currentVideoCapture = NO;
}

- (void)setupRemoteVideo:(ByteRTCVideoCanvas *)videoCanvas
                     uid:(NSString *)uid {
    ByteRTCRemoteStreamKey *streamKey = [[ByteRTCRemoteStreamKey alloc] init];
    streamKey.userId = uid;
    streamKey.roomId = self.rtcRoom.getRoomId;
    streamKey.streamIndex = ByteRTCStreamIndexMain;
    
    [self.rtcEngineKit setRemoteVideoCanvas:streamKey withCanvas:videoCanvas];
}

- (NSString *_Nullable)getSdkVersion {
    return [ByteRTCVideo getSDKVersion];
}

- (BOOL)currentCameraState {
    return _currentVideoCapture;
}

#pragma mark - rtc method

- (void)enableLectureLocalAudio:(BOOL)enable {
    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    if (enable) {
        [self.rtcEngineKit startAudioCapture];
    } else {
        [self.rtcEngineKit stopAudioCapture];
    }
}

- (void)muteLocalAudio:(BOOL)mute {
    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    if (mute) {
        [self.rtcRoom unpublishStream:ByteRTCMediaStreamTypeAudio];
    }else {
        [self.rtcRoom publishStream:ByteRTCMediaStreamTypeAudio];
    }
}

- (void)leaveLectureChannel {
    //离开频道
    //Leave the channel
    [self.rtcRoom leaveRoom];
    [self.rtcRoom destroy];
    self.rtcRoom = nil;
}

- (void)enableAudioInteract:(BOOL)enable{
    if (enable) {
        [self enableLectureLocalAudio:YES];
        [self muteLocalAudio:NO];
    } else {
        [self enableLectureLocalAudio:NO];
        [self muteLocalAudio:YES];
    }
}

- (void)enableVideoInteract:(BOOL)enable {
    if (enable) {
        [self.rtcEngineKit startVideoCapture];
        self.currentVideoCapture = YES;
    } else {
        [self.rtcEngineKit stopVideoCapture];
        self.currentVideoCapture = NO;
    }
}

- (void)destroy {
    [ByteRTCVideo destroyRTCVideo];
}

#pragma mark - aa



- (void)rtcRoom:(ByteRTCRoom *)rtcRoom onRoomStateChanged:(NSString *)roomId
        withUid:(NSString *)uid
          state:(NSInteger)state
      extraInfo:(NSString *)extraInfo {
    [super rtcRoom:rtcRoom onRoomStateChanged:roomId withUid:uid state:state extraInfo:extraInfo];
    
    dispatch_queue_async_safe(dispatch_get_main_queue(), ^{
        RTCJoinModel *joinModel = [RTCJoinModel modelArrayWithClass:extraInfo state:state roomId:roomId];
        if (self.rtcJoinRoomBlock) {
            self.rtcJoinRoomBlock(joinModel.roomId,
                                  joinModel.errorCode,
                                  joinModel.joinType);
        }
    });
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
