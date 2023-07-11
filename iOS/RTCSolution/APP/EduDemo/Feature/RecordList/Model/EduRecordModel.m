// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduRecordModel.h"

@implementation EduRecordModel

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"userId" : @"user_id",
             @"appId" : @"app_id",
             @"roomId" : @"room_id",
             @"roomName" : @"room_name",
             @"recordStatus" : @"record_status",
             @"createTime" : @"create_time",
             @"updateTime" : @"update_time",
             @"recordBeginTime" : @"record_begin_time",
             @"recordEndTime" : @"record_end_time",
             @"vid" : @"vid",
             @"videoURL": @"video_url"
    };
}

@end
