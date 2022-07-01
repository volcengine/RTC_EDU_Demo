//
//  EduHistoryTableCell.h
//  quickstart
//
//  Created by bytedance on 2021/3/23.
//  Copyright © 2021 . All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EduRecordModel.h"
NS_ASSUME_NONNULL_BEGIN

@interface EduRecordTableCell : UITableViewCell

@property (nonatomic, strong) EduRecordModel *model;

@end

NS_ASSUME_NONNULL_END
