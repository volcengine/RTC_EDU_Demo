//
//  NetworkingManager+joinRTSParams.m
//  joinRTSParams
//
//  Created by on 2022/6/8.
//

#import "NetworkingManager+joinRTSParams.h"
#import <Core/BuildConfig.h>

@implementation NetworkingManager (joinRTSParams)

+ (void)joinRTS:(JoinRTSInputModel *)inputModel
          block:(void (^ __nullable)(NetworkingResponse *response))block {
    NSDictionary *content = @{@"login_token" : inputModel.loginToken ?: @"",
                              @"app_id" : inputModel.appId ?: @"",
                              @"app_key" : inputModel.appKey ?: @"",
                              @"volc_ak" : inputModel.volcAccountKey ?: @"",
                              @"volc_sk" : inputModel.volcSecretKey ?: @"",
                              @"account_id" : inputModel.volcAccountID ?: @"",
                              @"tos_bucket" : inputModel.tosBucket ?: @"",
                              @"scenes_name" : inputModel.scenesName ?: @""};
    
    [self postWithEventName:JoinRTSEvent
                    content:content
                      block:block];
}

@end
