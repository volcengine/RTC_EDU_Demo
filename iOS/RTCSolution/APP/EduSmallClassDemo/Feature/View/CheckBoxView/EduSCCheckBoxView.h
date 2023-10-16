//
//  EduSCCheckBoxView.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN


@interface EduSCCheckBoxView : UIView

- (instancetype)initWithTitle:(NSString *)title font:(UIFont *)font checked:(BOOL)checked action:(void (^)(BOOL))block;

- (BOOL)isChecked;

@end

NS_ASSUME_NONNULL_END
