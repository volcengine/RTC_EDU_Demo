//
//  EduBCSettingsSliderView.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduBCSettingsSliderView : UIView

@property (nonatomic, copy) void (^clickDismissBlock)(BOOL isCancel, id selectItem);

- (void)show:(CGFloat)minValue maxValue:(CGFloat)maxValue value:(CGFloat)value;

@end

NS_ASSUME_NONNULL_END
