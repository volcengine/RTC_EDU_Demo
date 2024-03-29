//
//  GCDTimer.h
//
//

#import <Foundation/Foundation.h>

@interface GCDTimer : NSObject



/**
 Initialization and start

 @param timeNum Cycle Time
 @param block Loop method
 */
- (void)startTimerWithSpace:(float)timeNum block:(void(^)(BOOL result))block;


- (void)startTimer:(NSTimeInterval)startTime Space:(float)timeNum block:(void (^)(BOOL))block;

/**
 Resume
 */
- (void)resume;

/**
 Suspend
 */
- (void)suspend;


/**
 Stop Timer
 */
- (void)stopTimer;

@end
