//
//  EduHistoryTableCell.m
//  quickstart
//
//  Created by bytedance on 2021/3/23.
//  Copyright © 2021 . All rights reserved.
//

#import "EduRecordTableCell.h"

@interface EduRecordTableCell ()

@property (nonatomic, strong) UILabel *timeLabel;
@property (nonatomic, strong) UIView *lineView;

@end

@implementation EduRecordTableCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        self.contentView.backgroundColor = [UIColor clearColor];
        [self createUIComponents];
    }
    return self;
}

- (void)setModel:(EduRecordModel *)model {
    _model = model;
    NSInteger beginTime = model.recordBeginTime / 1000000000;
    NSInteger endTime = model.recordEndTime / 1000000000;

    NSDate *beginDate = [NSDate dateWithTimeIntervalSince1970:beginTime];
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyy/MM/dd HH:mm:ss"];
    
    NSString *beginTimeStr = [formatter stringFromDate:beginDate];
    
    NSDate *endDate = [NSDate dateWithTimeIntervalSince1970:endTime];
    NSDateFormatter *endDateformatter = [[NSDateFormatter alloc] init];
    [endDateformatter setDateFormat:@"HH:mm:ss"];
    
    NSString *endTimeStr = [endDateformatter stringFromDate:endDate];
    
    self.timeLabel.text = [NSString stringWithFormat:@"%@-%@",beginTimeStr,endTimeStr];
}


- (void)createUIComponents {
    [self.contentView addSubview:self.timeLabel];
    [self.timeLabel setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];
    [self.timeLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.equalTo(self.contentView).mas_offset(32/2.f);
        make.centerY.equalTo(self.contentView);
    }];
    
    [self.contentView addSubview:self.lineView];
    [self.lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(32/2.f);
        make.height.mas_equalTo(1);
        make.right.bottom.equalTo(self.contentView);
    }];
}

#pragma mark - getter

- (UIView *)lineView {
    if (!_lineView) {
        _lineView = [[UIView alloc] init];
        _lineView.backgroundColor = [UIColor colorFromRGBHexString:@"#FFFFFF" andAlpha:0.1 * 255];
    }
    return _lineView;
}

- (UILabel *)timeLabel {
    if (!_timeLabel) {
        _timeLabel = [[UILabel alloc] init];
        _timeLabel.textColor = [UIColor whiteColor];
        _timeLabel.font = [UIFont systemFontOfSize:16];
    }
    return _timeLabel;
}


@end
