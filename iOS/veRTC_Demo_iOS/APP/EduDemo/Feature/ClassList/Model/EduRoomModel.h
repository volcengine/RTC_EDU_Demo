//
//  EduControlRoomModel.h
//  SceneRTCDemo
//
//  Created by bytedance on 2021/3/16.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduRoomModel : NSObject

@property (nonatomic, copy) NSString *roomId;

@property (nonatomic, copy) NSString *roomName;

@property (nonatomic, assign) NSInteger roomType;

@property (nonatomic, copy) NSString *appId;

@property (nonatomic, copy) NSString *createUserId;

@property (nonatomic, assign) NSInteger status;

@property (nonatomic, assign) NSInteger createTime;

@property (nonatomic, assign) NSInteger updateTime;

@property (nonatomic, assign) NSInteger beginClassTime;

@property (nonatomic, assign) NSInteger endClassTime;

@property (nonatomic, assign) NSInteger beginClassTimeReal;

@property (nonatomic, assign) BOOL enableGroupSpeech;

@property (nonatomic, assign) BOOL enableInteractive;

@property (nonatomic, assign) BOOL audioMuteAll;

@property (nonatomic, assign) BOOL videoMuteAll;

@property (nonatomic, copy) NSString *token;

@property (nonatomic, copy) NSString *teacherName;

// ui touch track
@property (nonatomic, assign) BOOL isTrack;

@end

NS_ASSUME_NONNULL_END
