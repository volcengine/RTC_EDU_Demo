//
//  EduSCHistoryViewController.m
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import "EduSCHistoryViewController.h"
#import "EduSCHistoryTableView.h"
#import "EduSmallClassRTMManager.h"

@interface EduSCHistoryViewController ()

@property (nonatomic, strong) EduSCHistoryTableView *EduSCHistoryTableView;

@end

@implementation EduSCHistoryViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.view addSubview:self.EduSCHistoryTableView];
    [self.EduSCHistoryTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.navView.mas_bottom);
        make.left.right.bottom.equalTo(self.view);
    }];
    
    [self loadDataWithHistoryVideoRecord];
}

- (void)loadDataWithHistoryVideoRecord {
    __weak __typeof(self) wself = self;
    [EduSmallClassRTMManager getHistoryVideoRecord:self.isDelete block:^(NSArray<EduSmallClassControlRecordModel *> * _Nonnull recordLists, RTMACKModel * _Nonnull model) {
        if (model.result) {
            wself.EduSCHistoryTableView.dataLists = recordLists;
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:model.message];
        }
    }];
}

- (void)setIsDelete:(BOOL)isDelete {
    _isDelete = isDelete;
    self.EduSCHistoryTableView.isDelete = isDelete;
    if (isDelete) {
        self.navTitle = @"我的云录制";
    } else {
        self.navTitle = @"会议录像";
    }
}

#pragma mark - getter

- (EduSCHistoryTableView *)EduSCHistoryTableView {
    if (!_EduSCHistoryTableView) {
        _EduSCHistoryTableView = [[EduSCHistoryTableView alloc] init];
        _EduSCHistoryTableView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _EduSCHistoryTableView;
}

@end
