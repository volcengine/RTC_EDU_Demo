//
//  EduBCAvatarView.m
//  SceneRTCDemo
//
//  Created by on 2021/3/10.
//

#import "EduBCAvatarView.h"
#import "Masonry.h"
#import "Core.h"

@interface EduBCAvatarView ()

@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UIView  *bgView;

@end

@implementation EduBCAvatarView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.bgView];
        [self.bgView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
        
        [self addSubview:self.titleLabel];
        [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(self.bgView);
        }];
    }
    return self;
}

- (void)setFontSize:(NSInteger)fontSize {
    _fontSize = fontSize;
    self.titleLabel.font = [UIFont systemFontOfSize:fontSize];
}

- (void)setText:(NSString *)text {
    _text = text;
    
    if (NOEmptyStr(text)) {
        if (text.length > 0) {
            self.titleLabel.text = [text substringToIndex:1];
        }
    }
}

- (void)layoutSubviews{
    [super layoutSubviews];
    self.layer.cornerRadius = CGRectGetWidth(self.frame)/2;
}

#pragma mark - getter

- (UIView *)bgView {
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [ThemeManager avatarBackgroundColor];
    }
    return _bgView;
}

- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [ThemeManager titleLabelTextColor];
    }
    return _titleLabel;
}

@end
