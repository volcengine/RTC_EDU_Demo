//
//  MeetingWhiteBoardComponent.h
//
//

#import <Foundation/Foundation.h>
#import <WhiteBoard/ByteWhiteBoard.h>
//#import "RoomWhiteBoardView.h"

@class RoomWhiteBoardView;

@protocol MeetingWhiteBoardDelegate<NSObject>

- (void)whiteBoardComponentOnClickedQuitButton;
- (void)whiteBoardComponentOnClickedScaleButton;

@end

@interface MeetingWhiteBoardComponent : NSObject

@property (nonatomic, assign) id<MeetingWhiteBoardDelegate> delegate;

@property (nonatomic, assign) BOOL isSharing;
@property (nonatomic, assign) BOOL isLandscape;

- (instancetype)initWithwhiteBoardView:(RoomWhiteBoardView *)whiteBoardView superView:(UIView *)superView;

- (void)joinRoom:(NSString *)roomId userId:(NSString *)uid token:(NSString *)token;

- (void)leavRoom;

- (void)destroy;

@end
