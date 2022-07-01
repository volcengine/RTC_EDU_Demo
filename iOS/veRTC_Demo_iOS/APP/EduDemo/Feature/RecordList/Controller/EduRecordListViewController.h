//
//  EduHistoryViewController.h
//  quickstart
//
//  Created by bytedance on 2021/3/23.
//  Copyright © 2021 . All rights reserved.
//

#import "EduNavViewController.h"
#import "EduRoomModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduRecordListViewController : EduNavViewController

@property (nonatomic, strong) EduRoomModel *model;

@end

NS_ASSUME_NONNULL_END
