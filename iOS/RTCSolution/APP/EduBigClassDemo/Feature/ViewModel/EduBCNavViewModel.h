//
//  EduBCNavViewModel.h
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/31.
//

#import <Foundation/Foundation.h>
#import "EduBCRoomVideoSession.h"
#import "EduBigClassControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCNavViewModel : NSObject

- (instancetype)initWithVideoSession:(EduBCRoomVideoSession*)session withRoomModel:(nonnull EduBigClassControlRoomModel *)roomModel;

@property(nonatomic, strong)EduBCRoomVideoSession *localVideoSession;
@property(nonatomic, strong)EduBigClassControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
