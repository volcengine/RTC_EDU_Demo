//
//  RoomCollectionViewLayout.m
//
//  Created by admin on 2022/10/15.
//

#import "RoomCollectionViewLayout.h"
#define numberOfVertical 3
@interface RoomCollectionViewLayout ()
@end


@implementation RoomCollectionViewLayout

- (CGSize)itemSize {
    CGSize canvasSize = self.collectionView.frame.size;
    CGFloat insetH = self.sectionInset.left + self.sectionInset.right;
    CGFloat insetV = self.sectionInset.top + self.sectionInset.bottom;
    CGFloat itemW  = floor((canvasSize.width - (self.columnCount - 1)*self.minimumLineSpacing - insetH) / self.columnCount);
    CGFloat itemH = floor((canvasSize.height - (self.rowCount - 1)*self.minimumInteritemSpacing - insetV) / self.rowCount);
    return CGSizeMake(itemW, itemH);
}

- (NSInteger)totalPages {
    return  ceilf(self.totalItems / (float)(self.columnCount * self.rowCount));
}

- (NSInteger)totalItems {
    return [self.collectionView numberOfItemsInSection:0];
}

- (CGSize)collectionViewContentSize {
    CGSize canvasSize = self.collectionView.frame.size;
    CGSize contentSize = canvasSize;
    if (self.scrollDirection == UICollectionViewScrollDirectionHorizontal) {
        contentSize.width = (CGFloat)(self.totalPages * canvasSize.width);
    } else {
        contentSize.height = (CGFloat)(self.totalPages * canvasSize.height);
    }
    return contentSize;
}

- (CGRect)frameForItemAtIndexPath:(NSIndexPath *)indexPath {
    int itemsOf1Page = (int)(self.rowCount * self.columnCount);
    int curPage = (int)((CGFloat)indexPath.row / itemsOf1Page);
    int remainder = (int)(indexPath.row - curPage * itemsOf1Page);
    int curRow = (int)((CGFloat)remainder / self.columnCount);
    int curCol = (int)((CGFloat)remainder - curRow * self.columnCount);
    
    int totalItems = (int)self.totalItems;
    int itemsOfCurRow = (int)self.columnCount;
    int itemsOfCurCol = (int)self.rowCount;
    
//    if (indexPath.row >= (ceilf(totalItems / (float)self.columnCount) - 1) * self.columnCount && totalItems % self.columnCount) {
//        itemsOfCurRow = (int)(totalItems % self.columnCount);
//    }
    
    CGSize  canvasSize = self.collectionView.frame.size;
    CGFloat pageMarginX = (canvasSize.width - itemsOfCurRow * self.itemSize.width -
                           (itemsOfCurRow > 1 ? (itemsOfCurRow - 1) * self.minimumLineSpacing : 0)) / 2.0f;
    CGFloat pageMarginY = (canvasSize.height - itemsOfCurCol * self.itemSize.height -
                           (itemsOfCurCol > 1 ? (itemsOfCurCol - 1) * self.minimumInteritemSpacing : 0)) / 2.0f;
    
    CGRect cellFrame = CGRectZero;
    cellFrame.origin.x = pageMarginX + curCol * (self.itemSize.width + self.minimumLineSpacing);
    cellFrame.origin.y = pageMarginY + curRow * (self.itemSize.height + self.minimumInteritemSpacing);
    cellFrame.size.width = self.itemSize.width;
    cellFrame.size.height = self.itemSize.height;
    
    if (self.scrollDirection == UICollectionViewScrollDirectionHorizontal) {
        cellFrame.origin.x += curPage * canvasSize.width;
    } else {
        cellFrame.origin.y += curPage * canvasSize.height;
    }
    if (self.scrollDirection == UICollectionViewScrollDirectionVertical) {
        cellFrame = CGRectMake(12, cellFrame.origin.y + (cellFrame.size.height / self.columnCount + 3) * ( indexPath.row % self.columnCount), cellFrame.size.width * (self.columnCount + 0.3), cellFrame.size.height / self.columnCount);
    }
    
    return cellFrame;
}

- (UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)indexPath {
    UICollectionViewLayoutAttributes *attr = [[super layoutAttributesForItemAtIndexPath:indexPath] copy];
    attr.frame = [self frameForItemAtIndexPath:indexPath];
    return attr;
}

- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
    NSArray<UICollectionViewLayoutAttributes *> *originAttrs = [super layoutAttributesForElementsInRect:rect];
    NSMutableArray *attrs = [[NSMutableArray alloc] init];
    
    for (UICollectionViewLayoutAttributes *attr in originAttrs) {
        NSIndexPath *idxPath = attr.indexPath;
        CGRect itemFrame = [self frameForItemAtIndexPath:idxPath];
        
        if (!CGRectIsNull(CGRectIntersection(itemFrame, rect))) {
            UICollectionViewLayoutAttributes *nAttr = [self layoutAttributesForItemAtIndexPath:idxPath];
            [attrs addObject:nAttr];
        }
    }
    return attrs;
}

- (CGPoint)targetContentOffsetForProposedContentOffset:(CGPoint)proposedContentOffset withScrollingVelocity:(CGPoint)velocity {
    CGSize canvasSize = self.collectionView.frame.size;
    if (self.scrollDirection == UICollectionViewScrollDirectionHorizontal) {
        _currentPage = ceil(proposedContentOffset.x / canvasSize.width);
    } else {
        _currentPage = ceil(proposedContentOffset.y / canvasSize.height);
    }
    return [super targetContentOffsetForProposedContentOffset:proposedContentOffset withScrollingVelocity:velocity];
}

- (CGPoint)targetContentOffsetForProposedContentOffset:(CGPoint)proposedContentOffset {
    CGSize canvasSize = self.collectionView.frame.size;
    CGPoint offset = proposedContentOffset;
    if (self.scrollDirection == UICollectionViewScrollDirectionHorizontal) {
        offset.x = _currentPage * canvasSize.width;
    } else {
        offset.y = _currentPage * canvasSize.height;
    }
    return offset;
}
#pragma mark - getter
- (NSInteger)columnCount {
    if (self.scrollDirection == UICollectionViewScrollDirectionVertical) {
        return numberOfVertical;
    }
    return _columnCount;
}

@end
