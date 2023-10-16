//
//  RoomViewController+Sort.h
//  veRTC_Demo
//
//  Created by on 2021/6/8.
//  
//

#import "RoomViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RoomViewModel (Sort)

- (void)startSort:(void (^)(NSMutableArray *userLists))block;

- (void)stopSort;

- (NSMutableArray *)updateSortListsPromptly;

- (NSMutableArray<RoomVideoSession *> *)getSortUserLists;

@property (nonatomic, strong) NSMutableArray<RoomVideoSession *> *sortUserLists;
@end

NS_ASSUME_NONNULL_END
