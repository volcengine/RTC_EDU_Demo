// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduClassStudentView.h"

@interface EduClassStudentView ()

@property (nonatomic, strong) UIView *liveView;
@property (nonatomic, strong) UIImageView *shadowImageView;
@property (nonatomic, strong) UILabel *nameLabel;
@property (nonatomic, strong) UILabel *podiumLabel;

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
        
        [self addSubview:self.podiumLabel];
        [self.podiumLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(self);
        }];
    }
    return self;
}

#pragma mark - Publish Action

- (void)setModel:(EduUserModel *)model {
    _model = model;
    self.nameLabel.text = model.name;

    [self.liveView addSubview:model.streamView];
    model.streamView.hidden = NO;
    [model.streamView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.edges.equalTo(self.liveView);
    }];
}

- (void)setIsPodium:(BOOL)isPodium {
    _isPodium = isPodium;
    
    // 学生上台时，展示『上台中』文案
    // When students come to the stage, display the copy of "Go to Taichung"
    self.podiumLabel.hidden = isPodium ? NO : YES;
    self.liveView.hidden = !self.podiumLabel.hidden;
}

- (void)setIsCollectiveSpeech:(BOOL)isCollectiveSpeech {
    _isCollectiveSpeech = isCollectiveSpeech;
    
    // 集体发言时，所有人关闭了推流，所以需要隐藏渲染画面
    // When the group speaks, everyone closes the push stream, so the rendering screen needs to be hidden
    self.liveView.hidden = isCollectiveSpeech;
}

#pragma mark - Getter

- (UILabel *)podiumLabel {
    if (!_podiumLabel) {
        _podiumLabel = [[UILabel alloc] init];
        _podiumLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _podiumLabel.font = [UIFont systemFontOfSize:14];
        _podiumLabel.hidden = YES;
        _podiumLabel.text = @"上台中";
    }
    return _podiumLabel;
}

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
