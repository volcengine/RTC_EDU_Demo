//
//  RoomSpeakerView.h
//
//  Created by on 2021/3/25.
//  
//

#import <UIKit/UIKit.h>
#import "RoomVideoSession.h"
#import "RoomViewModel.h"

@interface RoomSpeakerView : UIView
- (void)bindVideoSessions:(NSArray<RoomVideoSession *> *)videoSessions;

@end

