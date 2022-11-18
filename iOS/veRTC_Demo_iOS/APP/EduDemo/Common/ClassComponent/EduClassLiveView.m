//
//  EduClassLiveView.m
//  veRTC_Demo
//
//  Created by on 2021/7/29.
//  
//

#import "EduClassLiveView.h"
#import "EduUserModel.h"

@interface EduClassLiveView ()

@property (nonatomic, strong) UIView *liveView;
@property (nonatomic, strong) UIImageView *cameraClosedView;
@property (nonatomic, strong) UIImageView *shadowView;
@property (nonatomic, strong) UILabel *nameLabel;
@property (nonatomic, strong) UILabel *isMicLabel;

@property (nonatomic, strong) UIImageView *audioImageView;
@property (nonatomic, strong) UIImageView *videoImageView;
@end

@implementation EduClassLiveView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.backgroundColor = [UIColor colorFromHexString:@"#394254"];

        [self addSubview:self.cameraClosedView];
        [self.cameraClosedView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.center.equalTo(self);
        }];

        [self addSubview:self.liveView];
        [self.liveView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.edges.equalTo(self);
        }];

        [self addSubview:self.shadowView];
        [self.shadowView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.right.bottom.equalTo(self);
        }];

        [self addSubview:self.nameLabel];
        [self.nameLabel mas_makeConstraints:^(MASConstraintMaker *make) {
          make.left.mas_offset(6);
          make.bottom.mas_offset(-6);
        }];

        [self addSubview:self.videoImageView];
        [self.videoImageView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.nameLabel);
          make.right.equalTo(self).offset(-8);
        }];

        [self addSubview:self.audioImageView];
        [self.audioImageView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.centerY.equalTo(self.videoImageView);
          make.right.equalTo(self.videoImageView.mas_left).offset(-10);
        }];
        
        [self addSubview:self.isMicLabel];
        [self.isMicLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.center.equalTo(self);
        }];
    }
    return self;
}

#pragma mark - Publish Action

- (void)startPreview:(EduUserModel *)userModel {
    NSLog(@"%@,%s", [NSThread currentThread], __func__);

    _userModel = userModel;
    userModel.streamView.hidden = NO;

    [self.liveView addSubview:userModel.streamView];
    [userModel.streamView mas_remakeConstraints:^(MASConstraintMaker *make) {
      make.edges.equalTo(self.liveView);
    }];
}

// 学生进入集体发言
// Students enter collective speech
- (void)joinCollectiveSpeech:(BOOL)isJoin {
    self.liveView.hidden = isJoin;
}

#pragma mark - setter

- (void)setIsMicOn:(BOOL)isMicOn {
    _isMicOn = isMicOn;
    
    self.isMicLabel.hidden = !isMicOn;
    self.cameraClosedView.hidden = isMicOn;
}

- (void)setName:(NSString *)name {
    _name = name;
    self.nameLabel.text = name;
}

- (void)setAudioClosed:(BOOL)audioClosed {
    _audioClosed = audioClosed;
    if (_audioClosed) {
        self.audioImageView.image = [UIImage imageNamed:@"edu_class_audio_close" bundleName:HomeBundleName];
    } else {
        self.audioImageView.image = [UIImage imageNamed:@"edu_class_audio_open"bundleName:HomeBundleName];
    }
}

- (void)setVideoClosed:(BOOL)videoClosed {
    _videoClosed = videoClosed;
    if (_videoClosed) {
        self.videoImageView.image = [UIImage imageNamed:@"edu_class_video_close"bundleName:HomeBundleName];
    } else {
        self.videoImageView.image = [UIImage imageNamed:@"edu_class_video_open" bundleName:HomeBundleName];
    }

    self.cameraClosedView.hidden = !videoClosed;
    if (videoClosed) {
        [self.liveView removeAllSubviews];
    }
}

#pragma mark - getter

- (UIView *)liveView {
    if (!_liveView) {
        _liveView = [[UIView alloc] init];
    }
    return _liveView;
}

- (UIImageView *)shadowView {
    if (!_shadowView) {
        _shadowView = [[UIImageView alloc] init];
        _shadowView.image = [UIImage imageNamed:@"edu_class_shadow" bundleName:HomeBundleName];
    }
    return _shadowView;
}

- (UILabel *)nameLabel {
    if (!_nameLabel) {
        _nameLabel = [[UILabel alloc] init];
        _nameLabel.textColor = [UIColor whiteColor];
        _nameLabel.font = [UIFont systemFontOfSize:11];
    }
    return _nameLabel;
}

- (UILabel *)isMicLabel {
    if (!_isMicLabel) {
        _isMicLabel = [[UILabel alloc] init];
        _isMicLabel.textColor = [UIColor colorFromHexString:@"#86909C"];
        _isMicLabel.font = [UIFont systemFontOfSize:14];
        _isMicLabel.hidden = YES;
        _isMicLabel.text = @"上台中";
    }
    return _isMicLabel;
}

- (UIImageView *)cameraClosedView {
    if (!_cameraClosedView) {
        _cameraClosedView = [[UIImageView alloc] init];
        _cameraClosedView.image = [UIImage imageNamed:@"edu_class_camera_close" bundleName:HomeBundleName];
    }
    return _cameraClosedView;
}

- (UIImageView *)videoImageView {
    if (!_videoImageView) {
        _videoImageView = [[UIImageView alloc] init];
    }
    return _videoImageView;
}

- (UIImageView *)audioImageView {
    if (!_audioImageView) {
        _audioImageView = [[UIImageView alloc] init];
    }
    return _audioImageView;
}
@end
