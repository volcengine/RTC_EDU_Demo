//
//  EduBCWhiteBoardViewModel.h
//  EduBigClassDemo
//
//  Created by ByteDance on 2023/4/28.
//

#import <Foundation/Foundation.h>
#import "EduBCRoomVideoSession.h"
#import "EduBigClassControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCWhiteBoardViewModel : NSObject
- (instancetype)initWithVideoSession:(EduBCRoomVideoSession*)session withRoomModel:(EduBigClassControlRoomModel*)roomModel;

@property(nonatomic, strong)EduBCRoomVideoSession *localVideoSession;
@property(nonatomic, strong)EduBigClassControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
