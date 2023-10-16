//
//  EduBCRoomScreenView.h
//  quickstart
//
//  Created by on 2021/3/25.
//  
//

#import <UIKit/UIKit.h>
#import "EduBCRoomVideoSession.h"
#import "EduBCRoomBottomView.h"
NS_ASSUME_NONNULL_BEGIN

@interface EduBCRoomScreenView : UIView

@property (nonatomic, strong, nullable) EduBCRoomVideoSession *sharingVideoSession;
@property (nonatomic, assign) BOOL isVertical;

@property (nonatomic, copy) void (^clickCloseBlock) (void);
@property (nonatomic, copy) void (^clickShareAudioBlock) (BOOL state);

@property (nonatomic, strong) BaseBtnClicked btnClickBlock;
@property (nonatomic, assign) BOOL enableSharingAudio;

- (void)updateButtonStatus:(BOOL)isActive;
- (void)updateIconPosition:(CGFloat)line;

@end

NS_ASSUME_NONNULL_END
