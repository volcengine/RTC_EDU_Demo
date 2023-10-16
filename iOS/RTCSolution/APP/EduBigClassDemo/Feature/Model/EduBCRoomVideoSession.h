//
//  EduBCRoomVideoSession.h
//  quickstart
//
//  Created by on 2021/4/2.
//  
//

#import <Foundation/Foundation.h>
#import "EduBigClassControlUserModel.h"

typedef NS_ENUM(NSInteger, LinkMicMode) {
    // none for default
    LinkMicModeNone,
    // 连接中
    LinkMicModeLinking,
    // 正在上麦
    LinkMicModeDone
};

static const NSInteger MaxAvatarNumber = 6;

@interface EduBCRoomVideoSession : NSObject

@property (nonatomic, copy) NSString *uid;
@property (nonatomic, copy) NSString *name;
@property (nonatomic, copy) NSString *userUniform;
@property (nonatomic, copy) NSString *roomId;
@property (nonatomic, assign) BOOL isSharingScreen;
@property (nonatomic, assign) BOOL isSharingWhiteBoard;
@property (nonatomic, assign) BOOL isLoginUser;
@property (nonatomic, assign) BOOL isHost;
@property (nonatomic, assign) BOOL isSlient;
@property (nonatomic, assign) BOOL isEnableVideo;
@property (nonatomic, assign) BOOL isEnableAudio;
@property (nonatomic, assign) BOOL hasSharePermission;
@property (nonatomic, assign) BOOL hasOperatePermission;
@property (nonatomic, assign) BOOL isVisible;
@property (nonatomic, assign) BOOL isUpdated;
@property (nonatomic, assign) BOOL isPublished;
@property (nonatomic, assign) BOOL isPublishedScreen;
@property (nonatomic, assign) BOOL isRequestMic;
@property (nonatomic, assign) BOOL isRequestShare;
@property (nonatomic, assign) LinkMicMode linkMicStatus;
@property (nonatomic, strong) UIView *videoView;
@property (nonatomic, strong) UIView *screenView;
@property (nonatomic, assign) NSUInteger volume;
@property (nonatomic, copy) NSString *appid;
@property (nonatomic, assign) BOOL showOperationView;

/*
 * Sorting rules: the host ranks first, himself ranks second,
 and then is sorted by volume, and the rest is sorted by user joining time
 */
@property (nonatomic, assign) NSInteger rankeFactor;

/*
 * Max volume user
 */
@property (nonatomic, assign) BOOL isMaxVolume;

- (instancetype)initWithUid:(NSString *)uid;

- (BOOL)isEqualToSession:(EduBCRoomVideoSession *)session;

+ (EduBCRoomVideoSession *)constructWithEduBigClassControlUserModel:(EduBigClassControlUserModel *)EduBigClassControlUserModel;

@end

