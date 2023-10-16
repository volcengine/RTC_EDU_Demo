//
//  MeetingControlUserModel.h
//  SceneRTCDemo
//
//  Created by on 2021/3/16.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, MeetingShareType) {
    kShareTypeScreen = 0,
    kShareTypeWhiteBoard,
};

NS_ASSUME_NONNULL_BEGIN

@interface MeetingControlUserModel : NSObject

@property (nonatomic, copy) NSString *room_id;

@property (nonatomic, copy) NSString *user_id;

@property (nonatomic, copy) NSString *user_name;

@property (nonatomic, assign) int user_role;

@property (nonatomic, assign) int camera;

@property (nonatomic, assign) int mic;

@property (nonatomic, assign) int share_permission;

@property (nonatomic, assign) int share_status;

@property (nonatomic, assign) int share_type;

@property (nonatomic, assign) NSInteger join_time;

@end

NS_ASSUME_NONNULL_END
