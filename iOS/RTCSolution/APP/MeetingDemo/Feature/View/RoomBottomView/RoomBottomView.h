//
//  RoomBottomView.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>
#import "RoomItemButton.h"
#import "RoomBottomViewModel.h"
#define ROOM_ITEM_TAG_BASE  3000
@class RoomBottomView;

typedef NS_ENUM(NSInteger, RoomBottomItem) {
    RoomBottomItemMic = 0,
    RoomBottomItemCamera,
    RoomBottomItemScreen,
    RoomBottomItemUserList,
    RoomBottomItemRecord,
};

NS_ASSUME_NONNULL_BEGIN

typedef void (^userListClick)(RoomBottomView * _Nonnull sender);
typedef void (^screenShareClick)(RoomBottomView * _Nonnull sender);
typedef void (^whiteboardShareClick)(RoomBottomView * _Nonnull sender);
@interface RoomBottomView : UIView

- (instancetype)initWithViewModel:(RoomBottomViewModel*)viewModel;

- (void)updateButton:(RoomBottomItem)item status:(BOOL)isActive;

- (void)updateButton:(RoomBottomItem)item title:(NSString *)title;

- (void)updateButton:(RoomBottomItem)item tagNum:(int)tagNum;

- (ButtonStatus)getStatusOfItem:(RoomBottomItem)item;

- (void)dismissMoreView;

- (void)updateUserCount:(NSInteger)count;

@property(nonatomic, strong)userListClick userListClickBlock;
@property(nonatomic, strong)screenShareClick screenShareClickBlock;
@property(nonatomic, strong)whiteboardShareClick whiteboardShareClickBlock;
@end

NS_ASSUME_NONNULL_END
