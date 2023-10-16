#import <UIKit/UIKit.h>

#import "EduSCRoomVideoSession.h"
#import "EduSmallClassControlRoomModel.h"

#import "EduSCRoomNavView.h"
#import "EduSCRoomCollectionView.h"
#import "EduSCRoomScreenView.h"
#import "EduSCRoomSpeakerView.h"
#import "EduSCRoomBottomView.h"
#import "EduSCRoomViewModel.h"

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

@interface EduSCRoomViewController : UIViewController

@property (nonatomic, strong) EduSCRoomNavView *navView;
@property (nonatomic, strong) EduSCRoomBottomView *bottomView;
@property (nonatomic, strong) EduSCRoomCollectionView *collectionView;
@property (nonatomic, strong) EduSCRoomSpeakerView *speakerView;
@property (nonatomic, strong) EduSCRoomScreenView *screenView;
@property (nonatomic, strong) EduSCRoomViewModel *EduSCRoomViewModel;

@property (nonatomic, copy) void (^closeRoomBlock)(BOOL isEnableAudio, BOOL isEnableVideo);

- (instancetype)initWithLocalVideoSession:(EduSCRoomVideoSession *)session withRoomModel:(EduSmallClassControlRoomModel *)roomModel andUsers:(NSArray<EduSCRoomVideoSession *> *)userLists;
- (void)restoreScreenOrientation;
- (void)hangUp:(BOOL)isManual end:(BOOL)isEndEduSmallClass;
- (void)joinUserControllor:(BOOL)hand;
@end
