//
//  EduBCHistoryTableView.m
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import "EduBCHistoryTableView.h"
#import "EduBigClassRTMManager.h"

@interface EduBCHistoryTableView () <UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UITableView *settingsTableView;

@end


@implementation EduBCHistoryTableView


- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.settingsTableView];
        [self.settingsTableView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
    }
    return self;
}

#pragma mark - Publish Action

- (void)setDataLists:(NSArray *)dataLists {
    _dataLists = dataLists;
    [self.settingsTableView reloadData];
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    EduBCHistoryTableCell *cell = [tableView dequeueReusableCellWithIdentifier:@"EduBCHistoryTableCellID" forIndexPath:indexPath];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.model = self.dataLists[indexPath.row];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:NO];

    EduBigClassControlRecordModel *mdel = self.dataLists[indexPath.row];
    if (mdel.download_url && [mdel.download_url isKindOfClass:[NSString class]] && mdel.download_url.length > 0) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:mdel.download_url]
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

#pragma mark - UITableView Edit

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    return self.isDelete;
}

- (NSArray<UITableViewRowAction *> *)tableView:(UITableView *)tableView editActionsForRowAtIndexPath:(NSIndexPath *)indexPath {
    __weak __typeof(self) wself = self;
    EduBigClassControlRecordModel *model = self.dataLists[indexPath.row];
    UITableViewRowAction *deleteAction = [UITableViewRowAction rowActionWithStyle:UITableViewRowActionStyleDestructive title:@"删除" handler:^(UITableViewRowAction * _Nonnull action, NSIndexPath * _Nonnull indexPath) {
        [wself deleteVideoRecord:model tableView:tableView indexPath:indexPath];
    }];
    return @[deleteAction];
}
 
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath{
    editingStyle = UITableViewCellEditingStyleDelete;
}

#pragma mark - loadData

- (void)deleteVideoRecord:(EduBigClassControlRecordModel *)model tableView:(UITableView *)tableView indexPath:(NSIndexPath *)indexPath{
    if (IsEmptyStr(model.vid)) {
        return;
    }
    __weak __typeof(self) wself = self;
//    [EduBigClassRTMManager deleteVideoRecord:model.vid block:^(RTMACKModel * _Nonnull ackModel) {
//        if (ackModel.result) {
//            NSMutableArray *lists = [wself.dataLists mutableCopy];
//            EduBigClassControlRecordModel *deleteModel = nil;
//            for (EduBigClassControlRecordModel *cModel in lists) {
//                if ([cModel.vid isEqualToString:model.vid]) {
//                    deleteModel = cModel;
//                    break;
//                }
//            }
//            [lists removeObject:deleteModel];
//            wself.dataLists = [lists copy];
//            
//            [tableView reloadData];
//        } else {
//            [[ToastComponent shareToastComponent] showWithMessage:ackModel.message];
//        }
//    }];
}

#pragma mark - getter


- (UITableView *)settingsTableView {
    if (!_settingsTableView) {
        _settingsTableView = [[UITableView alloc] init];
        _settingsTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _settingsTableView.delegate = self;
        _settingsTableView.dataSource = self;
        [_settingsTableView registerClass:EduBCHistoryTableCell.class forCellReuseIdentifier:@"EduBCHistoryTableCellID"];
        _settingsTableView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _settingsTableView;
}

@end
