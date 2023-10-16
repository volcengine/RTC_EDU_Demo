//
//  EduBCRoomCollectionViewDataSource.m
//
//  Created by admin on 2022/10/15.
//

#import "EduBCRoomCollectionViewDataSource.h"
#import "EduBCRoomCollectionViewCell.h"
#import "Masonry.h"

@interface EduBCRoomCollectionViewDataSource()

@property (nonatomic, strong) NSMutableArray<EduBCRoomVideoSession *> *sessionsList;

@end

@implementation EduBCRoomCollectionViewDataSource

- (id)init {
    self = [super init];
    if (self) {
        self.sessionsList = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)bindVideoSessions:(NSArray<EduBCRoomVideoSession *> *)videoSessions {
    [self.sessionsList removeAllObjects];
    [self.sessionsList addObjectsFromArray:videoSessions];
}

- (nonnull __kindof UICollectionViewCell *)collectionView:(nonnull UICollectionView *)collectionView cellForItemAtIndexPath:(nonnull NSIndexPath *)indexPath {
    EduBCRoomCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:NSStringFromClass([EduBCRoomCollectionViewCell class])
                                                   forIndexPath:indexPath];
    [cell bindVideoSession:self.sessionsList[indexPath.row]];
    return cell;
}

- (NSInteger)collectionView:(nonnull UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.sessionsList.count;
}


@end
 
