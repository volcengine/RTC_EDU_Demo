//
//  EduSCUserHeadView.m
//  veRTC_Demo
//
//  Created by on 2021/5/23.
//  
//

#import "EduSCUserHeadView.h"
#import "EduSCAvatarView.h"
#import "Masonry.h"

@interface EduSCUserHeadView ()

@property (nonatomic, strong) EduSCAvatarView *EduSCAvatarView;

@end

@implementation EduSCUserHeadView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.EduSCAvatarView];
        [self.EduSCAvatarView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(80, 80));
            make.center.equalTo(self);
        }];
    }
    return self;
}

- (void)setNameString:(NSString *)nameString {
    _nameString = nameString;
    
    self.EduSCAvatarView.text = nameString;
}

- (EduSCAvatarView *)EduSCAvatarView {
    if (!_EduSCAvatarView) {
        _EduSCAvatarView = [[EduSCAvatarView alloc] init];
        _EduSCAvatarView.layer.cornerRadius = 40;
        _EduSCAvatarView.layer.masksToBounds = YES;
        _EduSCAvatarView.fontSize = 32;
    }
    return _EduSCAvatarView;
}


@end
