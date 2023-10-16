//
//  NetworkingManager+joinRTSParams.h
//  joinRTSParams
//
//  Created by on 2022/6/8.
//

#import "NetworkingManager.h"
#import "JoinRTSInputModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface NetworkingManager (joinRTSParams)

#pragma mark - RTS


/*
 * Join RTS
 * @param scenes Scenes name
 * @param loginToken Login token
 * @param block Callback
 */
+ (void)joinRTS:(JoinRTSInputModel *)inputModel
          block:(void (^ __nullable)(NetworkingResponse *response))block;


@end

NS_ASSUME_NONNULL_END
