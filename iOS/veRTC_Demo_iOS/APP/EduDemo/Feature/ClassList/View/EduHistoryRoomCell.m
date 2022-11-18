//
//  EduRoomHistoryCell.m
//  veRTC_Demo
//
//  Created by on 2021/5/18.
//  
//

#import "EduHistoryRoomCell.h"
#import "EduAvatarComponent.h"

@interface EduHistoryRoomCell ()

@property (nonatomic, strong) UIView  *bgView;
@property (nonatomic, strong) UILabel *roomNameLabel;
@property (nonatomic, strong) UILabel *classTimeLabel;
@property (nonatomic, strong) UILabel *roomIDLabel;

@end

@implementation EduHistoryRoomCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
        self.contentView.backgroundColor = [UIColor clearColor];
        [self createUIComponent];
    }
    return self;
}

- (void)setModel:(EduRoomModel *)model {
    _model = model;
    [self setLineSpace:12 withText:model.roomName inLabel:self.roomNameLabel];
    
    NSInteger time = model.createTime/1000000000;
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:time];
    
    NSTimeZone *timeZone = [NSTimeZone systemTimeZone];
    NSInteger interval = [timeZone secondsFromGMTForDate: date];

    NSDate *localeDate = [date dateByAddingTimeInterval: interval];
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc]init];
    [formatter setDateFormat:@"yyyy/MM/dd"];

    self.classTimeLabel.text = [formatter stringFromDate:localeDate];
    
    self.roomIDLabel.text = [NSString stringWithFormat:@"ID:%@", model.roomId];
}

#pragma mark - Private Action

- (void)createUIComponent {
    [self.contentView addSubview:self.bgView];
    [self.bgView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.contentView).offset(20);
        make.left.equalTo(self.contentView).offset(20);
        make.right.equalTo(self.contentView).offset(-20);
    }];
    
    [self.bgView addSubview:self.roomNameLabel];
    [self.roomNameLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.equalTo(self.bgView).offset(16);
        make.right.mas_lessThanOrEqualTo(self.bgView.mas_right).offset(-15);
    }];
    
    [self.bgView addSubview:self.classTimeLabel];
    [self.classTimeLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(16);
        make.top.equalTo(self.roomNameLabel.mas_bottom).offset(24);
        make.bottom.equalTo(self.bgView.mas_bottom).offset(-16);
    }];
    
    [self.bgView addSubview:self.roomIDLabel];
    [self.roomIDLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(-16);
        make.centerY.equalTo(self.classTimeLabel);
    }];
    
    [self.bgView mas_updateConstraints:^(MASConstraintMaker *make) {
        make.bottom.equalTo(self.contentView);
    }];
}

#pragma mark - Private Action

- (void)setLineSpace:(CGFloat)lineSpace withText:(NSString *)text inLabel:(UILabel *)label{
    if (!text || !label) {
        return;
    }
    
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    paragraphStyle.lineSpacing = lineSpace;
    paragraphStyle.lineBreakMode = label.lineBreakMode;
    paragraphStyle.alignment = label.textAlignment;
    
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:text];
    [attributedString addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [text length])];
    label.attributedText = attributedString;
}

#pragma mark - getter

- (UILabel *)roomNameLabel {
    if (!_roomNameLabel) {
        _roomNameLabel = [[UILabel alloc] init];
        _roomNameLabel.textColor = [UIColor whiteColor];
        _roomNameLabel.font = [UIFont systemFontOfSize:17 weight:UIFontWeightRegular];
        _roomNameLabel.numberOfLines = 2;
    }
    return _roomNameLabel;
}

- (UILabel *)classTimeLabel {
    if (!_classTimeLabel) {
        _classTimeLabel = [[UILabel alloc] init];
        _classTimeLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _classTimeLabel.font = [UIFont systemFontOfSize:12 weight:UIFontWeightRegular];
    }
    return _classTimeLabel;
}

- (UILabel *)roomIDLabel {
    if (!_roomIDLabel) {
        _roomIDLabel = [[UILabel alloc] init];
        _roomIDLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _roomIDLabel.font = [UIFont systemFontOfSize:12 weight:UIFontWeightRegular];
    }
    return _roomIDLabel;
}

- (UIView *)bgView {
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorFromHexString:@"#394254"];
        _bgView.layer.cornerRadius = 20;
        _bgView.layer.masksToBounds = YES;
    }
    return _bgView;
}
@end
