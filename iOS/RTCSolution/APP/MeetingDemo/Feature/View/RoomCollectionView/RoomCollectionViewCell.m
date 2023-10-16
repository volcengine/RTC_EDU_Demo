//
//  RoomCollectionViewCell.m
//
//  Created by admin on 2022/10/15.
//

#import "RoomCollectionViewCell.h"
#import "RoomUserView.h"
#import "Masonry.h"

@interface RoomCollectionViewCell()
@property (nonatomic, strong) RoomUserView *videoView;
@end

@implementation RoomCollectionViewCell

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self addSubview:self.videoView];
        [self.videoView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
    }
    return self;
}

- (void)bindVideoSession:(RoomVideoSession *)session {
    [self.videoView setVideoSession:session];
}

- (RoomUserView *)videoView {
    if (!_videoView) {
        _videoView = [[RoomUserView alloc] init];
    }
    return _videoView;
}

@end

