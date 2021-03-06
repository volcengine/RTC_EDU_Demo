//
//  EduControlRecordModel.h
//  SceneRTCDemo
//
//  Created by bytedance on 2021/3/16.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduRecordModel : NSObject

@property (nonatomic, copy) NSString *userId;

@property (nonatomic, copy) NSString *appId;

@property (nonatomic, copy) NSString *roomId;

@property (nonatomic, copy) NSString *roomName;

@property (nonatomic, assign) NSInteger recordStatus;

@property (nonatomic, assign) NSInteger createTime;

@property (nonatomic, assign) NSInteger updateTime;

@property (nonatomic, assign) NSInteger recordBeginTime;

@property (nonatomic, assign) NSInteger recordEndTime;

@property (nonatomic, copy) NSString *vid;

@property (nonatomic, copy) NSString *videoURL;
@end

NS_ASSUME_NONNULL_END
