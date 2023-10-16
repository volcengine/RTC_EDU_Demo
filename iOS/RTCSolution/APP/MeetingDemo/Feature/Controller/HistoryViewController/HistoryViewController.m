//
//  HistoryViewController.m
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import "HistoryViewController.h"
#import "HistoryTableView.h"
#import "MeetingRTMManager.h"

@interface HistoryViewController ()

@property (nonatomic, strong) HistoryTableView *historyTableView;

@end

@implementation HistoryViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.view addSubview:self.historyTableView];
    [self.historyTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.navView.mas_bottom);
        make.left.right.bottom.equalTo(self.view);
    }];
    
    [self loadDataWithHistoryVideoRecord];
}

- (void)loadDataWithHistoryVideoRecord {
    __weak __typeof(self) wself = self;
    [MeetingRTMManager getHistoryVideoRecord:self.isDelete block:^(NSArray<MeetingControlRecordModel *> * _Nonnull recordLists, RTMACKModel * _Nonnull model) {
        if (model.result) {
            wself.historyTableView.dataLists = recordLists;
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:model.message];
        }
    }];
}

- (void)setIsDelete:(BOOL)isDelete {
    _isDelete = isDelete;
    self.historyTableView.isDelete = isDelete;
    if (isDelete) {
        self.navTitle = @"我的云录制";
    } else {
        self.navTitle = @"会议录像";
    }
}

#pragma mark - getter

- (HistoryTableView *)historyTableView {
    if (!_historyTableView) {
        _historyTableView = [[HistoryTableView alloc] init];
        _historyTableView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _historyTableView;
}

@end
