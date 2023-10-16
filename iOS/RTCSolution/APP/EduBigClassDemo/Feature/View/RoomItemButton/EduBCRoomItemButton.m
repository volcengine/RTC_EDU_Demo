//
//  EduBCRoomItemButton.m
//  quickstart
//
//  Created by on 2021/3/24.
//  
//

#import "EduBCRoomItemButton.h"

@interface EduBCRoomItemButton ()

@property (nonatomic, strong) UILabel *desLabel;
@property (nonatomic, strong) UILabel *tagLabel;

@end

@implementation EduBCRoomItemButton

- (instancetype)init {
    self = [super init];
    if (self) {
        self.clipsToBounds = NO;
        
        [self addSubview:self.desLabel];
        [self.desLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.bottom.equalTo(self).offset(-10);
            make.centerX.equalTo(self);
        }];
        
        [self addSubview:self.tagLabel];
        [self.tagLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self).offset(8);
            make.right.equalTo(self).offset(-8);
        }];
    }
    return self;
}

- (void)setDesTitle:(NSString *)desTitle {
    _desTitle = desTitle;
    
    self.desLabel.text = desTitle;
}

- (void)setTagNum:(NSInteger)tagNum {
    if (tagNum > 0) {
        self.tagLabel.text = [NSString stringWithFormat:@"%ld", tagNum];
    } else {
        self.tagLabel.text = @"";
    }
}

- (void)setIsAction:(BOOL)isAction {
    _isAction = isAction;
    
    if (isAction) {
        self.desLabel.textColor = [UIColor colorFromHexString:@"#165DFF"];
    } else {
        self.desLabel.textColor = [ThemeManager buttonDescLabelTextColor];
    }
}

#pragma mark - getter

- (UILabel *)desLabel {
    if (!_desLabel) {
        _desLabel = [[UILabel alloc] init];
        _desLabel.textColor = [ThemeManager buttonDescLabelTextColor];
        _desLabel.font = [UIFont systemFontOfSize:12];
    }
    return _desLabel;
}

- (UILabel *)tagLabel {
    if (!_tagLabel) {
        _tagLabel = [[UILabel alloc] init];
        _tagLabel.textColor = [ThemeManager buttonTagLabelTextColor];
        _tagLabel.font = [UIFont systemFontOfSize:14];
    }
    return _tagLabel;
}

@end
