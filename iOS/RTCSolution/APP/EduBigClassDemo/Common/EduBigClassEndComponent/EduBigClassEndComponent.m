//
//  EduBigClassEndComponent.m
//  SceneRTCDemo
//
//  Created by on 2021/3/10.
//

#import "EduBigClassEndComponent.h"
#import "EduBigClassEndView.h"

@interface EduBigClassEndComponent ()

@property (nonatomic, strong) EduBigClassEndView *endView;
@property (nonatomic, strong) UIView *maskView;
@property (nonatomic, strong) UITapGestureRecognizer *tap;

@end

@implementation EduBigClassEndComponent

- (instancetype)init {
    self = [super init];
    if (self) {
        
    }
    return self;
}

#pragma mark - Publish Action

- (void)showAt:(UIView *)view withStatus:(EduBigClassEndStatus)status {
    UIViewController *rootVC = [DeviceInforTool topViewController];;
    
    [rootVC.view addSubview:self.maskView];
    [self.maskView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(rootVC.view);
    }];
    [self.maskView addGestureRecognizer:self.tap];

    [rootVC.view addSubview:self.endView];
    [self.endView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.width.mas_equalTo(156);
        make.top.equalTo(view.mas_bottom).offset(2);
        make.right.equalTo(view.mas_right).offset(-2);
    }];

    self.endView.EduBigClassEndStatus = status;
    __weak __typeof(self) wself = self;
    self.endView.clickButtonBlock = ^(EduBigClassButtonStatus status) {
        [wself dismissEndView];
        if (wself.clickButtonBlock) {
            wself.clickButtonBlock(status);
        }
    };
}

#pragma mark - Private Action

- (void)dismissEndView {
    [self.endView removeFromSuperview];
    self.endView = nil;
    [self.maskView removeFromSuperview];
    self.maskView = nil;
}

#pragma mark - getter

- (EduBigClassEndView *)endView {
    if (!_endView) {
        _endView = [[EduBigClassEndView alloc] init];
        [_endView setBackgroundColor:[[ThemeManager buttonBackgroundColor] colorWithAlpha:0.9*255.0]];
        _endView.layer.masksToBounds = YES;
        _endView.layer.cornerRadius = 4;
    }
    return _endView;
}

- (UIView *)maskView {
    if (!_maskView) {
        _maskView = [[UIView alloc] init];
        [_maskView setBackgroundColor:[UIColor colorFromRGBHexString:@"#101319" andAlpha:0.7 * 255]];
    }
    return _maskView;
}

- (UITapGestureRecognizer *)tap {
    if (!_tap) {
        _tap = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                       action:@selector(tapGestureAction:)];
    }
    return _tap;
}

- (void)dealloc {
    NSLog(@"dealloc %@",NSStringFromClass([self class]));
}

- (void)tapGestureAction:(id)sender {
    [self dismissEndView];
}

@end
