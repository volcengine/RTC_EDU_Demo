//
//  EduBCRoomWhiteBoardView.h
//

#import <UIKit/UIKit.h>
#import <WhiteBoard/ByteWhiteBoard.h>
#import <WhiteBoard/ByteWhiteBoardRoom.h>
#import "EduBCRoomBottomView.h"
#import "EduBCWhiteBoardViewModel.h"
#import "EduBCTopInfoView.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^WhiteBoardScaleBtnClicked)(id _Nonnull sender);

@interface EduBCRoomWhiteBoardView : UIView
@property (nonatomic, assign) BOOL enableEdit;
@property(nonatomic) BOOL isLandscape;
@property (nonatomic, strong) UIView *boardView;
@property (nonatomic, strong) EduBCTopInfoView *topInfoView;

@property(nonatomic, strong)WhiteBoardScaleBtnClicked scaleBtnClickedBlock;

- (instancetype)initWithViewModel:(EduBCWhiteBoardViewModel *)viewModel;

- (void)onWhiteBoardRoom:(ByteWhiteBoardRoom *)room started:(ByteWhiteBoard *)board;
- (void)onWhiteBoardStoped:(ByteWhiteBoard *)board;
- (void)onWhiteBoardError:(NSInteger)code;
- (void)onWhiteBoardPageIndexChange;

@end

NS_ASSUME_NONNULL_END


