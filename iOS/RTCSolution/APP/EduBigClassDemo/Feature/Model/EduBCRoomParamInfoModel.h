//
//  EduBCRoomParamInfoModel.h
//  veRTC_Demo
//
//  Created by on 2021/4/9.
//  
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduBCRoomParamInfoModel : NSObject

@property (nonatomic, strong) NSString *local_res;
@property (nonatomic, strong) NSString *local_fps;
@property (nonatomic, strong) NSString *local_bit_video;
@property (nonatomic, strong) NSString *local_bit_audio;

@property (nonatomic, strong) NSString *remote_rtt_video;
@property (nonatomic, strong) NSString *remote_rtt_audio;
@property (nonatomic, strong) NSString *remote_cpu_avg;
@property (nonatomic, strong) NSString *remote_cpu_max;
@property (nonatomic, strong) NSString *remote_bit_video;
@property (nonatomic, strong) NSString *remote_bit_audio;
@property (nonatomic, strong) NSString *remote_res_min;
@property (nonatomic, strong) NSString *remote_res_max;
@property (nonatomic, strong) NSString *remote_fps_min;
@property (nonatomic, strong) NSString *remote_fps_max;
@property (nonatomic, strong) NSString *remote_loss_video;
@property (nonatomic, strong) NSString *remote_loss_audio;

@property (nonatomic, assign) NSInteger remote_res_min_w;
@property (nonatomic, assign) NSInteger remote_res_min_h;
@property (nonatomic, assign) NSInteger remote_res_max_w;
@property (nonatomic, assign) NSInteger remote_res_max_h;



@end

NS_ASSUME_NONNULL_END
