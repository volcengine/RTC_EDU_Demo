//
//  EduSCRoomUserView.h
//
//  Created by on 2022/11/11.
//

#import <UIKit/UIKit.h>
#import "EduSCRoomVideoSession.h"

@interface EduSCRoomUserView : UIView

- (void)setVideoSession:(EduSCRoomVideoSession *)session;
- (void)setScreenSession:(EduSCRoomVideoSession *)session;

@end
