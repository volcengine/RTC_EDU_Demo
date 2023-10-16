#import "RoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

enum {
    kUserCtrlAudio,
    kUserCtrlVideo,
    kUserCtrlShare
};

typedef void (^onUserCtrlBlock)(RoomVideoSession *session, int ctrl);

@interface UserListCell : UITableViewCell

@property (nonatomic, strong) RoomVideoSession *videoSession;

@property (nonatomic, assign) BOOL isShareHand;

@property (nonatomic, assign) BOOL isMicHand;


@property (nonatomic, strong) BaseBtnClicked deleteShareBlock;
@property (nonatomic, strong) BaseBtnClicked deleteMicBlock;

- (void)enableUserControl:(BOOL)enable block:(__nullable onUserCtrlBlock) block;
@end

NS_ASSUME_NONNULL_END
