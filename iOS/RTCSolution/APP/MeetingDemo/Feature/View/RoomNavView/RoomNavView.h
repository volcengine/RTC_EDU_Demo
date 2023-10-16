//
//  RoomNavView.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>
#import "RoomVideoSession.h"
#import "RoomItemButton.h"
#import "NavViewModel.h"

@class RoomNavView;

typedef NS_ENUM(NSInteger, RoomNavItem) {
    RoomNavItemSwitchSpeaker,
    RoomNavItemSwitchCamera,
    RoomNavItemHangeup
};

NS_ASSUME_NONNULL_BEGIN

@protocol RoomNavViewDelegate <NSObject>

- (void)roomNavView:(RoomNavView *)roomNavView itemButton:(RoomItemButton *)itemButton didSelectStatus:(RoomNavItem)status;

- (void)timeChange:(NSInteger)time;

@end

@interface RoomNavView : UIView

- (instancetype)initWithViewModel:(NavViewModel*)model;
- (void)changeSwitchCameraBtnStatus:(BOOL)isOpen;


@property (nonatomic, weak) id<RoomNavViewDelegate> delegate;

@property (nonatomic, assign) NSInteger meetingTime;

@end

NS_ASSUME_NONNULL_END
