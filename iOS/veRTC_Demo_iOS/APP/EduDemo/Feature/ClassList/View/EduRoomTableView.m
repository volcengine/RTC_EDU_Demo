//
//  EduRoomTableView.m
//  veRTC_Demo
//
//  Created by on 2021/5/18.
//  
//

#import "EduRoomTableView.h"

static NSString *EduActiveRoomCellID = @"EduActiveRoomCellID";
static NSString *EduHistoryLabelCellID = @"EduHistoryLabelCellID";
static NSString *EduHistoryRoomCellID = @"EduHistoryRoomCellID";

@interface EduRoomTableView () <UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UITableView *roomTableView;

@end

@implementation EduRoomTableView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self addSubview:self.roomTableView];
        [self.roomTableView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.edges.equalTo(self);
        }];
    }
    return self;
}

#pragma mark - Publish Action

- (void)setActiveRooms:(NSArray *)activeRooms {
    _activeRooms = activeRooms;
    [self.roomTableView reloadData];
}

- (void)setHistoryRooms:(NSArray *)historyRooms {
    _historyRooms = historyRooms;
    [self.roomTableView reloadData];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.section == 0) {
        EduActiveRoomCell *cell = [tableView dequeueReusableCellWithIdentifier:EduActiveRoomCellID forIndexPath:indexPath];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        cell.model = self.activeRooms[indexPath.row];

        return cell;
    } else {
        if (indexPath.row == 0) {
            UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:EduHistoryLabelCellID];
            cell.selectionStyle = UITableViewCellSelectionStyleNone;
            cell.backgroundColor = [UIColor clearColor];
            cell.textLabel.textColor = [UIColor whiteColor];
            cell.textLabel.textAlignment = NSTextAlignmentCenter;
            cell.textLabel.numberOfLines = 2;
            cell.textLabel.text = @"\n历史课堂";
            return cell;
        } else {
            EduHistoryRoomCell *cell = [tableView dequeueReusableCellWithIdentifier:EduHistoryRoomCellID forIndexPath:indexPath];
            cell.selectionStyle = UITableViewCellSelectionStyleNone;
            cell.model = self.historyRooms[indexPath.row - 1];
            return cell;
        }
    }
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:NO];

    EduRoomModel *model;
    EduRoomType type;

    if (indexPath.section == 0) {
        model = self.activeRooms[indexPath.row];
        if (model.roomType == 0) {
            type = EduRoomTypeLecture;
        } else {
            type = EduRoomTypeBreakout;
        }
    } else {
        if (indexPath.row == 0) {
            return;
        } else {
            model = self.historyRooms[indexPath.row - 1];
            type = EduRoomTypeHistory;
        }
    }

    if ([self.delegate respondsToSelector:@selector(EduRoomTableView:didSelectRowAtIndexPath:type:)]) {
        [self.delegate EduRoomTableView:self didSelectRowAtIndexPath:model type:type];
    }
}

#pragma mark - UITableViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    NSInteger sectionNumber = 2;

    if (self.historyRooms.count == 0) {
        sectionNumber -= 1;
    }

    return sectionNumber;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    if (section == 0) {
        return self.activeRooms.count;
    } else {
        return self.historyRooms.count + 1;
    }
}

#pragma mark - getter

- (UITableView *)roomTableView {
    if (!_roomTableView) {
        _roomTableView = [[UITableView alloc] init];
        _roomTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _roomTableView.delegate = self;
        _roomTableView.dataSource = self;
        [_roomTableView registerClass:EduActiveRoomCell.class forCellReuseIdentifier:EduActiveRoomCellID];
        [_roomTableView registerClass:EduHistoryRoomCell.class forCellReuseIdentifier:EduHistoryRoomCellID];
        [_roomTableView registerClass:UITableViewCell.class forCellReuseIdentifier:EduHistoryLabelCellID];
        _roomTableView.backgroundColor = [UIColor clearColor];
        _roomTableView.rowHeight = UITableViewAutomaticDimension;
        _roomTableView.estimatedRowHeight = 149 + 20;
    }
    return _roomTableView;
}

@end
