//
//  EduBreakoutClassModel.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/8/30.
//  Copyright © 2021 . All rights reserved.
//

#import "EduClassModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBreakoutClassModel : EduClassModel

@property (nonatomic, copy) NSArray<EduUserModel *> *groupUserList;
@property (nonatomic, copy) NSString *groupRtcToken;
@property (nonatomic, copy) NSString *groupRoomId;

@end

NS_ASSUME_NONNULL_END
