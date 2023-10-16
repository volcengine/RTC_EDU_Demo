//
//  EduBCRoomSpeakerView.h
//
//  Created by on 2021/3/25.
//  
//

#import <UIKit/UIKit.h>
#import "EduBCRoomVideoSession.h"
#import "EduBCRoomViewModel.h"

@interface EduBCRoomSpeakerView : UIView
- (void)bindVideoSessions:(NSArray<EduBCRoomVideoSession *> *)videoSessions;

@end

