//
//  PopupManager.h
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/16.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^popupManagerCallback)(BOOL result);

@interface EduBCPermitManager : NSObject

#pragma mark - Mic
+ (void)enableMicRequestWithUid:(NSString*)uid block:(nullable popupManagerCallback)block;
+ (void)enableMic:(BOOL)enable;
+ (void)recieveMicAccept:(BOOL)accepted;
+ (void)recieveMicInvite:(BOOL)unmute curMicUnmute:(BOOL)curIsUnmute;
+ (void)recieveMicRequest:(NSString*)uid name:(NSString*)name block:(nullable popupManagerCallback)block;
+ (void)recieveMicRequestWithCount:(int)count block:(nullable popupManagerCallback)block;

#pragma mark - Camera
+ (void)enableCameraRequestWithUid:(NSString*)uid block:(nullable popupManagerCallback)block;
+ (void)enableCamera:(BOOL)enable;
+ (void)recieveCameraAccept:(BOOL)accepted;
+ (void)recieveCameraInvite:(BOOL)unmute curMicUnmute:(BOOL)curIsUnmute;
+ (void)recieveCameraRequest:(NSString*)uid name:(NSString*)name block:(nullable popupManagerCallback)block;


#pragma mark - Share
+ (void)startShareRequestWithUid:(NSString*)uid block:(nullable popupManagerCallback)block;
+ (void)recieveShareAccept:(BOOL)accepted;
+ (void)recieveShareUpdate:(BOOL)accepted;
+ (void)recieveShareStatus:(BOOL)isShare name:(nullable NSString*)name type:(int)type;
+ (void)recieveShareRequest:(NSString*)uid name:(NSString*)name block:(nullable popupManagerCallback)block;
+ (void)recieveShareRequestWithCount:(int)count block:(nullable popupManagerCallback)block;

#pragma mark - Record
+ (void)stopRecord:(nullable popupManagerCallback)block;
+ (void)startRecord:(nullable popupManagerCallback)block;
+ (void)startRecordRequest;
+ (void)recieveRecordStatus:(BOOL)isRecord;
+ (void)recieveRecordRequest:(NSString*)uid name:(NSString*)name block:(nullable popupManagerCallback)block;
+ (void)recieveRecordAccept:(bool)accepted;

#pragma mark - Host OP
+ (void)muteAllUser;
+ (void)forceTurnOnOffMicOfUser:(BOOL)on uid:(NSString*)uid;
+ (void)forceTurnOnOffCamOfUser:(BOOL)on uid:(NSString*)uid;
+ (void)forceTurnOnOffShareOfUser:(BOOL)on uid:(NSString*)uid;
@end

NS_ASSUME_NONNULL_END
