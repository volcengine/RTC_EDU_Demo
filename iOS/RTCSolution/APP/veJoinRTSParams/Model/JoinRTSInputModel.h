//
//  JoinRTSInputModel.h
//  JoinRTSParams
//
//  Created by on 2022/7/15.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface JoinRTSInputModel : NSObject

@property (nonatomic, copy) NSString *loginToken;

@property (nonatomic, copy) NSString *appId;

@property (nonatomic, copy) NSString *appKey;

@property (nonatomic, copy) NSString *volcAccountKey;

@property (nonatomic, copy) NSString *volcSecretKey;

@property (nonatomic, copy) NSString *volcAccountID;

@property (nonatomic, copy) NSString *tosBucket;

@property (nonatomic, copy) NSString *scenesName;

@end

NS_ASSUME_NONNULL_END
