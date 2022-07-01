//
//  EduClassModel.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/8/30.
//  Copyright © 2021 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "EduRoomModel.h"
#import "EduUserModel.h"
#import "EduControlAckModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduClassModel : NSObject
- (instancetype)initWithDic:(NSDictionary *)ackModel;

@property (nonatomic, strong) EduRoomModel *roomModel;
@property (nonatomic, strong) EduUserModel *teacherUserModel;
@property (nonatomic, assign) BOOL selfMicOn;
@property (nonatomic, copy) NSArray<EduUserModel *> *micUserList;
@property (nonatomic, copy)   NSString *token;
@property (nonatomic, strong) EduControlAckModel *ackModel;
@end

NS_ASSUME_NONNULL_END
