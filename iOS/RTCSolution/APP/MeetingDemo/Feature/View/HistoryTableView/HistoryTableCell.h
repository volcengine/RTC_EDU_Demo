//
//  HistoryTableCell.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>
#import "MeetingControlRecordModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface HistoryTableCell : UITableViewCell

@property (nonatomic, copy) MeetingControlRecordModel *model;

@end

NS_ASSUME_NONNULL_END
