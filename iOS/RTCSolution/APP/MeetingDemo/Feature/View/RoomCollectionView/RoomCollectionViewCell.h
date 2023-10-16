//
//  RoomCollectionViewCell.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>
#import "RoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

@interface RoomCollectionViewCell : UICollectionViewCell

- (void)bindVideoSession:(RoomVideoSession *)session;

@end

NS_ASSUME_NONNULL_END
