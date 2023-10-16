//
//  JoinRTSParamsModel.h
//  JoinRTSParams
//
//  Created by on 2022/7/15.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface JoinRTSParamsModel : NSObject

@property (nonatomic, copy) NSString *app_id;

@property (nonatomic, copy) NSString *rts_token;

@property (nonatomic, copy) NSString *server_url;

@property (nonatomic, copy) NSString *server_signature;

@property (nonatomic, copy) NSString *bid;

@end

NS_ASSUME_NONNULL_END
