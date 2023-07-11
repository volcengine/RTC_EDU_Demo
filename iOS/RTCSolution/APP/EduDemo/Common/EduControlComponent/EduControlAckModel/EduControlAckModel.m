// 
// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT
// 

#import "EduControlAckModel.h"

@implementation EduControlAckModel

- (BOOL)result {
    if (self.code == 200) {
        return YES;
    } else {
        return NO;
    }
}

@end
