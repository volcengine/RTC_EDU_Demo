//
//  EduSCRoomCollectionViewCell.m
//
//  Created by admin on 2022/10/15.
//

#import "EduSCRoomCollectionViewCell.h"
#import "EduSCRoomUserView.h"
#import "Masonry.h"

@interface EduSCRoomCollectionViewCell()
@property (nonatomic, strong) EduSCRoomUserView *videoView;
@end

@implementation EduSCRoomCollectionViewCell

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

- (void)bindVideoSession:(EduSCRoomVideoSession *)session {
    [self.videoView setVideoSession:session];
}

- (EduSCRoomUserView *)videoView {
    if (!_videoView) {
        _videoView = [[EduSCRoomUserView alloc] init];
    }
    return _videoView;
}

@end

