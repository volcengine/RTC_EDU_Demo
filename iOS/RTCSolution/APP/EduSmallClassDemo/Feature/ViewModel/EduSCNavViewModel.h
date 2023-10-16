//
//  EduSCNavViewModel.h
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/31.
//

#import <Foundation/Foundation.h>
#import "EduSCRoomVideoSession.h"
#import "EduSmallClassControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCNavViewModel : NSObject

- (instancetype)initWithVideoSession:(EduSCRoomVideoSession*)session withRoomModel:(nonnull EduSmallClassControlRoomModel *)roomModel;

@property(nonatomic, strong)EduSCRoomVideoSession *localVideoSession;
@property(nonatomic, strong)EduSmallClassControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
