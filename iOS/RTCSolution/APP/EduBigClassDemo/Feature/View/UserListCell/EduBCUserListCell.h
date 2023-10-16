#import "EduBCRoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

enum {
    kUserCtrlAudio,
    kUserCtrlVideo,
    kUserCtrlShare
};

typedef void (^onUserCtrlBlock)(EduBCRoomVideoSession *session, int ctrl);

@interface EduBCUserListCell : UITableViewCell

@property (nonatomic, strong) EduBCRoomVideoSession *videoSession;

@property (nonatomic, assign) BOOL isShareHand;

@property (nonatomic, assign) BOOL isMicHand;


@property (nonatomic, strong) BaseBtnClicked deleteShareBlock;
@property (nonatomic, strong) BaseBtnClicked deleteMicBlock;

- (void)enableUserControl:(BOOL)enable block:(__nullable onUserCtrlBlock) block;
@end

NS_ASSUME_NONNULL_END
