//
//  EduClassChatView.m
//  veRTC_Demo
//
//  Created by on 2021/7/29.
//  
//

#import "EduClassChatView.h"

@interface EduClassChatView ()
@property (nonatomic, strong) UILabel *label;
@property (nonatomic, strong) UIView *chatBoxView;
@end

@implementation EduClassChatView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor colorFromHexString:@"#272E3B"];

        [self addSubview:self.chatBoxView];
        [self.chatBoxView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.equalTo(self).offset(8);
          make.bottom.right.equalTo(self).offset(-8);
          make.height.mas_equalTo(32);
        }];

        [self addSubview:self.label];
        [self.label mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerX.equalTo(self);
          make.centerY.equalTo(self.chatBoxView.mas_top).multipliedBy(0.5);
        }];
    }
    return self;
}

- (UILabel *)label {
    if (!_label) {
        _label = [[UILabel alloc] init];
        _label.textColor = [UIColor colorFromHexString:@"#4E5969"];
        _label.text = @"IM区域需嵌入组件使用";
        _label.textAlignment = NSTextAlignmentCenter;
        _label.font = [UIFont systemFontOfSize:8 weight:UIFontWeightMedium];
    }
    return _label;
}

- (UIView *)chatBoxView {
    if (!_chatBoxView) {
        _chatBoxView = [[UIView alloc] init];
        _chatBoxView.backgroundColor = [UIColor colorFromHexString:@"#1C222D"];
        _chatBoxView.layer.cornerRadius = 2;
        _chatBoxView.layer.masksToBounds = YES;
    }
    return _chatBoxView;
}
@end
