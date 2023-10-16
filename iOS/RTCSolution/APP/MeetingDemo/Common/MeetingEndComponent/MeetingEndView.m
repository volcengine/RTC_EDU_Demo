//
//  MeetingEndView.m
//  SceneRTCDemo
//
//  Created by on 1821/3/10.
//

#import "MeetingEndView.h"

@interface MeetingEndView ()

@property (nonatomic, strong) UIButton *endButton;
@property (nonatomic, strong) UIButton *leaveButton;
@property (nonatomic, strong) UIButton *cancelButton;

@end

@implementation MeetingEndView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.endButton];
        [self addSubview:self.leaveButton];
        [self addSubview:self.cancelButton];
    }
    return self;
}

- (void)endMeetingButtonAction {
    if (self.clickButtonBlock) {
        self.clickButtonBlock(MeetingButtonStatusEnd);
    }
}

- (void)leaveMeetingButtonAction {
    if (self.clickButtonBlock) {
        self.clickButtonBlock(MeetingButtonStatusLeave);
    }
}

- (void)cancelMeetingButtonAction {
    if (self.clickButtonBlock) {
        self.clickButtonBlock(MeetingButtonStatusCancel);
    }
}

- (void)setMeetingEndStatus:(MeetingEndStatus)meetingEndStatus {
    _meetingEndStatus = meetingEndStatus;
    
    NSInteger contentHeight = 0;
    if (meetingEndStatus == MeetingEndStatusHost) {
        NSMutableArray *viewLists = [[NSMutableArray alloc] init];
        
        [self updateButtonColorWithType:ButtonColorTypeRemind button:self.endButton];
        [self updateButtonColorWithType:ButtonColorTypeNone button:self.leaveButton];
        [viewLists addObject:self.endButton];
        [viewLists addObject:self.leaveButton];
    
        contentHeight = 36*2 + 18*3;
        [viewLists mas_distributeViewsAlongAxis:MASAxisTypeVertical withFixedSpacing:18 leadSpacing:18 tailSpacing:18];
        [viewLists mas_updateConstraints:^(MASConstraintMaker *make) {
            make.width.mas_equalTo(120);
            make.centerX.equalTo(self);
        }];
    } else {
        [self updateButtonColorWithType:ButtonColorTypeRemind button:self.leaveButton];
        
        contentHeight = 36 + 18*2;
        [self.leaveButton mas_updateConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.mas_top).offset(18);
            make.height.mas_equalTo(36);
            make.bottom.equalTo(self.mas_bottom).offset(-18);
            make.width.mas_equalTo(120);
            make.centerX.equalTo(self);
        }];
    }
    
    [self.leaveButton setTitle:(meetingEndStatus == MeetingEndStatusHost) ? @"暂时离开" : @"离开会议" forState:UIControlStateNormal];
    [self mas_updateConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(contentHeight);
    }];
}

#pragma mark - Private Action

- (void)updateButtonColorWithType:(ButtonColorType)type button:(UIButton *)button {
    button.enabled = YES;
    if (type == ButtonColorTypeRemind) {
        [button setTitleColor:[UIColor colorFromHexString:@"#FFFFFF"] forState:UIControlStateNormal];
        [button setBackgroundColor:[UIColor colorFromHexString:@"#F53F3F"]];
    } else if (type == ButtonColorTypeDisable) {
        [button setTitleColor:[UIColor colorFromRGBHexString:@"#FFFFFF" andAlpha:(0.05 * 255)] forState:UIControlStateNormal];
        [button setBackgroundColor:[UIColor colorFromRGBHexString:@"FFFFFF" andAlpha:(0.05 * 255)]];
        button.enabled = NO;
    } else {
        [button setTitleColor:[UIColor colorFromHexString:@"#1D2129"] forState:UIControlStateNormal];
        [button setBackgroundColor:[UIColor colorFromRGBHexString:@"#FFFFFF"]];
        button.layer.borderWidth = 1;
        button.layer.borderColor = [UIColor colorFromRGBHexString:@"#C9CDD4"].CGColor;
    }
}

#pragma mark - getter

- (UIButton *)endButton {
    if (!_endButton) {
        _endButton = [[UIButton alloc] init];
        [_endButton setTitle:@"全员结束" forState:UIControlStateNormal];
        _endButton.titleLabel.font = [UIFont systemFontOfSize:28/2];
        _endButton.layer.cornerRadius = 36/2;
        _endButton.layer.masksToBounds = YES;
        [_endButton addTarget:self action:@selector(endMeetingButtonAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _endButton;
}

- (UIButton *)leaveButton {
    if (!_leaveButton) {
        _leaveButton = [[UIButton alloc] init];
        [_leaveButton addTarget:self action:@selector(leaveMeetingButtonAction) forControlEvents:UIControlEventTouchUpInside];
        [_leaveButton setTitle:(self.meetingEndStatus == MeetingEndStatusHost) ? @"暂时离开" : @"离开会议" forState:UIControlStateNormal];
        _leaveButton.titleLabel.font = [UIFont systemFontOfSize:28/2];
        _leaveButton.layer.cornerRadius = 36/2;
        _leaveButton.layer.masksToBounds = YES;
    }
    return _leaveButton;
}

- (UIButton *)cancelButton {
    if (!_cancelButton) {
        _cancelButton = [[UIButton alloc] init];
        [_cancelButton addTarget:self action:@selector(cancelMeetingButtonAction) forControlEvents:UIControlEventTouchUpInside];
        [_cancelButton setTitle:@"取消" forState:UIControlStateNormal];
        _cancelButton.layer.cornerRadius = 36/2;
        _cancelButton.titleLabel.font = [UIFont systemFontOfSize:28/2];
        _cancelButton.layer.masksToBounds = YES;
    }
    return _cancelButton;
}

@end
