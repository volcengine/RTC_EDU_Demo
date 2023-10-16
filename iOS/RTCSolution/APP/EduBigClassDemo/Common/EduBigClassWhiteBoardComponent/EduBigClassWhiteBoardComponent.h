//
//  EduBigClassWhiteBoardComponent.h
//
//

#import <Foundation/Foundation.h>
#import <WhiteBoard/ByteWhiteBoard.h>

@class EduBCRoomWhiteBoardView;

@protocol EduBigClassWhiteBoardDelegate<NSObject>

- (void)whiteBoardComponentOnClickedQuitButton;

@end

@interface EduBigClassWhiteBoardComponent : NSObject

@property (nonatomic, assign) id<EduBigClassWhiteBoardDelegate> delegate;

@property (nonatomic, assign) BOOL isSharing;
@property (nonatomic, assign) BOOL isLandscape;

- (instancetype)initWithwhiteBoardView:(EduBCRoomWhiteBoardView *)whiteBoardView superView:(UIView *)superView;

- (void)joinRoom:(NSString *)roomId userId:(NSString *)uid token:(NSString *)token;

- (void)leavRoom;

- (void)destroy;

@end
