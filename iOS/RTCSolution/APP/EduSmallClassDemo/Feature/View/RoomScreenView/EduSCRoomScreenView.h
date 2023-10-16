//
//  EduSCRoomScreenView.h
//  quickstart
//
//  Created by on 2021/3/25.
//  
//

#import <UIKit/UIKit.h>
#import "EduSCRoomVideoSession.h"
#import "EduSCRoomBottomView.h"
NS_ASSUME_NONNULL_BEGIN

@interface EduSCRoomScreenView : UIView

@property (nonatomic, strong, nullable) EduSCRoomVideoSession *sharingVideoSession;
@property (nonatomic, assign) BOOL isVertical;

@property (nonatomic, copy) void (^clickCloseBlock) (void);
@property (nonatomic, copy) void (^clickShareAudioBlock) (BOOL state);

@property (nonatomic, strong) BaseBtnClicked btnClickBlock;
@property (nonatomic, assign) BOOL enableSharingAudio;

- (void)updateButtonStatus:(BOOL)isActive;
- (void)updateIconPosition;

@end

NS_ASSUME_NONNULL_END
