//
//  RoomUserView.h
//
//  Created by on 2022/11/11.
//

#import <UIKit/UIKit.h>
#import "RoomVideoSession.h"

@interface RoomUserView : UIView

- (void)setVideoSession:(RoomVideoSession *)session;
- (void)setScreenSession:(RoomVideoSession *)session;

@end
