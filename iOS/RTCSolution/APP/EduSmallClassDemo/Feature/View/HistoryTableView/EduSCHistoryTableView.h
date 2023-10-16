//
//  EduSCHistoryTableView.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>
#import "EduSCHistoryTableCell.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCHistoryTableView : UIView

@property (nonatomic, assign) BOOL isDelete;

@property (nonatomic, copy) NSArray *dataLists;

@end

NS_ASSUME_NONNULL_END
