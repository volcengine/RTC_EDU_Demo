//
//  UnderlinedButtonBar.h
//  TestAppButton
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UnderlinedButtonBar : UIView

- (instancetype)initWithButtons:(NSArray *)buttons width:(CGFloat)width height:(CGFloat)height underlineColor:(UIColor *)underlineColor underlineTrackColor:(UIColor *)underlineTrackColor underlineHeight:(CGFloat)underlineHeight underlineMargin:(CGFloat)underlineMargin backgroundColor:(UIColor *)backgroundColor animated:(BOOL)animated;

- (void)moveUnderLineTo:(UIButton *)passedButton;
- (void)resizeTheUnderlineFor:(UIButton *)passedButton;
- (UIButton *)getSelectedButton;
             
@end

NS_ASSUME_NONNULL_END
