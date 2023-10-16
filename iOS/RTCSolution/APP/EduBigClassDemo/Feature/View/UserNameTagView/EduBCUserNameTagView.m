//
//  UserNameView.m
//
//  Created by on 2022/11/12.
//

#import "EduBCUserNameTagView.h"
#import "Masonry.h"
#import "Core.h"

@interface EduBCUserNameTagView ()

@property (nonatomic, strong) UIView      *bgView;
@property (nonatomic, strong) UIImageView *micIcon;
@property (nonatomic, strong) UILabel     *nameLabel;
@property (nonatomic, strong) UIButton    *hostButton;

@end

@implementation EduBCUserNameTagView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.bgView];
        [self.bgView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
        
        [self addSubview:self.hostButton];
        [self.hostButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(44, 16));
            make.left.equalTo(self).offset(2);
            make.centerY.equalTo(self);
        }];
        
        [self addSubview:self.micIcon];
        [self.micIcon mas_makeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(16, 16));
            make.left.equalTo(self.hostButton.mas_right).offset(2);
            make.centerY.equalTo(self);
        }];
        
        [self addSubview:self.nameLabel];
        [self.nameLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerY.equalTo(self);
            make.left.equalTo(self.micIcon.mas_right).offset(2);
            make.width.mas_lessThanOrEqualTo(88.f);
        }];
    }
    return self;
}

- (void)setTitle:(NSString *)title {
    [self.nameLabel setText:title];
}

- (void)setIsHost:(BOOL)isHost {
    _isHost = isHost;
    self.hostButton.hidden = !isHost;
    
    [self updateUI];
}

- (void)setIsShare:(BOOL)isShare {
    _isShare = isShare;
    
    //[self updateUI];
}

- (void)setIsBanMic:(BOOL)isBanMic {
    _isBanMic = isBanMic;
    self.micIcon.hidden = NO;
    if (isBanMic) {
        _micIcon.image = [ThemeManager imageNamed:@"meeting_par_mic_s"];
    } else {
        _micIcon.image = [ThemeManager imageNamed:@"meeting_par_mic_i"];
    }
    [self updateUI];
}

- (void)updateUI {
    if (_isHost) {
        [self.micIcon mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(16, 16));
            make.left.equalTo(self.hostButton.mas_right).offset(2);
            make.centerY.equalTo(self);
        }];
    } else {
        [self.micIcon mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(16, 16));
            make.left.equalTo(self.mas_left).offset(2);
            make.centerY.equalTo(self);
        }];
    }
    
    CGFloat hostWidth = 20;
    if (_isHost) {
        hostWidth += 46;
    }
    [self mas_updateConstraints:^(MASConstraintMaker *make) {
        make.width.equalTo(self.nameLabel).offset(hostWidth + 2.f);
        make.height.mas_equalTo(20.f);
    }];
}
#pragma mark - getter
- (UILabel *)nameLabel {
    if (!_nameLabel) {
        _nameLabel = [[UILabel alloc] init];
        _nameLabel.textColor = [ThemeManager titleLabelTextColor];
        _nameLabel.font =  [UIFont systemFontOfSize:12];
    }
    return _nameLabel;
}

- (UIButton *)hostButton {
    if (!_hostButton) {
        _hostButton = [[UIButton alloc] init];
        [_hostButton setTitle:@"老师" forState:UIControlStateNormal];
        [_hostButton setTitleColor:[ThemeManager hostLabelTextColor] forState:UIControlStateNormal];
        _hostButton.titleLabel.font = [UIFont systemFontOfSize:12];
        _hostButton.backgroundColor = [[ThemeManager hostLabelBackgroudColor] colorWithAlpha:(0.8 * 255.0)];
        _hostButton.layer.masksToBounds = YES;
        _hostButton.layer.cornerRadius = 2;
    }
    return _hostButton;
}

- (UIImageView *)micIcon {
    if (!_micIcon) {
        _micIcon = [[UIImageView alloc] init];
        _micIcon.image = [ThemeManager imageNamed:@"meeting_par_mic_s"];
    }
    return _micIcon;
}


- (UIView *)bgView {
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [[ThemeManager backgroundColor] colorWithAlpha:0.7f];
        _bgView.layer.cornerRadius = 2;
        _bgView.layer.masksToBounds = YES;
    }
    return _bgView;
}

@end
