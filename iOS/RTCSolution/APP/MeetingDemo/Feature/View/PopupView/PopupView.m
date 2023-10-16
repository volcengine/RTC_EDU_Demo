//
//  PopupView.m
//
//  Created by admin on 2022/10/15.
//

#import "PopupView.h"
#import "CheckBoxView.h"
#import "Masonry.h"

#define kPopupViewLineSize       1

#define kPopupViewWidth          300
#define kPopupViewHeight         160

#define kPopupViewHSpace         40.f
#define kPopupViewBtnHeight      44.f
#define kPopupViewFontSize       15.f

enum {
    kPopupViewStyleNormal = 0,
    kPopupViewStyleCheckbox,
    kPopupViewStyleActionSheet,
    kPopupViewStyleCustomView,
};

@interface PopupView()

@property (nonatomic, assign) int style;

@property (nonatomic, copy) NSString *titleString;
@property (nonatomic, copy) NSString *contentString;
@property (nonatomic, copy) NSString *cancelString;
@property (nonatomic, copy) NSString *confirmString;

@property (nonatomic, copy) ButtonClick cancelClick;
@property (nonatomic, copy) ButtonClick confirmClick;

@property (nonatomic, strong) UIView *blackBgV;
@property (nonatomic, strong) UIView *alertV;
@property (nonatomic, strong) UILabel *titleLabel;

@property (nonatomic, strong) UIView *customView;
@property (nonatomic, assign) BOOL isChecked;

@end

@implementation PopupView

- (instancetype)initWithTitle:(nullable NSString *)title content:(nullable NSString *)content cancel:(nullable NSString *)cancelTitle confirm:(nullable NSString *)confirmTitle cancelClick:(ButtonClick)cancelClick confirmClick:(ButtonClick)confirmClick {
    if (self = [super init]) {
        self.style = kPopupViewStyleNormal;
        self.titleString = title;
        self.contentString = content;
        self.cancelString = cancelTitle;
        self.confirmString = confirmTitle;
        self.cancelClick = cancelClick;
        self.confirmClick = confirmClick;
    }
    return self;
}

- (instancetype)initWithTitle:(nullable NSString *)title
                      buttons:(NSArray *)buttonList
                  buttonClick:(ButtonClick)buttonClick {
    if (self = [super init]) {
        self.titleString = title;
    }
    return self;
}

- (instancetype)initWithCheckBox:(nullable NSString *)title
                      content:(nullable NSString *)content
                      checked:(BOOL)isChecked
                      cancel:(nullable NSString *)cancelTitle
                     confirm:(nullable NSString *)confirmTitle
                 cancelClick:(ButtonClick)cancelClick
                    confirmClick:(ButtonClick)confirmClick {
    if (self = [super init]) {
        self.style = kPopupViewStyleCheckbox;
        self.titleString = title;
        self.contentString = content;
        self.cancelString = cancelTitle;
        self.confirmString = confirmTitle;
        self.cancelClick = cancelClick;
        self.confirmClick = confirmClick;
        self.isChecked = isChecked;
    }
    return self;
}

- (instancetype)initWithCustomView:(nullable NSString *)title
                      content:(UIView *)customView
                      cancel:(nullable NSString *)cancelTitle
                     confirm:(nullable NSString *)confirmTitle
                 cancelClick:(ButtonClick)cancelClick
                      confirmClick:(ButtonClick)confirmClick {
    if (self = [super init]) {
        self.titleString = title;
        self.customView = customView;
    }
    return self;
}

- (void)show {
    [self installSubViews:[self createContentView]];
    [[UIApplication sharedApplication].keyWindow addSubview:self];
    self.hidden = NO;
    [UIView animateWithDuration:0.3 animations:^{
        self.alertV.alpha = 1;
        self.blackBgV.alpha = 0.5;
    } completion:^(BOOL finished) {
        
    }];
}

- (void)hidden {
    __block typeof(self) weakSelf = self;
    [UIView animateWithDuration:0.3 animations:^{
        self.alertV.alpha = 0;
        self.blackBgV.alpha = 0;
    } completion:^(BOOL finished) {
        weakSelf.hidden = YES;
        [weakSelf removeFromSuperview];
    }];
}

- (void)installSubViews:(UIView *)contentView {
    self.frame = [UIScreen mainScreen].bounds;
    
    [self addSubview:self.blackBgV];
    [self.blackBgV mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self);
    }];
    
    [self addSubview:self.alertV];
    
    self.titleLabel = [self createLabel:self.titleString withFont:self.titleFont ? self.titleFont : [UIFont boldSystemFontOfSize:kPopupViewFontSize+1] andColor:self.titleColor];
    [self.alertV addSubview:self.titleLabel];
    
    CGFloat popupViewHeight = kPopupViewHeight;
    if (contentView.height > kPopupViewFontSize * 2) {
        popupViewHeight = kPopupViewHeight + contentView.height - kPopupViewFontSize * 2;
    }
    
    [self.alertV mas_makeConstraints:^(MASConstraintMaker *make) {
        make.size.mas_equalTo(CGSizeMake(kPopupViewWidth, popupViewHeight));
        make.center.mas_equalTo(self.blackBgV);
    }];
    [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.width.equalTo(self.alertV);
        make.height.mas_equalTo([self.titleLabel.font lineHeight]);
        if (contentView) {
            make.top.mas_equalTo(self.alertV.mas_top).offset(kPopupViewHSpace/2);
        } else {
            make.top.mas_equalTo(self.alertV.mas_top).offset(kPopupViewHSpace);
        }
    }];
    
    if (contentView) {
        [self.alertV addSubview:contentView];
        [contentView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self.titleLabel.mas_left).offset(kPopupViewHSpace);
            make.width.mas_equalTo(self.alertV.mas_width).offset(-kPopupViewHSpace);
            make.height.mas_equalTo(contentView.height + kPopupViewFontSize);
            if (self.titleString) {
                make.top.mas_equalTo(self.titleLabel.mas_top).offset(kPopupViewHSpace);
            } else {
                make.top.mas_equalTo(self.alertV.mas_top).offset(kPopupViewHSpace);
            }
        }];
    }
    
    int btnCount = 0;
    if (self.cancelString.length > 0) {
        btnCount++;
    }
    
    if (self.confirmString.length > 0) {
        btnCount++;
    }
    
    UIView *hLine = nil;
    if (btnCount > 0) {
        hLine = [self createLine:self.lineColor];
        [self.alertV addSubview:hLine];
        [hLine mas_makeConstraints:^(MASConstraintMaker *make) {
            make.width.equalTo(self.alertV);
            make.height.mas_equalTo(kPopupViewLineSize);
            make.bottom.mas_equalTo(self.alertV.mas_bottom).offset(-kPopupViewBtnHeight);
        }];
    }
    
    if (btnCount == 2) {
        UIView *vLine = [self createLine:self.lineColor];
        [self.alertV addSubview:vLine];
        [vLine mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self.alertV.mas_centerX).offset(-kPopupViewLineSize/2);
            make.width.mas_equalTo(kPopupViewLineSize);
            make.top.mas_equalTo(hLine.mas_bottom);
            make.bottom.mas_equalTo(self.alertV.mas_bottom);
        }];
    }
    
    if (self.cancelString) {
        UIButton *cancelButton = [self createButton:self.cancelString ? self.cancelString : @"取消" withFont:self.actionFont andColor:self.cancelColor action:@selector(cancelButtonClick:)];
        [self.alertV addSubview:cancelButton];
        [cancelButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self.alertV.mas_left);
            if (btnCount == 2){
                make.right.mas_equalTo(self.alertV.mas_centerX).offset(-kPopupViewLineSize/2);
            } else {
                make.right.mas_equalTo(self.alertV.mas_right);
            }
            make.top.mas_equalTo(hLine.mas_bottom).offset(kPopupViewLineSize);
            make.bottom.mas_equalTo(self.alertV.mas_bottom);
        }];
    }
    
    if (self.confirmString) {
        UIButton *confimButton = [self createButton:self.confirmString ? self.confirmString : @"确认" withFont:self.actionFont andColor:self.confirmColor action:@selector(confimButtonClick:)];
        [self.alertV addSubview:confimButton];
        [confimButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.right.mas_equalTo(self.alertV.mas_right);
            if (btnCount == 2) {
                make.left.mas_equalTo(self.alertV.mas_centerX).offset(kPopupViewLineSize/2);
            } else {
                make.left.mas_equalTo(self.alertV.mas_left);
            }
            make.top.mas_equalTo(hLine.mas_bottom).offset(kPopupViewLineSize);
            make.bottom.mas_equalTo(self.alertV.mas_bottom);
        }];
    }
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(tapClick:)];
    [self.blackBgV addGestureRecognizer:tap];
    self.hidden = YES;
}

- (UIView *)createContentView {
    if (self.style == kPopupViewStyleNormal) {
        if (self.contentString) {
            return [self createLabel:self.contentString withFont:self.contentFont ? self.contentFont :
                    [UIFont systemFontOfSize:kPopupViewFontSize] andColor:self.contentFgColor];
        }
    } else if (self.style == kPopupViewStyleCheckbox) {
        return [[CheckBoxView alloc] initWithTitle:self.contentString font:self.contentFont ? self.contentFont :
                [UIFont systemFontOfSize:kPopupViewFontSize] checked:self.isChecked action:^(BOOL checked) {
            self.isChecked = checked;
        }];
    }
    return nil;
}

- (UIView *)createLine:(UIColor *)color {
    UIView *line = [[UIView alloc] init];
    if (color) {
        line.backgroundColor = color;
    } else {
        line.backgroundColor = [UIColor colorFromHexString:@"#dcdcdc"];
    }
    return line;
}

- (UIButton *)createButton:(NSString *)title withFont:(UIFont *)font andColor:(UIColor *)color action:(nullable SEL)action {
    UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
    if (font) {
        [button.titleLabel setFont:font];
    } else {
        [button.titleLabel setFont:[UIFont systemFontOfSize:kPopupViewFontSize]];
    }
    [button setTitle:title forState:UIControlStateNormal];
    
    if (color) {
        [button setTitleColor:color forState:UIControlStateNormal];
    } else {
        [button setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    }
    [button addTarget:self action:action forControlEvents:UIControlEventTouchUpInside];
    return button;
}

- (UILabel *)createLabel:(NSString *)title withFont:(UIFont *)font andColor:(UIColor *)color {
    UILabel *label = [[UILabel alloc] init];
    if (title && title.length > 0) {
        label.text = title;
    }
    
    if (color) {
        label.textColor = color;
    } else {
        label.textColor = [UIColor blackColor];
    }
    label.textAlignment = NSTextAlignmentCenter;
    label.numberOfLines = 0;
    
    if (font) {
        label.font = font;
    }
    CGRect rect = [title boundingRectWithSize:CGSizeMake(kPopupViewWidth - kPopupViewFontSize * 2, MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:font} context:nil];
    label.frame = rect;
    
    if (label.height > kPopupViewFontSize * 2) {
        label.textAlignment = NSTextAlignmentLeft;
    }
    
    return label;
}

- (UIView *)blackBgV {
    if (_blackBgV == nil) {
        _blackBgV = [[UIView alloc]initWithFrame:self.bounds];
        if (self.maskBgColor) {
            _alertV.backgroundColor = self.maskBgColor;
        } else {
            _alertV.backgroundColor = [UIColor grayColor];
        }
        _blackBgV.alpha = 0;
    }
    return _blackBgV;
}

- (UIView *)alertV {
    if (_alertV == nil) {
        _alertV = [[UIView alloc] init];
        if (self.contentBgColor) {
            _alertV.backgroundColor = self.contentBgColor;
        } else {
            _alertV.backgroundColor = [UIColor whiteColor];
        }
        _alertV.layer.cornerRadius = 5;
        _alertV.layer.masksToBounds = YES;
        _alertV.alpha = 0;
    }
    return _alertV;
}

- (void)confimButtonClick:(UIButton *)sender {
    if (self.confirmClick) {
        self.confirmClick(sender, (self.style == kPopupViewStyleCheckbox) ? self.isChecked : 0);
    }
    [self hidden];
}

- (void)cancelButtonClick:(UIButton *)sender {
    if (self.cancelClick) {
        self.cancelClick(sender, (self.style == kPopupViewStyleCheckbox) ? self.isChecked : 0);
    }
    [self hidden];
}

#pragma mark
- (void)tapClick:(UIGestureRecognizer *)tap {
    
}

@end
