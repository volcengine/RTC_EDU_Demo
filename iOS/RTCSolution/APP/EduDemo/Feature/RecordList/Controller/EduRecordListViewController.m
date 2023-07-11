// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduRTSManager.h"
#import "EduRecordListViewController.h"
#import "EduRecordTableView.h"

@interface EduRecordListViewController ()

@property (nonatomic, strong) EduRecordTableView *recordTableView;

@end

@implementation EduRecordListViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    [self.view addSubview:self.recordTableView];
    [self.recordTableView mas_makeConstraints:^(MASConstraintMaker *make) {
      make.top.equalTo(self.navView.mas_bottom);
      make.left.right.bottom.equalTo(self.view);
    }];

    [self loadDataWithHistoryVideoRecord];
}

- (void)setModel:(EduRoomModel *)model {
    _model = model;
    self.navTitle = model.roomName;
}

- (void)loadDataWithHistoryVideoRecord {
    __weak __typeof(self) wself = self;
    [EduRTSManager getHistoryRecordList:self.model.roomId
                                  block:^(NSArray *_Nonnull list,
                                          RTSACKModel *_Nonnull model) {
        if (model.result) {
            wself.recordTableView.dataLists = list;
        }
    }];
}

#pragma mark - getter

- (EduRecordTableView *)recordTableView {
    if (!_recordTableView) {
        _recordTableView = [[EduRecordTableView alloc] init];
        _recordTableView.backgroundColor = [UIColor colorFromHexString:@"#1D2129"];
    }
    return _recordTableView;
}

@end
