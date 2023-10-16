//
//  EduSCRoomViewController+Sort.h
//  veRTC_Demo
//
//  Created by on 2021/6/8.
//  
//

#import "EduSCRoomViewModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduSCRoomViewModel (Sort)

- (void)startSort:(void (^)(NSMutableArray *userLists))block;

- (void)stopSort;

- (NSMutableArray *)updateSortListsPromptly;

- (NSMutableArray<EduSCRoomVideoSession *> *)getSortUserLists;

@property (nonatomic, strong) NSMutableArray<EduSCRoomVideoSession *> *sortUserLists;
@end

NS_ASSUME_NONNULL_END
