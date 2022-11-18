//
//  EduNavViewController.h
//  quickstart
//
//  Created by on 2021/3/22.
//  
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduNavViewController : UIViewController

@property (nonatomic, copy) NSString *navTitle;

@property (nonatomic, strong) UIView *navView;

@property (nonatomic, strong) UIView *bgView;

@property (nonatomic, copy) NSString *rightTitle;

@property (nonatomic, strong) UIImage *rightImage;

- (void)rightButtonAction:(BaseButton *)sender;

@end

NS_ASSUME_NONNULL_END
