//
//  EduClassTitleView.h
//  veRTC_Demo
//
//  Created by on 2021/7/28.
//  
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduClassTitleView : UIView
@property (nonatomic, copy) NSString *classTitle;
@property (nonatomic, copy) NSString *classID;
@property (nonatomic, assign) NSInteger recordTime;
@property (nonatomic, assign) BOOL inClass;
@end

NS_ASSUME_NONNULL_END
