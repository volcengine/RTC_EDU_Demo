// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduRTCManager.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduRTCManager : BaseRTCManager

#pragma mark - Base Method

@property (nonatomic, copy, nullable) void (^rtcJoinRoomBlock)(NSString *roomId,
                                                               NSInteger errorCode,
                                                               NSInteger joinType);


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
- (void)setupRemoteVideo:(ByteRTCVideoCanvas *)videoCanvas
                     uid:(NSString *)uid;

/*
 * Get whether the current camera is on
 */
- (BOOL)currentCameraState;

@end

NS_ASSUME_NONNULL_END
