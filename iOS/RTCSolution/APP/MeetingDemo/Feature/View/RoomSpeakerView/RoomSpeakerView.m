//
//  RoomSpeakerView.m
//
//  Created by on 2021/3/25.
//  
//

#import "RoomSpeakerView.h"
#import "RoomUserView.h"
#import "MeetingRTCManager.h"
#import "EMBind.h"
#import "RoomViewModel+Sort.h"

@interface RoomSpeakerView ()
@property (nonatomic, strong) RoomUserView *focusedView;
@property (nonatomic, strong) RoomUserView *zoomOutView;
@property (nonatomic, assign) BOOL layoutSwapped;

@property (nonatomic, strong) RoomVideoSession *focusedVideoSession;
@property (nonatomic, strong) RoomVideoSession *zoomOutVideoSession;

@end

@implementation RoomSpeakerView

- (instancetype)init {
    self = [super init];
    if (self) {
        self.backgroundColor = [ThemeManager backgroundColor];
        self.layoutSwapped = NO;
        
        [self addSubview:self.focusedView];
        [self addSubview:self.zoomOutView];
        
        [self makeConstraints];
        
//        @weakify(self);
//        [self.KVOController observe:self.viewModel keyPath:@keypath(self.viewModel, sortUserLists) options:NSKeyValueObservingOptionNew block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
//            @strongify(self);
//            
//        }];
    }
    return self;
}

#pragma mark - Publish Action

- (void)bindVideoSessions:(NSArray<RoomVideoSession *> *)videoSessions {
    if (self.hidden) {
        return;
    }
    
    NSArray<RoomVideoSession *> *list = videoSessions;
    
    if (list.count == 1) {
        self.focusedVideoSession = list[0];
        self.zoomOutVideoSession = nil;
    } else if (list.count >= 2) {
        if (list[0].isLoginUser) {
            self.focusedVideoSession = list[1];
            self.zoomOutVideoSession = list[0];
        } else {
            self.focusedVideoSession = list[0];
            self.zoomOutVideoSession = list[1];
        }
    }
    
    if (!self.hidden) {
        self.focusedVideoSession.isVisible = YES;
        self.zoomOutVideoSession.isVisible = YES;
    }
}

- (void)setFocusedVideoSession:(RoomVideoSession *)focusedVideoSession {
    _focusedVideoSession = focusedVideoSession;
    self.focusedView.videoSession = self.focusedVideoSession;
    self.focusedView.hidden = (self.focusedVideoSession == nil);
}

- (void)setZoomOutVideoSession:(RoomVideoSession *)zoomOutVideoSession {
    BOOL becomeNil = zoomOutVideoSession == nil && _zoomOutVideoSession != nil;
    _zoomOutVideoSession = zoomOutVideoSession;
    self.zoomOutView.videoSession = self.zoomOutVideoSession;
    self.zoomOutView.hidden = (self.zoomOutVideoSession == nil);
    if (becomeNil) {
        self.layoutSwapped = NO;
        [self makeConstraints];
    }
}

- (void)makeConstraints {
    [self.focusedView mas_remakeConstraints:^(MASConstraintMaker *make) {
        if (self.layoutSwapped) {
            make.size.mas_equalTo(CGSizeMake(126, 224));
            make.top.equalTo(self.mas_top).offset(8);
            make.right.equalTo(self.mas_right).offset(-8);
        } else {
            make.edges.equalTo(self);
        }
    }];
    
    [self.zoomOutView mas_remakeConstraints:^(MASConstraintMaker *make) {
        if (self.layoutSwapped) {
            make.edges.equalTo(self);
        } else {
            make.size.mas_equalTo(CGSizeMake(126, 224));
            make.top.equalTo(self.mas_top).offset(8);
            make.right.equalTo(self.mas_right).offset(-8);
        }
    }];
    if (!self.layoutSwapped) {
        [self bringSubviewToFront:self.zoomOutView];
    } else {
        [self bringSubviewToFront:self.focusedView];
    }
}

#pragma mark - getter

- (RoomUserView *)focusedView {
    if (!_focusedView) {
        _focusedView = [[RoomUserView alloc] init];
        _focusedView.hidden = YES;
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(onTap:)];
        [_focusedView addGestureRecognizer:tap];
    }
    return _focusedView;
}

- (RoomUserView *)zoomOutView {
    if (!_zoomOutView) {
        _zoomOutView = [[RoomUserView alloc] init];
        _zoomOutView.hidden = YES;
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(onTap:)];
        [_zoomOutView addGestureRecognizer:tap];
    }
    return _zoomOutView;
}

- (void)onTap:(UIGestureRecognizer *)tap {
    if (!self.zoomOutView.hidden && !self.focusedView.hidden) {
        NSUInteger zOrderOfZoomOutView = [self.subviews indexOfObject:self.zoomOutView];
        NSUInteger zOrderOfFocusedView = [self.subviews indexOfObject:self.focusedView];
        [self exchangeSubviewAtIndex:zOrderOfFocusedView withSubviewAtIndex:zOrderOfZoomOutView];
        
        self.layoutSwapped = !self.layoutSwapped;
        [self makeConstraints];
    }
}

@end
