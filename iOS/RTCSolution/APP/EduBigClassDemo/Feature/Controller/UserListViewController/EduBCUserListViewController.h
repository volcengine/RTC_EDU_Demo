#import "EduBigClassNavViewController.h"
#import "EduBCRoomVideoSession.h"
#import "EduBCUserListCell.h"
#import "EduBCUserListViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCUserListViewController : EduBigClassNavViewController

- (instancetype)initWithViewModel:(EduBCUserListViewModel*)viewModel;

@property(nonatomic, strong)EduBCUserListViewModel *viewModel;


@end

NS_ASSUME_NONNULL_END
