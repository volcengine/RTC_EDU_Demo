// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduClassModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBreakoutClassModel : EduClassModel

@property (nonatomic, copy) NSArray<EduUserModel *> *groupUserList;
@property (nonatomic, copy) NSString *groupRtcToken;
@property (nonatomic, copy) NSString *groupRoomId;

@end

NS_ASSUME_NONNULL_END
