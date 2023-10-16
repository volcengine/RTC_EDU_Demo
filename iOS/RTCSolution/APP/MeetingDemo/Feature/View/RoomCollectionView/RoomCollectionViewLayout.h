//
//  RoomCollectionViewLayout.h
//
//  Created by admin on 2022/10/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RoomCollectionViewLayout : UICollectionViewFlowLayout

@property (nonatomic, assign) NSInteger rowCount;
@property (nonatomic, assign) NSInteger columnCount;
@property (nonatomic, assign, readonly) NSInteger currentPage;
@property (nonatomic, assign, readonly) NSInteger totalPages;
@property (nonatomic, assign, readonly) NSInteger totalItems;


@end

NS_ASSUME_NONNULL_END
