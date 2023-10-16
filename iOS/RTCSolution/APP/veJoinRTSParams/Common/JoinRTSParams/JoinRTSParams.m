//
//  JoinRTSParams.m
//  veRTC_Demo
//
//  Created by on 2021/12/23.
//  
//

#import "JoinRTSParams.h"
#import "NetworkingManager+joinRTSParams.h"

@implementation JoinRTSParams

+ (void)getJoinRTSParams:(JoinRTSInputModel *)inputModel
                   block:(void (^)(JoinRTSParamsModel *model))block {
    [NetworkingManager joinRTS:inputModel
                         block:^(NetworkingResponse * _Nonnull response) {
        if (response.result) {
            __block JoinRTSParamsModel *paramsModel = [JoinRTSParamsModel yy_modelWithJSON:response.response];
            [PublicParameterComponent share].appId = paramsModel.app_id;
            if (block) {
                block(paramsModel);
            }
        } else {
            if (block) {
                block(nil);
            }
        }
    }];
}
                          
+ (NSDictionary *)addTokenToParams:(NSDictionary *)dic {
    NSMutableDictionary *tokenDic = nil;
    if (dic && [dic isKindOfClass:[NSDictionary class]] && dic.count > 0) {
        tokenDic = [dic mutableCopy];
    } else {
        tokenDic = [[NSMutableDictionary alloc] init];
    }
    if (NOEmptyStr([LocalUserComponent userModel].uid)) {
        [tokenDic setValue:[LocalUserComponent userModel].uid
                    forKey:@"user_id"];
    }
    if (NOEmptyStr([LocalUserComponent userModel].loginToken)) {
        [tokenDic setValue:[LocalUserComponent userModel].loginToken
                    forKey:@"login_token"];
    }
    if (NOEmptyStr([PublicParameterComponent share].appId)) {
        [tokenDic setValue:[PublicParameterComponent share].appId
                    forKey:@"app_id"];
    }
    if (NOEmptyStr([PublicParameterComponent share].roomId)) {
        [tokenDic setValue:[PublicParameterComponent share].roomId
                    forKey:@"room_id"];
    }
    
    return [tokenDic copy];
}

@end
