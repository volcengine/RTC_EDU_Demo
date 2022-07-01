//
//  EduClassModel.m
//  veRTC_Demo
//
//  Created by bytedance on 2021/8/30.
//  Copyright © 2021 . All rights reserved.
//

#import "EduClassModel.h"

@implementation EduClassModel

- (instancetype)initWithDic:(NSDictionary *)dic {
    if (self = [super init]) {
        NSMutableArray *micList = [[NSMutableArray alloc] init];

        EduRoomModel *roomModel = nil;
        EduUserModel *teacherUserModel = nil;
        BOOL selfMicOn = NO;

        roomModel = [EduRoomModel yy_modelWithJSON:dic[@"room_info"]];
        teacherUserModel = [EduUserModel yy_modelWithJSON:dic[@"teacher_info"]];
        teacherUserModel.roomType = EduUserRoomTypeLeature;

        NSArray *micUserList = (NSArray *)dic[@"current_mic_user"];
        for (int i = 0; i < micUserList.count; i++) {
            EduUserModel *userModel = [EduUserModel yy_modelWithJSON:micUserList[i]];
            userModel.roomType = EduUserRoomTypeLeature;
            userModel.isVideoStream = YES;
            [micList addObject:userModel];
            if ([userModel.uid isEqualToString:[LocalUserComponents userModel].uid]) {
                selfMicOn = YES;
            }
        }

        NSString *token = dic[@"token"];

        self.token = token;
        self.roomModel = roomModel;
        self.teacherUserModel = teacherUserModel;
        self.micUserList = micList;
        self.selfMicOn = selfMicOn;
    }
    return self;
}
@end
