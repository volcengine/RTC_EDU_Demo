//
//  EduSmallClassWhiteBoardComponent.h
//
//

#import <Foundation/Foundation.h>
#import <WhiteBoard/ByteWhiteBoard.h>

@class EduSCRoomWhiteBoardView;

@protocol EduSmallClassWhiteBoardDelegate<NSObject>

- (void)whiteBoardComponentOnClickedQuitButton;
- (void)whiteBoardComponentOnClickedScaleButton;

@end

@interface EduSmallClassWhiteBoardComponent : NSObject

@property (nonatomic, assign) id<EduSmallClassWhiteBoardDelegate> delegate;

@property (nonatomic, assign) BOOL isSharing;
@property (nonatomic, assign) BOOL isLandscape;

- (instancetype)initWithwhiteBoardView:(EduSCRoomWhiteBoardView *)whiteBoardView superView:(UIView *)superView;

- (void)joinRoom:(NSString *)roomId userId:(NSString *)uid token:(NSString *)token;

- (void)leavRoom;

- (void)destroy;
@end
