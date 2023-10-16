//
//  RoomCollectionViewDataSource.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>
#import "RoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

@interface RoomCollectionViewDataSource : NSObject<UICollectionViewDataSource>

- (void)bindVideoSessions:(NSArray<RoomVideoSession *> *)videoSessions;

@end

NS_ASSUME_NONNULL_END
