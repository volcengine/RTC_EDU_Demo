//
//  JoinRTSParamsModel.m
//  JoinRTSParams
//
//  Created by on 2022/7/15.
//

#import "JoinRTSParamsModel.h"

@implementation JoinRTSParamsModel

+ (NSDictionary *)modelCustomPropertyMapper {
    return @{@"appId" : @"app_id",
             @"RTSToken" : @"rts_token",
             @"serverUrl" : @"server_url",
             @"serverSignature" : @"server_signature",
             @"bid" : @"bid"
    };
}

@end
