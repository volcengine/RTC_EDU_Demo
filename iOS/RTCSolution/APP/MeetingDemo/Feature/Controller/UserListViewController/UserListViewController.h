#import "MeetingNavViewController.h"
#import "RoomVideoSession.h"
#import "UserListCell.h"
#import "UserListViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface UserListViewController : MeetingNavViewController

- (instancetype)initWithViewModel:(UserListViewModel*)viewModel;

@property(nonatomic, strong)UserListViewModel *viewModel;


@end

NS_ASSUME_NONNULL_END
