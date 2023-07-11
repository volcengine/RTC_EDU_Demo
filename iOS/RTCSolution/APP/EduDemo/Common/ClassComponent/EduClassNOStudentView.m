// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduClassNOStudentView.h"

@interface EduClassNOStudentView ()
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UILabel *titleLabel;
@end

@implementation EduClassNOStudentView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor colorFromHexString:@"#394254"];

        [self addSubview:self.imageView];
        [self.imageView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.center.equalTo(self);
        }];

        [self addSubview:self.titleLabel];
        [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerX.equalTo(self);
          make.bottom.equalTo(self).offset(-4);
        }];
    }
    return self;
}

- (UILabel *)titleLabel {
    if (_titleLabel == nil) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _titleLabel.text = @"还没有学生上台";
        _titleLabel.font = [UIFont systemFontOfSize:12];
    }
    return _titleLabel;
    ;
}

- (UIImageView *)imageView {
    if (_imageView == nil) {
        _imageView = [[UIImageView alloc] init];
        _imageView.image = [UIImage imageNamed:@"edu_class_no_stu" bundleName:HomeBundleName];
    }
    return _imageView;
}

@end
