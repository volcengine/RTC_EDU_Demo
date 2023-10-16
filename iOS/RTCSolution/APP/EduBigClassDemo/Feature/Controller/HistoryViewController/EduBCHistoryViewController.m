//
//  EduBCHistoryViewController.m
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import "EduBCHistoryViewController.h"
#import "EduBCHistoryTableView.h"
#import "EduBigClassRTMManager.h"

@interface EduBCHistoryViewController ()

@property (nonatomic, strong) EduBCHistoryTableView *EduBCHistoryTableView;

@end

@implementation EduBCHistoryViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.view addSubview:self.EduBCHistoryTableView];
    [self.EduBCHistoryTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.navView.mas_bottom);
        make.left.right.bottom.equalTo(self.view);
    }];
    
    [self loadDataWithHistoryVideoRecord];
}

- (void)loadDataWithHistoryVideoRecord {
    __weak __typeof(self) wself = self;
    [EduBigClassRTMManager getHistoryVideoRecord:self.isDelete block:^(NSArray<EduBigClassControlRecordModel *> * _Nonnull recordLists, RTMACKModel * _Nonnull model) {
        if (model.result) {
            wself.EduBCHistoryTableView.dataLists = recordLists;
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:model.message];
        }
    }];
}

- (void)setIsDelete:(BOOL)isDelete {
    _isDelete = isDelete;
    self.EduBCHistoryTableView.isDelete = isDelete;
    if (isDelete) {
        self.navTitle = @"我的云录制";
    } else {
        self.navTitle = @"会议录像";
    }
}

#pragma mark - getter

- (EduBCHistoryTableView *)EduBCHistoryTableView {
    if (!_EduBCHistoryTableView) {
        _EduBCHistoryTableView = [[EduBCHistoryTableView alloc] init];
        _EduBCHistoryTableView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _EduBCHistoryTableView;
}

@end
