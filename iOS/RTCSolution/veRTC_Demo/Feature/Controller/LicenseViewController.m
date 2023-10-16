//
//  LicenseViewController.m
//  veRTC_Demo
//
//  Created by bytedance on 2023/9/14.
//  Copyright © 2021 bytedance. All rights reserved.
//

#import "LicenseViewController.h"
#import "LicenseDetailViewController.h"
#import "Masonry.h"
#import "Core.h"

@interface LicenseViewController ()<UITableViewDelegate,UITableViewDataSource>

@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) NSArray *dataArray;

@property (nonatomic, strong) UIView *navView;
@property (nonatomic, strong) UILabel *navLabel;
@property (nonatomic, strong) BaseButton *leftButton;

@end

@implementation LicenseViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.view addSubview:self.navView];
    [self.navView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.right.equalTo(self.view);
        make.height.mas_equalTo([DeviceInforTool getStatusBarHight] + 44);
    }];
    
    [self.navView addSubview:self.navLabel];
    [self.navLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.equalTo(self.navView);
        make.centerY.equalTo(self.navView).offset([DeviceInforTool getStatusBarHight]/2);
    }];
    
    [self.navView addSubview:self.leftButton];
    [self.leftButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.height.width.mas_equalTo(16);
        make.left.mas_equalTo(16);
        make.centerY.equalTo(self.navLabel);
    }];
    
    [self.view addSubview:self.tableView];
    [self.tableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.bottom.right.equalTo(self.view);
        make.top.equalTo(self.navView.mas_bottom);
    }];
    
    self.dataArray = @[@"营业执照",@"增值电信业务经营许可证",@"网络文化经营许可证"];
}

- (void)jumpToWeb:(NSString *)url {
    if (url && [url isKindOfClass:[NSString class]] && url.length > 0) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]
                                           options:@{}
                                 completionHandler:^(BOOL success) {
            
        }];
    }
}

- (void)navBackAction {
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - delegate
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.dataArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
   
    NSString *cellId = @"LicenseViewControllerCellId";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellId];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellId];
    }
    
    cell.textLabel.text = self.dataArray[indexPath.row];
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    NSInteger row = indexPath.row;
    if(row == 0){
        [self jumpToWeb:@"https://lf3-static.bytednsdoc.com/obj/eden-cn/pojnupibps/VE-RTC/20230919-112237.jpeg"];
    }else if (row == 1){
        LicenseDetailViewController *detailVC = [[LicenseDetailViewController alloc] init];
        detailVC.detailType = LicenseDetailTypeTeleServices;
        [self.navigationController pushViewController:detailVC animated:YES];
    }else {
        LicenseDetailViewController *detailVC = [[LicenseDetailViewController alloc] init];
        detailVC.detailType = LicenseDetailTypeNetworkCulture;
        [self.navigationController pushViewController:detailVC animated:YES];
    }
}

#pragma mark - getter

- (UITableView *)tableView {
    if (_tableView == nil) {
        _tableView = [[UITableView alloc] init];
        _tableView.delegate = self;
        _tableView.dataSource = self;
        _tableView.scrollEnabled = NO;
    }
    return _tableView;
}

- (BaseButton *)leftButton {
    if (!_leftButton) {
        _leftButton = [[BaseButton alloc] init];
        [_leftButton setImage:[ThemeManager imageNamed:@"meeting_nav_left"] forState:UIControlStateNormal];
        _leftButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        [_leftButton addTarget:self action:@selector(navBackAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _leftButton;
}

- (UIView *)navView {
    if (!_navView) {
        _navView = [[UIView alloc] init];
        _navView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _navView;
}

- (UILabel *)navLabel {
    if (!_navLabel) {
        _navLabel = [[UILabel alloc] init];
        _navLabel.font = [UIFont systemFontOfSize:17];
        _navLabel.textColor = [ThemeManager titleLabelTextColor];
        _navLabel.text = @"资质证照";
    }
    return _navLabel;
}
@end
