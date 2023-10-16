//
//  EduBCRoomCollectionViewCell.m
//
//  Created by admin on 2022/10/15.
//

#import "EduBCRoomCollectionViewCell.h"
#import "EduBCRoomUserView.h"
#import "Masonry.h"

@interface EduBCRoomCollectionViewCell()
@property (nonatomic, strong) EduBCRoomUserView *videoView;
@end

@implementation EduBCRoomCollectionViewCell

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

- (void)bindVideoSession:(EduBCRoomVideoSession *)session {
    [self.videoView setVideoSession:session];
}

- (EduBCRoomUserView *)videoView {
    if (!_videoView) {
        _videoView = [[EduBCRoomUserView alloc] init];
    }
    return _videoView;
}

@end

