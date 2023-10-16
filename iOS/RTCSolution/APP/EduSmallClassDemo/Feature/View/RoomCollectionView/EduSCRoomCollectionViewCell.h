//
//  EduSCRoomCollectionViewCell.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>
#import "EduSCRoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCRoomCollectionViewCell : UICollectionViewCell

- (void)bindVideoSession:(EduSCRoomVideoSession *)session;

@end

NS_ASSUME_NONNULL_END
