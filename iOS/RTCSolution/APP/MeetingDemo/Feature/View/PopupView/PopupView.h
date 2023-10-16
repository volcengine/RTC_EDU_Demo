//
//  PopupView.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^ButtonClick)(id sender, int result);

@interface PopupView : UIView

@property (nonatomic, strong)UIColor *cancelColor;
@property (nonatomic, strong)UIColor *confirmColor;
@property (nonatomic, strong)UIColor *titleColor;

@property (nonatomic, strong)UIColor *contentFgColor;
@property (nonatomic, strong)UIColor *contentBgColor;
@property (nonatomic, strong)UIColor *maskBgColor;
@property (nonatomic, strong)UIColor *lineColor;

@property (nonatomic, strong)UIFont *actionFont;
@property (nonatomic, strong)UIFont *titleFont;
@property (nonatomic, strong)UIFont *contentFont;

- (instancetype)initWithTitle:(nullable NSString *)title
                      content:(nullable NSString *)content
                      cancel:(nullable NSString *)cancelTitle
                     confirm:(nullable NSString *)confirmTitle
                 cancelClick:(ButtonClick)cancelClick
                confirmClick:(ButtonClick)confirmClick;

- (instancetype)initWithTitle:(nullable NSString *)title
                      buttons:(NSArray *)buttonList
                      buttonClick:(ButtonClick)buttonClick;

- (instancetype)initWithCheckBox:(nullable NSString *)title
                      content:(nullable NSString *)content
                         checked:(BOOL)isChecked
                      cancel:(nullable NSString *)cancelTitle
                     confirm:(nullable NSString *)confirmTitle
                 cancelClick:(ButtonClick)cancelClick
                confirmClick:(ButtonClick)confirmClick;

- (instancetype)initWithCustomView:(nullable NSString *)title
                      content:(UIView *)customView
                      cancel:(nullable NSString *)cancelTitle
                     confirm:(nullable NSString *)confirmTitle
                 cancelClick:(ButtonClick)cancelClick
                confirmClick:(ButtonClick)confirmClick;

- (void)show;

@end

NS_ASSUME_NONNULL_END
