// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <AVFoundation/AVFoundation.h>
#import "EduClassListViewController.h"
#import "EduRecordListViewController.h"
#import "EduLectureHallViewController.h"
#import "EduBreakoutClassViewController.h"
#import "EduRoomTableView.h"
#import "EduBreakoutRTCManager.h"
#import "EduRTSManager.h"
#import "EduRTSStudentManager.h"
#import "UIViewController+Orientation.h"

@interface EduClassListViewController ()<EduRoomTableViewDelegate>

@property (nonatomic, strong) UILabel *emptyLabel;
@property (nonatomic, strong) EduRoomTableView *roomTableView;

@end

@implementation EduClassListViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.bgView.hidden = NO;
    self.rightImage = [UIImage imageNamed:@"edu_refresh" bundleName:HomeBundleName];
    self.navView.backgroundColor = [UIColor clearColor];
    
    [self.view addSubview:self.roomTableView];
    [self.roomTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.left.right.equalTo(self.view);
        make.top.equalTo(self.navView.mas_bottom);
    }];
    
    [self.view addSubview:self.emptyLabel];
    [self.emptyLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(self.view);
    }];
    
    [self checkSystemAuthority];
    [self loadClassListData];
}

- (void)checkSystemAuthority{
    
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
        
    }];
    
    [SystemAuthority authorizationStatusWithType:AuthorizationTypeAudio block:^(BOOL isAuthorize) {

    }];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    [self setDeviceInterfaceOrientation:UIDeviceOrientationPortrait];
}

- (void)rightButtonAction:(BaseButton *)sender {
    [super rightButtonAction:sender];
    
    [self loadClassListData];
}

#pragma mark - load data

- (void)loadClassListData {

    WeakSelf;
    [EduRTSStudentManager getActiveClassWithBlock:^(NSArray<EduRoomModel *> * _Nonnull list, RTSACKModel * _Nonnull model) {
        wself.roomTableView.activeRooms = list;
        [wself updateEmptyLabelStatus];
    }];
    
    [EduRTSStudentManager getHistoryRoomListWithBlock:^(NSArray<EduRoomModel *> * _Nonnull list, RTSACKModel * _Nonnull model) {
        wself.roomTableView.historyRooms = list;
        [wself updateEmptyLabelStatus];
    }];
}

#pragma mark - EduRoomTableViewDelegate

- (void)EduRoomTableView:(EduRoomTableView *)EduRoomTableView didSelectRowAtIndexPath:(EduRoomModel *)model type:(EduRoomType)classType{
    switch (classType) {
        case EduRoomTypeLecture:
        {
            EduLectureHallViewController *lectureVC = [[EduLectureHallViewController alloc] init];
            lectureVC.roomModel = model;
            [self.navigationController pushViewController:lectureVC animated:YES];
        }
            break;
        case EduRoomTypeBreakout:
        {
            EduBreakoutClassViewController *breakoutClassVC = [[EduBreakoutClassViewController alloc] init];
            breakoutClassVC.roomModel = model;
            [self.navigationController pushViewController:breakoutClassVC animated:YES];
        }
            break;
        case EduRoomTypeHistory:
        {
            EduRecordListViewController *historyVC = [[EduRecordListViewController alloc] init];
            historyVC.model = model;
            [self.navigationController pushViewController:historyVC animated:YES];
        }
            break;
    }
}

#pragma mark - Private Action

- (void)updateEmptyLabelStatus {
    if (self.roomTableView.historyRooms.count <= 0 &&
        self.roomTableView.activeRooms.count <= 0) {
        self.emptyLabel.hidden = NO;
    } else {
        self.emptyLabel.hidden = YES;
    }
}


#pragma mark - getter

- (EduRoomTableView *)roomTableView {
    if (!_roomTableView) {
        _roomTableView = [[EduRoomTableView alloc] init];
        _roomTableView.delegate = self;
    }
    return _roomTableView;
}

- (UILabel *)emptyLabel {
    if (!_emptyLabel) {
        _emptyLabel = [[UILabel alloc] init];
        _emptyLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _emptyLabel.font = [UIFont systemFontOfSize:12 weight:UIFontWeightMedium];
        _emptyLabel.text = @"当前没有教室在上课";
        _emptyLabel.hidden = YES;
    }
    return _emptyLabel;
}

- (void)dealloc {
    [PublicParameterComponent clear];
    [[EduBreakoutRTCManager shareRtc] disconnect];
}

@end
