#import <UIKit/UIKit.h>

#import "EduBCRoomVideoSession.h"
#import "EduBigClassControlRoomModel.h"

#import "EduBCRoomCollectionView.h"
#import "EduBCRoomScreenView.h"
#import "EduBCRoomSpeakerView.h"
#import "EduBCRoomBottomView.h"
#import "EduBCRoomViewModel.h"

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

@interface EduBCRoomViewController : UIViewController

@property (nonatomic, strong) EduBCRoomBottomView *bottomView;
@property (nonatomic, strong) EduBCRoomCollectionView *collectionView;
@property (nonatomic, strong) EduBCRoomSpeakerView *speakerView;
@property (nonatomic, strong) EduBCRoomScreenView *screenView;
@property (nonatomic, strong) EduBCRoomViewModel *eduBCRoomViewModel;

@property (nonatomic, copy) void (^closeRoomBlock)(BOOL isEnableAudio, BOOL isEnableVideo);

- (instancetype)initWithLocalVideoSession:(EduBCRoomVideoSession *)session withRoomModel:(EduBigClassControlRoomModel *)roomModel andUsers:(NSArray<EduBCRoomVideoSession *> *)userLists;
- (void)restoreScreenOrientation;
- (void)hangUp:(BOOL)isManual end:(BOOL)isEndEduBigClass;
- (void)joinUserControllor:(BOOL)hand;
@end
