//
//  EduRoomEndView.m
//  veRTC_Demo
//
//  Created by on 2021/5/18.
//  
//

#import "EduRoomEndView.h"

@interface EduRoomEndView ()

@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UIButton *endButton;
@property (nonatomic, strong) UIButton *leaveButton;
@property (nonatomic, strong) UIButton *cancelButton;

@end

@implementation EduRoomEndView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.titleLabel];
        [self.titleLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.centerX.equalTo(self);
            make.top.mas_equalTo(20);
        }];
        
        [self addSubview:self.endButton];
        [self addSubview:self.leaveButton];
        [self addSubview:self.cancelButton];
    }
    return self;
}

- (void)endEduButtonAction {
    if (self.clickButtonBlock) {
        self.clickButtonBlock(EduButtonStatusEnd);
    }
}

- (void)leaveEduButtonAction {
    if (self.clickButtonBlock) {
        self.clickButtonBlock(EduButtonStatusLeave);
    }
}

- (void)cancelEduButtonAction {
    if (self.clickButtonBlock) {
        self.clickButtonBlock(EduButtonStatusCancel);
    }
}

- (void)setEduEndStatus:(EduEndStatus)EduEndStatus {
    _EduEndStatus = EduEndStatus;
    
    NSInteger buttonTop = 0;
    NSInteger titleTop = 0;
    NSInteger contentHeight = 0;
    titleTop = 30;
    buttonTop = 176 / 2;
    contentHeight = 452 /2;
    
    NSMutableArray *viewLists = [[NSMutableArray alloc] init];
    [self updateButtonColorWithType:EduButtonColorTypeRemind button:self.leaveButton];
    [self updateButtonColorWithType:EduButtonColorTypeNone button:self.cancelButton];
    [viewLists addObject:self.leaveButton];
    [viewLists addObject:self.cancelButton];
    
    if (EduEndStatus == EduEndStatusStudent) {
        self.titleLabel.text = @"正在上课，确定要退出教室吗？";
    } else {
        self.titleLabel.text = @"是否确认离开房间？";
    }
    [self.titleLabel mas_updateConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(titleTop);
    }];
    
    [viewLists mas_distributeViewsAlongAxis:MASAxisTypeVertical withFixedSpacing:20 leadSpacing:buttonTop tailSpacing:30];
    [viewLists mas_updateConstraints:^(MASConstraintMaker *make) {
        make.width.mas_equalTo(510/2);
        make.centerX.equalTo(self);
    }];
    
    [self mas_updateConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(contentHeight);
    }];
}

#pragma mark - Private Action

- (void)updateButtonColorWithType:(EduButtonColorType)type button:(UIButton *)button {
    button.enabled = YES;
    if (type == EduButtonColorTypeRemind) {
        [button setTitleColor:[UIColor colorFromHexString:@"#FFFFFF"] forState:UIControlStateNormal];
        [button setBackgroundColor:[UIColor colorFromHexString:@"#F53F3F"]];
    } else {
        [button setTitleColor:[UIColor colorFromHexString:@"#FFFFFF"] forState:UIControlStateNormal];
        [button setBackgroundColor:[UIColor colorFromRGBHexString:@"#FFFFFF" andAlpha:(0.1 * 255)]];
    }
}

#pragma mark - getter

- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [UIColor colorFromHexString:@"#FFFFFF"];
        _titleLabel.font = [UIFont systemFontOfSize:32/2 weight:UIFontWeightMedium];
        _titleLabel.numberOfLines = 0;
        _titleLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLabel;
}

- (UIButton *)endButton {
    if (!_endButton) {
        _endButton = [[UIButton alloc] init];
        [_endButton setTitle:@"离开房间2" forState:UIControlStateNormal];
        _endButton.layer.cornerRadius = 44/2;
        _endButton.layer.masksToBounds = YES;
        [_endButton addTarget:self action:@selector(endEduButtonAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _endButton;
}

- (UIButton *)leaveButton {
    if (!_leaveButton) {
        _leaveButton = [[UIButton alloc] init];
        [_leaveButton addTarget:self action:@selector(leaveEduButtonAction) forControlEvents:UIControlEventTouchUpInside];
        [_leaveButton setTitle:@"确定" forState:UIControlStateNormal];
        _leaveButton.titleLabel.font = [UIFont systemFontOfSize:32/2];
        _leaveButton.layer.cornerRadius = 44/2;
        _leaveButton.layer.masksToBounds = YES;
    }
    return _leaveButton;
}

- (UIButton *)cancelButton {
    if (!_cancelButton) {
        _cancelButton = [[UIButton alloc] init];
        [_cancelButton addTarget:self action:@selector(cancelEduButtonAction) forControlEvents:UIControlEventTouchUpInside];
        [_cancelButton setTitle:@"取消" forState:UIControlStateNormal];
        _cancelButton.layer.cornerRadius = 44/2;
        _cancelButton.titleLabel.font = [UIFont systemFontOfSize:32/2];
        _cancelButton.layer.masksToBounds = YES;
    }
    return _cancelButton;
}

@end
