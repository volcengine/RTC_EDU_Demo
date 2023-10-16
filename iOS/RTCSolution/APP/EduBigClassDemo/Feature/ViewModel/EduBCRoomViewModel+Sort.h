//
//  EduBCRoomViewController+Sort.h
//  veRTC_Demo
//
//  Created by on 2021/6/8.
//  
//

#import "EduBCRoomViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduBCRoomViewModel (Sort)

- (void)startSort:(void (^)(NSMutableArray *userLists))block;

- (void)stopSort;

- (NSMutableArray *)updateSortListsPromptly;

- (NSMutableArray<EduBCRoomVideoSession *> *)getSortUserLists;

@property (nonatomic, strong) NSMutableArray<EduBCRoomVideoSession *> *sortUserLists;
@end

NS_ASSUME_NONNULL_END
