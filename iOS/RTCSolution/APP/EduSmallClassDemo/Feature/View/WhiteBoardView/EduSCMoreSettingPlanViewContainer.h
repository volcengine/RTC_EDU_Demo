//
//  EduSCMoreSettingPlanViewContainer.h
//  EduSmallClassDemo
//
//  Created by ByteDance on 2022/11/2.
//

#import <UIKit/UIKit.h>
#import <WhiteBoard/ByteWhiteBoard.h>

NS_ASSUME_NONNULL_BEGIN
@class EduSCToolView;
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

@protocol EduSCMoreSettingPlanViewContainerDelegate <NSObject>
- (void)dataUpdated:(NSDictionary *)dict;
@end

@interface EduSCMoreSettingPlanView : UIView
@property (nonatomic, weak) id<EduSCMoreSettingPlanViewContainerDelegate> delegate;
- (instancetype)initWithDelegate:(id<EduSCMoreSettingPlanViewContainerDelegate>)delegate type:(WBDrawType)type;
- (void)setDefualtSetting:(NSDictionary*)dict;
- (NSDictionary*)requestSetting;
- (void)updateUI;
@end


@interface EduSCMoreSettingPlanViewContainer : UIView
- (instancetype)initWithDelegate:(id<EduSCMoreSettingPlanViewContainerDelegate>)delegate frame:(CGRect)frame;
@property (nonatomic, weak) id<EduSCMoreSettingPlanViewContainerDelegate> delegate;
@property (nonatomic, strong) EduSCMoreSettingPlanView *setingView;
@end

@interface EduSCToolView : UIView

@property (nonatomic, weak) id<EduSCMoreSettingPlanViewContainerDelegate> delegate;
@property(strong, nonatomic) ByteWhiteBoard *board;
@property(assign, nonatomic) ByteWhiteBoardShapeType shapeType;
- (instancetype)initWithWhiteBoard:(ByteWhiteBoard *)wb delegate:(id<EduSCMoreSettingPlanViewContainerDelegate>)delegate;
@end

NS_ASSUME_NONNULL_END

