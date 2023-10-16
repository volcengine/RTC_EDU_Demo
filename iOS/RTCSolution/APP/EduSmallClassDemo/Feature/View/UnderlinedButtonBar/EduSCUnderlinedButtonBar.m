//
//  EduSCUnderlinedButtonBar.m
//  TestAppButton
//
//  Created by admin on 2022/10/15.
//

#import "EduSCUnderlinedButtonBar.h"
#import "Masonry.h"

@interface EduSCUnderlinedButtonBar()

@property (strong, atomic) NSArray *buttons;
@property (strong, atomic) UIButton *currentlySelectedButton;
@property (strong, atomic) UIStackView *stackView;

@property(strong, atomic) UIView *underline;
@property(strong, atomic) UIView *underlineTrack;

@property(nonatomic) UIColor *underlineColor;
@property(nonatomic) UIColor *underlineTrackColor;
@property(nonatomic) CGFloat underlineHeight;
@property(nonatomic) CGFloat underlineMargin;
@property(nonatomic) BOOL animated;

@end

@implementation EduSCUnderlinedButtonBar

- (instancetype)initWithButtons:(NSArray *)buttons width:(CGFloat)width height:(CGFloat)height underlineColor:(UIColor *)underlineColor underlineTrackColor:(UIColor *)underlineTrackColor underlineHeight:(CGFloat)underlineHeight underlineMargin:(CGFloat)underlineMargin backgroundColor:(UIColor *)backgroundColor animated:(BOOL)animated {
    self = [super initWithFrame:CGRectMake(0, 0, width, height)];
    if (self) {
        self.buttons = buttons;
        self.underlineColor = underlineColor;
        self.underlineTrackColor = underlineTrackColor;
        self.backgroundColor = backgroundColor;
        self.underlineHeight = underlineHeight;
        self.underlineMargin = underlineMargin;
        self.animated = animated;
        
        [self constructUI];
    }
    return self;
}

- (void) constructUI {
    self.stackView = [[UIStackView alloc] init];
    self.stackView.alignment = UIStackViewAlignmentCenter;
    self.stackView.distribution = UIStackViewDistributionFillEqually;
    self.stackView.spacing = 10;
    [self.stackView setUserInteractionEnabled:YES];
    [self.stackView setSemanticContentAttribute:UISemanticContentAttributeForceLeftToRight];
    
    for (int index = 0; index < self.buttons.count; index++) {
        if (![self.stackView.arrangedSubviews containsObject:self.buttons[index]]) {
            [self.stackView addArrangedSubview:self.buttons[index]];
        }
    }
    
    self.underlineTrack = [[UIView alloc] init];
    self.underlineTrack.backgroundColor = self.underlineTrackColor;
    
    self.underline = [[UIView alloc] initWithFrame:CGRectZero];
    self.underline.backgroundColor = self.underlineColor;
    self.underline.layer.cornerRadius = 2.f;
    
    __weak typeof(self) wself = self;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        UIButton *button = wself.stackView.arrangedSubviews[0];
        wself.currentlySelectedButton = button;
        CGFloat offSet = CGRectGetMinX(button.frame) + (button.frame.size.width/2 - button.intrinsicContentSize.width/2);
        wself.underline.frame = CGRectMake(offSet + wself.underlineMargin, 0, button.intrinsicContentSize.width - wself.underlineMargin*2, wself.underlineHeight);
    });
    
    [self addSubview:self.stackView];
    [self.stackView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.top.equalTo(self);
        make.bottom.equalTo(self.mas_bottom).offset(-self.underlineHeight);
    }];
    
    [self addSubview:self.underlineTrack];
    [self.underlineTrack mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(CGRectGetWidth(self.frame), self.underlineHeight));
        make.left.equalTo(self.mas_left);
        make.bottom.equalTo(self.mas_bottom);
    }];
    
    [self.underlineTrack addSubview:self.underline];
}

- (void)moveUnderLineTo:(UIButton *)passedButton {
    for (int index = 0; index < self.stackView.arrangedSubviews.count; index++) {
        UIButton *button = self.stackView.arrangedSubviews[index];
        CGFloat offset = CGRectGetMinX(button.frame) + (CGRectGetWidth(button.frame)/2 - button.intrinsicContentSize.width/2);
        if (passedButton == button) {
            self.currentlySelectedButton = button;
            if (self.animated) {
                __weak typeof(self) wself = self;
                [UIView animateWithDuration:0.5 delay:0 usingSpringWithDamping:0.7 initialSpringVelocity:1 options:UIViewAnimationOptionCurveEaseIn animations:^{
                    CGRect frame = wself.underline.frame;
                    frame.size.width = button.intrinsicContentSize.width - wself.underlineMargin*2;
                    frame.origin = CGPointMake(offset + wself.underlineMargin, 0);
                    wself.underline.frame = frame;
                } completion:nil];
            } else {
                CGRect frame = self.underline.frame;
                frame.size.width = button.intrinsicContentSize.width - self.underlineMargin*2;
                frame.origin = CGPointMake(offset + self.underlineMargin, 0);
                self.underline.frame = frame;
            }
        }
    }
}

- (void)resizeTheUnderlineFor:(UIButton *)passedButton {
    for (int index = 0; index < self.stackView.arrangedSubviews.count; index++) {
        UIButton *button = self.stackView.arrangedSubviews[index];
        CGFloat offset = CGRectGetMinX(button.frame) + (CGRectGetWidth(button.frame)/2 - button.intrinsicContentSize.width/2);
        
        if (passedButton == button) {
            if (self.animated) {
                __weak typeof(self) wself = self;
                [UIView animateWithDuration:0.5 delay:0 usingSpringWithDamping:0.7 initialSpringVelocity:1 options:UIViewAnimationOptionCurveEaseIn animations:^{
                    CGRect frame = wself.underline.frame;
                    frame.size.width = button.intrinsicContentSize.width - wself.underlineMargin*2;
                    frame.origin = CGPointMake(offset + wself.underlineMargin, 0);
                    wself.underline.frame = frame;
                } completion:nil];
            } else {
                CGRect frame = self.underline.frame;
                frame.size.width = button.intrinsicContentSize.width - self.underlineMargin*2;
                frame.origin = CGPointMake(offset + self.underlineMargin, 0);
                self.underline.frame = frame;
            }
        }
    }
}

- (int)getIndexOf:(UIButton *)passedButton {
    int this_index = -1;
    for (int index = 0; index < self.stackView.arrangedSubviews.count; index++) {
        UIButton *button = self.stackView.arrangedSubviews[index];
        if (passedButton == button) {
            this_index = index;
            break;
        }
    }
    return this_index;
}

- (CGFloat)getOffsetOf:(UIButton *) passedButton {
    CGFloat this_offset = 0;
    for (int index = 0; index < self.stackView.arrangedSubviews.count; index++) {
        UIButton *button = self.stackView.arrangedSubviews[index];
        CGFloat offset = CGRectGetMinX(button.frame) + (button.frame.size.width/2 - button.intrinsicContentSize.width/2);
        if (passedButton == button) {
            this_offset = offset;
            break;
        }
    }
    return this_offset;
}

- (CGFloat)getOffsetOfFirstButton {
    return [self getOffsetOf:self.buttons[0]];
}

- (CGFloat)getTotalDistance {
    UIButton *firstButton = self.stackView.arrangedSubviews[0];
    UIButton *lastButton = self.stackView.arrangedSubviews[self.stackView.arrangedSubviews.count - 1];
    
    CGFloat firstOffset = CGRectGetMinX(firstButton.frame) + (firstButton.frame.size.width/2 - firstButton.intrinsicContentSize.width/2);
    CGFloat lastOffset = CGRectGetMinX(lastButton.frame) + (lastButton.frame.size.width/2 - lastButton.intrinsicContentSize.width/2);
    
    return (lastOffset - firstOffset);
}

- (UIButton *)getSelectedButton {
    return self.currentlySelectedButton;
}


@end
