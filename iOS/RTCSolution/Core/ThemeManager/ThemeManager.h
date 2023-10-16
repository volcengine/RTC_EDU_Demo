//
//  ThemeManager.h
//  Core
//
//  Created by guojian on 2022/11/9.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, ThemeType) {
    ThemeTypeDark = 0,
    ThemeTypeLight = 1
};

@interface ThemeManager : NSObject

+ (instancetype)sharedThemeManager;

+ (UIColor*)backgroundColor;

+ (UIColor*)contentBackgroundColor;

+ (UIColor*)avatarBackgroundColor;

+ (UIColor*)cellBackgroundColor;

+ (UIColor *)translucentColor;

+ (UIColor *)destructFgColor;

+ (UIColor *)destructBgColor;

+ (UIColor*)titleLabelTextColor;

+ (UIColor*)commomLabelTextColor;

+ (UIColor*)commomDescLabelTextColor;

+ (UIColor*)buttonDescLabelTextColor;

+ (UIColor*)buttonTagLabelTextColor;

+ (UIColor*)buttonBackgroundColor;

+ (UIColor*)buttonBorderColor;

+ (UIColor*)commonCellLabelColor;

+ (UIColor*)commonLineColor;

+ (UIColor*)hostLabelBackgroudColor;

+ (UIColor*)hostLabelTextColor;

+ (UIColor*)activeSpeakerBorderColor;

+ (UIColor*)pageCotrolDefaultTintColor;

+ (UIColor*)pageCotrolFocusedTintColor;

+ (UIImage*)imageNamed:(NSString*)name;

+ (UIStatusBarStyle)statusBarStyle;

@property (nonatomic) ThemeType themeType;

@property (nonatomic, copy) NSString *sence;
@end

typedef void (^RTCGestureBlock)(id sender);
@interface UIGestureRecognizer (Block)
+(instancetype)rtc_gestureRecognizerWithActionBlock:(RTCGestureBlock)block;
@end

NS_ASSUME_NONNULL_END
