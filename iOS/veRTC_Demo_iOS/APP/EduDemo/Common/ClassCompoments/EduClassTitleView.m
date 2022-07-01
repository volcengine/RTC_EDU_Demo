//
//  EduClassTitleView.m
//  veRTC_Demo
//
//  Created by bytedance on 2021/7/28.
//  Copyright © 2021 . All rights reserved.
//

#import "EduClassTitleView.h"
#import "GCDTimer.h"

@interface EduClassTitleView ()
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UIView *seperateView1;
@property (nonatomic, strong) UILabel *classIdLabel;
@property (nonatomic, strong) UIView *seperateView2;
@property (nonatomic, strong) UILabel *timeLabel;
@property (nonatomic, strong) UIImageView *recImageView;
@property (nonatomic, strong) UILabel *notStartLabel;
@property (nonatomic, strong) GCDTimer *timer;
@end

@implementation EduClassTitleView

- (void)dealloc {
    [self.timer stopTimer];
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self addSubview:self.titleLabel];
        [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.top.left.bottom.equalTo(self);
        }];

        [self addSubview:self.seperateView1];
        [self.seperateView1 mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.titleLabel);
          make.height.mas_equalTo(self.titleLabel.font.lineHeight);
          make.left.equalTo(self.titleLabel.mas_right).offset(15);
          make.width.mas_equalTo(2);
        }];

        [self addSubview:self.classIdLabel];
        [self.classIdLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.titleLabel);
          make.height.equalTo(self.titleLabel);
          make.left.equalTo(self.seperateView1.mas_right).offset(15);
        }];

        [self addSubview:self.seperateView2];
        [self.seperateView2 mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.seperateView1);
          make.height.equalTo(self.seperateView1);
          make.left.equalTo(self.classIdLabel.mas_right).offset(15);
          make.width.mas_equalTo(2);
        }];

        [self addSubview:self.timeLabel];
        [self.timeLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.titleLabel);
          make.height.equalTo(self.titleLabel);
          make.left.equalTo(self.seperateView2.mas_right).offset(15);
        }];

        [self addSubview:self.recImageView];
        [self.recImageView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.titleLabel);
          make.width.mas_equalTo(44);
          make.height.mas_equalTo(12);
          make.left.equalTo(self.timeLabel.mas_right).offset(8);
        }];

        [self addSubview:self.notStartLabel];
        [self.notStartLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.titleLabel);
          make.height.equalTo(self.titleLabel);
          make.left.equalTo(self.seperateView2.mas_right).offset(15);
        }];
    }
    return self;
}

#pragma mark - setter
- (void)setClassTitle:(NSString *)classTitle {
    _classTitle = classTitle;

    if (NOEmptyStr(classTitle)) {
        NSString *str = [classTitle stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        self.titleLabel.text = str;
    }
}

- (void)setClassID:(NSString *)classID {
    _classID = classID;
    self.classIdLabel.text = [NSString stringWithFormat:@"课堂ID: %@", classID];
}

- (void)setRecordTime:(NSInteger)recordTime {
    _recordTime = recordTime;
    if (self.inClass) {
        WeakSelf;
        [self.timer startTimerWithSpace:0.1
                                  block:^(BOOL result) {
                                    [wself timerMethod];
                                  }];
    }
}

- (void)timerMethod {
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:_recordTime / 1000000000];
    NSInteger seconds = [[NSDate date] timeIntervalSinceDate:date];

    self.timeLabel.text = [self getMMSSFromSS:seconds];
}

- (NSString *)getMMSSFromSS:(NSInteger)seconds {
    //    NSString *str_hour = [NSString stringWithFormat:@"%02ld",seconds/3600];

    NSString *str_minute = [NSString stringWithFormat:@"%02ld", (seconds % 3600) / 60];

    NSString *str_second = [NSString stringWithFormat:@"%02ld", seconds % 60];

    NSString *format_time = [NSString stringWithFormat:@"%@:%@", str_minute, str_second];

    return format_time;
}

- (void)setInClass:(BOOL)inClass {
    _inClass = inClass;

    self.timeLabel.hidden = !inClass;
    self.recImageView.hidden = !inClass;
    self.notStartLabel.hidden = inClass;
}
#pragma mark - getter

- (UILabel *)titleLabel {
    if (_titleLabel == nil) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.textColor = [UIColor whiteColor];
        _timeLabel.font = [UIFont systemFontOfSize:16];
    }
    return _titleLabel;
}

- (UIView *)seperateView1 {
    if (_seperateView1 == nil) {
        _seperateView1 = [[UIView alloc] init];
        _seperateView1.backgroundColor = [UIColor colorFromHexString:@"#4E5969"];
    }
    return _seperateView1;
}

- (UILabel *)classIdLabel {
    if (_classIdLabel == nil) {
        _classIdLabel = [[UILabel alloc] init];
        _classIdLabel.textColor = [UIColor whiteColor];
        _classIdLabel.font = [UIFont systemFontOfSize:16];
    }
    return _classIdLabel;
}

- (UIView *)seperateView2 {
    if (_seperateView2 == nil) {
        _seperateView2 = [[UIView alloc] init];
        _seperateView2.backgroundColor = [UIColor colorFromHexString:@"#4E5969"];
    }
    return _seperateView2;
}

- (UILabel *)timeLabel {
    if (_timeLabel == nil) {
        _timeLabel = [[UILabel alloc] init];
        _timeLabel.textColor = [UIColor whiteColor];
        _timeLabel.font = [UIFont systemFontOfSize:16];
    }
    return _timeLabel;
}

- (UIImageView *)recImageView {
    if (_recImageView == nil) {
        _recImageView = [[UIImageView alloc] init];
        _recImageView.image = [UIImage imageNamed:@"edu_class_record" bundleName:HomeBundleName];
    }
    return _recImageView;
    ;
}

- (UILabel *)notStartLabel {
    if (_notStartLabel == nil) {
        _notStartLabel = [[UILabel alloc] init];
        _notStartLabel.textColor = [UIColor whiteColor];
        _notStartLabel.font = [UIFont systemFontOfSize:16];
        _notStartLabel.text = @"暂未开始上课";
    }
    return _notStartLabel;
    ;
}

- (GCDTimer *)timer {
    if (!_timer) {
        _timer = [[GCDTimer alloc] init];
    }
    return _timer;
}
@end
