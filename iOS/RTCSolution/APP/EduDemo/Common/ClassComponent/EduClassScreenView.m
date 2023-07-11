// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduClassScreenView.h"

@interface EduClassScreenView ()
@property (nonatomic, strong) UILabel *centerLabel;
@end

@implementation EduClassScreenView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self addSubview:self.centerLabel];
        [self.centerLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerX.equalTo(self);
          make.centerY.equalTo(self);
        }];
    }
    return self;
}

- (UILabel *)centerLabel {
    if (_centerLabel == nil) {
        _centerLabel = [[UILabel alloc] init];
        _centerLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _centerLabel.font = [UIFont systemFontOfSize:12 weight:UIFontWeightMedium];
        _centerLabel.text = @"老师暂未共享屏幕";
    }
    return _centerLabel;
    ;
}
@end
