#import <UIKit/UIKit.h>

#import "RoomVideoSession.h"
#import "MeetingControlRoomModel.h"

#import "RoomNavView.h"
#import "RoomCollectionView.h"
#import "RoomScreenView.h"
#import "RoomSpeakerView.h"
#import "RoomBottomView.h"
#import "RoomViewModel.h"

typedef NS_ENUM(NSInteger, RoomViewMode) {
    // none for default
    RoomViewModeNone,
    // 1v1
    RoomViewModeSpeaker,
    // GridView
    RoomViewModeGallery,
    // Thumbnail Mode
    RoomViewModeThumbnail,
    // whiteBoard Mode
    RoomViewModeWhiteBoard
};

@interface RoomViewController : UIViewController

@property (nonatomic, strong) RoomNavView *navView;
@property (nonatomic, strong) RoomBottomView *bottomView;
@property (nonatomic, strong) RoomCollectionView *collectionView;
@property (nonatomic, strong) RoomSpeakerView *speakerView;
@property (nonatomic, strong) RoomScreenView *screenView;
@property (nonatomic, strong) RoomViewModel *roomViewModel;

@property (nonatomic, copy) void (^closeRoomBlock)(BOOL isEnableAudio, BOOL isEnableVideo);

- (instancetype)initWithLocalVideoSession:(RoomVideoSession *)session withRoomModel:(MeetingControlRoomModel *)roomModel andUsers:(NSArray<RoomVideoSession *> *)userLists;
- (void)restoreScreenOrientation;
- (void)hangUp:(BOOL)isManual end:(BOOL)isEndMeeting;
- (void)joinUserControllor:(BOOL)hand;
@end
