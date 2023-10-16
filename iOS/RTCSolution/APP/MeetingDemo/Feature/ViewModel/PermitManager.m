//
//  PopupManager.m
//  MeetingDemo
//
//  Created by guojian on 2023/1/16.
//

#import "PermitManager.h"
#import "PopupView.h"
#import "MeetingRTCManager.h"
#import "MeetingRTMManager.h"

@implementation PermitManager

#pragma mark - Mic
+ (void)enableMicRequestWithUid:(NSString *)uid block:(popupManagerCallback)block {
    [SystemAuthority authorizationStatusWithType:AuthorizationTypeAudio block:^(BOOL isAuthorize) {
        if (isAuthorize) {
            AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
            alertCancelModel.title = @"确认";

            alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
                [MeetingRTMManager applyForMicPermission:uid block: ^(BOOL result) {
                }];
                
                if (block) {
                    block(YES);
                }
            };
            
            AlertActionModel *alertModel = [[AlertActionModel alloc] init];
            alertModel.title = @"取消";
            alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
                if (block) {
                    block(NO);
                }
            };
            
            [[AlertActionManager shareAlertActionManager] showWithMessage:@"无法自行打开麦克风，请向主持人申请" actions:@[alertCancelModel, alertModel]];
        } else {
            [self showAuthAlert:AuthorizationTypeAudio];
        }
    }];
}

+ (void)enableMic:(BOOL)enable {
    [SystemAuthority authorizationStatusWithType:AuthorizationTypeAudio block:^(BOOL isAuthorize) {
        if (isAuthorize) {
            [[MeetingRTCManager shareRtc] enableLocalAudio:enable];
            [MeetingRTMManager turnOnOffMic:enable];
        } else {
            if (enable) {
                [self showAuthAlert:AuthorizationTypeAudio];
            }
        }
    }];
}

+ (void)showAuthAlert:(AuthorizationType)type {
    
    NSString *msg = @"";
   
    if (type == AuthorizationTypeAudio) {
        msg = @"麦克风权限已关闭，请至设备设置页开启";
    }
    
    if (type == AuthorizationTypeCamera) {
        msg = @"摄像头权限已关闭，请至设备设置页开启";
    }
    
    AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
    alertCancelModel.title = @"取消";
    AlertActionModel *alertModel = [[AlertActionModel alloc] init];
    alertModel.title = @"确定";
    alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        if ([action.title isEqualToString:@"确定"]) {
            [SystemAuthority autoJumpWithAuthorizationStatusWithType:type];
        }
    };
    [[AlertActionManager shareAlertActionManager] showWithMessage:msg actions:@[alertCancelModel, alertModel]];
}

+ (void)recieveMicAccept:(BOOL)accepted {
        if (accepted) {
            [[ToastComponent shareToastComponent] showWithMessage:@"主持人已将你的静音取消"];
            [self enableMic:YES];
        } else {
            [[ToastComponent shareToastComponent] showWithMessage:@"主持人已拒绝"];
        }
}

+ (void)recieveOperateAllMic {
    [[ToastComponent shareToastComponent] showWithMessage:@"你已被主持人静音"];
    [[MeetingRTCManager shareRtc] enableLocalAudio:NO];
}

+ (void)recieveMicInvite:(BOOL)unmute curMicUnmute:(BOOL)curIsUnmute {
    if (unmute) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"确定";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            if ([action.title isEqualToString:@"确定"]) {
                [self enableMic:YES];
            }
        };
        [[AlertActionManager shareAlertActionManager] showWithMessage:@"主持人邀请你打开麦克风" actions:@[alertCancelModel, alertModel]];
    } else {
        if (curIsUnmute) {
            [[ToastComponent shareToastComponent] showWithMessage:@"你已被主持人静音"];
            [self enableMic:NO];
        }
    }
}

+ (void)recieveMicRequest:(NSString *)uid name:(NSString *)name block:(popupManagerCallback)block {
    if (name && name.length && uid && uid.length) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager grantMicPermission:uid result:NO];
            block(NO);
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"同意";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager grantMicPermission:uid result:YES];
            block(NO);
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%@正在申请发言", name]
                                                              actions:@[alertCancelModel, alertModel]];
    }
}

+ (void)recieveMicRequestWithCount:(int)count block:(nullable popupManagerCallback)block {
    AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
    alertCancelModel.title = @"取消";
    alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
    };
    
    AlertActionModel *alertModel = [[AlertActionModel alloc] init];
    alertModel.title = @"确定";
    alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        block(YES);
    };
    [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%d位用户正在申请发言", count]
                                                          actions:@[alertCancelModel, alertModel]];
}

#pragma mark - Camera
+ (void)enableCameraRequestWithUid:(NSString *)uid block:(popupManagerCallback)block {
    [SystemAuthority authorizationStatusWithType:AuthorizationTypeCamera block:^(BOOL isAuthorize) {
        if (isAuthorize) {

            AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
            alertCancelModel.title = @"确认";

            alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
                [MeetingRTMManager applyForCamPermission:uid block: ^(BOOL result) {
                }];
                
                if (block) {
                    block(YES);
                }
            };
            
            AlertActionModel *alertModel = [[AlertActionModel alloc] init];
            alertModel.title = @"取消";
            alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
                if (block) {
                    block(NO);
                }
            };
            
            [[AlertActionManager shareAlertActionManager] showWithMessage:@"无法自行打开摄像头，请向主持人申请" actions:@[alertCancelModel, alertModel]];
        } else {
            [self showAuthAlert:AuthorizationTypeCamera];
        }
    }];
}

+ (void)enableCamera:(BOOL)enable {
    [SystemAuthority authorizationStatusWithType:AuthorizationTypeCamera block:^(BOOL isAuthorize) {
        if (isAuthorize) {
            [[MeetingRTCManager shareRtc] enableLocalVideo:enable];
            [MeetingRTMManager turnOnOffCam:enable];
        } else {
            if (enable) {
                [self showAuthAlert:AuthorizationTypeCamera];
            }
        }
    }];
}

+ (void)recieveCameraAccept:(BOOL)accepted {
    if (accepted) {
        [[ToastComponent shareToastComponent] showWithMessage:@"主持人已授予你开启摄像头权限"];
    } else {
        [[ToastComponent shareToastComponent] showWithMessage:@"主持人已拒绝"];
    }
}

+ (void)recieveCameraInvite:(BOOL)unmute curMicUnmute:(BOOL)curIsUnmute {
    if (unmute) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"确定";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            if ([action.title isEqualToString:@"确定"]) {
                [self enableCamera:YES];
            }
        };
        [[AlertActionManager shareAlertActionManager] showWithMessage:@"主持人邀请你打开摄像头" actions:@[alertCancelModel, alertModel]];
    } else {
        if (curIsUnmute) {
            [[ToastComponent shareToastComponent] showWithMessage:@"你的摄像头已被主持人关闭"];
            [self enableCamera:NO];
        }
    }
}

+ (void)recieveCameraRequest:(NSString *)uid name:(NSString *)name block:(popupManagerCallback)block {
    if (name && name.length && uid && uid.length) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager grantCamPermission:uid result:NO];
            if (block) {
                block(NO);
            }
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"同意";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager grantCamPermission:uid result:YES];
            if (block) {
                block(YES);
            }
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%@正在申请开摄像头", name]
                                                              actions:@[alertCancelModel, alertModel]];
    }
}

#pragma mark - Share
+ (void)startShareRequestWithUid:(NSString *)uid block:(popupManagerCallback)block {
    AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
    alertCancelModel.title = @"确认";

    alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        [MeetingRTMManager applyForSharePermission:uid block: ^(BOOL result) {
        }];
        if (block) {
            block(YES);
        }
    };
    
    AlertActionModel *alertModel = [[AlertActionModel alloc] init];
    alertModel.title = @"取消";
    alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        if (block) {
            block(NO);
        }
    };
    
    [[AlertActionManager shareAlertActionManager] showWithMessage:@"暂无共享权限，请向主持人申请" actions:@[alertCancelModel, alertModel]];
}

+ (void)recieveShareAccept:(BOOL)accepted {
    if (accepted) {
        [[ToastComponent shareToastComponent] showWithMessage:@"主持人已授予你共享权限"];
    } else {
        [[ToastComponent shareToastComponent] showWithMessage:@"主持人已拒绝"];
    }
}

+ (void)recieveShareUpdate:(BOOL)accepted {
    if (accepted) {
        [[ToastComponent shareToastComponent] showWithMessage:@"主持人已授予你共享权限"];
    } else {
        [[ToastComponent shareToastComponent] showWithMessage:@"共享权限已被回收"];
    }
}

+ (void)recieveShareStatus:(BOOL)isShare name:(nullable NSString *)name type:(int)type {
    if (isShare) {
        NSString *msg = [NSString stringWithFormat:@"%@正在共享%@", name, (MeetingShareType)type == kShareTypeScreen ? @"屏幕" : @"白板"];
        [[ToastComponent shareToastComponent] showWithMessage:msg];
    } else {
        
    }
}

+ (void)recieveShareRequest:(NSString *)uid name:(NSString *)name block:(popupManagerCallback)block {
    if (name && name.length && uid && uid.length) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager grantSharePermission:uid result:NO];
            block(NO);
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"同意";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager grantSharePermission:uid result:YES];
            block(NO);
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%@正在申请共享", name]
                                                              actions:@[alertCancelModel, alertModel]];
    }
}

+ (void)recieveShareRequestWithCount:(int)count block:(nullable popupManagerCallback)block {
    AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
    alertCancelModel.title = @"取消";
    alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
    };
    
    AlertActionModel *alertModel = [[AlertActionModel alloc] init];
    alertModel.title = @"确定";
    alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        block(YES);
    };
    [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%d位用户正在申请共享", count]
                                                          actions:@[alertCancelModel, alertModel]];
}


#pragma mark - Record
+ (void)startRecordRequest {
    [MeetingRTMManager requestForRecord];
    [[ToastComponent shareToastComponent] showWithMessage:@"已向主持人发起录制请求"];
}

+ (void)showNoPermmitionStopRecord {
    [[ToastComponent shareToastComponent] showWithMessage:@"只有主持人才能停止录制"];
}

+ (void)startRecord:(popupManagerCallback)block {
    AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
    alertCancelModel.title = @"确认";

    alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        [MeetingRTMManager startRecord];

        if (block) {
            block(YES);
        }
    };
    
    AlertActionModel *alertModel = [[AlertActionModel alloc] init];
    alertModel.title = @"取消";
    alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        if (block) {
            block(NO);
        }
    };
    
    [[AlertActionManager shareAlertActionManager] showWithTitle:@"确定要开始录制吗？" message:@"录制功能仅做体验，本产品仅用于功能体验，单次录制时长不超过15分钟，录制文件保留时间1周" actions:@[alertCancelModel, alertModel]];
}

+ (void)stopRecord:(popupManagerCallback)block {

    AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
    alertCancelModel.title = @"确认";

    alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        [MeetingRTMManager stopRecord];

        if (block) {
            block(YES);
        }
    };
    
    AlertActionModel *alertModel = [[AlertActionModel alloc] init];
    alertModel.title = @"取消";
    alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
        if (block) {
            block(NO);
        }
    };
    
    [[AlertActionManager shareAlertActionManager] showWithTitle:@"确定要停止录制吗？" message:@"录制功能仅做体验，本产品仅用于功能体验，单次录制时长不超过15分钟，录制文件保留时间1周" actions:@[alertCancelModel, alertModel]];
}

+ (void)recieveRecordStatus:(BOOL)isRecord {
    if (isRecord) {
        [[ToastComponent shareToastComponent] showWithMessage:@"录制已开始"];
    }
}

+ (void)recieveRecordRequest:(NSString*)uid name:(NSString*)name block:(nullable popupManagerCallback)block {
    if (name && name.length && uid && uid.length) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";
        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager acceptRecordRequest:uid result:NO result:^(BOOL success) {
                
            }];
            if (block) {
                block(NO);
            }
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"同意";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager acceptRecordRequest:uid result:YES result:^(BOOL success) {
                if (block) {
                    block(success);
                }
                
                if (success) {
                    [MeetingRTMManager startRecord];
                }
                
            }];
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:[NSString stringWithFormat:@"%@正在申请录制", name]
                                                              actions:@[alertCancelModel, alertModel]];
    }
}

+ (void)recieveRecordAccept:(bool)accepted {
    if (accepted) {
    } else {
        [[ToastComponent shareToastComponent] showWithMessage:@"录制被拒绝"];
    }
}

#pragma mark - Host OP
+ (void)muteAllUser {
    PopupView *alertView = [[PopupView alloc] initWithCheckBox:@"将全体以及新加入的参会人静音" content:@"参会人自己打开麦克风" checked:YES cancel:@"取消" confirm:@"全员静音" cancelClick:^(id sender, int result){
    } confirmClick:^(id sender, int result) {
        [MeetingRTMManager forceTurnOnOffMicOfAllUsers:NO canOperateBySelf:(result > 0) block:^(RTMACKModel * _Nonnull model) {
            if (!model.result) {
                [[ToastComponent shareToastComponent] showWithMessage:model.message];
            }
        }];
    }];
    alertView.backgroundColor = [UIColor colorFromHexString:@"#00000066"];
    [alertView show];
}

+ (void)forceTurnOnOffMicOfUser:(BOOL)on uid:(NSString *)uid {
    [MeetingRTMManager forceTurnOnOffMicOfUser:uid status:on block:^(BOOL result, RTMACKModel * _Nonnull model) {
    }];
}

+ (void)forceTurnOnOffCamOfUser:(BOOL)on uid:(NSString *)uid {
    [MeetingRTMManager forceTurnOnOffCamOfUser:uid status:on block:^(BOOL result, RTMACKModel * _Nonnull model) {
    }];
}

+ (void)forceTurnOnOffShareOfUser:(BOOL)on uid:(NSString *)uid {
    if (!on) {
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";

        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
           
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"确认";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager forceTurnOnOffShareOfUser:uid status:NO block:^(BOOL result, RTMACKModel * _Nonnull model) {
            }];
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:@"是否取消共享权限" actions:@[alertModel,alertCancelModel]];
    } else {
        
        AlertActionModel *alertCancelModel = [[AlertActionModel alloc] init];
        alertCancelModel.title = @"取消";

        alertCancelModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
           
        };
        
        AlertActionModel *alertModel = [[AlertActionModel alloc] init];
        alertModel.title = @"确认";
        alertModel.alertModelClickBlock = ^(UIAlertAction * _Nonnull action) {
            [MeetingRTMManager forceTurnOnOffShareOfUser:uid status:YES block:^(BOOL result, RTMACKModel * _Nonnull model) {
            }];
        };
        
        [[AlertActionManager shareAlertActionManager] showWithMessage:@"是否打开共享权限" actions:@[alertModel,alertCancelModel]];
    }
}

@end
