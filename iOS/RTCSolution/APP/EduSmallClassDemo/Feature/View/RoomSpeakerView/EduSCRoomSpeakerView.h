//
//  EduSCRoomSpeakerView.h
//
//  Created by on 2021/3/25.
//  
//

#import <UIKit/UIKit.h>
#import "EduSCRoomVideoSession.h"
#import "EduSCRoomViewModel.h"

@interface EduSCRoomSpeakerView : UIView
- (void)bindVideoSessions:(NSArray<EduSCRoomVideoSession *> *)videoSessions;

@end

