//
//  EduBCRoomCollectionViewCell.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>
#import "EduBCRoomVideoSession.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCRoomCollectionViewCell : UICollectionViewCell

- (void)bindVideoSession:(EduBCRoomVideoSession *)session;

@end

NS_ASSUME_NONNULL_END
