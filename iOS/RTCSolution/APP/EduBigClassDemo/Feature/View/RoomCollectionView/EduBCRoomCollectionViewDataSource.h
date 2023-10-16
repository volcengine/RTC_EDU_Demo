//
//  EduBCRoomCollectionViewDataSource.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>
#import "EduBCRoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCRoomCollectionViewDataSource : NSObject<UICollectionViewDataSource>

- (void)bindVideoSessions:(NSArray<EduBCRoomVideoSession *> *)videoSessions;

@end

NS_ASSUME_NONNULL_END
