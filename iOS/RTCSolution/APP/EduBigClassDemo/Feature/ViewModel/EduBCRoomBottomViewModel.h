//
//  EduBCRoomBottomViewModel.h
//  EduBigClassDemo
//
//  Created by guojian on 2023/1/15.
//

#import <Foundation/Foundation.h>
#import "EduBCRoomVideoSession.h"
#import "EduBigClassControlRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCRoomBottomViewModel : NSObject

- (instancetype)initWithVideoSession:(EduBCRoomVideoSession*)session withRoomModel:(EduBigClassControlRoomModel*)roomModel;
- (void)turnOnMic:(BOOL)on;
- (void)turnOnCamera:(BOOL)on;
- (void)requestSharePermission;
- (void)startRecord;
- (void)stopRecord;

@property(nonatomic, strong)EduBCRoomVideoSession *localVideoSession;
@property(nonatomic, strong)EduBigClassControlRoomModel *roomModel;
@end

NS_ASSUME_NONNULL_END
