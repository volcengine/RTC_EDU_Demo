// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduClassStudentView.h"
#import "EduClassStudentsScrollView.h"

@interface EduClassStudentsScrollView ()
@property (nonatomic, strong) UIScrollView *scrollView;
@end

@implementation EduClassStudentsScrollView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self addSubview:self.scrollView];
        [self.scrollView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.edges.equalTo(self);
        }];
    }
    return self;
}

- (void)setStudnetArray:(NSArray *)studnetArray {
    _studnetArray = studnetArray;
    [self.scrollView removeAllSubviews];

    NSArray *array = studnetArray;

    if (studnetArray.count > 6) {
        array = [studnetArray subarrayWithRange:NSMakeRange(0, 6)];
    }

    for (int i = 0; i < array.count; i++) {
        EduClassStudentView *studentView = [[EduClassStudentView alloc] init];
        studentView.model = array[i];
        [self.scrollView addSubview:studentView];

        [studentView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.mas_equalTo(128 * i);
          make.top.equalTo(self);
          make.width.mas_equalTo(120);
          make.height.mas_equalTo(80);
        }];
    }

    self.scrollView.contentSize = CGSizeMake(array.count * 128 - 8, 80);

    [self mas_updateConstraints:^(MASConstraintMaker *make) {
      make.width.mas_equalTo(array.count * 128 + 12);
    }];
}

#pragma mark - Publish Action

- (void)joinPodium:(EduUserModel *)userModel {
    for (EduClassStudentView *studentView in self.scrollView.subviews) {
        if ([studentView isKindOfClass:[EduClassStudentView class]] &&
            [studentView.model.uid isEqualToString:userModel.uid]) {
            studentView.isPodium = YES;
            break;
        }
    }
}

- (void)leavePodium:(EduUserModel *)userModel {
    for (EduClassStudentView *studentView in self.scrollView.subviews) {
        if ([studentView isKindOfClass:[EduClassStudentView class]] &&
            [studentView.model.uid isEqualToString:userModel.uid]) {
            studentView.isPodium = NO;
            break;
        }
    }
}

- (void)leavePodiumAllUserModel {
    for (EduClassStudentView *studentView in self.scrollView.subviews) {
        if ([studentView isKindOfClass:[EduClassStudentView class]]) {
            studentView.isPodium = NO;
        }
    }
}

- (void)joinCollectiveSpeech:(BOOL)isJoin {
    for (EduClassStudentView *studentView in self.scrollView.subviews) {
        if ([studentView isKindOfClass:[EduClassStudentView class]]) {
            studentView.isCollectiveSpeech = isJoin;
        }
    }
}

#pragma mark - Getter

- (UIScrollView *)scrollView {
    if (!_scrollView) {
        _scrollView = [[UIScrollView alloc] init];
    }
    return _scrollView;
}
@end
