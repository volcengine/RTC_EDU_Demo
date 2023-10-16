//
//  Constants.h
//  quickstart
//

#ifndef Constants_h
#define Constants_h
#import <KVOController/KVOController.h>
#import "EXTKeyPathCoding.h"

static NSString * _Nullable const NotificationLoginExpired = @"NotificationLoginExpired";
static NSString * _Nullable const NotificationJoinOrExit = @"NotificationJoinOrExit";
#define SCREEN_WIDTH  ([UIScreen mainScreen].bounds.size.width)

#define FIGMA_SCALE(x) (0.524 * x) // 393/750 = 0.524

#define SCREEN_HEIGHT ([UIScreen mainScreen].bounds.size.height)

#define WeakSelf __weak typeof(self) wself = self;

#define StrongSelf __strong __typeof(self) sself = wself;

#define IsEmptyStr(string) (string == nil || string == NULL ||[string isKindOfClass:[NSNull class]]|| [string isEqualToString:@""] ||[[string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length]==0 ? YES : NO)

#define NOEmptyStr(string) (string == nil || string == NULL ||[string isKindOfClass:[NSNull class]] || [string isEqualToString: @""]  ||[[string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length]==0 ? NO : YES)

#ifndef dispatch_queue_async_safe
#define dispatch_queue_async_safe(queue, block)\
    if (dispatch_queue_get_label(DISPATCH_CURRENT_QUEUE_LABEL) == dispatch_queue_get_label(queue)) {\
        block();\
    } else {\
        dispatch_async(queue, block);\
    }
#endif

#ifndef btd_keywordify
    #if DEBUG
        #define btd_keywordify autoreleasepool {}
    #else
        #define btd_keywordify try {} @catch (...) {}
    #endif
#endif

#ifndef weakify
    #if __has_feature(objc_arc)
        #define weakify(object) btd_keywordify __weak __typeof__(object) weak##_##object = object;
    #else
        #define weakify(object) btd_keywordify __block __typeof__(object) block##_##object = object;
    #endif
#endif

#ifndef strongify
    #if __has_feature(objc_arc)
        #define strongify(object) btd_keywordify __typeof__(object) object = weak##_##object;
    #else
        #define strongify(object) btd_keywordify __typeof__(object) object = block##_##object;
    #endif
#endif

#endif /* Constants_h */

