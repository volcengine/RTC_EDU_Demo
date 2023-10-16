//
//  EduSCRoomCollectionViewDataSource.m
//
//  Created by admin on 2022/10/15.
//

#import "EduSCRoomCollectionViewDataSource.h"
#import "EduSCRoomCollectionViewCell.h"
#import "Masonry.h"

@interface EduSCRoomCollectionViewDataSource()

@property (nonatomic, strong) NSMutableArray<EduSCRoomVideoSession *> *sessionsList;

@end

@implementation EduSCRoomCollectionViewDataSource

- (id)init {
    self = [super init];
    if (self) {
        self.sessionsList = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)bindVideoSessions:(NSArray<EduSCRoomVideoSession *> *)videoSessions {
    [self.sessionsList removeAllObjects];
    [self.sessionsList addObjectsFromArray:videoSessions];
}

- (nonnull __kindof UICollectionViewCell *)collectionView:(nonnull UICollectionView *)collectionView cellForItemAtIndexPath:(nonnull NSIndexPath *)indexPath {
    EduSCRoomCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:NSStringFromClass([EduSCRoomCollectionViewCell class])
                                                   forIndexPath:indexPath];
    [cell bindVideoSession:self.sessionsList[indexPath.row]];
    return cell;
}

- (NSInteger)collectionView:(nonnull UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.sessionsList.count;
}


@end
 
