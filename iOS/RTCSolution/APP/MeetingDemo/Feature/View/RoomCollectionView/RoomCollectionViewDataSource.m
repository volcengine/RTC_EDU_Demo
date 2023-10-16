//
//  RoomCollectionViewDataSource.m
//
//  Created by admin on 2022/10/15.
//

#import "RoomCollectionViewDataSource.h"
#import "RoomCollectionViewCell.h"
#import "Masonry.h"

@interface RoomCollectionViewDataSource()

@property (nonatomic, strong) NSMutableArray<RoomVideoSession *> *sessionsList;

@end

@implementation RoomCollectionViewDataSource

- (id)init {
    self = [super init];
    if (self) {
        self.sessionsList = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)bindVideoSessions:(NSArray<RoomVideoSession *> *)videoSessions {
    [self.sessionsList removeAllObjects];
    [self.sessionsList addObjectsFromArray:videoSessions];
}

- (nonnull __kindof UICollectionViewCell *)collectionView:(nonnull UICollectionView *)collectionView cellForItemAtIndexPath:(nonnull NSIndexPath *)indexPath {
    RoomCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:NSStringFromClass([RoomCollectionViewCell class])
                                                   forIndexPath:indexPath];
    [cell bindVideoSession:self.sessionsList[indexPath.row]];
    return cell;
}

- (NSInteger)collectionView:(nonnull UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.sessionsList.count;
}


@end
 
