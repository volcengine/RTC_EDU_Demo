//
//  EduUserModel.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/5/28.
//  Copyright © 2021 . All rights reserved.
//

#import "BaseUserModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, EduUserRoomType) {
    EduUserRoomTypeLeature,
    EduUserRoomTypeBreakoutHost,
    EduUserRoomTypeBreakoutGroup
};

@interface EduUserModel : BaseUserModel

- (instancetype)initWithUid:(NSString *)uid;

@property (nonatomic, copy) NSString *appId;

@property (nonatomic, copy) NSString *roomId;

@property (nonatomic, copy) NSString *userRole;

@property (nonatomic, copy) NSString *userStatus;

@property (nonatomic, copy) NSString *createTime;

@property (nonatomic, copy) NSString *updateTime;

@property (nonatomic, copy) NSString *joinTime;

@property (nonatomic, copy) NSString *leaveTime;

@property (nonatomic, assign) BOOL isMicOn;

@property (nonatomic, assign) BOOL isCameraOn;

@property (nonatomic, assign) BOOL isHandsUp;

@property (nonatomic, assign) BOOL groupSpeechJoinRtc;

@property (nonatomic, copy) NSString *rtcToken;

@property (nonatomic, strong) UIView *streamView;

@property (nonatomic, strong) ByteRTCVideoCanvas *canvas;

@property (nonatomic, assign) BOOL isSelf;

@property (nonatomic, assign) BOOL isVideoStream;

// ui touch track
@property (nonatomic, assign) BOOL isTrack;

@property (nonatomic, assign) EduUserRoomType roomType;
@end

NS_ASSUME_NONNULL_END
