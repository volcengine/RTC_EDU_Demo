//
//  EduSCRoomCollectionViewDataSource.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>
#import "EduSCRoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCRoomCollectionViewDataSource : NSObject<UICollectionViewDataSource>

- (void)bindVideoSessions:(NSArray<EduSCRoomVideoSession *> *)videoSessions;

@end

NS_ASSUME_NONNULL_END
