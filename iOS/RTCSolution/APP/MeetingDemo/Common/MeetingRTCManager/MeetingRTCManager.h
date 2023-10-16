
#import "BaseRTCManager.h"
#import <VolcEngineRTC/objc/rtc/ByteRTCDefines.h>
#import "MeetingRTCManager.h"
#import "RoomVideoSession.h"
#import "RoomVideoSession.h"
#import "RoomParamInfoModel.h"

@class MeetingRTCManager;

@protocol MeetingRTCManagerDelegate <NSObject>
- (void)meetingRTCManager:(MeetingRTCManager *_Nullable)rtcManager changeParamInfo:(RoomParamInfoModel *_Nullable)model;
- (void)rtcManager:(MeetingRTCManager * _Nonnull)rtcManager didStreamAdded:(NSString *_Nullable)streamsUid;
- (void)rtcManager:(MeetingRTCManager * _Nonnull)rtcManager didScreenStreamAdded:(NSString *_Nullable)screenStreamsUid;
- (void)rtcManager:(MeetingRTCManager *_Nonnull)rtcManager didStreamRemoved:(NSString *_Nullable)streamsUid;
- (void)rtcManager:(MeetingRTCManager *_Nonnull)rtcManager didScreenStreamRemoved:(NSString *_Nullable)screenStreamsUid;
- (void)rtcManager:(MeetingRTCManager *_Nonnull)rtcManager reportAllAudioVolume:(NSDictionary<NSString *, NSNumber *> *_Nonnull)volumeInfo;
@end

@interface MeetingRTCManager : BaseRTCManager

@property (nonatomic, weak) id<MeetingRTCManagerDelegate> _Nullable delegate;

/*
 * RTC Manager Singletons
 */
+ (MeetingRTCManager *_Nullable)shareRtc;

#pragma mark - Base Method

/**
 * Join room
 * @param videoSession User Model
 */
- (void)joinChannelWithSession:(RoomVideoSession *_Nullable)videoSession token:(NSString *_Nullable)token;

/*
 * Real-time update of video parameters
 */
- (void)updateRtcVideoParams;

/*
 * Switch camera
 */
- (void)switchCamera;

/*
 * Switch audio routing (handset/speaker)
 * @param enableSpeaker ture:Use speakers false：Use the handset
 */
- (int)setEnableSpeakerphone:(BOOL)enableSpeaker;

/*
 * Switch local audio capture
 * @param mute ture:Turn on audio capture false：Turn off audio capture
 */
- (void)enableLocalAudio:(BOOL)enable;

/*
 * Switch local video capture
 * @param mute ture:Open video capture false：Turn off video capture
 */
- (void)enableLocalVideo:(BOOL)enable;

/*
 * Leave the room
 */
- (void)leaveChannel;

/*
 * Open preview
 @param view View
 */
- (void)startPreview:(UIView *_Nullable)view;

- (void)resetPreview:(UIView *_Nullable)view;

#pragma mark - Subscribe Stream

/*
 * Subscribe to the video stream
 @param uid User ID
 */
- (void)subscribeStream:(NSString *_Nullable)uid video:(BOOL)subVideo;

/*
 * Subscribe to screen stream
 @param uid User ID
 */
- (void)subscribeScreenStream:(NSString *_Nullable)uid;

/*
 * Unsubscribe video stream
 @param uid User ID
 */
- (void)unsubscribe:(NSString *_Nullable)uid;

/*
 * Unsubscribe from screen stream
 @param uid User ID
 */
- (void)unsubscribeScreen:(NSString *_Nullable)uid;

/*
 * Remote render view and uid binding
 @param canvas Canvas Model
 */
- (void)setupRemoteVideo:(ByteRTCVideoCanvas *_Nullable)canvas uid:(NSString *_Nullable)uid;;

/*
 * Local render view and uid binding
 @param canvas Canvas Model
 */
- (void)setupLocalVideo:(ByteRTCVideoCanvas *_Nullable)canvas uid:(NSString *_Nullable)uid;

#pragma mark - Screen

/*
 * Screen render view and uid binding
 * @param view View
 * @param uid User ID
 */
- (void)setupRemoteScreen:(UIView *_Nullable)view uid:(NSString *_Nullable)uid;


/*
 * Turn on screen sharing
 * @param param Param data
 * @param extension Extension Bunle ID
 * @param groupId Group ID
 */
- (void)startScreenSharingWithParam:(ByteRTCScreenCaptureParam *_Nonnull)param mediaType:(ByteRTCScreenMediaType)mediaType preferredExtension:(NSString *_Nullable)extension groupId:(NSString *_Nonnull)groupId;

/*
* update screen sharing media type
*/
- (void)updateScreenSharingType:(ByteRTCScreenMediaType)mediaType;

/*
 * Turn off screen sharing
 */
- (void)stopScreenSharing;


/*
 * Get current subscription Uid
 * @return subscription Uid
 */
- (NSDictionary *_Nullable)getSubscribeUidDic;

@end
