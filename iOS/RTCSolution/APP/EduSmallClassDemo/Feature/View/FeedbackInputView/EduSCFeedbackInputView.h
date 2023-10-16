//
//  EduSCFeedbackInputView.h
//  quickstart
//
//  Created by on 2021/3/25.
//  
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduSCFeedbackInputView : UIView

@property (nonatomic, strong) NSString *text;

@property (nonatomic, strong) UIFont *font;

@property (nonatomic, strong) UIColor *textColor;

- (void)resignFirstResponder;

@end

NS_ASSUME_NONNULL_END
