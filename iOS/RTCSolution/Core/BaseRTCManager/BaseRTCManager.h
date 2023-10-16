//
//  BaseRTCManager.h
//  veRTC_Demo
//
//  Created by on 2021/12/16.
//
//

#import <Foundation/Foundation.h>
#import <VolcEngineRTC/objc/ByteRTCVideo.h>
#import <VolcEngineRTC/objc/ByteRTCRoom.h>
#import <YYModel/YYModel.h>
#import "RTMRequestModel.h"
#import "RTMACKModel.h"
#import "RTMNoticeModel.h"
#import "LocalUserComponent.h"
#import "PublicParameterComponent.h"
#import "NetworkingTool.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RTCNetworkProtocol <NSObject>

@optional

- (void)networkTypeChangedToType:(ByteRTCNetworkType)type;

- (void)didStartNetworkMonitoring;

- (void)didStopNetworkMonitoring;

@end

typedef void (^RTCRoomMessageBlock)(RTMNoticeModel *noticeModel);

@interface BaseRTCManager : NSObject <ByteRTCVideoDelegate, ByteRTCRoomDelegate>

@property (nonatomic, strong, nullable) ByteRTCVideo *rtcEngineKit;

@property (nonatomic, strong, nullable) ByteRTCRoom *rtcRoom;

@property (nonatomic, copy, nullable) void (^rtcJoinRoomBlock)(NSString *roomId, NSInteger errorCode, NSInteger joinType);

/// 相同用户进房，被踢下线
@property (nonatomic, copy, nullable) void (^rtcSameUserJoinRoomBlock)(NSString *roomId, NSInteger errorCode);

@property (nonatomic, weak, nullable) id<RTCNetworkProtocol> networkDelegate;

/// 业务标识参数
@property (nonatomic, copy, readonly) NSString *businessId;

/// 开启连接
- (void)connect:(NSString *)appID
       RTSToken:(NSString *)RTMToken
      serverUrl:(NSString *)serverUrl
      serverSig:(NSString *)serverSig
            bid:(NSString *)bid
          block:(void (^)(BOOL result))block;

/// 关闭连接
- (void)disconnect;

/// 接口请求
- (void)emitWithAck:(NSString *)event
               with:(NSDictionary *)item
              block:(__nullable RTCSendServerMessageBlock)block;
           
/// 注册广播监听
- (void)onSceneListener:(NSString *)key
                  block:(RTCRoomMessageBlock)block;

/// 移除广播监听
- (void)offSceneListener;

/// 多房间,用于需要额外房间需求时使用
- (void)joinMultiRoomByToken:(NSString *)token
                    roomID:(NSString *)roomID
                    userID:(NSString *)userID;

/// 多房间,离开房间
- (void)leaveMultiRoom;

/// Get Sdk Version
+ (NSString *_Nullable)getSdkVersion;

#pragma mark - config

/// 父类每次初始化rtcEngineKit时会调用，子类直接覆写实现。
- (void)configeRTCEngine;

@end

NS_ASSUME_NONNULL_END
