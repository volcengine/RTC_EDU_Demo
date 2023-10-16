//
//  BaseButton.h
//  quickstart
//
//  Created by on 2021/3/24.
//  
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, ButtonStatus) {
    ButtonStatusNone,
    ButtonStatusActive,
    ButtonStatusIng,
    ButtonStatusIllegal,
};

typedef void (^BaseBtnClicked)(id _Nonnull sender);

@interface BaseButton : UIButton

@property (nonatomic, assign) ButtonStatus status;
@property (nonatomic, strong) BaseBtnClicked btnClickBlock;

- (void)bingImage:(UIImage *)image status:(ButtonStatus)status;

@end

NS_ASSUME_NONNULL_END
