//
//  EduSCCheckBoxView.m
//
//  Created by admin on 2022/10/15.
//

#import "EduSCCheckBoxView.h"
#import "Masonry.h"

@interface EduSCCheckBoxView()

@property (nonatomic, strong) UIStackView *stackView;
@property (nonatomic, strong) UILabel *label;
@property (nonatomic, strong) UIImageView *icon;

@property (nonatomic, copy) NSString *titleString;
@property (nonatomic, strong) UIFont *titleFont;
@property (nonatomic, assign) CGFloat iconWidth;

@property (nonatomic, assign) BOOL checked;
@property (nonatomic, copy) void (^onChecked)(BOOL result);

@end

@implementation EduSCCheckBoxView

- (instancetype)initWithTitle:(NSString *)title font:(UIFont *)font checked:(BOOL)checked action:(void (^)(BOOL))block {
    if (self = [super init]) {
        self.titleString = title;
        self.titleFont = font;
        self.checked = checked;
        self.onChecked = block;
        [self constructUI];
    }
    return self;
}

- (void)constructUI {
    [self addSubview:self.stackView];
    [self.stackView addSubview:self.label];
    [self.stackView addSubview:self.icon];
    self.iconWidth = 18.0;
    
    [self.stackView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self);
    }];
    
    [self.label mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(160.f, self.iconWidth));
    }];
    
    [self.icon mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(self.iconWidth, self.iconWidth));
        make.centerY.equalTo(self.label);
        make.left.mas_equalTo(self.label.mas_right);
    }];
    
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(tapClick:)];
    [self addGestureRecognizer:tap];
}

- (BOOL)isChecked {
    return self.checked;
}

- (void)tapClick:(UIGestureRecognizer *)tap {
    self.checked = !self.checked;
    [self.icon setImage:[ThemeManager imageNamed:self.checked ? @"meeting_checkbox_checked" : @"meeting_checkbox_unchecked"]];
    if (self.onChecked) {
        self.onChecked(self.checked);
    }
}

- (UIStackView *)stackView {
    if (!_stackView) {
        _stackView = [[UIStackView alloc] init];
        _stackView.spacing = 4.f;
    }
    return _stackView;
}

- (UIImageView *)icon {
    if (_icon == nil) {
        _icon = [[UIImageView alloc] init];
        [_icon setImage:[ThemeManager imageNamed:self.checked ? @"meeting_checkbox_checked" : @"meeting_checkbox_unchecked"]];
    }
    return _icon;
}

- (UILabel *)label {
    if (_label == nil) {
        _label = [[UILabel alloc] init];
        if (self.titleFont) {
            _label.font = self.titleFont;
        }
        [_label setTextColor:[UIColor blackColor]];
        [_label setText:self.titleString];
    }
    return _label;
}

@end
