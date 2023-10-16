//
//  EduBCRoomBottomView.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>
#import "EduBCRoomItemButton.h"
#import "EduBCRoomBottomViewModel.h"
#define ROOM_ITEM_TAG_BASE  3000
@class EduBCRoomBottomView;

typedef NS_ENUM(NSInteger, RoomBottomItem) {
    RoomBottomItemMic = 0,
    RoomBottomItemCamera,
    RoomBottomItemScreen,
    RoomBottomItemUserList,
    RoomBottomItemRecord,
};

NS_ASSUME_NONNULL_BEGIN

typedef void (^userListClick)(EduBCRoomBottomView * _Nonnull sender);
typedef void (^screenShareClick)(EduBCRoomBottomView * _Nonnull sender);
typedef void (^whiteboardShareClick)(EduBCRoomBottomView * _Nonnull sender);
@interface EduBCRoomBottomView : UIView

- (instancetype)initWithViewModel:(EduBCRoomBottomViewModel*)viewModel;

- (void)updateButton:(RoomBottomItem)item status:(BOOL)isActive;

- (void)updateButton:(RoomBottomItem)item title:(NSString *)title;

- (void)updateButton:(RoomBottomItem)item tagNum:(int)tagNum;

- (ButtonStatus)getStatusOfItem:(RoomBottomItem)item;

- (void)dismissMoreView;

@property(nonatomic, strong)userListClick userListClickBlock;
@property(nonatomic, strong)screenShareClick screenShareClickBlock;
@property(nonatomic, strong)whiteboardShareClick whiteboardShareClickBlock;
@end

NS_ASSUME_NONNULL_END
