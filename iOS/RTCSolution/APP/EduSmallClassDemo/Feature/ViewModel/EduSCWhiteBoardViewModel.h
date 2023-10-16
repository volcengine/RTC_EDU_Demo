//
//  EduSCWhiteBoardViewModel.h
//  EduSmallClassDemo
//
//  Created by ByteDance on 2023/4/28.
//

#import <Foundation/Foundation.h>
#import "EduSCRoomVideoSession.h"
#import "EduSmallClassControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCWhiteBoardViewModel : NSObject
- (instancetype)initWithVideoSession:(EduSCRoomVideoSession*)session withRoomModel:(EduSmallClassControlRoomModel*)roomModel;
- (void)turnOnMic:(BOOL)on;

@property(nonatomic, strong)EduSCRoomVideoSession *localVideoSession;
@property(nonatomic, strong)EduSmallClassControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
