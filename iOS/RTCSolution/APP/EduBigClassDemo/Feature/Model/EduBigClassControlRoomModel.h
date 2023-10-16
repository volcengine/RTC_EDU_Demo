//
//  EduBigClassControlRoomModel.h
//  SceneRTCDemo
//
//  Created by on 2021/3/16.
//

#import <Foundation/Foundation.h>



NS_ASSUME_NONNULL_BEGIN

@interface EduBigClassControlRoomModel : NSObject

@property (nonatomic, copy) NSString *app_id;

@property (nonatomic, copy) NSString *room_id;

@property (nonatomic, copy) NSString *room_name;

@property (nonatomic, copy) NSString *host_user_id;

@property (nonatomic, copy) NSString *host_user_name;

@property (nonatomic, assign) int room_mic_status;

@property (nonatomic, assign) int operate_self_mic_permission;

@property (nonatomic, assign) int share_status;

@property (nonatomic, assign) int share_type;

@property (nonatomic, copy) NSString *share_user_id;

@property (nonatomic, copy) NSString *share_user_name;

@property (nonatomic, assign) NSInteger start_time;

@property (nonatomic, assign) NSInteger base_time;

@property (nonatomic, assign) int record_status;

@property (nonatomic, copy) NSString *ext;

@property (nonatomic, copy) NSString *token;

@property (nonatomic, copy) NSString *wb_token;

@property (nonatomic, copy) NSString *wb_user_id;

@property (nonatomic, copy) NSString *wb_room_id;

@property (nonatomic, assign) NSInteger linkMicApplyCount;

@property (nonatomic, assign) NSInteger linkMicCount;

@end

NS_ASSUME_NONNULL_END
