//
//  EduSCRoomCollectionView.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>
#import "EduSCRoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, EduSCRoomCollectionViewFoldMode) {
    EduSCRoomCollectionViewFoldModeHide,
    EduSCRoomCollectionViewFoldModeFold,
    EduSCRoomCollectionViewFoldModeUnfold,
//    EduSCRoomCollectionViewFoldModeSide
};

@interface EduSCRoomCollectionView : UIView

@property (nonatomic, assign, readonly) NSInteger currentPage;
@property (nonatomic, assign, readonly) NSInteger totalPages;
@property (nonatomic, strong) BaseBtnClicked foldBtnClickBlock;
@property (nonatomic, strong) BaseBtnClicked unfoldBtnClickBlock;
@property (nonatomic, strong) BaseBtnClicked sideBtnClickBlock;
@property (nonatomic, assign) BOOL isFold;
@property (nonatomic, assign) BOOL needFold;
@property (nonatomic, assign) BOOL isHiddenSideView;
@property (nonatomic, assign) UICollectionViewScrollDirection scrollDirection;

- (instancetype)initWithFrame:(CGRect)frame;
- (void)updateGridLayout:(CGPoint)gridLayout forceSet:(BOOL)forceset;
- (void)bindVideoSessions:(NSArray<EduSCRoomVideoSession *> *)videoSessions;
- (void)setContentViewColor:(UIColor *)contentColor;
- (void)setActiveSpeakerInfo:(NSString *)info;
- (BOOL)isItemVisible:(NSInteger)index;

@end

NS_ASSUME_NONNULL_END
