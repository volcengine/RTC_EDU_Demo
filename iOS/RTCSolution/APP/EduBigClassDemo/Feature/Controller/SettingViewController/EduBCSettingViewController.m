#import "EduBCMockDataComponent.h"
#import "EduBCSettingsRightLabelCell.h"
#import "EduBCSettingsService.h"
#import "EduBCSettingsSwitchCell.h"
#import "EduBCSettingViewController.h"
#import "EduBigClassPickerComponent.h"
#import "EduBCSettingsSliderView.h"
#import "EduBCHistoryViewController.h"

static NSString *const kSettingsBaseCellIdentifier = @"kSettingsBaseCellIdentifier";
static NSString *const kEduBCSettingsRightLabelCellIdentifier = @"kEduBCSettingsRightLabelCellIdentifier";
static NSString *const kEduBCSettingsSwitchCellIdentifier = @"kEduBCSettingsSwitchCellIdentifier";

typedef NS_ENUM(NSInteger, SettingsGroupType) {
    SettingsGroupTypeResolution,        // Resolution configuration
    SettingsGroupTypeFrameRate,         // Frame rate configuration
    SettingsGroupTypeBitRate,           // Bit rate configuration
    SettingsGroupTypeScreenResolution,  // Screen Resolution configuration
    SettingsGroupTypeScreenFrameRate,   // Screen Frame rate configuration
    SettingsGroupTypeScreenBitRate,     // Screen Bit rate configuration
    SettingsGroupTypeShowVideoParam,    // View real-time parameter configuration
    SettingsGroupTypeHistory,           // Historical EduBigClass
    SettingsGroupTypeSelfHistory,       // Self Historical EduBigClass
};

@interface EduBCSettingViewController () <UITableViewDelegate, UITableViewDataSource>
@property (nonatomic, strong) UITableView *settingsTableView;
@property (nonatomic, strong) NSArray *groupTypes;
@property (nonatomic, strong) EduBCMockDataComponent *localDataModel;

@property (nonatomic, strong) EduBigClassPickerComponent *resolutionPicker;
@property (nonatomic, strong) EduBigClassPickerComponent *frameRatePicker;

@property (nonatomic, copy) NSArray *currentResolutionItem;
@property (nonatomic, strong) NSNumber *currentFrameRate;
@property (nonatomic, strong) NSNumber *currentBitRate;

@property (nonatomic, copy) NSArray *currentScreenResolutionItem;
@property (nonatomic, strong) NSNumber *currentScreenFrameRate;
@property (nonatomic, strong) NSNumber *currentScreenBitRate;

@property (nonatomic, assign) BOOL isShowVideoParam;

@end

@implementation EduBCSettingViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor clearColor];
    self.groupTypes = @[@"分辨率", @"帧率", @"码率",
                        @"屏幕共享分辨率", @"屏幕共享帧率", @"屏幕共享码率",
                        @"实时视频参数", @"查看历史会议", @"我的云录制"];

    [self createUIComponent];
    [self defaultSelectBitRateRang];
    [self defaultSelectScreenBitRateRang];
    [self.settingsTableView reloadData];
    
    self.currentResolutionItem = [EduBCSettingsService getResolutionArray];
    self.currentFrameRate = @([EduBCSettingsService getFrameRate]);
    self.currentBitRate = @([EduBCSettingsService getKBitRate]);
    self.currentScreenResolutionItem = [EduBCSettingsService getScreenResolutionArray];
    self.currentScreenFrameRate = @([EduBCSettingsService getScreenFrameRate]);
    self.currentScreenBitRate = @([EduBCSettingsService getScreenKBitRate]);
    self.isShowVideoParam = [EduBCSettingsService getOpenParam];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];

    self.navTitle = @"会议设置";
}

- (void)createUIComponent {
    [self.view addSubview:self.settingsTableView];
    [self.settingsTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.navView.mas_bottom);
        make.left.right.bottom.equalTo(self.view);
    }];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [UITableViewCell new];
    switch (indexPath.row) {
        case SettingsGroupTypeResolution: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
            [(EduBCSettingsRightLabelCell *)cell settingsRightLabel].text = [NSString stringWithFormat:@"%d*%d", (int)[EduBCSettingsService getResolution].width, (int)[EduBCSettingsService getResolution].height];
        } break;
        case SettingsGroupTypeFrameRate: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
            [(EduBCSettingsRightLabelCell *)cell settingsRightLabel].text = [NSString stringWithFormat:@"%dfps", [EduBCSettingsService getFrameRate]];
        } break;
        case SettingsGroupTypeBitRate: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
            [(EduBCSettingsRightLabelCell *)cell settingsRightLabel].text = [NSString stringWithFormat:@"%dkbps", [EduBCSettingsService getKBitRate]];
        } break;
            
        case SettingsGroupTypeScreenResolution: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
            [(EduBCSettingsRightLabelCell *)cell settingsRightLabel].text = [NSString stringWithFormat:@"%d*%d", (int)[EduBCSettingsService getScreenResolution].width, (int)[EduBCSettingsService getScreenResolution].height];
        } break;
        case SettingsGroupTypeScreenFrameRate: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
            [(EduBCSettingsRightLabelCell *)cell settingsRightLabel].text = [NSString stringWithFormat:@"%dfps", [EduBCSettingsService getScreenFrameRate]];
        } break;
        case SettingsGroupTypeScreenBitRate: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
            [(EduBCSettingsRightLabelCell *)cell settingsRightLabel].text = [NSString stringWithFormat:@"%dkbps", [EduBCSettingsService getScreenKBitRate]];
        } break;
            
        case SettingsGroupTypeShowVideoParam: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsSwitchCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
            [(EduBCSettingsSwitchCell *)cell setSwitchOn:self.isShowVideoParam];
            __weak typeof(self) weakSelf = self;
            [(EduBCSettingsSwitchCell *)cell switchValueChangeCallback:^(BOOL on) {
                [EduBCSettingsService setOpenParam:on];
              if (weakSelf.switchValueChangeBlock) {
                  weakSelf.switchValueChangeBlock(on);
              }
            }];
        } break;
        case SettingsGroupTypeHistory: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
        } break;
        case SettingsGroupTypeSelfHistory: {
            cell = [tableView dequeueReusableCellWithIdentifier:kEduBCSettingsRightLabelCellIdentifier forIndexPath:indexPath];
            [(EduBCSettingsRightLabelCell *)cell settingsLabel].text = self.groupTypes[indexPath.row];
        } break;
        default:
            break;
    }
    if (cell) {
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:NO];
    switch (indexPath.row) {
        case SettingsGroupTypeResolution: {
            [self.resolutionPicker show:self.localDataModel.resolutionLists
                             selectItem:self.currentResolutionItem];
            __weak __typeof(self) wself = self;
            self.resolutionPicker.clickDismissBlock = ^(BOOL isCancel, id selectItem, NSInteger row) {
                if (!isCancel) {
                    wself.currentResolutionItem = selectItem;
                    [EduBCSettingsService setResolutions:selectItem];
                    [wself.localDataModel selectBitRateRangWithRow:row];
                    [wself.settingsTableView reloadData];
                }
                wself.resolutionPicker = nil;
            };
        } break;
        case SettingsGroupTypeFrameRate: {
            [self.frameRatePicker show:self.localDataModel.frameRateLists
                             selectItem:self.currentFrameRate];
            __weak __typeof(self) wself = self;
            self.frameRatePicker.clickDismissBlock = ^(BOOL isCancel, id selectItem, NSInteger row) {
                if (!isCancel) {
                    wself.currentFrameRate = selectItem;
                    int frameRate = ((NSNumber *)selectItem).intValue;
                    [EduBCSettingsService setFrameRate:frameRate];
                    [wself.settingsTableView reloadData];
                }
                wself.frameRatePicker = nil;
            };
        } break;
        case SettingsGroupTypeBitRate: {
            __block EduBCSettingsSliderView *view = [[EduBCSettingsSliderView alloc] init];
            NSRange bitRateRang = self.localDataModel.bitRateRang;
            [view show:bitRateRang.location
              maxValue:(bitRateRang.location + bitRateRang.length)
                 value:[EduBCSettingsService getKBitRate]];
            [self.view addSubview:view];
            [view mas_makeConstraints:^(MASConstraintMaker *make) {
                make.edges.equalTo(self.view);
            }];
            __weak __typeof(self) wself = self;
            view.clickDismissBlock = ^(BOOL isCancel, id  _Nonnull selectItem) {
                if (!isCancel) {
                    NSNumber *valueNumber = (NSNumber *)selectItem;
                    wself.currentBitRate = valueNumber;
                    [EduBCSettingsService setKBitRate:valueNumber.intValue];
                    [wself.settingsTableView reloadData];
                }
                view = nil;
            };
        } break;
            
        case SettingsGroupTypeScreenResolution: {
            [self.resolutionPicker show:self.localDataModel.resolutionLists
                             selectItem:self.currentScreenResolutionItem];
            __weak __typeof(self) wself = self;
            self.resolutionPicker.clickDismissBlock = ^(BOOL isCancel, id selectItem, NSInteger row) {
                if (!isCancel) {
                    wself.currentScreenResolutionItem = selectItem;
                    [EduBCSettingsService setScreenResolutions:selectItem];
                    [wself.localDataModel selectScreenBitRateRangWithRow:row isDefault:NO];
                    [wself.settingsTableView reloadData];
                }
                wself.resolutionPicker = nil;
            };
        } break;
        case SettingsGroupTypeScreenFrameRate: {
            [self.frameRatePicker show:self.localDataModel.frameRateLists
                             selectItem:self.currentScreenFrameRate];
            __weak __typeof(self) wself = self;
            self.frameRatePicker.clickDismissBlock = ^(BOOL isCancel, id selectItem, NSInteger row) {
                if (!isCancel) {
                    wself.currentScreenFrameRate = selectItem;
                    int frameRate = ((NSNumber *)selectItem).intValue;
                    [EduBCSettingsService setScreenFrameRate:frameRate];
                    [wself.settingsTableView reloadData];
                }
                wself.frameRatePicker = nil;
            };
        } break;
        case SettingsGroupTypeScreenBitRate: {
            __block EduBCSettingsSliderView *view = [[EduBCSettingsSliderView alloc] init];
            NSRange bitRateRang = self.localDataModel.bitScreenRateRang;
            [view show:bitRateRang.location
              maxValue:(bitRateRang.location + bitRateRang.length)
                 value:[EduBCSettingsService getScreenKBitRate]];
            [self.view addSubview:view];
            [view mas_makeConstraints:^(MASConstraintMaker *make) {
                make.edges.equalTo(self.view);
            }];
            __weak __typeof(self) wself = self;
            view.clickDismissBlock = ^(BOOL isCancel, id  _Nonnull selectItem) {
                if (!isCancel) {
                    NSNumber *valueNumber = (NSNumber *)selectItem;
                    wself.currentScreenBitRate = valueNumber;
                    [EduBCSettingsService setScreenKBitRate:valueNumber.intValue];
                    [wself.settingsTableView reloadData];
                }
                view = nil;
            };
        } break;
            
            
        case SettingsGroupTypeHistory: {
            EduBCHistoryViewController *next = [[EduBCHistoryViewController alloc] init];
            next.isDelete = NO;
            [self.navigationController pushViewController:next animated:YES];
        } break;
        case SettingsGroupTypeSelfHistory: {
            EduBCHistoryViewController *next = [[EduBCHistoryViewController alloc] init];
            next.isDelete = YES;
            [self.navigationController pushViewController:next animated:YES];
        } break;
        default:
            break;
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 119/2;
}

#pragma mark - UITableViewDataSource

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.groupTypes.count;
}

#pragma mark - Private Action

- (void)defaultSelectBitRateRang {
    CGSize resolution = [EduBCSettingsService getResolution];
    NSInteger defaultRow = 0;
    NSString *resolutionString = [NSString stringWithFormat:@"%ld*%ld", (long)resolution.width, (long)resolution.height];
    for (int i = 0; i < self.localDataModel.resolutionLists.count; i++) {
        NSArray *resolutions = self.localDataModel.resolutionLists[i];
        NSString *titleString = [NSString stringWithFormat:@"%@*%@", resolutions[0], resolutions[1]];
        if ([titleString isEqualToString:resolutionString]) {
            defaultRow = i;
            break;
        }
    }

    [self.localDataModel selectBitRateRangWithRow:defaultRow];
}

- (void)defaultSelectScreenBitRateRang {
    CGSize resolution = [EduBCSettingsService getScreenResolution];
    NSInteger defaultRow = 0;
    NSString *resolutionString = [NSString stringWithFormat:@"%ld*%ld", (long)resolution.width, (long)resolution.height];
    for (int i = 0; i < self.localDataModel.resolutionLists.count; i++) {
        NSArray *resolutions = self.localDataModel.resolutionLists[i];
        NSString *titleString = [NSString stringWithFormat:@"%@*%@", resolutions[0], resolutions[1]];
        if ([titleString isEqualToString:resolutionString]) {
            defaultRow = i;
            break;
        }
    }

    [self.localDataModel selectScreenBitRateRangWithRow:defaultRow isDefault:YES];
}

#pragma mark - getter

- (UITableView *)settingsTableView {
    if (!_settingsTableView) {
        _settingsTableView = [[UITableView alloc] init];
        _settingsTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        _settingsTableView.delegate = self;
        _settingsTableView.dataSource = self;
        [_settingsTableView registerClass:EduBCSettingsRightLabelCell.class forCellReuseIdentifier:kEduBCSettingsRightLabelCellIdentifier];
        [_settingsTableView registerClass:EduBCSettingsSwitchCell.class forCellReuseIdentifier:kEduBCSettingsSwitchCellIdentifier];
        _settingsTableView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _settingsTableView;
}

- (EduBCMockDataComponent *)localDataModel {
    if (!_localDataModel) {
        _localDataModel = [[EduBCMockDataComponent alloc] init];
    }
    return _localDataModel;
}

- (EduBigClassPickerComponent *)resolutionPicker {
    if (!_resolutionPicker) {
        _resolutionPicker = [[EduBigClassPickerComponent alloc] initWithHeight:566/2 superView:self.view];
        _resolutionPicker.titleStr = @"分辨率";
    }
    return _resolutionPicker;
}

- (EduBigClassPickerComponent *)frameRatePicker {
    if (!_frameRatePicker) {
        _frameRatePicker = [[EduBigClassPickerComponent alloc] initWithHeight:195 superView:self.view];
        _frameRatePicker.titleStr = @"帧率";
    }
    return _frameRatePicker;
}

#pragma mark - tool

@end
