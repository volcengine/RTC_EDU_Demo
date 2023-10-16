//
//  EduBCTopInfoView.m
//  EduBigClassDemo
//
//  Created by ByteDance on 2023/6/29.
//

#define iconSize 24

#import "EduBCTopInfoView.h"
#import "EduBCRoomWhiteBoardView.h"
#import "EduBCMoreSettingPlanViewContainer.h"

@interface EduBCTopInfoView() <UITableViewDelegate,UITableViewDataSource>

@property (nonatomic, strong) BaseButton *leftFillButton;
@property (nonatomic, strong) BaseButton *rightFillButton;
@property (nonatomic, strong) BaseButton *addPageButton;
@property (nonatomic, strong) BaseButton *navLeftButton;
@property (nonatomic, strong) BaseButton *pullBoxButton;
@property (nonatomic, strong) UIButton *quitButton;
@property (nonatomic, strong) UILabel *emptyLabel;
@property (nonatomic, strong) UILabel *pageLabel;
@property (nonatomic, strong) BaseButton *addPageTextButton;
@property (nonatomic, strong) UILabel *roomNumLabel;
@property (nonatomic, strong) UILabel *timeLabel;
@property (nonatomic, strong) UITableView *boardListView;
@property (nonatomic, strong) UIView *lineTwo;
@property (nonatomic, strong) NSArray *boardInfoArray;
@property (nonatomic, strong) EduBigClassControlRoomModel *roomModel;
@property (nonatomic, assign) NSInteger timing;
@end

@implementation EduBCTopInfoView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
- (instancetype)initWithModel:(EduBigClassControlRoomModel *)model {
    self = [super init];
    if (self) {
        self.roomModel = model;
        [self createUIComponents];
        [self setEnableEdit:NO];
        self.backgroundColor = [UIColor whiteColor];
        [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(getRoomTime) userInfo:nil repeats:YES];
        
        @weakify(self);
        [self.KVOController observe:model keyPath:@keypath(model, share_type) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            NSInteger shareType = [change[NSKeyValueChangeNewKey] integerValue];

            if (shareType == kShareTypeWhiteBoard && self.enableEdit) {
                [self showWhiteBoardEdit:YES];
            } else {
                [self showWhiteBoardEdit:NO];
            }
        }];
    }
    return self;
}

- (void)createUIComponents {
    UIView *lineOne = [UIView new];
    UIView *lineTwo = [UIView new];
    self.lineTwo = lineTwo;
    lineOne.backgroundColor = [UIColor grayColor];
    lineTwo.backgroundColor = [UIColor grayColor];
    lineOne.alpha = 0.3;
    lineTwo.alpha = 0.3;
    [self addSubview:lineOne];
    [self addSubview:lineTwo];
    
    [self addSubview:self.navLeftButton];
    [self addSubview:self.emptyLabel];
    [self addSubview:self.pullBoxButton];
    [self addSubview:self.leftFillButton];
    [self addSubview:self.pageLabel];
    [self addSubview:self.rightFillButton];
    [self addSubview:self.addPageTextButton];
    [self addSubview:self.addPageButton];
    [self addSubview:self.roomNumLabel];
    [self addSubview:self.timeLabel];
    
    [self.navLeftButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.left.equalTo(self.mas_left).offset(8);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(iconSize * 2), FIGMA_SCALE(iconSize * 2)));
    }];
    
    [self.emptyLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.left.equalTo(self.navLeftButton.mas_right).offset(8);
        make.width.mas_equalTo(100);
        make.height.mas_equalTo(FIGMA_SCALE(64));
    }];
    
    [self.pullBoxButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.left.equalTo(self.emptyLabel.mas_right);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(iconSize), FIGMA_SCALE(iconSize) / 2));
    }];
    
    [self.addPageTextButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.right.equalTo(self.mas_right).offset(0);
        make.width.mas_equalTo(70);
        make.height.mas_equalTo(FIGMA_SCALE(64));
    }];
    
    [self.addPageButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(self.addPageTextButton.mas_left).mas_offset(-10);
        make.centerY.equalTo(self);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(iconSize), FIGMA_SCALE(iconSize)));
    }];
    
    [lineTwo mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.width.mas_equalTo(1);
        make.height.equalTo(self.mas_height).multipliedBy(0.4);
        make.right.equalTo(self.addPageButton.mas_left).offset(-12);
    }];
    
    [self.rightFillButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.right.equalTo(self.addPageButton.mas_left).offset(-24);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(iconSize / 1.5), FIGMA_SCALE(iconSize)));
    }];
    
    [self.pageLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.right.equalTo(self.rightFillButton.mas_left);
        make.height.mas_equalTo(FIGMA_SCALE(64));
        make.width.mas_equalTo(FIGMA_SCALE(90));
    }];
    
    [self.leftFillButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(self.pageLabel.mas_left);
        make.centerY.equalTo(self);
        make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(iconSize / 1.5), FIGMA_SCALE(iconSize)));
    }];
    
    [self.timeLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.right.equalTo(self.leftFillButton.mas_left).offset(-54);
    }];
    
    [lineOne mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.width.mas_equalTo(1);
        make.height.equalTo(self.mas_height).multipliedBy(0.4);
        make.right.equalTo(self.timeLabel.mas_left).offset(-6);
    }];
    
    [self.roomNumLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.equalTo(self);
        make.right.equalTo(self.timeLabel.mas_left).offset(-18);
    }];
}

- (void)setEnableEdit:(BOOL)enableEdit {
    _enableEdit = enableEdit;
  
    [self showWhiteBoardEdit:enableEdit];
}

- (void)showWhiteBoardEdit:(BOOL)enableEdit {
    self.emptyLabel.hidden = !enableEdit;
    self.pullBoxButton.hidden = !enableEdit;
    self.boardListView.hidden = YES;
    self.leftFillButton.hidden = !enableEdit;
    self.pageLabel.hidden = !enableEdit;
    self.rightFillButton.hidden = !enableEdit;
    self.addPageTextButton.hidden = !enableEdit;
    self.addPageButton.hidden = !enableEdit;
    self.lineTwo.hidden = !enableEdit;
}

#pragma mark - action
- (void)getRoomTime {
    self.timing++;
    NSInteger lastTime = MaxEduBigClassLimitedTimeInSecs - self.timing;
    _timeLabel.text = [NSString stringWithFormat:@"剩余时间：%ld:%ld", lastTime / 60, lastTime - (lastTime / 60) * 60];
    if (lastTime - (lastTime / 60) * 60 < 10) {
        _timeLabel.text = [NSString stringWithFormat:@"剩余时间：%ld:0%ld", lastTime / 60, lastTime - (lastTime / 60) * 60];
    }
    if (lastTime == 0) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"exitRoom" object:nil];
    }
}

- (void)onWhiteBoardPageIndexChange:(NSInteger)currentIndex total:(NSInteger)totalNum {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.pageLabel.text = [NSString stringWithFormat:@"%ld/%ld",currentIndex,totalNum];
    });
}

- (void)reloadBoardList {

    
    WeakSelf
    [self.boardRoom getCurrentWhiteBoardId:^(NSInteger index) {
        [wself.boardRoom getWhiteBoardInfo:index completionHandler:^(ByteWhiteBoardInfo * _Nonnull boardInfo) {
            
            self.emptyLabel.text = [self boardNamewith:boardInfo];
        }];
    }];

    // 注意是superview,加当前view点击无效
    [self.superview addSubview:self.boardListView];

    [self.boardRoom getAllWhiteBoardInfo:^(NSArray * _Nonnull array) {
        wself.boardInfoArray = array;
        [wself.boardListView reloadData];
    }];
}
#pragma mark - delegate
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 36;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    NSInteger numberOfCells = self.boardInfoArray.count;

    if (numberOfCells) {
        [self.boardListView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.equalTo(self.mas_bottom);
            make.left.equalTo(self.emptyLabel);
            make.right.equalTo(self.pullBoxButton);
            make.height.mas_equalTo(36 * numberOfCells);
        }];
    }
    
    return numberOfCells;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    NSString *reusedId = @"cell_boardId";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:reusedId];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:reusedId];
    }
    cell.textLabel.font = [UIFont systemFontOfSize:14];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    ByteWhiteBoardInfo *boardInfo = self.boardInfoArray[indexPath.row];
    
    cell.textLabel.text = [self boardNamewith:boardInfo];

    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    ByteWhiteBoardInfo *boardInfo = self.boardInfoArray[indexPath.row];
    self.emptyLabel.text = [self boardNamewith:boardInfo];
    [self.boardRoom switchWhiteBoard:boardInfo.boardID];
    
    self.boardListView.hidden = YES;
}

- (NSString *)boardNamewith:( ByteWhiteBoardInfo *)boardInfo {
    if (boardInfo.boardName.length) {
        return boardInfo.boardName;
    }
    
    return @"空白白板";
}
#pragma mark - getter

- (BaseButton *)navLeftButton {
    if (!_navLeftButton) {
        _navLeftButton = [[BaseButton alloc] init];
        [_navLeftButton setImage:[ThemeManager imageNamed:@"meeting_nav_left"] forState:UIControlStateNormal];
        _navLeftButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        [_navLeftButton setBtnClickBlock:^(id  _Nonnull sender) {
            AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
            alertCancelModel.title = @"取消";
            alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            };
            
            AlertActionModel *alertModel = [[AlertActionModel alloc] init];
            alertModel.title = @"确定";
            alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
                [[NSNotificationCenter defaultCenter] postNotificationName:@"exitRoom" object:nil];
            };
            [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"是否离开房间"]
                                                                  actions:@[alertCancelModel, alertModel]];
            
        }];
    }
    return _navLeftButton;
}

- (UILabel *)pageLabel {
    if (_pageLabel == nil) {
        _pageLabel = [[UILabel alloc] init];
        _pageLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(32)];
        _pageLabel.textAlignment = NSTextAlignmentCenter;
        _pageLabel.textColor = [ThemeManager titleLabelTextColor];
        _pageLabel.text = @"1/1";
    }
    
    return _pageLabel;
}

- (UILabel *)emptyLabel {
    if (_emptyLabel == nil) {
        _emptyLabel = [[UILabel alloc] init];
        _emptyLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(32)];
        _emptyLabel.textAlignment = NSTextAlignmentLeft;
        _emptyLabel.textColor = [ThemeManager titleLabelTextColor];
        _emptyLabel.text = @"空白画板";
    }
    
    return _emptyLabel;
}

- (UITableView *)boardListView {
    if (_boardListView == nil) {
        
        _boardListView = [[UITableView alloc] init];
        _boardListView.layer.shadowColor = [UIColor grayColor].CGColor;
        _boardListView.layer.masksToBounds = NO;
        _boardListView.layer.shadowRadius = 3;
        _boardListView.layer.shadowOffset = CGSizeMake(0.0f,0.0f);
        _boardListView.layer.shadowOpacity = 0.9f;
        _boardListView.hidden = YES;
        _boardListView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _boardListView.delegate = self;
        _boardListView.dataSource = self;
        _boardListView.scrollEnabled = NO;
    }
    return _boardListView;
}

- (BaseButton *)addPageTextButton {
    
    if (_addPageTextButton == nil) {
        _addPageTextButton = [[BaseButton alloc] init];
        [_addPageTextButton setTitle:@"添加画板" forState:UIControlStateNormal];
        [_addPageTextButton setTitleColor:[ThemeManager titleLabelTextColor] forState:UIControlStateNormal];
        
        _addPageTextButton.titleLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(32)];
        _addPageTextButton.contentEdgeInsets = UIEdgeInsetsMake(0, -10, 0, -10);
        _addPageTextButton.titleLabel.textAlignment = NSTextAlignmentLeft;
        WeakSelf
        [_addPageTextButton setBtnClickBlock:^(id  _Nonnull sender) {
            wself.addPageBlock();
        }];
    }
    
    return _addPageTextButton;
}

- (UILabel *)roomNumLabel {
    if (_roomNumLabel == nil) {
        _roomNumLabel = [[UILabel alloc] init];
        _roomNumLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
        _roomNumLabel.textAlignment = NSTextAlignmentLeft;
        _roomNumLabel.textColor = [ThemeManager titleLabelTextColor];
        _roomNumLabel.text = [NSString stringWithFormat:@"房间ID：%@", self.roomModel.room_id];
    }
    
    return _roomNumLabel;
}

- (UILabel *)timeLabel {
    if (_timeLabel == nil) {
        _timeLabel = [[UILabel alloc] init];
        _timeLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(24)];
        _timeLabel.textAlignment = NSTextAlignmentLeft;
        _timeLabel.textColor = [UIColor grayColor];
        self.timing = [[NSDate date] timeIntervalSince1970] - self.roomModel.start_time / 1000;
        NSInteger lastTime = MaxEduBigClassLimitedTimeInSecs - self.timing;
        _timeLabel.text = [NSString stringWithFormat:@"剩余时间：%ld:%ld", lastTime / 60, lastTime - (lastTime / 60) * 60];
        if (lastTime - (lastTime / 60) * 60 < 10) {
            _timeLabel.text = [NSString stringWithFormat:@"剩余时间：%ld:0%ld", lastTime / 60, lastTime - (lastTime / 60) * 60];
        }
    }
    
    return _timeLabel;
}

- (BaseButton *)addPageButton {
    if (!_addPageButton) {
        _addPageButton = [[BaseButton alloc] init];
        [_addPageButton setImage:[ThemeManager imageNamed:@"meeting_room_add_enable"] forState:UIControlStateNormal];
        _addPageButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        WeakSelf
        [_addPageButton setBtnClickBlock:^(id  _Nonnull sender) {
            wself.addPageBlock();
        }];
    }
    return _addPageButton;
}

- (BaseButton *)leftFillButton {
    if (!_leftFillButton) {
        _leftFillButton = [[BaseButton alloc] init];
        [_leftFillButton setImage:[ThemeManager imageNamed:@"meeting_room_left_enable"] forState:UIControlStateNormal];
        _leftFillButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        WeakSelf
        [_leftFillButton setBtnClickBlock:^(id  _Nonnull sender) {
            wself.leftFillBlock();
        }];
    }
    return _leftFillButton;
}

- (BaseButton *)rightFillButton {
    if (!_rightFillButton) {
        _rightFillButton = [[BaseButton alloc] init];
        [_rightFillButton setImage:[ThemeManager imageNamed:@"meeting_room_right_enable"] forState:UIControlStateNormal];
        _rightFillButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        WeakSelf
        [_rightFillButton setBtnClickBlock:^(id  _Nonnull sender) {
            wself.rightFillBlock();
        }];
    }
    return _rightFillButton;
}

- (BaseButton *)pullBoxButton {
    if (!_pullBoxButton) {
        _pullBoxButton = [[BaseButton alloc] init];
        [_pullBoxButton setImage:[ThemeManager imageNamed:@"meeting_arrow_down"] forState:UIControlStateNormal];
        _pullBoxButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        WeakSelf
        [_pullBoxButton setBtnClickBlock:^(id  _Nonnull sender) {
            wself.boardListView.hidden = !wself.boardListView.hidden;
        }];
    }
    return _pullBoxButton;
}

@end
