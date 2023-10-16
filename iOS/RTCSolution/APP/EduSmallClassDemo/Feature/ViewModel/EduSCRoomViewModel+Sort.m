//
//  EduSCRoomViewController+Sort.m
//  veRTC_Demo
//
//  Created by on 2021/6/8.
//  
//

#import <objc/runtime.h>
#import "EduSCRoomViewModel+Sort.h"
#import "GCDTimer.h"

@interface EduSCRoomViewModel (Sort)

@property (nonatomic, strong) GCDTimer *timer;

@end

static const void *kSortUserLists = @"sortUserLists";
static const void *kGCDTimer = @"GCDTimer";

@implementation EduSCRoomViewModel (Sort)

#pragma mark - Publish Action

- (NSArray*)getUserList {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"
    if ([self respondsToSelector:@selector(userList)]) {
        return [self performSelector:@selector(userList)];
    }
    return nil;
#pragma clang diagnostic pop

}

- (void)startSort:(void (^)(NSMutableArray *userLists))block {
    if (!self.sortUserLists) {
        self.sortUserLists = [[NSMutableArray alloc] init];
    }
    if (!self.timer) {
        self.timer = [[GCDTimer alloc] init];
    }
    
    __weak __typeof(self) wself = self;
    [self.timer startTimerWithSpace:1 block:^(BOOL result) {
        [wself sortEndCallbackWithBlock:block];
    }];
}

- (void)stopSort {
    [self.timer stopTimer];
}

- (void)sortEndCallbackWithBlock:(void (^)(NSMutableArray *userLists))block {
    NSArray *sortedNameArray = [[self getUserList] sortedArrayUsingComparator:^NSComparisonResult(EduSCRoomVideoSession *  _Nonnull obj1, EduSCRoomVideoSession *  _Nonnull obj2) {
        return [obj1.userUniform compare:obj2.userUniform options:NSCaseInsensitiveSearch];
    }];
    
    EduSCRoomVideoSession *tempMaxVolumeUser = nil;
    NSMutableArray *hostLists = [[NSMutableArray alloc] init];
    NSMutableArray *selfLists = [[NSMutableArray alloc] init];
    NSMutableArray *shareLists = [[NSMutableArray alloc] init];
    NSMutableArray *volumeLists = [[NSMutableArray alloc] init];
    NSMutableArray *sorce1 = [[NSMutableArray alloc] init];
    NSMutableArray *sorce2 = [[NSMutableArray alloc] init];
    NSMutableArray *sorce3 = [[NSMutableArray alloc] init];
    NSMutableArray *sorce4 = [[NSMutableArray alloc] init];
    for (int i = 0; i < sortedNameArray.count; i++) {
        EduSCRoomVideoSession *userModel = sortedNameArray[i];
        BOOL isLoginUser = [userModel.uid isEqualToString:self.localVideoSession.uid];
        if (isLoginUser) {
            [selfLists addObject:userModel];
        } else if (userModel.isHost) {
            [hostLists addObject:userModel];
        } else if ([userModel.uid isEqualToString:self.roomModel.share_user_id]) {
            [shareLists addObject:userModel];
        } else if (self.activeSpeaker &&
                   [self.activeSpeaker.uid isEqualToString:userModel.uid]) {
            [volumeLists addObject:userModel];
        } else {
            if ([self isEnableMic:userModel] && userModel.isEnableVideo) {
                [sorce1 addObject:userModel];
            } else if ([self isEnableMic:userModel] && !userModel.isEnableVideo) {
                [sorce2 addObject:userModel];
            } else if (![self isEnableMic:userModel] && userModel.isEnableVideo) {
                [sorce3 addObject:userModel];
            } else {
                [sorce4 addObject:userModel];
            }
        }
        
        //排序使用
        if ([self isEnableMic:userModel] &&
            userModel.volume > 0 &&
            !userModel.isHost &&
            !isLoginUser) {
            self.activeSpeaker = userModel;
        }
        
        //展示说话动画使用
        userModel.isMaxVolume = NO;
        if ([self isEnableMic:userModel] &&
            userModel.volume > 0 &&
            userModel.volume > tempMaxVolumeUser.volume) {
            tempMaxVolumeUser = userModel;
        }
    }
    
    if (tempMaxVolumeUser) {
        tempMaxVolumeUser.isMaxVolume = YES;
    }
    
    NSMutableArray *retArray = [NSMutableArray new];
    if (selfLists.count > 0) {
        [retArray addObjectsFromArray:selfLists];
    }
    if (shareLists.count > 0) {
        [retArray addObjectsFromArray:shareLists];
    }
    if (hostLists.count > 0) {
        [retArray addObjectsFromArray:hostLists];
    }
    if (volumeLists.count > 0) {
        [retArray addObjectsFromArray:volumeLists];
    }
    if (sorce1.count > 0) {
        [retArray addObjectsFromArray:sorce1];
    }
    if (sorce2.count > 0) {
        [retArray addObjectsFromArray:sorce2];
    }
    if (sorce3.count > 0) {
        [retArray addObjectsFromArray:sorce3];
    }
    if (sorce4.count > 0) {
        [retArray addObjectsFromArray:sorce4];
    }
    
    self.sortUserLists = retArray;
    
    if (block) {
        block(self.sortUserLists);
    }
}

- (NSMutableArray *)updateSortListsPromptly {
    [self.sortUserLists removeAllObjects];
    NSArray *array = [[self getUserList] copy];
    [self.sortUserLists addObjectsFromArray:array];
    return self.sortUserLists;
}

- (NSMutableArray<EduSCRoomVideoSession *> *)getSortUserLists {
    return self.sortUserLists;
}

#pragma mark - Private Action

- (BOOL)isEnableMic:(EduSCRoomVideoSession *)userModel {
    BOOL isEnableMic = NO;
    if ([userModel.uid isEqualToString:self.localVideoSession.uid]) {
        isEnableMic = self.localVideoSession.isEnableAudio;
    } else {
        isEnableMic = userModel.isEnableAudio;
    }
    return isEnableMic;
}


#pragma mark - getter

- (void)setSortUserLists:(NSMutableArray<EduSCRoomVideoSession *> *)sortUserLists {
    objc_setAssociatedObject(self, kSortUserLists, sortUserLists, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSMutableArray<EduSCRoomVideoSession *> *)sortUserLists {
    return objc_getAssociatedObject(self, kSortUserLists);
}

- (void)setTimer:(GCDTimer *)timer {
    objc_setAssociatedObject(self, kGCDTimer, timer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (GCDTimer *)timer {
    return objc_getAssociatedObject(self, kGCDTimer);
}

@end
