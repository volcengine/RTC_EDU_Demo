//
//  EduClassStudentView.m
//  veRTC_Demo
//
//  Created by bytedance on 2021/7/29.
//

#import "EduClassStudentView.h"

@interface EduClassStudentView ()
@property (nonatomic, strong) UIView *liveView;
@property (nonatomic, strong) UIImageView *shadowImageView;
@property (nonatomic, strong) UILabel *nameLabel;

@end

@implementation EduClassStudentView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self setBackgroundColor:[UIColor colorFromHexString:@"#394254"]];

        [self addSubview:self.liveView];
        [self.liveView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.edges.equalTo(self);
        }];

        [self addSubview:self.shadowImageView];
        [self.shadowImageView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.bottom.left.right.equalTo(self);
          make.height.mas_equalTo(32);
        }];

        [self addSubview:self.nameLabel];
        [self.nameLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.mas_equalTo(4);
          make.centerY.equalTo(self.shadowImageView);
          make.width.mas_lessThanOrEqualTo(self);
          make.height.mas_equalTo(20);
        }];
    }
    return self;
}
#pragma mark - setter
- (void)setModel:(EduUserModel *)model {
    _model = model;
    self.nameLabel.text = model.name;

    [self.liveView addSubview:model.streamView];
    model.streamView.hidden = NO;
    [model.streamView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.edges.equalTo(self.liveView);
    }];
}

#pragma mark - getter

- (UIImageView *)shadowImageView {
    if (!_shadowImageView) {
        _shadowImageView = [[UIImageView alloc] init];
        _shadowImageView.image = [UIImage imageNamed:@"edu_class_shadow" bundleName:HomeBundleName];
    }
    return _shadowImageView;
}

- (UILabel *)nameLabel {
    if (!_nameLabel) {
        _nameLabel = [[UILabel alloc] init];
        _nameLabel.font = [UIFont systemFontOfSize:12];
        _nameLabel.textColor = [UIColor colorFromHexString:@"#FFFFFF"];
        _nameLabel.numberOfLines = 1;
    }
    return _nameLabel;
}

- (UIView *)liveView {
    if (!_liveView) {
        _liveView = [[UIView alloc] init];
    }
    return _liveView;
}
@end
