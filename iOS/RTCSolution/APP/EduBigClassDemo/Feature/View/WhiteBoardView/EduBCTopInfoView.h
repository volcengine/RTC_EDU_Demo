//
//  EduBCTopInfoView.h
//  EduBigClassDemo
//
//  Created by ByteDance on 2023/6/29.
//

#import <UIKit/UIKit.h>
#import <WhiteBoard/ByteWhiteBoard.h>
#import <WhiteBoard/ByteWhiteBoardRoom.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^WhiteBoardAddPageClicked)(void);
typedef void (^WhiteBoardLeftFillClicked)(void);
typedef void (^WhiteBoardRightFillClicked)(void);

@class EduBigClassControlRoomModel;

@interface EduBCTopInfoView : UIView
@property (nonatomic, assign) BOOL enableEdit;
@property (nonatomic, strong) ByteWhiteBoardRoom *boardRoom;

- (instancetype)initWithModel:(EduBigClassControlRoomModel *)model;
- (void)onWhiteBoardPageIndexChange:(NSInteger)currentIndex total:(NSInteger)totalNum;

@property (nonatomic, strong)WhiteBoardAddPageClicked addPageBlock;
@property (nonatomic, strong)WhiteBoardLeftFillClicked leftFillBlock;
@property (nonatomic, strong)WhiteBoardRightFillClicked rightFillBlock;

- (void)reloadBoardList;
@end

NS_ASSUME_NONNULL_END
