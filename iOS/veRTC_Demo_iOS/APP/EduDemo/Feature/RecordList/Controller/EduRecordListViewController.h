//
//  EduHistoryViewController.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import "EduNavViewController.h"
#import "EduRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduRecordListViewController : EduNavViewController

@property (nonatomic, strong) EduRoomModel *model;

@end

NS_ASSUME_NONNULL_END
