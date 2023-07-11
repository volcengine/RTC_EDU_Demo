// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import <UIKit/UIKit.h>
#import "EduActiveRoomCell.h"
#import "EduHistoryRoomCell.h"

@class EduRoomTableView;

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, EduRoomType) {
    EduRoomTypeLecture,
    EduRoomTypeBreakout,
    EduRoomTypeHistory
};

@protocol EduRoomTableViewDelegate <NSObject>

- (void)EduRoomTableView:(EduRoomTableView *)EduRoomTableView didSelectRowAtIndexPath:(EduRoomModel *)model type:(EduRoomType)classType;

@end

@interface EduRoomTableView : UIView

@property (nonatomic, copy) NSArray *activeRooms;
@property (nonatomic, copy) NSArray *historyRooms;

@property (nonatomic, weak) id<EduRoomTableViewDelegate> delegate;


@end

NS_ASSUME_NONNULL_END
