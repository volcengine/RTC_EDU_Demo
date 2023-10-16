//
//  EduBCRoomBottomView.m
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import "EduBCRoomBottomView.h"

@interface EduBCRoomBottomView ()

@property (nonatomic, strong) UIView *contentView;
@property (nonatomic, strong) UIView *moreView;
@property (nonatomic, strong) UIView *lineView;

@property (nonatomic, strong) NSMutableArray *buttonLists;
@property (nonatomic, strong) EduBCRoomBottomViewModel *viewModel;
@end

@implementation EduBCRoomBottomView

- (instancetype)initWithViewModel:(EduBCRoomBottomViewModel *)viewModel {
    self = [super init];
    if (self) {
        self.viewModel = viewModel;
        self.clipsToBounds = NO;
        self.backgroundColor = [ThemeManager backgroundColor];
        
        [self addSubview:self.moreView];
        [self.moreView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.right.equalTo(self);
            make.height.mas_equalTo(148/2);
            make.top.equalTo(self).offset(0);
        }];
        
        [self addSubview:self.contentView];
        [self.contentView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
        
        [self addSubviewAndConstraints];
        
        @weakify(self);
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, isEnableAudio) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            [self updateButton:RoomBottomItemMic status:![change[NSKeyValueChangeNewKey] boolValue]];
        }];
        
        [self.KVOController observe:self.viewModel.localVideoSession keyPath:@keypath(self.viewModel.localVideoSession, isEnableVideo) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            [self updateButton:RoomBottomItemCamera status:![change[NSKeyValueChangeNewKey] boolValue]];
        }];
        
        [self.KVOController observe:self.viewModel.roomModel keyPath:@keypath(self.viewModel.roomModel, record_status) options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
            @strongify(self);
            [self updateButton:RoomBottomItemRecord status:[change[NSKeyValueChangeNewKey] boolValue]];
        }];
        
        BOOL micOn = self.viewModel.localVideoSession.isEnableAudio && self.viewModel.roomModel.room_mic_status;
        [self.viewModel turnOnMic:micOn];
        [self updateButton:RoomBottomItemMic status:!micOn];
        
        BOOL camOn = self.viewModel.localVideoSession.isEnableVideo;
        [self.viewModel turnOnCamera:camOn];
        [self updateButton:RoomBottomItemCamera status:!camOn];
    }
    return self;
}

- (void)buttonAction:(EduBCRoomItemButton *)itemButton {
    RoomBottomItem status = itemButton.tag - ROOM_ITEM_TAG_BASE;
    
    if (status == RoomBottomItemMic) {
        BOOL on = itemButton.status == ButtonStatusActive;
        [self.viewModel turnOnMic:on];
    } else if (status == RoomBottomItemCamera) {
        BOOL on = itemButton.status == ButtonStatusActive;
        [self.viewModel turnOnCamera:on];
    } else if (status == RoomBottomItemScreen) {
        [self startShare];
    } else if (status == RoomBottomItemUserList) {
        if (self.userListClickBlock) {
            self.userListClickBlock(self);
        }
    } else if (status == RoomBottomItemRecord) {
        if (itemButton.status == ButtonStatusNone) {
            [self.viewModel startRecord];
        } else if ( self.viewModel.localVideoSession.isHost ) {
            [self.viewModel stopRecord];
        }
    }
}

-(void)startShare {
    __weak typeof(self) weakSelf = self;
    AlertActionModel *sreenShareModel = [[AlertActionModel alloc] init];
    sreenShareModel.title = @"共享屏幕";
    sreenShareModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        if (!weakSelf.viewModel.localVideoSession.hasSharePermission && !weakSelf.viewModel.localVideoSession.isHost) {
            [self.viewModel requestSharePermission];
        } else {
            if (weakSelf.screenShareClickBlock) {
                weakSelf.screenShareClickBlock(weakSelf);
            }
        }
    };
    
    AlertActionModel *whiteBoardModel = [[AlertActionModel alloc] init];
    whiteBoardModel.title = @"共享白板";
    whiteBoardModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        if (!weakSelf.viewModel.localVideoSession.hasSharePermission && !weakSelf.viewModel.localVideoSession.isHost) {
            [self.viewModel requestSharePermission];
        } else {
            if (weakSelf.whiteboardShareClickBlock) {
                weakSelf.whiteboardShareClickBlock(weakSelf);
            }
        }
    };
    
    AlertActionModel *cancelModel = [[AlertActionModel alloc] init];
    cancelModel.title = @"取消";
    cancelModel.isCancel = YES;
    cancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
    };
    
    [[AlertActionManager shareAlertActionManager] showWithMessage:@"选择共享内容" actions:@[sreenShareModel, whiteBoardModel, cancelModel] isActionSheet:![DeviceInforTool isIpad] hideDelay:0];
}

- (void)dismissMoreView {
    if (self.moreView.hidden) {
        return;
    }
}

- (void)addSubviewAndConstraints {
    NSInteger groupNum = 5;
    for (int i = 0; i < groupNum * 2; i++) {
        EduBCRoomItemButton *button = [[EduBCRoomItemButton alloc] init];
        button.tag = ROOM_ITEM_TAG_BASE + i;
        UIImage *image = [self getImageOfItem:i];
        [button bingImage:image status:ButtonStatusNone];
        [button bingImage:[self getSelectImageWithStatus:i] status:ButtonStatusActive];
        button.desTitle = [self getTitleOfItem:i];
        [button addTarget:self action:@selector(buttonAction:) forControlEvents:UIControlEventTouchUpInside];
        [button setImageEdgeInsets:UIEdgeInsetsMake(10, 0, 30, 0)];
        button.imageView.contentMode = UIViewContentModeScaleAspectFit;
        button.hidden = image ? NO : YES;
        if (i < groupNum) {
            [self.contentView addSubview:button];
        } else {
            [self.moreView addSubview:button];
        }
        [self.buttonLists addObject:button];
    }
    
    [self.contentView.subviews mas_distributeViewsAlongAxis:MASAxisTypeHorizontal withFixedItemLength:150/2 leadSpacing:0 tailSpacing:0];
    [self.contentView.subviews mas_updateConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.contentView);
        make.bottom.mas_equalTo(-[DeviceInforTool getVirtualHomeHeight]);
    }];
    
    [self.moreView.subviews mas_distributeViewsAlongAxis:MASAxisTypeHorizontal withFixedItemLength:150/2 leadSpacing:0 tailSpacing:0];
    [self.moreView.subviews mas_updateConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.moreView);
        make.bottom.equalTo(self.moreView).offset(-10);
    }];
    
    [self.moreView addSubview:self.lineView];
    [self.lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.left.right.equalTo(_moreView);
        make.height.mas_equalTo(1);
    }];
}

- (void)updateButton:(RoomBottomItem)item status:(BOOL)isActive {
    EduBCRoomItemButton *selectButton = [self getButtonOfItem:item];
    if (selectButton) {
        selectButton.status = isActive ? ButtonStatusActive : ButtonStatusNone;
    }
}

- (void)updateButton:(RoomBottomItem)item title:(NSString *)title {
    EduBCRoomItemButton *selectButton = [self getButtonOfItem:item];
    if (selectButton) {
        selectButton.desTitle = title;
    }
}

- (void)updateButton:(RoomBottomItem)item tagNum:(int)tagNum {
    EduBCRoomItemButton *selectButton = [self getButtonOfItem:item];
    if (selectButton) {
        if (tagNum >= 0) {
            selectButton.tagNum = tagNum;
        }
    }
}

- (EduBCRoomItemButton *)getButtonOfItem:(RoomBottomItem)item {
    for (EduBCRoomItemButton *button in self.buttonLists) {
        if (button.tag == ROOM_ITEM_TAG_BASE + (int)item) {
            return button;
        }
    }
    return nil;
}

- (ButtonStatus)getStatusOfItem:(RoomBottomItem)item {
    NSString *title = [self getTitleOfItem:item];
    EduBCRoomItemButton *selectButton = nil;
    for (EduBCRoomItemButton *button in self.buttonLists) {
        if ([button.desTitle isEqualToString:title]) {
            selectButton = button;
            break;
        }
    }
    if (selectButton) {
        return selectButton.status;
    } else {
        return ButtonStatusNone;
    }
}

#pragma mark - Private Action

- (NSString *)getTitleOfItem:(RoomBottomItem)status {
    NSString *name = @"";
    switch (status) {
        case RoomBottomItemMic:
            name = @"麦克风";
            break;
        case RoomBottomItemCamera:
            name = @"摄像头";
            break;
        case RoomBottomItemScreen:
            name = @"共享";
            break;
        case RoomBottomItemUserList:
            name = @"成员";
            break;
        case RoomBottomItemRecord:
            name = @"录制";
            break;
        default:
            break;
    }
    return name;
}

- (UIImage *)getImageOfItem:(RoomBottomItem)item {
    NSString *name = @"";
    switch (item) {
        case RoomBottomItemMic:
            name = @"meeting_room_mic";
            break;
        case RoomBottomItemCamera:
            name = @"meeting_room_video";
            break;
        case RoomBottomItemScreen:
            name = @"meeting_par_screen_s";
            break;
        case RoomBottomItemUserList:
            name = @"meeting_room_par";
            break;
        case RoomBottomItemRecord:
            name = @"meeting_room_record";
            break;
        default:
            break;
    }
    return [ThemeManager imageNamed:name];
}

- (UIImage *)getSelectImageWithStatus:(RoomBottomItem)status {
    NSString *name = @"";
    switch (status) {
        case RoomBottomItemMic:
            name = @"meeting_room_mic_s";
            break;
        case RoomBottomItemCamera:
            name = @"meeting_room_video_s";
            break;
        case RoomBottomItemRecord:
            name = @"meeting_room_record_s";
            break;
        case RoomBottomItemScreen:
            name = @"meeting_par_screen_s";
            break;
        default:
            break;
    }
    return [ThemeManager imageNamed:name];
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    
    if (!self.isUserInteractionEnabled || self.isHidden || self.alpha <= 0.01) {
        return nil;
    }
    
    UIView *view = [super hitTest:point withEvent:event];
    CGPoint convertedPoint = [self.moreView convertPoint:point fromView:self];
    UIView *hitTestView = [self.moreView hitTest:convertedPoint withEvent:event];
    if (hitTestView) {
        return hitTestView;
    } else {
        return view;
    }
}


#pragma mark - getter

- (UIView *)contentView {
    if (!_contentView) {
        _contentView = [[UIView alloc] init];
        _contentView.backgroundColor = [ThemeManager backgroundColor];
    }
    return _contentView;
}

- (UIView *)lineView {
    if (!_lineView) {
        _lineView = [[UIView alloc] init];
        _lineView.backgroundColor = [UIColor colorFromRGBHexString:@"#FFFFFF" andAlpha:0.1 * 255];
        
    }
    return _lineView;
}

- (UIView *)moreView {
    if (!_moreView) {
        _moreView = [[UIView alloc] init];
        _moreView.backgroundColor = [ThemeManager backgroundColor];
        _moreView.hidden = YES;
    }
    return _moreView;
}

- (NSMutableArray *)buttonLists {
    if (!_buttonLists) {
        _buttonLists = [[NSMutableArray alloc] init];
    }
    return _buttonLists;
}

@end
