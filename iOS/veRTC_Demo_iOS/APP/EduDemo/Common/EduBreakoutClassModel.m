//
//  EduBreakoutClassModel.m
//  veRTC_Demo
//
//  Created by on 2021/8/30.
//  
//

#import "EduBreakoutClassModel.h"

@implementation EduBreakoutClassModel
- (instancetype)initWithDic:(NSDictionary *)dic {
    if (self = [super init]) {
        NSMutableArray *micList = [[NSMutableArray alloc] init];
        NSMutableArray *groupList = [[NSMutableArray alloc] init];
        NSString *groupRtcToken = @"";
        NSString *groupRoomId = @"";
        EduRoomModel *roomModel = nil;
        EduUserModel *teacherUserModel = nil;
        BOOL selfMicOn = NO;
        roomModel = [EduRoomModel yy_modelWithJSON:dic[@"room_info"]];
        teacherUserModel = [EduUserModel yy_modelWithJSON:dic[@"teacher_info"]];
        teacherUserModel.roomType = EduUserRoomTypeBreakoutHost;

        NSArray *micUserList = (NSArray *)dic[@"current_mic_user"];
        for (int i = 0; i < micUserList.count; i++) {
            EduUserModel *userModel = [EduUserModel yy_modelWithJSON:micUserList[i]];
            userModel.roomType = EduUserRoomTypeBreakoutHost;
            userModel.isVideoStream = YES;
            [micList addObject:userModel];
            if ([userModel.uid isEqualToString:[LocalUserComponent userModel].uid]) {
                selfMicOn = YES;
            }
        }

        NSArray *groupUserList = (NSArray *)dic[@"group_user_list"];
        if (groupUserList && [groupUserList isKindOfClass:[NSArray class]]) {
            for (int i = 0; i < groupUserList.count; i++) {
                EduUserModel *groupUserModel = [EduUserModel yy_modelWithJSON:groupUserList[i]];
                groupUserModel.roomType = EduUserRoomTypeBreakoutGroup;
                [groupList addObject:groupUserModel];
            }
        }

        groupRtcToken = [NSString stringWithFormat:@"%@", dic[@"group_token"]];
        groupRoomId = [NSString stringWithFormat:@"%@", dic[@"group_room_id"]];

        NSString *token = dic[@"token"];

        self.token = token;

        self.roomModel = roomModel;
        self.teacherUserModel = teacherUserModel;
        self.micUserList = micList;
        self.groupUserList = groupList;
        self.groupRtcToken = groupRtcToken;
        self.groupRoomId = groupRoomId;
        self.selfMicOn = selfMicOn;
    }
    return self;
}
@end
