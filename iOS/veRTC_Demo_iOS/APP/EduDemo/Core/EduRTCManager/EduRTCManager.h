#import "EduRTCManager.h"
#import <VolcEngineRTC/objc/rtc/ByteRTCDefines.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduRTCManager : BaseRTCManager

#pragma mark - Base Method

/**
 * Join room
 * @param token token
 * @param roomID roomID
 * @param uid uid
 */
- (void)joinChannelWithToken:(NSString *)token roomID:(NSString *)roomID uid:(NSString *)uid;

/*
 * Switch local audio capture
 * @param enable ture:Turn on audio capture false：Turn off audio capture
 */
- (void)enableLectureLocalAudio:(BOOL)enable;

/*
 * Switch local audio capture
 * @param mute ture:Turn on audio capture false：Turn off audio capture
 */
- (void)muteLocalAudio:(BOOL)mute;

/*
 * Switch audioInteract
 * @param enable ture:Turn on audioInteract false：Turn off audioInteract
 */
- (void)enableAudioInteract:(BOOL)enable;

/*
 * Switch videoInteract
 * @param enable ture:Turn on videoInteract false：Turn off videoInteract
 */
- (void)enableVideoInteract:(BOOL)enable;
/*
 * Leave the room
 */
- (void)leaveLectureChannel;

/*
 * destroy
 */
- (void)destroy;

/*
 * get Sdk Version
 */
- (NSString *_Nullable)getSdkVersion;

/*
 * Bind remote users and display views
 * @param videoCanvas Video attributes
 */
- (void)setupRemoteVideo:(ByteRTCVideoCanvas *_Nullable)videoCanvas;

/*
 * Get whether the current camera is on
 */
- (BOOL)currentCameraState;

@end

NS_ASSUME_NONNULL_END
