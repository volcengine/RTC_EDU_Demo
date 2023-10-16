#import "EduSmallClassNavViewController.h"
#import "EduSCRoomVideoSession.h"
#import "EduSCUserListCell.h"
#import "EduSCUserListViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCUserListViewController : EduSmallClassNavViewController

- (instancetype)initWithViewModel:(EduSCUserListViewModel*)viewModel;

@property(nonatomic, strong)EduSCUserListViewModel *viewModel;


@end

NS_ASSUME_NONNULL_END
