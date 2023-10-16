#import "EduBCSettingsService.h"
#import "EduBigClassRTCManager.h"
#import "AlertActionManager.h"

@interface EduBigClassRTCManager () <ByteRTCVideoDelegate>

@property (nonatomic, strong) EduBCRoomParamInfoModel *paramInfoModel;
@property (nonatomic, strong) EduBCRoomVideoSession *localVideoSession;

@property (nonatomic, strong) NSMutableDictionary *subscribeUidDic;
@property (nonatomic, assign) NSInteger currnetCameraID;

@property (nonatomic, strong) NSMutableDictionary *canvasUidDic;

@property (nonatomic, strong) ByteRTCVideoEncoderConfig *solution;
@property (nonatomic, assign) BOOL enableSpeaker;
@property (nonatomic, assign) ByteRTCAudioRoute currentAudioRoute;
@end

@implementation EduBigClassRTCManager

+ (EduBigClassRTCManager *_Nullable)shareRtc {
    static EduBigClassRTCManager *eduBigClassRTCManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        eduBigClassRTCManager = [[EduBigClassRTCManager alloc] init];
    });
    return eduBigClassRTCManager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.currnetCameraID = ByteRTCCameraIDFront;
        self.currentAudioRoute = ByteRTCAudioRouteDefault;
    }
    return self;
}

#pragma mark - Publish Action

- (void)configeRTCEngine {
    [super configeRTCEngine];
    [self.rtcEngineKit setExtensionConfig:APPGroupId];
}

- (void)joinChannelWithSession:(EduBCRoomVideoSession *)videoSession token:(NSString *)token {
    self.localVideoSession = videoSession;
    [self.subscribeUidDic removeAllObjects];
    [self.canvasUidDic removeAllObjects];
    // 设置音频场景类型
    [self.rtcEngineKit setAudioScenario:ByteRTCAudioScenarioCommunication];
    
    //设置订阅的音视频流回退选项
    //Set the subscribed audio and video stream fallback options
//    [self.rtcEngineKit setSubscribeFallbackOption:ByteRTCSubscribeFallbackOptionAudioOnly];

    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    [self enableLocalAudio:videoSession.isEnableAudio];
    
    //Turn on/off local video capture
    [self enableLocalVideo:videoSession.isEnableVideo];
    
    //设置音频路由模式，YES 扬声器/NO 听筒
    //Set the audio routing mode, YES speaker/NO earpiece
    [self setEnableSpeakerphone:YES];

    //设置本地视频镜像
    //Set local video mirroring
    [self.rtcEngineKit setLocalVideoMirrorType:ByteRTCMirrorTypeRender];
    
    //开启/关闭发言者音量键控
    //Turn on/off speaker volume keying
    ByteRTCAudioPropertiesConfig *audioPropertiesConfig = [[ByteRTCAudioPropertiesConfig alloc] init];
    audioPropertiesConfig.interval = 2000;
    [self.rtcEngineKit enableAudioPropertiesReport:audioPropertiesConfig];
    
    //加入房间，开始连麦,需要申请AppId和Token
    //Join the room, start connecting the microphone, you need to apply for AppId and Token
    ByteRTCUserInfo *userInfo = [[ByteRTCUserInfo alloc] init];
    userInfo.userId = videoSession.uid;
    
    ByteRTCRoomConfig *config = [[ByteRTCRoomConfig alloc] init];
    config.profile = ByteRTCRoomProfileCommunication;
    config.isAutoPublish = YES;
    config.isAutoSubscribeAudio = YES;
    config.isAutoSubscribeVideo = NO;
    
    self.rtcRoom = [self.rtcEngineKit createRTCRoom:videoSession.roomId];
    self.rtcRoom.delegate = self;
    [self.rtcRoom joinRoom:token userInfo:userInfo roomConfig:config];
}

#pragma mark - rtc method

- (void)updateRtcVideoParams {
    ByteRTCVideoEncoderConfig *localSolution =[[ByteRTCVideoEncoderConfig alloc] init];
    localSolution.width = [EduBCSettingsService getResolution].width;
    localSolution.height = [EduBCSettingsService getResolution].height;

    localSolution.frameRate = [EduBCSettingsService getFrameRate];
    localSolution.maxBitrate = [EduBCSettingsService getKBitRate];
    
    self.solution = localSolution;
    
    //设置本地视频属性
    //Set local video attributes
    [self.rtcEngineKit setVideoEncoderConfig:@[localSolution]];
}

- (void)switchCamera {
    //切换 前置/后置 摄像头
    //Switch front/rear camera
    ByteRTCCameraID cameraID = self.currnetCameraID;
    if (cameraID == ByteRTCCameraIDFront) {
        cameraID = ByteRTCCameraIDBack;
    } else {
        cameraID = ByteRTCCameraIDFront;
    }
    
    if (cameraID == ByteRTCCameraIDFront) {
        [self.rtcEngineKit setLocalVideoMirrorType:ByteRTCMirrorTypeRender];
    } else {
        [self.rtcEngineKit setLocalVideoMirrorType:ByteRTCMirrorTypeNone];
    }
    
    int result = [self.rtcEngineKit switchCamera:cameraID];
    if (0 == result) {
        self.currnetCameraID = cameraID;
    }
}

- (int)setEnableSpeakerphone:(BOOL)enableSpeaker {
    //打开/关闭 外放
    //Turn on/off the loudspeaker
    int result = -1;
    ByteRTCAudioRoute curAR = [self.rtcEngineKit getAudioRoute];
    if (curAR == ByteRTCAudioRouteEarpiece || curAR == ByteRTCAudioRouteSpeakerphone) {
        if (enableSpeaker) {
            result = [self.rtcEngineKit setDefaultAudioRoute:ByteRTCAudioRouteSpeakerphone];
        } else {
            result = [self.rtcEngineKit setDefaultAudioRoute:ByteRTCAudioRouteEarpiece];
        }
        
        if (result == 0) {
            self.enableSpeaker = enableSpeaker;
        }
    }
    return result;
}

- (void)enableLocalAudio:(BOOL)enable {
    //开启/关闭 本地音频采集
    //Turn on/off local audio capture
    if (enable) {
        [self.rtcEngineKit startAudioCapture];
    } else {
        [self.rtcEngineKit stopAudioCapture];
    }
}

- (void)enableLocalVideo:(BOOL)enable {
    //开启/关闭 本地视频采集
    //Turn on/off local video capture
    if (enable) {
        [self.rtcEngineKit startVideoCapture];
    } else {
        [self.rtcEngineKit stopVideoCapture];
    }
}

- (void)leaveChannel {
    //离开频道
    //Leave the channel
    if (self.currnetCameraID != ByteRTCCameraIDFront) {
        [self switchCamera];
    }
    [self.rtcEngineKit stopAudioCapture];
    [self.rtcRoom leaveRoom];
    [self.subscribeUidDic removeAllObjects];
    [self.canvasUidDic removeAllObjects];
    self.localVideoSession = nil;
}

- (void)startPreview:(UIView *)view {
    [self resetPreview:view];
    [self.rtcEngineKit startVideoCapture];
}

- (void)resetPreview:(UIView *)view {
    ByteRTCVideoCanvas *canvas = [[ByteRTCVideoCanvas alloc] init];
    canvas.view = view;
    canvas.renderMode = ByteRTCRenderModeHidden;
    canvas.view.backgroundColor = [UIColor clearColor];
    //设置本地视频显示信息
    //Set local video display information
    [self.rtcEngineKit setLocalVideoCanvas:ByteRTCStreamIndexMain withCanvas:canvas];
}

- (void)subscribeStream:(NSString *_Nullable)uid video:(BOOL)subVideo {
    if (IsEmptyStr(uid)) {
        return;
    }
    
    NSUInteger mediaType = ByteRTCMediaStreamTypeAudio;
    if (subVideo) {
        mediaType |= ByteRTCMediaStreamTypeVideo;
    }
    
    NSString *value = [self.subscribeUidDic objectForKey:uid];
    if ([value integerValue] != 1) {
        [self.rtcRoom subscribeStream:uid mediaStreamType:mediaType];
        [self.subscribeUidDic setValue:@"1" forKey:uid];
    }
}

- (void)subscribeScreenStream:(NSString *)uid {
    if (IsEmptyStr(uid)) {
        return;
    }
    
    NSString *key = [NSString stringWithFormat:@"%@_screen", uid];
    NSString *value = [self.subscribeUidDic objectForKey:key];
    if ([value integerValue] != 1) {
        [self.rtcRoom subscribeScreen:uid mediaStreamType:ByteRTCMediaStreamTypeBoth];
        [self.subscribeUidDic setValue:@"1" forKey:key];
    }
}

- (void)unsubscribe:(NSString *_Nullable)uid {
    if (IsEmptyStr(uid)) {
        return;
    }
    NSString *value = [self.subscribeUidDic objectForKey:uid];
    if ([value integerValue] == 1) {
        [self.rtcRoom unsubscribeStream:uid mediaStreamType:ByteRTCMediaStreamTypeVideo];
        [self.rtcRoom subscribeStream:uid mediaStreamType:ByteRTCMediaStreamTypeAudio];

        [self.subscribeUidDic setValue:@"0" forKey:uid];
    }
}

- (void)unsubscribeScreen:(NSString *)uid {
    if (IsEmptyStr(uid)) {
        return;
    }
    
    NSString *key = [NSString stringWithFormat:@"%@_screen", uid];
    NSString *value = [self.subscribeUidDic objectForKey:key];
    if ([value integerValue] == 1) {
        [self.rtcRoom unsubscribeScreen:uid mediaStreamType:ByteRTCMediaStreamTypeBoth];
        [self.subscribeUidDic setValue:@"0" forKey:key];
    }
}

- (NSDictionary *_Nullable)getSubscribeUidDic {
    return [self.subscribeUidDic copy];
}

- (void)setupRemoteVideo:(ByteRTCVideoCanvas *)canvas uid:(NSString *)uid{
    if (canvas) {
        NSNumber *value = [self.canvasUidDic objectForKey:uid];
        if ([value unsignedIntegerValue] != [canvas.view hash]) {
            NSLog(@"setupRemoteVideo:%p for user:%@", canvas.view, uid);
            
            ByteRTCRemoteStreamKey *streamKey = [[ByteRTCRemoteStreamKey alloc] init];
            streamKey.userId = uid;
            streamKey.roomId = self.rtcRoom.getRoomId;
            streamKey.streamIndex = ByteRTCStreamIndexMain;
            
            [self.rtcEngineKit setRemoteVideoCanvas:streamKey withCanvas:canvas];
            [self.canvasUidDic setObject:[NSNumber numberWithUnsignedInteger:[canvas.view hash]] forKey:uid];
        }
    }
}

- (void)setupLocalVideo:(ByteRTCVideoCanvas *)canvas uid:(NSString *)uid{
    NSNumber *value = [self.canvasUidDic objectForKey:uid];
    if ([value unsignedIntegerValue] != [canvas.view hash]) {
        NSLog(@"setuplocalVideo:%p", canvas.view);
        [self.rtcEngineKit setLocalVideoCanvas:ByteRTCStreamIndexMain withCanvas:canvas];
        [self.canvasUidDic setObject:[NSNumber numberWithUnsignedInteger:[canvas.view hash]] forKey:uid];
    }
}

- (void)setupRemoteScreen:(UIView *)view uid:(NSString *)uid {
    NSString *key = [NSString stringWithFormat:@"%@_screen", uid];
    NSNumber *value = [self.canvasUidDic objectForKey:key];
    if ([value unsignedIntegerValue] != [view hash]) {
        ByteRTCVideoCanvas *canvas = [[ByteRTCVideoCanvas alloc] init];
        canvas.renderMode = ByteRTCRenderModeFit;
        canvas.view.backgroundColor = [UIColor clearColor];
        canvas.view = view;
        
        ByteRTCRemoteStreamKey *streamKey = [[ByteRTCRemoteStreamKey alloc] init];
        streamKey.userId = uid;
        streamKey.roomId = self.rtcRoom.getRoomId;
        streamKey.streamIndex = ByteRTCStreamIndexScreen;
        
        [self.rtcEngineKit setRemoteVideoCanvas:streamKey withCanvas:canvas];
        [self.canvasUidDic setObject:[NSNumber numberWithUnsignedInteger:[view hash]] forKey:key];
    }
}

#pragma mark - ByteRTCVideoDelegate

- (void)rtcRoom:(ByteRTCRoom *)rtcRoom onStreamAdd:(id<ByteRTCStream>)stream  {
    if (stream.isScreen) {
        if ([self.delegate respondsToSelector:@selector(rtcManager:didScreenStreamAdded:)]) {
            [self.delegate rtcManager:self didScreenStreamAdded:stream.userId];
        }
    } else {
        if ([self.delegate respondsToSelector:@selector(rtcManager:didStreamAdded:)]) {
            [self.delegate rtcManager:self didStreamAdded:stream.userId];
        }
    }
}

- (void)rtcRoom:(ByteRTCRoom *)rtcRoom didStreamRemoved:(NSString *)uid stream:(id<ByteRTCStream>)stream reason:(ByteRTCStreamRemoveReason)reason {
    if (stream.isScreen) {
        if ([self.delegate respondsToSelector:@selector(rtcManager:didScreenStreamRemoved:)]) {
            [self.delegate rtcManager:self didScreenStreamRemoved:stream.userId];
        }
    } else {
        [self.subscribeUidDic setValue:@"0" forKey:stream.userId];
        if ([self.delegate respondsToSelector:@selector(rtcManager:didStreamRemoved:)]) {
            [self.delegate rtcManager:self didStreamRemoved:stream.userId];
        }
    }
}

- (void)rtcEngine:(ByteRTCVideo *)engine onVideoDeviceStateChanged:(NSString *)device_id device_type:(ByteRTCVideoDeviceType)device_type device_state:(ByteRTCMediaDeviceState)device_state device_error:(ByteRTCMediaDeviceError)device_error {

    if (device_type == ByteRTCVideoDeviceTypeScreenCaptureDevice) {
        if (device_state == ByteRTCMediaDeviceStateStarted) {
            [self.rtcRoom publishScreen:ByteRTCMediaStreamTypeBoth];
            NSLog(@"onVideoDeviceStateChanged Started");
        } else if (device_state == ByteRTCMediaDeviceStateStopped ||
                   device_state == ByteRTCMediaDeviceStateRuntimeError) {
            [self.rtcRoom unpublishScreen:ByteRTCMediaStreamTypeBoth];
            NSLog(@"onVideoDeviceStateChanged Stopped");
        }
    }
}

#pragma mark - Rtc Stats

- (void)rtcRoom:(ByteRTCRoom *)rtcRoom onLocalStreamStats:(ByteRTCLocalStreamStats *)stats {

    self.paramInfoModel.local_bit_video = [NSString stringWithFormat:@"%.0f",stats.video_stats.sentKBitrate];
    self.paramInfoModel.local_fps = [NSString stringWithFormat:@"%ld",(long)stats.video_stats.inputFrameRate];
    self.paramInfoModel.local_res = [NSString stringWithFormat:@"%ld*%ld",(long)stats.video_stats.encodedFrameWidth, (long)stats.video_stats.encodedFrameHeight];
    
    self.paramInfoModel.local_bit_audio = [NSString stringWithFormat:@"%.0f",stats.audio_stats.sentKBitrate];
    
    [self updateEduBCRoomParamInfoModel];
}

- (void)rtcRoom:(ByteRTCRoom *)rtcRoom onRemoteStreamStats:(ByteRTCRemoteStreamStats *)stats {
    self.paramInfoModel.remote_rtt_audio = [NSString stringWithFormat:@"%ld",(long)stats.audio_stats.rtt];
    self.paramInfoModel.remote_bit_audio = [NSString stringWithFormat:@"%ld",(long)stats.audio_stats.receivedKBitrate];
    self.paramInfoModel.remote_loss_audio = [NSString stringWithFormat:@"%ld",(long)stats.audio_stats.audioLossRate];
 
    self.paramInfoModel.remote_rtt_video = [NSString stringWithFormat:@"%ld",(long)stats.video_stats.rtt];
    self.paramInfoModel.remote_bit_video = [NSString stringWithFormat:@"%ld",(long)stats.video_stats.receivedKBitrate];
    
    if (stats.video_stats.width * stats.video_stats.height <= self.paramInfoModel.remote_res_min_w * self.paramInfoModel.remote_res_min_h ||
        (self.paramInfoModel.remote_res_min_w == 0 && self.paramInfoModel.remote_res_min_h == 0)) {
        self.paramInfoModel.remote_res_min_w = stats.video_stats.width;
        self.paramInfoModel.remote_res_min_h = stats.video_stats.height;
    }
    if (stats.video_stats.width * stats.video_stats.height > self.paramInfoModel.remote_res_max_w * self.paramInfoModel.remote_res_max_h) {
        self.paramInfoModel.remote_res_max_w = stats.video_stats.width;
        self.paramInfoModel.remote_res_max_h = stats.video_stats.height;
    }
    self.paramInfoModel.remote_res_min = [NSString stringWithFormat:@"%ld*%ld",
                                             (long)self.paramInfoModel.remote_res_min_w,
                                             (long)self.paramInfoModel.remote_res_min_h];
    self.paramInfoModel.remote_res_max = [NSString stringWithFormat:@"%ld*%ld",
                                             (long)self.paramInfoModel.remote_res_max_w,
                                             (long)self.paramInfoModel.remote_res_max_h];
    self.paramInfoModel.remote_fps_min = [NSString stringWithFormat:@"%ld",(long)stats.video_stats.receivedFrameRate];
    self.paramInfoModel.remote_fps_max = [NSString stringWithFormat:@"%ld",(long)stats.video_stats.receivedFrameRate];
    self.paramInfoModel.remote_loss_video = [NSString stringWithFormat:@"%ld",(long)stats.video_stats.videoLossRate];
    
    [self updateEduBCRoomParamInfoModel];
}

- (void)rtcEngine:(ByteRTCVideo *)engine reportSysStats:(const ByteRTCSysStats *)stats {
    self.paramInfoModel.remote_cpu_avg = [NSString stringWithFormat:@"%.2f", stats.cpu_app_usage * 100];
    if (stats.cpu_app_usage > [self.paramInfoModel.remote_cpu_max floatValue] / 100.0) {
        self.paramInfoModel.remote_cpu_max = [NSString stringWithFormat:@"%.2f", stats.cpu_app_usage * 100];
    }
    
    [self updateEduBCRoomParamInfoModel];
}

- (void)rtcEngine:(ByteRTCVideo *)engine onRemoteAudioPropertiesReport:(NSArray<ByteRTCRemoteAudioPropertiesInfo *> *)audioPropertiesInfos totalRemoteVolume:(NSInteger)totalRemoteVolume {
    
    NSInteger minVolume = 10;
    NSMutableDictionary *parDic = [[NSMutableDictionary alloc] init];
    for (int i = 0; i < audioPropertiesInfos.count; i++) {
        ByteRTCRemoteAudioPropertiesInfo *model = audioPropertiesInfos[i];
        if (model.audioPropertiesInfo.linearVolume > minVolume) {
            [parDic setValue:@(model.audioPropertiesInfo.linearVolume) forKey:model.streamKey.userId];
        }
    }
    if ([self.delegate respondsToSelector:@selector(rtcManager:reportAllAudioVolume:)]) {
        [self.delegate rtcManager:self reportAllAudioVolume:[parDic copy]];
    }
}

- (void)rtcEngine:(ByteRTCVideo * _Nonnull)engine onLocalAudioPropertiesReport:(NSArray<ByteRTCLocalAudioPropertiesInfo *> * _Nonnull)audioPropertiesInfos {
    NSInteger minVolume = 10;
    NSMutableDictionary *parDic = [[NSMutableDictionary alloc] init];
    for (int i = 0; i < audioPropertiesInfos.count; i++) {
        ByteRTCLocalAudioPropertiesInfo *model = audioPropertiesInfos[i];
        if (model.audioPropertiesInfo.linearVolume > minVolume) {
            [parDic setValue:@(model.audioPropertiesInfo.linearVolume) forKey:self.localVideoSession.uid ? self.localVideoSession.uid : @"local"];
        }
    }
    if ([self.delegate respondsToSelector:@selector(rtcManager:reportAllAudioVolume:)]) {
        [self.delegate rtcManager:self reportAllAudioVolume:[parDic copy]];
    }
}

- (void)startScreenSharingWithParam:(ByteRTCScreenCaptureParam *_Nonnull)param mediaType:(ByteRTCScreenMediaType)mediaType preferredExtension:(NSString *)extension groupId:(NSString *)groupId {
    ByteRTCVideoEncoderConfig *screenSolution =[[ByteRTCVideoEncoderConfig alloc] init];
    CGSize videoSize = [EduBCSettingsService getScreenResolution];
    screenSolution.width = videoSize.width;
    screenSolution.height = videoSize.height;
    screenSolution.frameRate = [EduBCSettingsService getScreenFrameRate];
    screenSolution.maxBitrate = [EduBCSettingsService getScreenKBitRate];
    [self.rtcEngineKit setVideoEncoderConfig:@[self.solution,screenSolution]];
    
    // startScreenCapture 后需要在 -onVideoDeviceStateChanged 回调中开启推流 -publishScreen
    [self.rtcEngineKit startScreenCapture:mediaType bundleId:extension];
}

- (void)updateScreenSharingType:(ByteRTCScreenMediaType)mediaType {
    [self.rtcEngineKit updateScreenCapture:mediaType];
}

- (void)stopScreenSharing {
    [self.rtcEngineKit stopScreenCapture];
}

- (void)rtcEngine:(ByteRTCVideo *)engine onAudioRouteChanged:(ByteRTCAudioRoute)device {
    BOOL needToast = FALSE;//self.currentAudioRoute != ByteRTCAudioRouteUnknown && self.currentAudioRoute != device;
    self.currentAudioRoute = device;
    switch (device) {
        case ByteRTCAudioRouteHeadset: {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (needToast) {
                    [[ToastComponent shareToastComponent] showWithMessage:@"切换到耳机"];
                }
            });
            break;
        }
        case ByteRTCAudioRouteSpeakerphone: {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (self.enableSpeaker) {
                    if (needToast) {
                        [[ToastComponent shareToastComponent] showWithMessage:@"切换到扬声器"];
                    }
                } else {
                    [self setEnableSpeakerphone:self.enableSpeaker];
                }
            });
            break;
        }
        case ByteRTCAudioRouteHeadsetBluetooth: {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (needToast) {
                    [[ToastComponent shareToastComponent] showWithMessage:@"切换到蓝牙"];
                }
            });
            break;
        }
        case ByteRTCAudioRouteEarpiece: {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (!self.enableSpeaker) {
                    if (needToast) {
                        [[ToastComponent shareToastComponent] showWithMessage:@"切换到听筒"];
                    }
                } else {
                    [self setEnableSpeakerphone:self.enableSpeaker];
                }
            });
            break;
        }
        case ByteRTCAudioRouteHeadsetUSB: {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (needToast) {
                    [[ToastComponent shareToastComponent] showWithMessage:@"切换到USB设备"];
                }
            });
            break;
        }
        default:
            break;
    }
}

#pragma mark - Private Action

- (void)updateEduBCRoomParamInfoModel {
    if ([self.delegate respondsToSelector:@selector(eduBigClassRTCManager:changeParamInfo:)]) {
        [self.delegate eduBigClassRTCManager:self changeParamInfo:self.paramInfoModel];
    }
}

#pragma mark - getter
- (EduBCRoomParamInfoModel *)paramInfoModel {
    if (!_paramInfoModel) {
        _paramInfoModel = [[EduBCRoomParamInfoModel alloc] init];
    }
    return _paramInfoModel;
}

- (NSMutableDictionary *)subscribeUidDic {
    if (!_subscribeUidDic) {
        _subscribeUidDic = [[NSMutableDictionary alloc] init];
    }
    return _subscribeUidDic;
}

- (NSMutableDictionary *)canvasUidDic {
    if (!_canvasUidDic) {
        _canvasUidDic = [[NSMutableDictionary alloc] init];
    }
    return _canvasUidDic;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
