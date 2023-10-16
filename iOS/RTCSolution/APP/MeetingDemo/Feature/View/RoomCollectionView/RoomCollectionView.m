//
//  RoomCollectionView.m
//
//  Created by admin on 2022/10/15.
//

#import "RoomCollectionView.h"
#import "RoomCollectionViewCell.h"
#import "RoomCollectionViewDataSource.h"
#import "RoomCollectionViewLayout.h"
#import "Masonry.h"
#import "Constants.h"
#import "RoomViewModel+Sort.h"

@interface RoomCollectionView()<UICollectionViewDelegate>

@property (nonatomic, strong) UICollectionView *collectionView;
@property (nonatomic, strong) UIPageControl *pageControl;
@property (nonatomic, strong) RoomCollectionViewDataSource *dataSource;
@property (nonatomic, strong) RoomCollectionViewLayout* collectionViewLayout;
@property (nonatomic, strong) BaseButton *foldButton;
@property (nonatomic, strong) BaseButton *unfoldButton;
@property (nonatomic, strong) BaseButton *sideButton;
@property (nonatomic, strong) UILabel *activeSpeakerLabel;


@property (nonatomic, assign) CGPoint gridLayout;
@property (nonatomic, assign) CGPoint aspectRatio;
@property (nonatomic, assign) int lineSpacing;


@end

@implementation RoomCollectionView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.lineSpacing = 8.f;
        self.gridLayout = CGPointMake(2, 2);
        
        [self addSubview:self.collectionView];
        [self addSubview:self.pageControl];
        [self addSubview:self.foldButton];
        [self addSubview:self.unfoldButton];
        [self addSubview:self.sideButton];
        [self addSubview:self.activeSpeakerLabel];
        
        WeakSelf
        [self.foldButton setBtnClickBlock:^(id  _Nonnull sender) {
            if (wself.foldBtnClickBlock) {
                wself.foldBtnClickBlock(sender);
            }
            wself.isFold = YES;
        }];
        
        [self.unfoldButton setBtnClickBlock:^(id  _Nonnull sender) {
            if (wself.unfoldBtnClickBlock) {
                wself.unfoldBtnClickBlock(sender);
            }
            wself.isFold = NO;
        }];
        
        [self.sideButton setBtnClickBlock:^(id  _Nonnull sender) {
            if (wself.sideBtnClickBlock) {
                wself.sideBtnClickBlock(sender);
            }
            wself.isFold = !wself.isFold;
        }];
        
        [self.collectionView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.top.right.equalTo(self);
            make.bottom.equalTo(self.pageControl.mas_top).mas_offset(-10);
        }];
        
        [self.pageControl mas_makeConstraints:^(MASConstraintMaker *make) {
            make.bottom.equalTo(self).mas_offset(10);
            make.centerX.equalTo(self);
        }];
        
        [self.foldButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.mas_equalTo(self.collectionView.mas_bottom);
            make.centerX.mas_equalTo(self);
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(80), FIGMA_SCALE(28)));
        }];
        
        [self.unfoldButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerY.mas_equalTo(self);
            make.centerX.mas_equalTo(self).mas_offset(-10);
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(20), FIGMA_SCALE(8)));
        }];
        
        [self.sideButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerY.mas_equalTo(self);
            make.left.mas_equalTo(self);
            make.size.mas_equalTo(CGSizeMake(FIGMA_SCALE(12), FIGMA_SCALE(30)));
        }];
        
        [self.activeSpeakerLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.bottom.mas_equalTo(self.unfoldButton);
            make.left.mas_equalTo(self.mas_centerX);
            make.right.mas_equalTo(self.mas_right);
            make.height.mas_equalTo(FIGMA_SCALE(20));
        }];
        
    }
    return self;
}

- (void)bindVideoSessions:(NSArray<RoomVideoSession *> *)videoSessions {
    if (self.hidden) {
        return;
    }
        
    [self.dataSource bindVideoSessions:videoSessions];
    [self.collectionView reloadData];
    self.pageControl.numberOfPages = self.collectionViewLayout.totalPages;
    [self checkFlod];
}

- (void)setContentViewColor:(UIColor *)contentColor {
    [self.collectionView setBackgroundColor:contentColor];
}

- (void)updateGridLayout:(CGPoint)gridLayout forceSet:(BOOL)forceset {
    if (!CGPointEqualToPoint(self.gridLayout, gridLayout) || forceset) {
        if (CGPointEqualToPoint(gridLayout, CGPointZero)) {
            NSLog(@"###Invalid Layout");
            return;
        }
        self.collectionViewLayout.rowCount = gridLayout.y;
        self.collectionViewLayout.columnCount = gridLayout.x;
        self.gridLayout = gridLayout;
    }
}

- (NSInteger)currentPage {
    return self.collectionViewLayout.currentPage;
}

- (NSInteger)totalPages {
    return self.collectionViewLayout.totalPages;
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    self.pageControl.numberOfPages = self.collectionViewLayout.totalPages;
    self.pageControl.currentPage = self.collectionViewLayout.currentPage;
}

- (UICollectionView *)collectionView {
    if (!_collectionView) {
        _collectionView = [[UICollectionView alloc] initWithFrame:self.frame collectionViewLayout:self.collectionViewLayout];
        _collectionView.delegate   = self;
        _collectionView.dataSource = self.dataSource;
        
        _collectionView.pagingEnabled = YES;
        _collectionView.showsHorizontalScrollIndicator = NO;
        _collectionView.showsVerticalScrollIndicator = NO;
        _collectionView.bounces = NO;
        _collectionView.backgroundColor = [ThemeManager contentBackgroundColor];
        
        [_collectionView registerClass:[RoomCollectionViewCell class] forCellWithReuseIdentifier:NSStringFromClass([RoomCollectionViewCell class])];
    }
    return _collectionView;
}

- (RoomCollectionViewDataSource *)dataSource {
    if (!_dataSource) {
        _dataSource = [[RoomCollectionViewDataSource alloc] init];
    }
    return _dataSource;
}

- (RoomCollectionViewLayout *)collectionViewLayout {
    if (!_collectionViewLayout) {
        _collectionViewLayout = [[RoomCollectionViewLayout alloc] init];
        _collectionViewLayout.rowCount = self.gridLayout.y;
        _collectionViewLayout.columnCount = self.gridLayout.x;
        _collectionViewLayout.minimumLineSpacing = self.lineSpacing;
        _collectionViewLayout.minimumInteritemSpacing = self.lineSpacing;
        _collectionViewLayout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
        _collectionViewLayout.sectionInset = UIEdgeInsetsMake(self.lineSpacing, self.lineSpacing, self.lineSpacing, self.lineSpacing);
    }
    return _collectionViewLayout;
}

- (UIPageControl *)pageControl {
    if (!_pageControl) {
        _pageControl = [[UIPageControl alloc] init];
        _pageControl.backgroundColor = [UIColor clearColor];
        _pageControl.pageIndicatorTintColor = [ThemeManager pageCotrolDefaultTintColor];
        _pageControl.currentPageIndicatorTintColor = [ThemeManager pageCotrolFocusedTintColor];
        _pageControl.transform = CGAffineTransformMakeScale(0.7, 0.7);
        _pageControl.hidesForSinglePage = YES;
    }
    return _pageControl;
}

- (BaseButton *)foldButton {
    if (!_foldButton) {
        _foldButton = [BaseButton new];
        [_foldButton setBackgroundImage:[ThemeManager imageNamed:@"meeting_collection_fold_bg"] forState:UIControlStateNormal];
        [_foldButton setImage:[ThemeManager imageNamed:@"meeting_arrow_up"] forState:UIControlStateNormal];
        [_foldButton setImageEdgeInsets:UIEdgeInsetsMake(FIGMA_SCALE(10), FIGMA_SCALE(30), FIGMA_SCALE(10), FIGMA_SCALE(30))];
    }
    return _foldButton;
}

- (BaseButton *)unfoldButton {
    if (!_unfoldButton) {
        _unfoldButton = [BaseButton new];
        [_unfoldButton setImage:[ThemeManager imageNamed:@"meeting_arrow_down"] forState:UIControlStateNormal];
    }
    return _unfoldButton;
}

- (BaseButton *)sideButton {
    if (!_sideButton) {
        _sideButton = [BaseButton new];
        [_sideButton setImage:[ThemeManager imageNamed:@"meeting_arrow_left"] forState:UIControlStateNormal];
    }
    return _sideButton;
}

- (UILabel *)activeSpeakerLabel {
    if (!_activeSpeakerLabel) {
        _activeSpeakerLabel = [UILabel new];
        _activeSpeakerLabel.text = @"sdfefwfsef";
        _activeSpeakerLabel.font = [UIFont systemFontOfSize:FIGMA_SCALE(20)];
        _activeSpeakerLabel.textColor = [ThemeManager buttonDescLabelTextColor];
        _activeSpeakerLabel.textAlignment = NSTextAlignmentLeft;
    }
    return _activeSpeakerLabel;
}

- (void)setScrollDirection:(UICollectionViewScrollDirection)scrollDirection {
    _scrollDirection = scrollDirection;
    
    self.collectionViewLayout.scrollDirection = scrollDirection;
    [self checkFlod];
}

- (void)checkFlod {
    self.sideButton.hidden = YES;
    self.foldButton.hidden = YES;
    self.unfoldButton.hidden = YES;
    self.activeSpeakerLabel.hidden = YES;
    self.pageControl.hidden = YES;
    
    if (self.scrollDirection == UICollectionViewScrollDirectionVertical) {
        self.foldButton.hidden = YES;
        self.unfoldButton.hidden = YES;
        self.activeSpeakerLabel.hidden = YES;
        self.sideButton.hidden = NO;
        self.pageControl.hidden = self.pageControl.numberOfPages <= 1;
        
    } else {
        if (!self.needFold) {
            self.foldButton.hidden = YES;
            self.unfoldButton.hidden = YES;
            self.activeSpeakerLabel.hidden = YES;
            self.pageControl.hidden = self.pageControl.numberOfPages <= 1;
        } else {
            if (self.isFold) {
                self.foldButton.hidden = YES;
                self.unfoldButton.hidden = NO;
                self.activeSpeakerLabel.hidden = NO;
                self.backgroundColor = self.collectionView.backgroundColor;
                self.pageControl.hidden = YES;
            } else {
                self.foldButton.hidden = NO;
                self.unfoldButton.hidden = YES;
                self.activeSpeakerLabel.hidden = YES;
                self.backgroundColor = [UIColor clearColor];
                self.pageControl.hidden = self.pageControl.numberOfPages <= 1;
            }
        }
    }
}

- (void)setActiveSpeakerInfo:(NSString *)info {
    self.activeSpeakerLabel.text = info;
}

- (BOOL)isItemVisible:(NSInteger)index {
    NSInteger curPage = self.currentPage;
    NSInteger itemsOfCurPage = self.gridLayout.x * self.gridLayout.y;
    NSInteger start = curPage * itemsOfCurPage;
    NSInteger end = MIN(start + itemsOfCurPage, [self.collectionView numberOfItemsInSection:0]);
    return index >= start && index < end;
}

@end

