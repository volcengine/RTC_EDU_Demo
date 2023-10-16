//
//  WBMoreSettingPlanViewContainer.h
//  MeetingDemo
//
//  Created by ByteDance on 2022/11/2.
//

#import <UIKit/UIKit.h>
#import <WhiteBoard/ByteWhiteBoard.h>

NS_ASSUME_NONNULL_BEGIN
@class WBToolView;
typedef NS_ENUM(NSInteger, WBDrawType) {
    WBDrawTypeTxt = 0,
    WBDrawTypePen = 1,
    WBDrawTypeShape = 2,
    WBDrawTypeBackground = 3,
};

typedef NS_ENUM(NSInteger, WBBackgroundFillType) {
    WBBackgroundFillTypeFill = 0,
    WBBackgroundFillTypeCenter = 1,
    WBBackgroundFillTypeHidden = 2,
};

typedef NS_ENUM(NSInteger, WBDrawShapeType) {
    WBDrawShapeTypeLine = 0,
    WBDrawShapeTypeCircle = 1,
    WBDrawShapeTypeShapeRectangle = 2,
    WBDrawShapeTypeArrow = 3,
};

typedef void (^WBButtonActionBlock)(id btn);
typedef void (^WBSliderBlock)(CGFloat progress);

@protocol WBMoreSettingPlanViewContainerDelegate <NSObject>
- (void)dataUpdated:(NSDictionary *)dict;
@end

@interface MoreSettingPlanView : UIView
@property (nonatomic, weak) id<WBMoreSettingPlanViewContainerDelegate> delegate;
- (instancetype)initWithDelegate:(id<WBMoreSettingPlanViewContainerDelegate>)delegate type:(WBDrawType)type;
- (void)setDefualtSetting:(NSDictionary*)dict;
- (NSDictionary*)requestSetting;
- (void)updateUI;
@end


@interface WBMoreSettingPlanViewContainer : UIView
- (instancetype)initWithDelegate:(id<WBMoreSettingPlanViewContainerDelegate>)delegate frame:(CGRect)frame;
@property (nonatomic, weak) id<WBMoreSettingPlanViewContainerDelegate> delegate;
@property (nonatomic, strong) MoreSettingPlanView *setingView;
@end

@interface WBToolView : UIView

@property (nonatomic, weak) id<WBMoreSettingPlanViewContainerDelegate> delegate;
@property(strong, nonatomic) ByteWhiteBoard *board;
@property(assign, nonatomic) ByteWhiteBoardShapeType shapeType;
- (instancetype)initWithWhiteBoard:(ByteWhiteBoard *)wb delegate:(id<WBMoreSettingPlanViewContainerDelegate>)delegate;
@end

NS_ASSUME_NONNULL_END

