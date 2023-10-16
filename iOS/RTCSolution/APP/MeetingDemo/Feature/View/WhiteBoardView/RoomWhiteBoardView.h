//
//  RoomWhiteboardView.h
//

#import <UIKit/UIKit.h>
#import <WhiteBoard/ByteWhiteBoard.h>
#import <WhiteBoard/ByteWhiteBoardRoom.h>
#import "RoomBottomView.h"
#import "WhiteBoardViewModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^WhiteBoardQuitBtnClicked)(id _Nonnull sender);
typedef void (^WhiteBoardScaleBtnClicked)(id _Nonnull sender);

@interface RoomWhiteBoardView : UIView
@property (nonatomic, assign) BOOL enableEdit;
@property(nonatomic) BOOL isLandscape;
@property (nonatomic, strong) UIView *boardView;

@property(nonatomic, strong)WhiteBoardQuitBtnClicked quitBtnClickedBlock;
@property(nonatomic, strong)WhiteBoardScaleBtnClicked scaleBtnClickedBlock;

- (instancetype)initWithViewModel:(WhiteBoardViewModel *)viewModel;

- (void)onWhiteBoardRoom:(ByteWhiteBoardRoom *)room started:(ByteWhiteBoard *)board;
- (void)onWhiteBoardStoped:(ByteWhiteBoard *)board;
- (void)onWhiteBoardError:(NSInteger)code;
- (void)onWhiteBoardPageIndexChange;

@end

NS_ASSUME_NONNULL_END


