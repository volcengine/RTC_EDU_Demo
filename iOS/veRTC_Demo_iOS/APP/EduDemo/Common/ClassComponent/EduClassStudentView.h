//
//  EduClassStudentView.h
//  veRTC_Demo
//
//  Created by on 2021/7/29.
//

#import <UIKit/UIKit.h>
#import "EduUserModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface EduClassStudentView : UIView

@property (nonatomic, strong) EduUserModel *model;

// 上台中
// Go to the podium
@property (nonatomic, assign) BOOL isPodium;

// 集体发言中
// Group speech
@property (nonatomic, assign) BOOL isCollectiveSpeech;

@end

NS_ASSUME_NONNULL_END
