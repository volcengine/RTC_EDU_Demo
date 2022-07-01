//
//  EduClassStudentView.h
//  veRTC_Demo
//
//  Created by bytedance on 2021/7/30.
//  Copyright © 2021 . All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EduUserModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduClassStudentListView : UIView
@property (nonatomic, copy) NSString *roomId;
@property (nonatomic, copy) NSArray *studnetArray;
@property (nonatomic, copy) void (^hideButtonClicked)(void);

- (void)addUser:(EduUserModel *)userModel;

- (void)removeUser:(EduUserModel *)userModel;


@end

NS_ASSUME_NONNULL_END
