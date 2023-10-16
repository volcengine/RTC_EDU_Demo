//
//  EduSCRoomNavView.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <UIKit/UIKit.h>
#import "EduSCRoomVideoSession.h"
#import "EduSCRoomItemButton.h"
#import "EduSCNavViewModel.h"

@class EduSCRoomNavView;

typedef NS_ENUM(NSInteger, RoomNavItem) {
    RoomNavItemSwitchSpeaker,
    RoomNavItemSwitchCamera,
    RoomNavItemHangeup
};

NS_ASSUME_NONNULL_BEGIN

@protocol EduSCRoomNavViewDelegate <NSObject>

- (void)EduSCRoomNavView:(EduSCRoomNavView *)EduSCRoomNavView itemButton:(EduSCRoomItemButton *)itemButton didSelectStatus:(RoomNavItem)status;

- (void)timeChange:(NSInteger)time;

@end

@interface EduSCRoomNavView : UIView

- (instancetype)initWithViewModel:(EduSCNavViewModel*)model;
- (void)changeSwitchCameraBtnStatus:(BOOL)isOpen;


@property (nonatomic, weak) id<EduSCRoomNavViewDelegate> delegate;

@property (nonatomic, assign) NSInteger EduSmallClassTime;

@end

NS_ASSUME_NONNULL_END
