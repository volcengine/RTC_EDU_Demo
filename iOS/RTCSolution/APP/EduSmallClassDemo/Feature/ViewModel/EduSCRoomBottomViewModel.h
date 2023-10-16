//
//  EduSCRoomBottomViewModel.h
//  EduSmallClassDemo
//
//  Created by guojian on 2023/1/15.
//

#import <Foundation/Foundation.h>
#import "EduSCRoomVideoSession.h"
#import "EduSmallClassControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCRoomBottomViewModel : NSObject

- (instancetype)initWithVideoSession:(EduSCRoomVideoSession*)session withRoomModel:(EduSmallClassControlRoomModel*)roomModel;
- (void)turnOnMic:(BOOL)on;
- (void)turnOnCamera:(BOOL)on;
- (void)requestSharePermission;
- (void)startRecord;
- (void)stopRecord;

@property(nonatomic, strong)EduSCRoomVideoSession *localVideoSession;
@property(nonatomic, strong)EduSmallClassControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
