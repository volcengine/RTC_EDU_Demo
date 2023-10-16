//
//  EduBCRoomUserView.h
//
//  Created by on 2022/11/11.
//

#import <UIKit/UIKit.h>
#import "EduBCRoomVideoSession.h"

@interface EduBCRoomUserView : UIView

- (void)setVideoSession:(EduBCRoomVideoSession *)session;
- (void)setScreenSession:(EduBCRoomVideoSession *)session;

@end
