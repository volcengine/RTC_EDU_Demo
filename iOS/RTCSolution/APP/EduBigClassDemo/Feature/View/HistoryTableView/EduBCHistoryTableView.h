//
//  EduBCHistoryTableView.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>
#import "EduBCHistoryTableCell.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCHistoryTableView : UIView

@property (nonatomic, assign) BOOL isDelete;

@property (nonatomic, copy) NSArray *dataLists;

@end

NS_ASSUME_NONNULL_END
