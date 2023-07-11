// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduClassNOStudentView.h"
#import "EduClassStudentListView.h"
#import "EduClassStudentsScrollView.h"
#import "EduRTSStudentManager.h"

@interface EduClassStudentListView ()
@property (nonatomic, strong) UIButton *closeButton;
@property (nonatomic, strong) UIButton *handUpButton;
@property (nonatomic, strong) EduClassStudentsScrollView *scrollView;
@property (nonatomic, strong) EduClassNOStudentView *noStudentView;
@end

@implementation EduClassStudentListView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor colorFromHexString:@"#272E3B"];

        [self addSubview:self.closeButton];
        [self.closeButton mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerX.equalTo(self);
          make.top.equalTo(self).offset(5);
        }];

        [self addSubview:self.noStudentView];
        [self.noStudentView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.top.equalTo(self.closeButton.mas_bottom).offset(14);
          make.left.equalTo(self).offset(16);
          make.width.mas_equalTo(120);
          make.height.mas_equalTo(80);
        }];

        [self addSubview:self.scrollView];
        [self.scrollView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.mas_equalTo(12);
          make.top.equalTo(self.closeButton.mas_bottom).offset(14);
          make.right.equalTo(self).offset(-12);
          make.bottom.equalTo(self).offset(-16);
        }];

        [self addSubview:self.handUpButton];
        [self.handUpButton mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerX.equalTo(self);
          make.bottom.equalTo(self).offset(-16);
          make.size.mas_equalTo(CGSizeMake(80, 32));
        }];
    }
    return self;
}

- (void)setStudnetArray:(NSArray *)studnetArray {
    _studnetArray = studnetArray;
    if (studnetArray.count) {
        self.noStudentView.hidden = YES;
        self.scrollView.hidden = NO;
        self.scrollView.studnetArray = studnetArray;

        [self mas_updateConstraints:^(MASConstraintMaker *make) {
          make.width.mas_equalTo(studnetArray.count * 128 + 12);
        }];

        BOOL includeMe = [self checkIncludeSelf:studnetArray];
        if (includeMe) {
            self.handUpButton.hidden = YES;
        } else {
            self.handUpButton.hidden = NO;
        }
    } else {
        [self showNoStudentView];
    }
}

- (BOOL)checkIncludeSelf:(NSArray *)studnetArray {
    BOOL includeMe = NO;
    for (EduUserModel *model in studnetArray) {
        if ([model.uid isEqualToString:[LocalUserComponent userModel].uid]) {
            includeMe = YES;
            break;
        }
    }
    return includeMe;
}

#pragma mark - Publish Action

- (void)addUser:(EduUserModel *)userModel {
    NSMutableArray *list = [self.studnetArray mutableCopy];
    [list addObject:userModel];
    self.studnetArray = [list copy];
}

- (void)removeUser:(EduUserModel *)userModel {
    //lock
    EduUserModel *deleteModel = nil;
    for (int i = 0; i < self.studnetArray.count; i++) {
        EduUserModel *model = self.studnetArray[i];
        if ([model.uid isEqualToString:userModel.uid]) {
            deleteModel = model;
            break;
        }
    }
    if (deleteModel) {
        NSMutableArray *list = [self.studnetArray mutableCopy];
        [list removeObject:deleteModel];
        self.studnetArray = [list copy];
    }

    if ([userModel.uid isEqualToString:[LocalUserComponent userModel].uid]) {
        self.handUpButton.hidden = NO;
        [self.handUpButton setTitle:@"我要举手" forState:UIControlStateNormal];
    }
}

#pragma mark - Private Action

- (void)showNoStudentView {
    self.scrollView.studnetArray = @[];
    self.scrollView.hidden = YES;
    self.noStudentView.hidden = NO;

    [self mas_updateConstraints:^(MASConstraintMaker *make) {
      make.width.mas_equalTo(152);
    }];
}

- (void)hideStudentLists:(UIButton *)sendr {
    self.hidden = YES;
    if (self.hideButtonClicked) {
        self.hideButtonClicked();
    }
}

- (void)handup {
    WeakSelf;
    NSString *title = self.handUpButton.titleLabel.text;
    if ([title isEqualToString:@"我要举手"]) {
        [EduRTSStudentManager handsUp:self.roomId
                                       block:^(RTSACKModel *_Nonnull model) {
                                         if (model.result) {
                                             [wself.handUpButton setTitle:@"取消举手" forState:UIControlStateNormal];
                                         }
                                       }];
    } else {
        [EduRTSStudentManager cancelHandsUp:self.roomId
                                             block:^(RTSACKModel *_Nonnull model) {
                                               if (model.result) {
                                                   [wself.handUpButton setTitle:@"我要举手" forState:UIControlStateNormal];
                                               }
                                             }];
    }
}

#pragma mark - getter

- (UIButton *)closeButton {
    if (!_closeButton) {
        _closeButton = [[UIButton alloc] init];
        [_closeButton setImage:[UIImage imageNamed:@"edu_class_vector_down" bundleName:HomeBundleName] forState:UIControlStateNormal];
        [_closeButton sizeToFit];
        [_closeButton addTarget:self action:@selector(hideStudentLists:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeButton;
}

- (UIButton *)handUpButton {
    if (!_handUpButton) {
        _handUpButton = [[UIButton alloc] init];
        _handUpButton.backgroundColor = [UIColor colorFromHexString:@"#4080FF"];
        _handUpButton.layer.cornerRadius = 16;
        _handUpButton.clipsToBounds = YES;
        _handUpButton.titleLabel.font = [UIFont systemFontOfSize:12];
        [_handUpButton setTitle:@"我要举手" forState:UIControlStateNormal];
        [_handUpButton addTarget:self action:@selector(handup) forControlEvents:UIControlEventTouchUpInside];
    }
    return _handUpButton;
}

- (EduClassStudentsScrollView *)scrollView {
    if (!_scrollView) {
        _scrollView = [[EduClassStudentsScrollView alloc] init];
    }
    return _scrollView;
}

- (EduClassNOStudentView *)noStudentView {
    if (!_noStudentView) {
        _noStudentView = [[EduClassNOStudentView alloc] init];
    }
    return _noStudentView;
}
@end
