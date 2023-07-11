// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduRoomModel.h"

@implementation EduRoomModel

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"roomId" : @"room_id",
             @"roomName" : @"room_name",
             @"roomType" : @"room_type",
             @"appId" : @"app_id",
             @"createUserId" : @"create_user_id",
             @"status" : @"status",
             @"createTime" : @"create_time",
             @"updateTime" : @"update_time",
             @"beginClassTime" : @"begin_class_time",
             @"endClassTime" : @"end_class_time",
             @"enableGroupSpeech" : @"enable_group_speech",
             @"enableInteractive" : @"enable_interactive",
             @"beginClassTimeReal" : @"begin_class_time_real",
             @"list" : @"room_child_info",
             @"teacherName" : @"teacher_name",
    };
}

@end
