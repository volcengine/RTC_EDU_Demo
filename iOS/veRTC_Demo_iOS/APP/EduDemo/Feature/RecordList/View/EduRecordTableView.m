//
//  EduHistoryTableView.m
//  quickstart
//
//  Created by bytedance on 2021/3/23.
//  Copyright © 2021 . All rights reserved.
//

#import "EduRecordTableView.h"

@interface EduRecordTableView () <UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UITableView *tableView;

@end

@implementation EduRecordTableView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.tableView];
        [self.tableView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
    }
    return self;
}

#pragma mark - Publish Action

- (void)setDataLists:(NSArray *)dataLists {
    _dataLists = dataLists;
    [self.tableView reloadData];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    EduRecordTableCell *cell = [tableView dequeueReusableCellWithIdentifier:@"EduHistoryTableCellID" forIndexPath:indexPath];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.model = self.dataLists[indexPath.row];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:NO];

    EduRecordModel *model = self.dataLists[indexPath.row];
    if (model.videoURL && [model.videoURL isKindOfClass:[NSString class]] && model.videoURL.length > 0) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:model.videoURL]
                                           options:@{}
                                 completionHandler:^(BOOL success) {

        }];
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 107/2;
}

#pragma mark - UITableViewDataSource

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.dataLists.count;
}

#pragma mark - getter


- (UITableView *)tableView {
    if (!_tableView) {
        _tableView = [[UITableView alloc] init];
        _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _tableView.delegate = self;
        _tableView.dataSource = self;
        [_tableView registerClass:EduRecordTableCell.class forCellReuseIdentifier:@"EduHistoryTableCellID"];
        _tableView.backgroundColor = [UIColor colorFromHexString:@"#1D2129"];
    }
    return _tableView;
}

@end
