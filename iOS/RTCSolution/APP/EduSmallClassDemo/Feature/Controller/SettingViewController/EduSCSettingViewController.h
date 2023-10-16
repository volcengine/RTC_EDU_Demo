#import "EduSmallClassNavViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCSettingViewController : EduSmallClassNavViewController

/*
 * On/off real-time information callback
 */
@property (nonatomic, copy) void (^switchValueChangeBlock)(BOOL on);

@end

NS_ASSUME_NONNULL_END
