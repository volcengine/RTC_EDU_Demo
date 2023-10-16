//
//  ThemeManager.m
//  Core
//
//  Created by guojian on 2022/11/9.
//

#import "ThemeManager.h"
#import <objc/runtime.h>
#import "UIColor+String.h"
#import "UIImage+Bundle.h"

@implementation ThemeManager

+ (instancetype)sharedThemeManager {
    static dispatch_once_t onceToken;
    static ThemeManager *themeManager;
    dispatch_once(&onceToken, ^{
        themeManager = [[ThemeManager alloc] init];
    });
    return themeManager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        if (@available(iOS 13.0, *)) {
            UIUserInterfaceStyle mode = UITraitCollection.currentTraitCollection.userInterfaceStyle;
            if (mode == UIUserInterfaceStyleDark) {
                self.themeType = ThemeTypeDark;
            } else {
                self.themeType = ThemeTypeLight;
            }
        } else {
            self.themeType = ThemeTypeLight;
        }
    }
    
    return self;
}

- (void)setSence:(NSString *)sence {
    _sence = sence;
}

+ (UIColor*)backgroundColor {
    NSString *colorString = @"#1D2129";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#FFFFFF";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)contentBackgroundColor {
    NSString *colorString = @"#13171E";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#F1F2F4";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor *)translucentColor {
    UIColor *color;
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            color = [UIColor colorFromRGBHexString:@"#FFFFFF" andAlpha:0.8f*255];
            break;
        default:
            color = [UIColor colorFromRGBHexString:@"#272E3B" andAlpha:0.6f*255];
            break;
    }
    return color;
}

+ (UIColor*)cellBackgroundColor {
    NSString *colorString = @"#272E3B";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#DEDFE3";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)avatarBackgroundColor {
    NSString *colorString = @"#303846";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#F1F2F4";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)titleLabelTextColor {
    NSString *colorString = @"#FFFFFF";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#1D2129";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor *)destructFgColor {
    NSString *colorString = @"#F53F3F";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#FFFFFF";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor *)destructBgColor {
    UIColor *color;
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            color = [UIColor colorFromHexString:@"#F53F3F"];
            break;
        default:
            color = [UIColor colorFromRGBHexString:@"#F53F3F" andAlpha:0.2f*255];
            break;
    }
    return color;
}

+ (UIColor*)commomLabelTextColor {
    return [self buttonTagLabelTextColor];
}

+ (UIColor*)commomDescLabelTextColor {
    return [self buttonDescLabelTextColor];
}

+ (UIColor*)buttonDescLabelTextColor {
    NSString *colorString = @"#86909C";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#4E5969";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)buttonTagLabelTextColor {
    NSString *colorString = @"#FFFFFF";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#000000";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)buttonBackgroundColor {
    NSString *colorString = @"#272E3B";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#FFFFFF";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)buttonBorderColor {
    NSString *colorString = @"#4E5969";
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            colorString = @"#E5E6EB";
            break;
        default:
            break;
    }
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)activeSpeakerBorderColor {
    return [UIColor colorFromHexString:@"#00CF3A"];
}

+ (UIColor*)commonCellLabelColor {
    NSString *colorString = [@[@"#E5E6EB", @"#1D2129"] objectAtIndex:[ThemeManager sharedThemeManager].themeType];
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)commonLineColor {
    NSString *colorString = [@[@"#4E5969", @"#E5E6EB"] objectAtIndex:[ThemeManager sharedThemeManager].themeType];
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)hostLabelBackgroudColor {
    NSString *colorString = [@[@"#272E3B", @"#000000"] objectAtIndex:[ThemeManager sharedThemeManager].themeType];
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)hostLabelTextColor {
    NSString *colorString = [@[@"#4080FF", @"#FFFFFF"] objectAtIndex:[ThemeManager sharedThemeManager].themeType];
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)pageCotrolDefaultTintColor {
    NSString *colorString = [@[@"#DEDFE3", @"#DEDFE3"] objectAtIndex:[ThemeManager sharedThemeManager].themeType];
    return [UIColor colorFromHexString:colorString];
}

+ (UIColor*)pageCotrolFocusedTintColor {
    NSString *colorString = [@[@"#4080FF", @"#4080FF"] objectAtIndex:[ThemeManager sharedThemeManager].themeType];
    return [UIColor colorFromHexString:colorString];
}

+ (UIImage*)imageNamed:(NSString *)name {
    
    NSString *bundleName = [NSString stringWithFormat:@"%@Demo",[ThemeManager sharedThemeManager].sence];
    
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            bundleName = [NSString stringWithFormat:@"%@DemoLight",[ThemeManager sharedThemeManager].sence];
            break;
        default:
            break;
    }
    UIImage *ret = [UIImage imageNamed:name bundleName:bundleName];
    if (ret == nil && [ThemeManager sharedThemeManager].themeType == ThemeTypeLight) {
        ret = [UIImage imageNamed:name bundleName:[NSString stringWithFormat:@"%@Demo",[ThemeManager sharedThemeManager].sence]];
    }
    
    return ret;
}

+ (UIStatusBarStyle)statusBarStyle {
    UIStatusBarStyle style = UIStatusBarStyleLightContent;
    switch ([ThemeManager sharedThemeManager].themeType) {
        case ThemeTypeLight:
            if (@available(iOS 13.0, *)) {
                style = UIStatusBarStyleDarkContent;
            } else {
                style = UIStatusBarStyleDefault;
            }
            break;
        default:
            break;
    }
    return style;
}


@end

static const int target_key;
@implementation UIGestureRecognizer (Block)

+(instancetype)rtc_gestureRecognizerWithActionBlock:(RTCGestureBlock)block {
    return [[self alloc] initWithActionBlock:block];
}

- (instancetype)initWithActionBlock:(RTCGestureBlock)block {
    self = [self init];
    [self addActionBlock:block];
    [self addTarget:self action:@selector(invoke:)];
    return self;
}

- (void)addActionBlock:(RTCGestureBlock)block {
    if (block) {
      objc_setAssociatedObject(self, &target_key, block, OBJC_ASSOCIATION_COPY_NONATOMIC);
    }
}

- (void)invoke:(id)sender {
    RTCGestureBlock block = objc_getAssociatedObject(self, &target_key);
    if (block) {
        block(sender);
    }
}

@end
