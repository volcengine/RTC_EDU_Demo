//
//  EduBCUserHeadView.m
//  veRTC_Demo
//
//  Created by on 2021/5/23.
//  
//

#import "EduBCUserHeadView.h"
#import "EduBCAvatarView.h"
#import "Masonry.h"

@interface EduBCUserHeadView ()

@property (nonatomic, strong) EduBCAvatarView *EduBCAvatarView;

@end

@implementation EduBCUserHeadView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:self.EduBCAvatarView];
        [self.EduBCAvatarView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.size.mas_equalTo(CGSizeMake(80, 80));
            make.center.equalTo(self);
        }];
    }
    return self;
}

- (void)setNameString:(NSString *)nameString {
    _nameString = nameString;
    
    self.EduBCAvatarView.text = nameString;
}

- (EduBCAvatarView *)EduBCAvatarView {
    if (!_EduBCAvatarView) {
        _EduBCAvatarView = [[EduBCAvatarView alloc] init];
        _EduBCAvatarView.layer.cornerRadius = 40;
        _EduBCAvatarView.layer.masksToBounds = YES;
        _EduBCAvatarView.fontSize = 32;
    }
    return _EduBCAvatarView;
}


@end
