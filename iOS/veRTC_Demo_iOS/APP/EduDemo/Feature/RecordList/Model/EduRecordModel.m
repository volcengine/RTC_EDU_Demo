//
//  EduControlRecordModel.m
//  SceneRTCDemo
//
//  Created by on 2021/3/16.
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
