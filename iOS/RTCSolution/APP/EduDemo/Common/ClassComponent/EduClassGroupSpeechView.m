// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduClassGroupSpeechView.h"

@interface EduClassGroupSpeechView ()
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *subTitleLabel;
@property (nonatomic, strong) UIImageView *speakerView;
@end

@implementation EduClassGroupSpeechView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor colorFromHexString:@"#272E3B"];

        [self addSubview:self.titleLabel];
        [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.top.left.mas_equalTo(16);
        }];

        [self addSubview:self.subTitleLabel];
        [self.subTitleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.equalTo(self.titleLabel);
          make.top.equalTo(self.titleLabel.mas_bottom).offset(12);
        }];

        [self addSubview:self.speakerView];
        [self.speakerView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.titleLabel);
          make.right.equalTo(self).offset(-16);
        }];
    }
    return self;
}

- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [UIColor whiteColor];
        _titleLabel.font = [UIFont systemFontOfSize:16];
        _titleLabel.text = @"老师开启了集体发言";
    }
    return _titleLabel;
}

- (UILabel *)subTitleLabel {
    if (!_subTitleLabel) {
        _subTitleLabel = [[UILabel alloc] init];
        _subTitleLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _subTitleLabel.font = [UIFont systemFontOfSize:12];
        _subTitleLabel.text = @"请大声说出答案";
    }
    return _subTitleLabel;
}

- (UIImageView *)speakerView {
    if (!_speakerView) {
        _speakerView = [[UIImageView alloc] init];
        _speakerView.image = [UIImage imageNamed:@"edu_class_speaker" bundleName:HomeBundleName];
    }
    return _speakerView;
}
@end
