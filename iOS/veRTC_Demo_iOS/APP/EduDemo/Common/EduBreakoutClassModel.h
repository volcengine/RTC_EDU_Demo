//
//  EduBreakoutClassModel.h
//  veRTC_Demo
//
//  Created by on 2021/8/30.
//  
//

#import "EduClassModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBreakoutClassModel : EduClassModel

@property (nonatomic, copy) NSArray<EduUserModel *> *groupUserList;
@property (nonatomic, copy) NSString *groupRtcToken;
@property (nonatomic, copy) NSString *groupRoomId;

@end

NS_ASSUME_NONNULL_END
