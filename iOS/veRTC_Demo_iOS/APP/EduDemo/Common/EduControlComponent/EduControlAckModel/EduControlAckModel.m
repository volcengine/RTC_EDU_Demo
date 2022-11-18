//
//  EduControlAckModel.m
//  SceneRTCDemo
//
//  Created by on 2021/3/17.
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
